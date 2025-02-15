import { openai } from "@ai-sdk/openai";
import { OpenAIChatModelId } from "@ai-sdk/openai/internal";
import { generateObject } from "ai";
import "jsr:@std/dotenv/load";
import { z, ZodSchema } from "zod";
import { getCurrentLogger } from "@/lib/current-logger.ts";

export default async function generateStructuredData<T>({
  fnName,
  schema,
  systemMessage,
  prompt,
  temperature,
  model = "gpt-4o-mini",
}: {
  fnName: string;
  schema: ZodSchema<T>;
  systemMessage: string;
  prompt?: string;
  temperature?: number;
  model?: OpenAIChatModelId;
}): Promise<T> {
  const logger = getCurrentLogger();
  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { object: result } = await generateObject({
        model: openai(model),
        schema,
        system: systemMessage,
        prompt: prompt || "",
        temperature,
      });
      logger.debug(
        `[generateStructuredData: ${fnName}] Attempt ${attempt} succeeded`,
        { result }
      );
      return result;
    } catch (error) {
      logger.warn(
        `[generateStructuredData: ${fnName}] Attempt ${attempt} failed`,
        { error }
      );
      lastError = error;
      if (attempt === 3) {
        const message = `[generateStructuredData: ${fnName}] All 3 attempts failed: ${String(
          lastError
        )}`;
        logger.error(message);
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

