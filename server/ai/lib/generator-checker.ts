import { openai } from "@ai-sdk/openai";
import { OpenAIChatModelId } from "@ai-sdk/openai/internal";
import { generateObject } from "ai";
import "jsr:@std/dotenv/load";
import { z, ZodSchema, ZodObject } from "zod";
import { getCurrentLogger } from "@/lib/current-logger.ts";

export interface CheckerOutputFix<T> {
  fixText: string;
  fixObject: Partial<T>;
}

export interface GeneratorCheckerAllInOneParams<T> {
  generatorSystemMessage: string;
  generatorPrompt: string;
  generatorSchema: ZodSchema<T>;
  checkerSystemMessage: string;
  checkerPrompt: (candidate: T) => string;
  generatorModel?: OpenAIChatModelId;
  generatorTemperature?: number;
  checkerModel?: OpenAIChatModelId;
  checkerTemperature?: number;
  maxAttempts?: number;
  fnBaseName: string;
}

// Accept string/null/undefined for fixText so it won't fail when null is returned
const rawCheckerSchema = z.object({
  passesCheck: z.boolean(),
  fixText: z.union([z.string(), z.null()]).optional(),
  fixObject: z.unknown().optional(),
});

type RawCheckerOutput = z.infer<typeof rawCheckerSchema>;

/**
 * Attempts to generate a structured object using an LLM, then checks it with a second LLM call.
 * If the checker proposes fixes, we try to apply them using a fixer. If fixText is "None", we accept immediately.
 */
