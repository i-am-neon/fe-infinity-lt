import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import "jsr:@std/dotenv/load";
import { readFileSync } from "node:fs";
import { z, ZodSchema } from "zod";

export default async function generateStructuredDataWithImage<T>({
  schema,
  systemMessage,
  prompt,
  temperature = 0,
  imagePath,
}: {
  schema: ZodSchema<T>;
  systemMessage: string;
  prompt?: string;
  temperature?: number;
  imagePath: string;
}): Promise<T> {
  const fileContents = readFileSync(imagePath);
  const base64 = fileContents.toString("base64");

  const { object: result } = await generateObject({
    model: anthropic("claude-3-7-sonnet-20250219"),
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

