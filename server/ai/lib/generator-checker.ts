import generateStructuredData from "@/lib/generate-structured-data.ts";
import { z, ZodSchema, ZodObject } from "zod";
import { OpenAIChatModelId } from "@ai-sdk/openai/internal";
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
  fixText: z.union([z.string(), z.null()]).optional(),
  fixObject: z.unknown().optional(),
});

type RawCheckerOutput = z.infer<typeof rawCheckerSchema>;

/**
 * Attempts to generate a structured object using an LLM, then checks it with a second LLM call.
 * If the checker proposes fixes, we attempt to apply them. If fixText is "None", we accept immediately.
 */
export async function genAndCheck<T>(
  params: GeneratorCheckerAllInOneParams<T>
): Promise<T> {
  const logger = getCurrentLogger();
  const {
    generatorSystemMessage,
    generatorPrompt,
    generatorSchema,
    checkerSystemMessage,
    checkerPrompt,
    generatorModel = "gpt-4o",
    generatorTemperature = 1,
    checkerModel = "gpt-4o-mini",
    checkerTemperature = 0,
    maxAttempts = 3,
    fnBaseName,
  } = params;

  if (!(generatorSchema instanceof ZodObject)) {
    throw new Error(
      "[genAndCheck] generatorSchema must be a ZodObject to allow partial fixObject."
    );
  }

  let partialFix: Partial<T> = {};

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let finalGeneratorPrompt = generatorPrompt;
    if (Object.keys(partialFix).length > 0) {
      finalGeneratorPrompt += `\n\nPotential fix for previous attempt:\n${JSON.stringify(
        partialFix,
        null,
        2
      )}`;
    }

    // 1) Generate the candidate from the generator LLM
    const candidate = await generateStructuredData<T>({
      fnName: `${fnBaseName}_generator_attempt${attempt}`,
      systemMessage: generatorSystemMessage,
      prompt: finalGeneratorPrompt,
      schema: generatorSchema,
      temperature: generatorTemperature,
      model: generatorModel,
    });

    // 2) Check the candidate with the checker LLM, using the raw schema
    const rawFixCheck = await generateStructuredData<RawCheckerOutput>({
      fnName: `${fnBaseName}_checker_attempt${attempt}`,
      systemMessage: checkerSystemMessage,
      prompt: checkerPrompt(candidate),
      schema: rawCheckerSchema,
      temperature: checkerTemperature,
      model: checkerModel,
    });

    // Convert the raw data into a CheckerOutputFix<T>, defaulting to "None" if fixText is null/undefined
    const fixCheck: CheckerOutputFix<T> = {
      fixText: rawFixCheck.fixText ?? "None",
      fixObject: (rawFixCheck.fixObject as Partial<T>) ?? {},
    };

    // If fixText is "None", no changes needed; return the candidate
    if (!fixCheck.fixText || fixCheck.fixText === "None") {
      return candidate;
    }

    // If we reached the last attempt and still have a fix required, throw
    if (attempt === maxAttempts) {
      throw new Error(
        `Failed after ${maxAttempts} attempts. Last fixText: ${fixCheck.fixText}`
      );
    }

    // Otherwise incorporate partial fix and continue
    partialFix = fixCheck.fixObject;
    logger.warn(`${fnBaseName}_generator_attempt${attempt} FAILED:`, {
      fixCheck,
      candidate,
    });
  }

  throw new Error("Unreachable code in genAndCheck");
}

