import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import "jsr:@std/dotenv/load";
import { readFileSync } from "node:fs";
import { z, ZodSchema } from "zod";

// Helper function to add delay between retries
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function generateStructuredDataWithImage<T>({
  schema,
  systemMessage,
  prompt,
  temperature = 0,
  imagePath,
  maxRetries = 3,
}: {
  schema: ZodSchema<T>;
  systemMessage: string;
  prompt?: string;
  temperature?: number;
  imagePath: string;
  maxRetries?: number;
}): Promise<T> {
  const fileContents = readFileSync(imagePath);
  const base64 = fileContents.toString("base64");

  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const { object: result } = await generateObject({
        model: openai("gpt-4.1"),
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
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt + 1}/${maxRetries} failed:`, error);

      if (attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s, etc.
        const backoffTime = Math.pow(2, attempt) * 1000;
        console.log(`Retrying in ${backoffTime}ms...`);
        await sleep(backoffTime);
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts. Last error: ${lastError}`);
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
  }).catch((error) => {
    console.error("Failed to generate data:", error);
  });
}

