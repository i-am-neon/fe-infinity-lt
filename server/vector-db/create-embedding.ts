import OpenAI from "openai";
import { isElectronEnvironment } from "@/lib/env-detector.ts";
import { getAIApiKey } from "@/lib/api-key-manager.ts";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { embed } from "ai";

export interface CreateEmbeddingOptions {
  text: string;
  model?: OpenAI.Embeddings.EmbeddingModel;
}

export default async function createEmbedding({
  text,
  model = "text-embedding-3-small",
}: CreateEmbeddingOptions): Promise<number[]> {
  // Get API key from our manager which prioritizes user-provided keys
  const apiKey = getAIApiKey();

  // If no key is available, throw an error
  if (!apiKey) {
    const error = "No OpenAI API key found. Please provide an API key in the settings.";
    console.error(error);
    throw new Error(error);
  }

  // const openai = new OpenAI({
  //   apiKey: apiKey,
  // });
  const google = createGoogleGenerativeAI({
    apiKey,
  });

  try {
    // const response = await openai.embeddings.create({
    //   model,
    //   input: text,
    //   encoding_format: "float",
    // });
    // return response.data[0].embedding as number[];
    const model = google.textEmbedding('gemini-embedding-001')
    const { embedding } = await embed({
      model,
      value: text,
      providerOptions: {
        google: {
          taskType: 'SEMANTIC_SIMILARITY', // optional, specifies the task type for generating embeddings
        },
      },
    });
    return embedding;
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