import pool from "@/vector-db/connection.ts";

/**
 * Stores or updates a vector and its metadata in the database.
 * @param id Unique identifier for this entry.
 * @param embedding Array of numbers, must match the dimension declared in initVectorDb.
 * @param metadata Arbitrary metadata, stored as JSON.
 */
export default async function storeVector(
  id: string,
  embedding: number[],
  metadata: Record<string, unknown>
): Promise<void> {
  const client = await pool.connect();
  try {
    // Convert embedding array to Postgres vector literal format
    const embeddingLiteral = "[" + embedding.join(",") + "]";
    const query = `
      INSERT INTO vectors (id, embedding, metadata)
      VALUES ($1, $2::vector, $3)
      ON CONFLICT (id)
      DO UPDATE SET embedding = EXCLUDED.embedding,
                    metadata  = EXCLUDED.metadata;
    `;
    await client.query(query, [id, embeddingLiteral, JSON.stringify(metadata)]);
  } finally {
    client.release();
  }
}

if (import.meta.main) {
  // Sample usage
  const id = "sample-001";
  const sampleEmbedding = new Array(1536).fill(0).map(() => Math.random());
  const sampleMetadata = { type: "portrait", name: "Test Portrait" };

  await storeVector(id, sampleEmbedding, sampleMetadata);
  console.log("Stored sample vector data in 'vectors' table.");
}
