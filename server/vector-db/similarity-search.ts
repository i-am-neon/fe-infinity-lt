import pool from "@/vector-db/connection.ts";

export default async function similaritySearch(
  embedding: number[],
  topK = 3,
  vectorType: "maps" | "portraits"
): Promise<
  Array<{
    id: string;
    score: number;
    metadata: Record<string, unknown> | null;
  }>
> {
  console.log("Similarity search table selection:", vectorType);

  const client = await pool.connect();
  try {
    const tableName =
      vectorType === "maps" ? "maps_vectors" : "portraits_vectors";
    const embeddingLiteral = "[" + embedding.join(",") + "]";
    const query = `
      SELECT
        id,
        1 - (embedding <#> $1::vector) AS score,
        metadata
      FROM ${tableName}
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
  // Example usage for maps
  const queryEmbedding = new Array(1536).fill(0).map(() => Math.random());
  const res = await similaritySearch(queryEmbedding, 100, "portraits");
  console.log("similarity search results:", res);
}

