import { getCurrentLogger } from "../lib/current-logger.ts";
import createEmbedding from "./create-embedding.ts";
import { VectorType } from "./types/vector-type.ts";
import { generateId, storeVector } from "./vector-store.ts";

export interface GenerateAndStoreVectorOptions {
  id?: string;
  text: string;
  metadata: Record<string, unknown>;
  vectorType: VectorType;
}

export default async function generateAndStoreVector({
  id,
  text,
  metadata,
  vectorType,
}: GenerateAndStoreVectorOptions): Promise<string> {
  try {
    // Generate embedding
    const embedding = await createEmbedding({ text });

    // Use provided ID or generate a new one
    const vectorId = id || generateId();

    // Store the vector
    await storeVector({
      id: vectorId,
      embedding,
      metadata,
      vectorType,
    });

    return vectorId;
  } catch (error) {
    const logger = getCurrentLogger();
    logger.error(`[Generate and Store Vector] Error`, { error, text, metadata, vectorType });
    throw error;
  }
}

if (import.meta.main) {
  const id = await generateAndStoreVector({
    text: "Hello world. This is a sample text to embed.",
    metadata: { type: "demo" },
    vectorType: "maps",
  });

  console.log(`Generated and stored embedding with ID: ${id}`);
}
