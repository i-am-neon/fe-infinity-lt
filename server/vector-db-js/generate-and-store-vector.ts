import createEmbedding from "@/vector-db-js/create-embedding.ts";
import { storeVector, generateId } from "@/vector-db-js/vector-store.ts";
import { VectorType } from "@/vector-db-js/types/vector-type.ts";
import OpenAI from "openai";

export interface GenerateAndStoreVectorOptions {
  id?: string;
  text: string;
  metadata: Record<string, unknown>;
  vectorType: VectorType;
  model?: OpenAI.Embeddings.EmbeddingModel;
}

export default async function generateAndStoreVector({
  id,
  text,
  metadata,
  vectorType,
  model = "text-embedding-3-small",
}: GenerateAndStoreVectorOptions): Promise<string> {
  // Generate embedding
  const embedding = await createEmbedding({ text, model });
  
  // Use provided ID or generate a new one
  const vectorId = id || generateId();
  
  // Store the vector
  await storeVector({
    id: vectorId,
    embedding,
    metadata,
    vectorType
  });
  
  return vectorId;
}

if (import.meta.main) {
  const id = await generateAndStoreVector({
    text: "Hello world. This is a sample text to embed.",
    metadata: { type: "demo" },
    vectorType: "maps",
  });
  
  console.log(`Generated and stored embedding with ID: ${id}`);
}