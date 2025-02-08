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
  const { object: result } = await generateObject({
    model: openai(model),
    schema,
    system: systemMessage,
    prompt: prompt || "",
    temperature,
  });

  return result;
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
