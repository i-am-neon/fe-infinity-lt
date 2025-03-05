import pool from "@/vector-db/connection.ts";
import { VectorType } from "@/vector-db/types/vector-type.ts";

/**
 * Stores or updates a vector and its metadata in the database.
 * @param id Unique identifier for this entry.
 * @param embedding Array of numbers, must match the dimension declared in initVectorDb.
 * @param metadata Arbitrary metadata, stored as JSON.
 */
export default async function storeVector({
  id,
  embedding,
  metadata,
  vectorType,
}: {
  id: string;
  embedding: number[];
  metadata: Record<string, unknown>;
  vectorType: VectorType;
}): Promise<void> {
  const client = await pool.connect();
  try {
    // Convert embedding array to Postgres vector literal format
    const embeddingLiteral = "[" + embedding.join(",") + "]";
    let tableName = "";
    if (vectorType === "maps") {
      tableName = "maps_vectors";
    } else if (vectorType === "portraits-male") {
      tableName = "portraits_male_vectors";
    } else if (vectorType === "portraits-female") {
      tableName = "portraits_female_vectors";
    } else if (vectorType === "items") {
      tableName = "items_vectors";
    } else {
      tableName = "music_vectors";
    }
    await client.query(
      `
        INSERT INTO ${tableName} (id, embedding, metadata)
        VALUES ($1, $2::vector, $3)
        ON CONFLICT (id)
        DO UPDATE SET embedding = EXCLUDED.embedding,
                      metadata  = EXCLUDED.metadata;
      `,
      [id, embeddingLiteral, JSON.stringify(metadata)]
    );
  } finally {
    client.release();
  }
}

if (import.meta.main) {
  // Sample usage
  const id = "sample-001";
  const sampleEmbedding = new Array(1536).fill(0).map(() => Math.random());
  const sampleMetadata = { type: "portrait", name: "Test Portrait" };

  await storeVector({
    id,
    embedding: sampleEmbedding,
    metadata: sampleMetadata,
    vectorType: "portraits-male",
  });
  console.log("Stored sample vector data in 'vectors' table.");
}

