import { getCurrentLogger } from "@/lib/current-logger.ts";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import "jsr:@std/dotenv/load";
import { z, ZodSchema } from "zod";

export type ModelType = "fast" | "strong";
const LLM_PROVIDER: "anthropic" | "openai" = "openai";

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

  const _model =
    LLM_PROVIDER === "anthropic"
      ? model === "fast"
        ? anthropic("claude-3-5-haiku-latest")
        : anthropic("claude-3-7-sonnet-20250219")
      : model === "fast"
      ? openai("gpt-4o-mini")
      : openai("gpt-4o");

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

