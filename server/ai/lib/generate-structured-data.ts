import { getCurrentLogger } from "@/lib/current-logger.ts";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import "jsr:@std/dotenv/load";
import { z, ZodSchema } from "zod";
import { getOpenAIApiKey } from "@/lib/api-key-manager.ts";

export type ModelType = "fast" | "strong";
const LLM_PROVIDER = "openai";

export default async function generateStructuredData<T>({
  fnName,
  schema,
  systemMessage,
  prompt,
  temperature,
  model = "fast",
  logResults = true,
}: {
  fnName: string;
  schema: ZodSchema<T>;
  systemMessage: string;
  prompt?: string;
  temperature?: number;
  model?: ModelType;
  logResults?: boolean;
}): Promise<T> {
  const logger = getCurrentLogger();
  let lastError: unknown;
  const startTime = performance.now();

  // Get API key from our key manager
  const openaiKey = getOpenAIApiKey();

  // Check if we have an API key
  if (!openaiKey) {
    const error = "No OpenAI API key found. Please provide an API key in the settings.";
    logger.error(error);
    throw new Error(error);
  }

  // If we have a custom key, temporarily set it as environment variable
  // This is how the AI SDK expects keys to be provided
  let originalOpenAIKey;
  if (openaiKey) {
    originalOpenAIKey = Deno.env.get("OPENAI_API_KEY");
    Deno.env.set("OPENAI_API_KEY", openaiKey);
  }

  try {
    // Select the appropriate model based on type
    const _model = model === "fast"
      ? openai("gpt-4o-mini")
      : openai("gpt-4.5-preview");

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const attemptStartTime = performance.now();
        const { object: result } = await generateObject({
          model: _model,
          schema,
          system: systemMessage,
          prompt: prompt || "no prompt provided",
          temperature,
        });
        const attemptDuration = performance.now() - attemptStartTime;

        logResults &&
          logger.debug(
            `[generateStructuredData: ${fnName}] Attempt ${attempt} succeeded`,
            {
              model: _model.modelId,
              result,
              duration_ms: Math.round(attemptDuration),
            }
          );

        const totalDuration = performance.now() - startTime;
        logResults &&
          logger.info(
            `[generateStructuredData: ${fnName}] Total execution completed successfully`,
            {
              model: _model.modelId,
              attempts: attempt,
              duration_ms: Math.round(totalDuration),
            }
          );

        return result;
      } catch (error) {
        const attemptDuration = performance.now() - startTime;

        logResults &&
          logger.warn(
            `[generateStructuredData: ${fnName}] Attempt ${attempt} failed`,
            {
              model: _model.modelId,
              error,
              duration_ms: Math.round(attemptDuration),
            }
          );

        lastError = error;
        if (attempt === 3) {
          const totalDuration = performance.now() - startTime;

          const message = `[generateStructuredData: ${fnName}] All 3 attempts failed: ${String(
            lastError
          )}`;

          logResults &&
            logger.error(
              `[generateStructuredData: ${fnName}] All 3 attempts failed`,
              {
                model: _model.modelId,
                error: lastError,
                duration_ms: Math.round(totalDuration),
              }
            );

          throw new Error(message);
        }
      }
    }
    throw new Error("[generateStructuredData] This should never happen.");
  } finally {
    // Restore original environment variable
    if (originalOpenAIKey !== undefined) {
      Deno.env.set("OPENAI_API_KEY", originalOpenAIKey);
    }
  }
}

if (import.meta.main) {
  const schema = z.object({
    name: z.string(),
    age: z.number(),
  });
  generateStructuredData({
    fnName: "generatePerson",
    schema,
    systemMessage: "Generate a person object",
  }).then((res) => {
    console.log(res);
  });
}