export async function genAndCheck<T>({
  generatorSystemMessage,
  generatorPrompt,
  generatorSchema,
  checkerSystemMessage,
  checkerPrompt,
  generatorModel = "gpt-4o-mini",
  generatorTemperature = 0.8,
  checkerModel = "gpt-4o-mini",
  checkerTemperature = 0,
  maxAttempts = 3,
  fnBaseName,
}: GeneratorCheckerAllInOneParams<T>): Promise<T> {
  const logger = getCurrentLogger();
  const startTime = Date.now();

  try {
    if (!(generatorSchema instanceof ZodObject)) {
      throw new Error(
        "[genAndCheck] generatorSchema must be a ZodObject to allow partial fixObject."
      );
    }

    let lastCandidate: T | null = null;
    let lastFixText = "";

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      // 1) Generate the candidate from the generator LLM
      let candidate: T;
      try {
        const generationPrompt =
          attempt === 1
            ? generatorPrompt
            : `${generatorPrompt}\n\nPrevious attempt had issues: ${lastFixText}`;

        const { object: generatedCandidate } = await generateObject({
          model: openai(generatorModel),
          schema: generatorSchema,
          system: generatorSystemMessage,
          prompt: generationPrompt,
          temperature: generatorTemperature,
        });

        logger.debug(
          `[genAndCheck: ${fnBaseName}] Generation attempt ${attempt} succeeded`,
          { candidate: generatedCandidate }
        );

        candidate = generatedCandidate;
      } catch (genError) {
        logger.warn(
          `[genAndCheck: ${fnBaseName}] Generation error on attempt ${attempt}`,
          { error: genError }
        );

        // If this is the last attempt, throw the error
        if (attempt === maxAttempts) {
          throw new Error(
            `[genAndCheck: ${fnBaseName}] Failed to generate valid output after ${maxAttempts} attempts: ${genError}`
          );
        }

        // Try again with a more explicit error message
        const errorMessage =
          genError instanceof Error ? genError.message : String(genError);
        lastFixText = `Error in generation: ${errorMessage}. Make sure to generate valid JSON that matches the required schema.`;
        continue;
      }

      // Run internal validation before checking with LLM
      if (fnBaseName.includes("Event")) {
        // Try to fix portrait issues programmatically first
        try {
          candidate = validateAndFixPortraits(
            candidate,
            fnBaseName,
            attempt,
            logger
          );
        } catch (validationError) {
          logger.warn(
            `[genAndCheck: ${fnBaseName}] Internal validation failed on attempt ${attempt}`,
            { error: validationError }
          );
        }
      }

      // 2) Check the candidate with the checker LLM, using the raw schema
      try {
        const { object: rawFixCheck } = await generateObject({
          model: openai(checkerModel),
          schema: rawCheckerSchema,
          system: checkerSystemMessage,
          prompt: checkerPrompt(candidate),
          temperature: checkerTemperature,
        });

        const passesCheck = rawFixCheck.passesCheck;
        if (passesCheck) {
          logger.info(
            `[genAndCheck: ${fnBaseName}] Candidate passed check on attempt ${attempt}`
          );
          return candidate;
        }

        const fixCheck: CheckerOutputFix<T> = {
          fixText: rawFixCheck.fixText ?? "No fix instructions provided",
          fixObject: (rawFixCheck.fixObject as Partial<T>) ?? {},
        };

        lastFixText = fixCheck.fixText;
        lastCandidate = candidate;

        // If the check fails, see if fix instructions are "None" - some checkers use this convention
        if (fixCheck.fixText === "None") {
          logger.info(
            `[genAndCheck: ${fnBaseName}] Checker responded with "None" as fixText, considering it passing`
          );
          return candidate;
        }

        // If we reached the last attempt and still have a fix required, try one last fix attempt
        if (attempt === maxAttempts) {
          try {
            const lastChanceFixedCandidate = await fixCandidate({
              candidate,
              fixCheck,
              generatorSchema,
              fnBaseName,
              attemptNumber: attempt,
            });

            // Check if the fix worked
            const { object: finalCheckResult } = await generateObject({
              model: openai(checkerModel),
              schema: rawCheckerSchema,
              system: checkerSystemMessage,
              prompt: checkerPrompt(lastChanceFixedCandidate),
              temperature: checkerTemperature,
            });

            if (finalCheckResult.passesCheck) {
              logger.info(
                `[genAndCheck: ${fnBaseName}] Last-chance fix succeeded on attempt ${attempt}`
              );
              return lastChanceFixedCandidate;
            }

            // If final fix attempt failed, but we have internal portrait validation
            if (fnBaseName.includes("Event")) {
              try {
                const finalFixedCandidate = validateAndFixPortraits(
                  lastChanceFixedCandidate,
                  fnBaseName,
                  attempt + 0.5,
                  logger
                );

                // Do a final manual validation before accepting
                if (manuallyValidateEvent(finalFixedCandidate)) {
                  logger.info(
                    `[genAndCheck: ${fnBaseName}] Final portrait validation succeeded on attempt ${
                      attempt + 0.5
                    }`
                  );
                  return finalFixedCandidate;
                }
              } catch (finalValidationError) {
                logger.warn(
                  `[genAndCheck: ${fnBaseName}] Final portrait validation failed`,
                  { finalValidationError }
                );
              }
            }

            // If final fix attempt failed
            throw new Error(
              `Failed after ${maxAttempts} attempts with fixes. Last fixText: ${fixCheck.fixText}`
            );
          } catch (fixError) {
            logger.error(
              `[genAndCheck: ${fnBaseName}] Final fix attempt failed`,
              { fixError }
            );
            throw new Error(
              `Failed after ${maxAttempts} attempts. Last fixText: ${fixCheck.fixText}`
            );
          }
        }

        // 3) Try to fix the candidate for the next check
        let fixedCandidate = await fixCandidate({
          candidate,
          fixCheck,
          generatorSchema,
          fnBaseName,
          attemptNumber: attempt,
        });

        // Add additional internal validation
        if (fnBaseName.includes("Event")) {
          try {
            fixedCandidate = validateAndFixPortraits(
              fixedCandidate,
              fnBaseName,
              attempt + 0.25,
              logger
            );
          } catch (validationError) {
            logger.warn(
              `[genAndCheck: ${fnBaseName}] Post-fix validation failed on attempt ${attempt}`,
              { validationError }
            );
          }
        }

        // 4) Check if the fix worked
        const { object: verifyFixCheck } = await generateObject({
          model: openai(checkerModel),
          schema: rawCheckerSchema,
          system: checkerSystemMessage,
          prompt: checkerPrompt(fixedCandidate),
          temperature: checkerTemperature,
        });

        if (verifyFixCheck.passesCheck || verifyFixCheck.fixText === "None") {
          logger.info(
            `[genAndCheck: ${fnBaseName}] Fixed candidate passed check on attempt ${attempt}`
          );
          return fixedCandidate;
        }

        logger.warn(
          `[genAndCheck: ${fnBaseName}] Fixed candidate still failed checks on attempt ${attempt}`,
          {
            fixText: verifyFixCheck.fixText,
            originalFixText: fixCheck.fixText,
          }
        );

        // If this is the second-to-last attempt, try one more fix with the new feedback
        if (attempt === maxAttempts - 1) {
          try {
            const lastChanceFixedCandidate = await fixCandidate({
              candidate: fixedCandidate,
              fixCheck: {
                fixText:
                  verifyFixCheck.fixText ?? "No fix instructions provided",
                fixObject: (verifyFixCheck.fixObject as Partial<T>) ?? {},
              },
              generatorSchema,
              fnBaseName,
              attemptNumber: attempt + 0.5,
            });

            // One more internal validation pass
            if (fnBaseName.includes("Event")) {
              try {
                const finalValidatedCandidate = validateAndFixPortraits(
                  lastChanceFixedCandidate,
                  fnBaseName,
                  attempt + 0.75,
                  logger
                );

                // Check if this last fix worked
                const { object: finalCheckResult } = await generateObject({
                  model: openai(checkerModel),
                  schema: rawCheckerSchema,
                  system: checkerSystemMessage,
                  prompt: checkerPrompt(finalValidatedCandidate),
                  temperature: checkerTemperature,
                });

                if (
                  finalCheckResult.passesCheck ||
                  finalCheckResult.fixText === "None"
                ) {
                  logger.info(
                    `[genAndCheck: ${fnBaseName}] Last-chance final validation succeeded on attempt ${
                      attempt + 0.75
                    }`
                  );
                  return finalValidatedCandidate;
                }

                // If even this doesn't work, do a manual validation as last resort
                if (manuallyValidateEvent(finalValidatedCandidate)) {
                  logger.info(
                    `[genAndCheck: ${fnBaseName}] Manual validation succeeded as last resort`
                  );
                  return finalValidatedCandidate;
                }
              } catch (finalValidationError) {
                logger.warn(
                  `[genAndCheck: ${fnBaseName}] Final validation failed`,
                  { finalValidationError }
                );
              }
            } else {
              // For non-event types, just check the LLM result
              const { object: finalCheckResult } = await generateObject({
                model: openai(checkerModel),
                schema: rawCheckerSchema,
                system: checkerSystemMessage,
                prompt: checkerPrompt(lastChanceFixedCandidate),
                temperature: checkerTemperature,
              });

              if (
                finalCheckResult.passesCheck ||
                finalCheckResult.fixText === "None"
              ) {
                logger.info(
                  `[genAndCheck: ${fnBaseName}] Last-chance additional fix succeeded on attempt ${
                    attempt + 0.5
                  }`
                );
                return lastChanceFixedCandidate;
              }
            }
          } catch (additionalFixError) {
            logger.warn(
              `[genAndCheck: ${fnBaseName}] Additional fix attempt failed`,
              { additionalFixError }
            );
          }
        }
      } catch (checkError) {
        logger.warn(
          `[genAndCheck: ${fnBaseName}] Check error on attempt ${attempt}`,
          { error: checkError }
        );

        // If this is the last attempt, save the candidate and continue to the end
        if (attempt === maxAttempts) {
          lastCandidate = candidate;
          lastFixText =
            checkError instanceof Error
              ? checkError.message
              : String(checkError);
        }
      }
    }

    // If we got here, we've exhausted all attempts, but we have a last candidate
    if (lastCandidate) {
      // As a final attempt, try our internal validation if it's an event
      if (fnBaseName.includes("Event")) {
        try {
          const finalFixedCandidate = validateAndFixPortraits(
            lastCandidate,
            fnBaseName,
            maxAttempts + 1,
            logger
          );

          if (manuallyValidateEvent(finalFixedCandidate)) {
            logger.info(
              `[genAndCheck: ${fnBaseName}] Final manual validation succeeded at last attempt`
            );
            return finalFixedCandidate;
          }
        } catch (finalError) {
          logger.error(
            `[genAndCheck: ${fnBaseName}] Final manual validation failed`,
            { finalError }
          );
        }
      }

      logger.warn(
        `[genAndCheck: ${fnBaseName}] Using last candidate despite failed checks`
      );
      return lastCandidate;
    }

    throw new Error(`Unreachable code in genAndCheck for ${fnBaseName}`);
  } finally {
    const duration = Date.now() - startTime;
    logger.info(`[genAndCheck: ${fnBaseName}] Completed`, { duration });
  }
}

