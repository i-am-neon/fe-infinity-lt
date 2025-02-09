import createEmbedding from "@/vector-db/create-embedding.ts";
import storeVector from "@/vector-db/store-vector.ts";
import OpenAI from "openai";

export interface GenerateAndStoreVectorOptions {
  id: string;
  text: string;
  metadata: Record<string, unknown>;
  model?: OpenAI.Embeddings.EmbeddingModel;
}

export default async function generateAndStoreVector({
  id,
  text,
  metadata,
  model = "text-embedding-3-small",
}: GenerateAndStoreVectorOptions): Promise<void> {
  const embedding = await createEmbedding({ text, model });
  await storeVector(id, embedding, metadata);
}

if (import.meta.main) {
  const id = "sample-id";
  const text = "Hello world. This is a sample text to embed.";
  const metadata = { type: "demo" };
  await generateAndStoreVector({ id, text, metadata });
  console.log("Generated and stored embedding for sample-id.");
}

