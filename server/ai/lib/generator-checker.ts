import generateStructuredData, {
  ModelType,
} from "@/ai/lib/generate-structured-data.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import "jsr:@std/dotenv/load";
import { z, ZodObject, ZodSchema } from "zod";

export interface CheckerOutputFix<T> {
  fixText: string;
  fixObject: Partial<T>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export type ValidatorFunction<T> = (candidate: T) => ValidationResult;

export interface GeneratorCheckerAllInOneParams<T> {
  generatorSystemMessage: string;
  generatorPrompt: string;
  generatorSchema: ZodSchema<T>;
  checkerSystemMessage: string;
  checkerPrompt: (candidate: T) => string;
  generatorModel?: ModelType;
  generatorTemperature?: number;
  checkerModel?: ModelType;
  checkerTemperature?: number;
  maxAttempts?: number;
  fnBaseName: string;
  validators?: ValidatorFunction<T>[];
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
  generatorModel = "fast",
  generatorTemperature = 0.8,
  checkerModel = "fast",
  checkerTemperature = 0,
  maxAttempts = 3,
  fnBaseName,
  validators,
}: GeneratorCheckerAllInOneParams<T>): Promise<T> {
  const logger = getCurrentLogger();
  const startTime = Date.now();

  checkerSystemMessage += `\nIf the candidate is valid, return exactly the JSON:
{
  "passesCheck": true,
  "fixText": "None",
  "fixObject": {}
}
If the candidate is invalid, return exactly the JSON:
{
  "passesCheck": false,
  "fixText": "some fix instructions",
  "fixObject": {}
}
No additional commentary or text outside these JSON objects.`;

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

        const generatedCandidate = await generateStructuredData({
          fnName: `${fnBaseName}_generator_${attempt}`,
          schema: generatorSchema,
          systemMessage: generatorSystemMessage,
          prompt: generationPrompt,
          temperature: generatorTemperature,
          model: generatorModel,
          logResults: false,
        });

        logger.debug(
          `[genAndCheck: ${fnBaseName}] Generation attempt ${attempt} succeeded`,
          { candidate: generatedCandidate }
        );

        candidate = generatedCandidate;
      } catch (genError) {
        logger.warn(
          `[genAndCheck: ${fnBaseName}] Generation error on attempt ${attempt}`,
          { error: (genError as Error).message }
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

      // 2) Check the candidate with the checker LLM, using the raw schema
      try {
        // Run validators if provided
        const validationResults: Record<string, ValidationResult> = {};
        let algorithmicValidationFailed = false;

        if (validators && validators.length > 0) {
          for (let i = 0; i < validators.length; i++) {
            const validatorName = `validator_${i + 1}`;
            const validationResult = validators[i](candidate);
            validationResults[validatorName] = validationResult;

            if (!validationResult.isValid) {
              algorithmicValidationFailed = true;
              logger.warn(
                `[genAndCheck: ${fnBaseName}] Validator ${validatorName} failed on attempt ${attempt}`,
                { validationResult }
              );
            }
          }
        }

        // If algorithmic validation already failed, we can short-circuit and trigger a retry
        if (algorithmicValidationFailed) {
          throw new Error(
            "Algorithmic validation failed. Retrying with a new generation."
          );
        }

        // Get the checker result
        const checkerResult = checkerPrompt(candidate);

        // For backward compatibility - extract algorithmic validation results if they exist in the prompt
        if (
          typeof checkerResult === "string" &&
          checkerResult.includes("Portrait Validation Result")
        ) {
          const validationMatch = checkerResult.match(
            /Portrait Validation Result: ({.*?})/
          );
          if (validationMatch) {
            try {
              const validationResult = JSON.parse(validationMatch[1]);
              if (validationResult && validationResult.isValid === false) {
                algorithmicValidationFailed = true;
                logger.warn(
                  `[genAndCheck: ${fnBaseName}] Embedded algorithmic validation failed on attempt ${attempt}`,
                  { validationResult }
                );
                throw new Error(
                  "Embedded algorithmic validation failed. Retrying with a new generation."
                );
              }
            } catch (e) {
              // Parsing error, just continue
              logger.debug(
                `[genAndCheck: ${fnBaseName}] Error parsing validation result`,
                { error: e }
              );
            }
          }
        }

        // Add validation results to the checker prompt
        const checkerPromptWithValidations =
          Object.keys(validationResults).length > 0
            ? `${checkerResult}\n\nValidation Results: ${JSON.stringify(
                validationResults
              )}`
            : checkerResult;

        const rawFixCheck = await generateStructuredData({
          fnName: `${fnBaseName}_checker_${attempt}`,
          schema: rawCheckerSchema,
          systemMessage: checkerSystemMessage,
          prompt: checkerPromptWithValidations,
          temperature: checkerTemperature,
          model: checkerModel,
          logResults: false,
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

        // If the check fails, see if fix instructions are "None"
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
              generatorModel,
            });

            // Check if the fix worked
            const finalCheckResult = await generateStructuredData({
              fnName: `${fnBaseName}_final_check_additional_${attempt}`,
              schema: rawCheckerSchema,
              systemMessage: checkerSystemMessage,
              prompt: checkerPrompt(lastChanceFixedCandidate),
              temperature: checkerTemperature,
              model: checkerModel,
              logResults: false,
            });

            if (finalCheckResult.passesCheck) {
              logger.info(
                `[genAndCheck: ${fnBaseName}] Last-chance fix succeeded on attempt ${attempt}`
              );
              return lastChanceFixedCandidate;
            }

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
        const fixedCandidate = await fixCandidate({
          candidate,
          fixCheck,
          generatorSchema,
          fnBaseName,
          attemptNumber: attempt,
          generatorModel,
        });

        // 4) Check if the fix worked
        const verifyFixCheck = await generateStructuredData({
          fnName: `${fnBaseName}_verify_fix_${attempt}`,
          schema: rawCheckerSchema,
          systemMessage: checkerSystemMessage,
          prompt: checkerPrompt(fixedCandidate),
          temperature: checkerTemperature,
          model: checkerModel,
          logResults: false,
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

        // If this is the second-to-last attempt, try one more fix
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
              generatorModel,
            });

            // Check if that final fix worked
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
          } catch (additionalFixError) {
            logger.warn(
              `[genAndCheck: ${fnBaseName}] Additional fix attempt failed`,
              { additionalFixError: (additionalFixError as Error).message }
            );
          }
        }
      } catch (checkError) {
        logger.warn(
          `[genAndCheck: ${fnBaseName}] Check error on attempt ${attempt}`,
          { error: (checkError as Error).message }
        );

        // If this is the last attempt, store the candidate
        if (attempt === maxAttempts) {
          lastCandidate = candidate;
          lastFixText =
            checkError instanceof Error
              ? checkError.message
              : String(checkError);
        }
      }
    }

    // If we got here, we've exhausted attempts, but we have a last candidate
    if (lastCandidate) {
      // We simply return the last candidate as-is
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
 * Attempts to fix a candidate based on the checker's feedback.
 */
async function fixCandidate<T>({
  candidate,
  fixCheck,
  generatorSchema,
  fnBaseName,
  attemptNumber,
  generatorModel,
}: {
  candidate: T;
  fixCheck: CheckerOutputFix<T>;
  generatorSchema: ZodSchema<T>;
  fnBaseName: string;
  attemptNumber: number;
  generatorModel: ModelType;
}): Promise<T> {
  const logger = getCurrentLogger();

  // If fixObject is provided with content, apply it directly
  const hasFixObject =
    fixCheck.fixObject && Object.keys(fixCheck.fixObject).length > 0;
  if (hasFixObject) {
    logger.debug(
      `[fixCandidate: ${fnBaseName}] Applying fixObject directly for attempt ${attemptNumber}`
    );
    return { ...candidate, ...fixCheck.fixObject };
  }

  // Otherwise, try the LLM to fix
  const fixerSystemMessage = `You are a surgical fixer for a generated response. You've been given:
1. An original candidate object
2. A description of issues with that object

Your job is to make minimal, precise changes to fix the specific issues while preserving everything else.
DO NOT rewrite everything. Only modify what needs to be fixed.
DO NOT add commentary, explanation, or notes. ONLY return the fixed JSON object.`;

  const fixerPrompt = `Original candidate:
${JSON.stringify(candidate, null, 2)}

Issues to fix:
${fixCheck.fixText}

Return only the fixed JSON object with no additional commentary.`;

  try {
    logger.debug(
      `[fixCandidate: ${fnBaseName}] Calling fixer LLM on attempt ${attemptNumber}`
    );

    const fixedCandidate = await generateStructuredData({
      fnName: `${fnBaseName}_fixer_${attemptNumber}`,
      schema: generatorSchema,
      systemMessage: fixerSystemMessage,
      prompt: fixerPrompt,
      temperature: 0.2,
      model: generatorModel,
      logResults: false,
    });

    logger.debug(
      `[fixCandidate: ${fnBaseName}] Fixer succeeded on attempt ${attemptNumber}`
    );
    return fixedCandidate;
  } catch (error) {
    logger.warn(
      `[fixCandidate: ${fnBaseName}] Fixer failed on attempt ${attemptNumber}`,
      { error: (error as Error).message }
    );

    // If there's a fixObject, return candidate merged with fixObject
    if (hasFixObject) {
      return { ...candidate, ...fixCheck.fixObject };
    }

    // Return the original candidate if everything else fails
    return candidate;
  }
}

