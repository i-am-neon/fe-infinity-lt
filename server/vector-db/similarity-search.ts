import pool from "@/vector-db/connection.ts";
import { VectorType } from "@/vector-db/types/vector-type.ts";
import createEmbedding from "@/vector-db/create-embedding.ts";
import { adaptiveSimilaritySearch } from "@/vector-db/adapter.ts";

export default async function similaritySearch({
  searchQuery,
  topK = 3,
  vectorType,
}: {
  searchQuery: string;
  topK: number;
  vectorType: VectorType;
}): Promise<
  Array<{
    id: string;
    score: number;
    metadata: Record<string, unknown> | null;
  }>
> {
  // Use the adapter which will route to the appropriate implementation
  return adaptiveSimilaritySearch({ searchQuery, topK, vectorType });
}

// This function is the original PostgreSQL implementation that's used when not in Electron
export async function pgSimilaritySearch({
  searchQuery,
  topK = 3,
  vectorType,
}: {
  searchQuery: string;
  topK: number;
  vectorType: VectorType;
}): Promise<
  Array<{
    id: string;
    score: number;
    metadata: Record<string, unknown> | null;
  }>
> {
  const client = await pool.connect();
  try {
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
    const embedding = await createEmbedding({ text: searchQuery });

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
  const res = await similaritySearch({
    searchQuery: "Magic Necklace",
    topK: 3,
    vectorType: "items",
  });

  console.log("similarity search results:", res);
}
