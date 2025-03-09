import OpenAI from "openai";
import { isElectronEnvironment } from "@/lib/env-detector.ts";

export interface CreateEmbeddingOptions {
  text: string;
  model?: OpenAI.Embeddings.EmbeddingModel;
}

export default async function createEmbedding({
  text,
  model = "text-embedding-3-small",
}: CreateEmbeddingOptions): Promise<number[]> {
  let apiKey: string | undefined;
  
  // Handle API key differently in Electron vs standalone
  if (isElectronEnvironment()) {
    apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      console.warn("No OpenAI API key found in Electron environment. Using default API key initialization.");
    }
  }

  const openai = new OpenAI({
    apiKey: apiKey, // If undefined, OpenAI will use OPENAI_API_KEY env var or ~/.openai/config.json
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