/**
 * Manually validates an event to ensure all speaking characters have portraits
 */
function manuallyValidateEvent<T>(candidate: T): boolean {
  // Early return if not an event
  if (!(candidate as any)?.sourceObjects) {
    return true;
  }

  const aiEvent = candidate as any;
  if (!aiEvent.sourceObjects || !Array.isArray(aiEvent.sourceObjects)) {
    return false;
  }

  // Track characters that have been added with add_portrait
  const addedCharacters = new Set<string>();

  // First pass: check if all speaking characters have portraits
  for (const obj of aiEvent.sourceObjects) {
    if (obj.command === "add_portrait" && obj.args?.length >= 1) {
      addedCharacters.add(obj.args[0]);
    } else if (
      obj.command === "speak" &&
      obj.args?.length >= 1 &&
      !addedCharacters.has(obj.args[0])
    ) {
      return false; // Found a character speaking without a portrait
    }
  }

  return true;
}

/**
 * Validates and fixes portrait issues in events programmatically
 */
function validateAndFixPortraits<T>(
  candidate: T,
  fnBaseName: string,
  attemptNumber: number,
  logger: any
): T {
  // Early return if not an event
  if (!(candidate as any)?.sourceObjects) {
    return candidate;
  }

  const aiEvent = candidate as any;
  if (!aiEvent.sourceObjects || !Array.isArray(aiEvent.sourceObjects)) {
    return candidate;
  }

  // Track characters that have been added with add_portrait
  const addedCharacters = new Set<string>();
  const fixedSourceObjects = [];
  let hasChanges = false;

  // First pass: collect all characters that have add_portrait commands
  for (const obj of aiEvent.sourceObjects) {
    if (obj.command === "add_portrait" && obj.args?.length >= 1) {
      addedCharacters.add(obj.args[0]);
    }
  }

  // Second pass: fix any speak commands for characters without portraits
  for (let i = 0; i < aiEvent.sourceObjects.length; i++) {
    const obj = aiEvent.sourceObjects[i];

    // If it's a speak command and the character hasn't been added
    if (
      obj.command === "speak" &&
      obj.args?.length >= 1 &&
      !addedCharacters.has(obj.args[0])
    ) {
      // Add an add_portrait command before this speak command
      // Use offscreen positions to avoid disrupting existing layout
      logger.debug(
        `[validateAndFixPortraits: ${fnBaseName}] Adding missing portrait for ${obj.args[0]} at attempt ${attemptNumber}`
      );

      fixedSourceObjects.push({
        command: "add_portrait",
        args: [obj.args[0], "OffscreenRight"],
      });

      addedCharacters.add(obj.args[0]);
      hasChanges = true;
    }

    fixedSourceObjects.push(obj);
  }

  if (hasChanges) {
    const fixedCandidate = {
      ...aiEvent,
      sourceObjects: fixedSourceObjects,
    };
    logger.debug(
      `[validateAndFixPortraits: ${fnBaseName}] Applied portrait fixes at attempt ${attemptNumber}`
    );
    return fixedCandidate as T;
  }

  return candidate;
}

