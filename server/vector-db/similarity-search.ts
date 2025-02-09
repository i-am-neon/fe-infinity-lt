import pool from "@/vector-db/connection.ts";

/**
 * Performs a similarity search on the 'vectors' table, finding the closest matches
 * by cosine distance between a query embedding and stored embeddings.
 * @param embedding Query embedding to compare against.
 * @param topK Number of results to return.
 * @returns An array of objects including { id, score, metadata }.
 */
export default async function similaritySearch(
  embedding: number[],
  topK = 3
): Promise<
  Array<{
    id: string;
    score: number;
    metadata: Record<string, unknown> | null;
  }>
> {
  const client = await pool.connect();
  try {
    const embeddingLiteral = "[" + embedding.join(",") + "]";
    const query = `
      SELECT
        id,
        1 - (embedding <#> $1::vector) AS score,
        metadata
      FROM vectors
      ORDER BY embedding <#> $1::vector
      LIMIT $2;
    `;
    const result = await client.query(query, [embeddingLiteral, topK]);
    return result.rows as Array<{
      id: string;
      score: number;
      metadata: Record<string, unknown> | null;
    }>;
  } finally {
    client.release();
  }
}

if (import.meta.main) {
  // Example usage
  const queryEmbedding = new Array(1536).fill(0).map(() => Math.random());
  const results = await similaritySearch(queryEmbedding, 5);
  console.log("Similarity search results:", results);
}
