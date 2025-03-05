import createEmbedding from "@/vector-db/create-embedding.ts";
import storeVector from "@/vector-db/store-vector.ts";
import OpenAI from "openai";
import { VectorType } from "@/vector-db/types/vector-type.ts";

export interface GenerateAndStoreVectorOptions {
  id: string;
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
}: GenerateAndStoreVectorOptions): Promise<void> {
  const embedding = await createEmbedding({ text, model });
  await storeVector({ id, embedding, metadata, vectorType });

  function getSeedFilePathByType(type: VectorType): string {
    if (type === "maps") {
      return new URL("./seed-vectors/maps.json", import.meta.url).pathname;
    } else if (type === "portraits-male") {
      return new URL("./seed-vectors/portraits-male.json", import.meta.url)
        .pathname;
    } else if (type === "portraits-female") {
      return new URL("./seed-vectors/portraits-female.json", import.meta.url)
        .pathname;
    } else if (type === "items") {
      return new URL("./seed-vectors/items.json", import.meta.url).pathname;
    } else {
      throw new Error("invalid vector type");
    }
  }
  const seedFilePath = getSeedFilePathByType(vectorType);
  let seedVectors: Array<{
    id: string;
    embedding: number[];
    metadata: Record<string, unknown>;
  }> = [];
  try {
    const data = await Deno.readTextFile(seedFilePath);
    seedVectors = JSON.parse(data);
  } catch (error) {
    console.log(
      `No seed vectors file found for ${vectorType}, creating a new one.`
    );
  }
  seedVectors.push({ id, embedding, metadata });
  await Deno.writeTextFile(seedFilePath, JSON.stringify(seedVectors, null, 2));
}

if (import.meta.main) {
  const id = "sample-id";
  const text = "Hello world. This is a sample text to embed.";
  const metadata = { type: "demo" };
  await generateAndStoreVector({
    id,
    text,
    metadata,
    vectorType: "portraits-male",
  });
  console.log("Generated and stored embedding for sample-id.");
}