/**
 * Attempts to fix a candidate based on the checker's feedback.
 * Uses an LLM to make surgical fixes rather than regenerating from scratch.
 */
async function fixCandidate<T>({
  candidate,
  fixCheck,
  generatorSchema,
  fnBaseName,
  attemptNumber,
}: {
  candidate: T;
  fixCheck: CheckerOutputFix<T>;
  generatorSchema: ZodSchema<T>;
  fnBaseName: string;
  attemptNumber: number;
}): Promise<T> {
  const logger = getCurrentLogger();

  // If fixObject is provided and has meaningful content, apply it directly
  const hasFixObject =
    fixCheck.fixObject && Object.keys(fixCheck.fixObject).length > 0;
  if (hasFixObject) {
    logger.debug(
      `[fixCandidate: ${fnBaseName}] Applying fixObject directly for attempt ${attemptNumber}`
    );
    return { ...candidate, ...fixCheck.fixObject };
  }

  // Special handling for AIEvent objects with character portrait validation issues
  if (
    fnBaseName.includes("Event") &&
    (fixCheck.fixText?.includes("add_portrait") ||
      fixCheck.fixText?.includes("portrait") ||
      fixCheck.fixText?.includes("character") ||
      fixCheck.fixText?.includes("speak"))
  ) {
    try {
      // Try to fix character portrait validation issues programmatically
      logger.debug(
        `[fixCandidate: ${fnBaseName}] Attempting specialized AIEvent fix for attempt ${attemptNumber}`
      );

      const fixedCandidate = validateAndFixPortraits(
        candidate,
        fnBaseName,
        attemptNumber,
        logger
      );

      logger.debug(
        `[fixCandidate: ${fnBaseName}] Applied specialized AIEvent fix for attempt ${attemptNumber}`
      );

      return fixedCandidate;
    } catch (error) {
      logger.warn(
        `[fixCandidate: ${fnBaseName}] Specialized AIEvent fix failed on attempt ${attemptNumber}`,
        { error }
      );
    }
  }

  // Otherwise, use an LLM to fix it
  const fixerSystemMessage = `You are a surgical fixer for a generated response. You've been given:
1. An original candidate object
2. A description of issues with that object

Your job is to make minimal, precise changes to fix the specific issues while preserving everything else.
DO NOT rewrite everything. Only modify what needs to be fixed.
DO NOT add commentary, explanation, or notes. ONLY return the fixed JSON object.

Common fixes you should handle:
- For AIEvents, ensure each character who speaks has an "add_portrait" command before their first speaking line
- Check that characters mentioned in "speak" commands have been added with "add_portrait" earlier
- Correct any malformed or invalid commands
- Remove references to or speaking roles for dead characters`;

  const fixerPrompt = `Original candidate:
${JSON.stringify(candidate, null, 2)}

Issues to fix:
${fixCheck.fixText}

Return only the fixed JSON object with no additional commentary.`;

  try {
    logger.debug(
      `[fixCandidate: ${fnBaseName}] Calling fixer LLM on attempt ${attemptNumber}`
    );

    const { object: fixedCandidate } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: generatorSchema,
      system: fixerSystemMessage,
      prompt: fixerPrompt,
      temperature: 0.2, // Lower temperature for more precise fixes
    });

    logger.debug(
      `[fixCandidate: ${fnBaseName}] Fixer succeeded on attempt ${attemptNumber}`
    );
    return fixedCandidate;
  } catch (error) {
    logger.warn(
      `[fixCandidate: ${fnBaseName}] Fixer failed on attempt ${attemptNumber}`,
      { error }
    );

    // If all else fails, just return the original candidate with any fixObject applied
    if (hasFixObject) {
      return { ...candidate, ...fixCheck.fixObject };
    }

    // Last resort - return the original
    return candidate;
  }
}
