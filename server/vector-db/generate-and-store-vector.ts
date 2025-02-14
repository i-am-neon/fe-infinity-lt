import createEmbedding from "@/vector-db/create-embedding.ts";
import storeVector from "@/vector-db/store-vector.ts";
import OpenAI from "openai";

export interface GenerateAndStoreVectorOptions {
  id: string;
  text: string;
  metadata: Record<string, unknown>;
  vectorType: "maps" | "portraits";
  model?: OpenAI.Embeddings.EmbeddingModel;
}

export default async function generateAndStoreVector({
  id,
  text,
  metadata,
  vectorType,
  model = "text-embedding-3-small",
}: GenerateAndStoreVectorOptions): Promise<void> {
  const embedding = await createEmbedding({ text, model });
  await storeVector({ id, embedding, metadata, vectorType });

  function getSeedFilePathByType(type: "maps" | "portraits"): string {
    return new URL(
      type === "maps" ? "./seed-vectors/maps.json" : "./seed-vectors/portraits.json",
      import.meta.url
    ).pathname;
  }
  const seedFilePath = getSeedFilePathByType(vectorType);
  let seedVectors: Array<{ id: string; embedding: number[]; metadata: Record<string, unknown> }> = [];
  try {
    const data = await Deno.readTextFile(seedFilePath);
    seedVectors = JSON.parse(data);
  } catch (error) {
    console.log(`No seed vectors file found for ${vectorType}, creating a new one.`);
  }
  seedVectors.push({ id, embedding, metadata });
  await Deno.writeTextFile(seedFilePath, JSON.stringify(seedVectors, null, 2));
}

if (import.meta.main) {
  const id = "sample-id";
  const text = "Hello world. This is a sample text to embed.";
  const metadata = { type: "demo" };
  await generateAndStoreVector({ id, text, metadata, vectorType: "portraits" });
  console.log("Generated and stored embedding for sample-id.");
}