import OpenAI from "openai";
import { isElectronEnvironment } from "@/lib/env-detector.ts";
import { getOpenAIApiKey } from "@/lib/api-key-manager.ts";

export interface CreateEmbeddingOptions {
  text: string;
  model?: OpenAI.Embeddings.EmbeddingModel;
}

export default async function createEmbedding({
  text,
  model = "text-embedding-3-small",
}: CreateEmbeddingOptions): Promise<number[]> {
  // Get API key from our manager which prioritizes user-provided keys
  const apiKey = getOpenAIApiKey();

  // If no key is available, throw an error
  if (!apiKey) {
    const error = "No OpenAI API key found. Please provide an API key in the settings.";
    console.error(error);
    throw new Error(error);
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const response = await openai.embeddings.create({
      model,
      input: text,
      encoding_format: "float",
    });

    return response.data[0].embedding as number[];
  } catch (error) {
    console.error("Error creating embedding:", error);
    // Return a 0-dimension embedding as fallback (will be detected as invalid later)
    return [];
  }
}

if (import.meta.main) {
  const text = "Hello world. This is a sample text to embed.";
  const embedding = await createEmbedding({ text });
  console.log("Embedding:", embedding);
}