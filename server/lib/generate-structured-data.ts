import { openai } from "@ai-sdk/openai";
import { OpenAIChatModelId } from "@ai-sdk/openai/internal";
import { generateObject } from "ai";
import "jsr:@std/dotenv/load";
import { z, ZodSchema } from "zod";

export default async function generateStructuredData<T>({
  schema,
  systemMessage,
  prompt,
  temperature = 0,
  model = "gpt-4o",
}: {
  schema: ZodSchema<T>;
  systemMessage: string;
  prompt?: string;
  temperature?: number;
  model?: OpenAIChatModelId;
}): Promise<T> {
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
      return result;
    } catch (error) {
      console.warn(`[generateStructuredData] Attempt ${attempt} failed: ${error}`);
      lastError = error;
      if (attempt === 3) {
        throw new Error(
          `[generateStructuredData] All 3 attempts failed: ${String(lastError)}`
        );
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
    schema,
    systemMessage: "Generate a person object",
  }).then((res) => {
    console.log(res);
  });
}