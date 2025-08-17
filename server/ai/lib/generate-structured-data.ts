import { getCurrentLogger } from "@/lib/current-logger.ts";
import { openai } from "@ai-sdk/openai";
import { google } from '@ai-sdk/google';
import { generateObject, NoObjectGeneratedError } from "ai";
import "jsr:@std/dotenv/load";
import { z, ZodSchema } from "zod";
import { getAIApiKey } from "@/lib/api-key-manager.ts";

export type ModelType = "nano" | "fast" | "strong";
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
  const aiKey = getAIApiKey();

  // Check if we have an API key
  if (!aiKey) {
    const error = "No OpenAI API key found. Please provide an API key in the settings.";
    logger.error(error);
    throw new Error(error);
  }

  // If we have a custom key, temporarily set it as environment variable
  // This is how the AI SDK expects keys to be provided
  let originalAIKey;
  if (aiKey) {
    // originalOpenAIKey = Deno.env.get("OPENAI_API_KEY");
    originalAIKey = Deno.env.get("GOOGLE_GENERATIVE_AI_API_KEY");
    // Deno.env.set("OPENAI_API_KEY", openaiKey);
    Deno.env.set("GOOGLE_GENERATIVE_AI_API_KEY", aiKey);
  }

  try {
    // Select the appropriate model based on type
    // const _model = model === "nano"
    //   ? openai("gpt-4.1-nano") : model === "fast"
    //     ? openai("gpt-4.1-mini")
    //     : openai("gpt-4.1");
    const _model = model === "nano"
      ? google("gemini-2.5-flash-lite") : model === "fast"
        ? google("gemini-2.5-flash")
        : google("gemini-2.5-pro");

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const attemptStartTime = performance.now();
        const { object: result } = await generateObject({
          model: _model,
          schema,
          system: systemMessage,
          prompt: prompt || "no prompt provided",
          temperature,
          providerOptions: {
            google: {
              thinkingConfig: {
                thinkingBudget: model === 'strong' ? -1 : undefined, // dynamically choose thinking based on task
              },
            },
          },
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

        // Enhanced error logging for NoObjectGeneratedError
        if (NoObjectGeneratedError.isInstance && NoObjectGeneratedError.isInstance(error)) {
          logResults &&
            logger.warn(
              `[generateStructuredData: ${fnName}] Attempt ${attempt} failed with NoObjectGeneratedError`,
              {
                model: _model.modelId,
                errorMessage: error.message,
                rawText: error.text || "No text available",
                cause: error.cause,
                finishReason: error.finishReason,
                usage: error.usage,
                response: error.response,
                duration_ms: Math.round(attemptDuration),
              }
            );
        } else {
          logResults &&
            logger.warn(
              `[generateStructuredData: ${fnName}] Attempt ${attempt} failed`,
              {
                model: _model.modelId,
                error,
                duration_ms: Math.round(attemptDuration),
              }
            );
        }

        lastError = error;
        if (attempt === 3) {
          const totalDuration = performance.now() - startTime;

          // Enhanced error details in the final error message
          const errorDetails = NoObjectGeneratedError.isInstance && NoObjectGeneratedError.isInstance(lastError)
            ? {
              message: lastError.message,
              rawText: lastError.text || "No text available",
              cause: lastError.cause,
              finishReason: lastError.finishReason,
              usage: lastError.usage
            }
            : String(lastError);

          const message = `[generateStructuredData: ${fnName}] All 3 attempts failed: ${typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails)
            }`;

          logResults &&
            logger.error(
              `[generateStructuredData: ${fnName}] All 3 attempts failed`,
              {
                model: _model.modelId,
                error: lastError,
                errorDetails: NoObjectGeneratedError.isInstance && NoObjectGeneratedError.isInstance(lastError)
                  ? {
                    message: lastError.message,
                    rawText: lastError.text,
                    cause: lastError.cause,
                    finishReason: lastError.finishReason,
                    usage: lastError.usage,
                    response: lastError.response
                  }
                  : undefined,
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
    if (originalAIKey !== undefined) {
      // Deno.env.set("OPENAI_API_KEY", originalOpenAIKey);
      Deno.env.set("GOOGLE_GENERATIVE_AI_API_KEY", originalAIKey);
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

