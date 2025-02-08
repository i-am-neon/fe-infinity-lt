import "jsr:@std/dotenv/load";
import { openai } from "@ai-sdk/openai";
import { OpenAIChatModelId } from "@ai-sdk/openai/internal";
import { generateObject } from "ai";
import { z, ZodSchema } from "zod";
import { readFileSync } from "node:fs";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

export default async function generateStructuredDataWithImage<T>({
  schema,
  systemMessage,
  prompt,
  temperature = 0,
  model = "gpt-4o",
  imagePath,
}: {
  schema: ZodSchema<T>;
  systemMessage: string;
  prompt?: string;
  temperature?: number;
  model?: OpenAIChatModelId;
  imagePath: string;
}): Promise<T> {
  const fileContents = readFileSync(imagePath);
  const base64 = fileContents.toString("base64");

  const { object: result } = await generateObject({
    model: openai(model),
    schema,
    system: systemMessage,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt || "",
          },
          {
            type: "image",
            image: `data:image/png;base64,${base64}`,
          },
        ],
      },
    ],
    temperature,
  });

  return result;
}

if (import.meta.main) {
  const schema = z.object({
    regions: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
      })
    ),
  });

  generateStructuredDataWithImage({
    schema,
    systemMessage:
      "This is a FE map. Break it up into distinct regions that pertain to playing the map from a strategy standpoint.",
    prompt: "Sample prompt",
    imagePath: getPathWithinServer("assets/test/test-map-image.png"),
  }).then((res) => {
    console.log("Response:", res);
  });
}

