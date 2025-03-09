import { getVectorStore } from "./init.ts";
import { VectorType } from "./types/vector-type.ts";
import { Vector } from "./vector-store.ts";

export interface TypedSimilarityResult<T> {
  id: string;
  score: number;
  metadata: T;
}

export default async function similaritySearch<T = Record<string, unknown>>({
  vectorType,
  query,
  limit = 5,
  transform,
}: {
  vectorType: VectorType;
  query: string;
  limit?: number;
  transform?: (vector: Vector) => T;
}): Promise<TypedSimilarityResult<T>[]> {
  const vectorStore = await getVectorStore();
  const results = await vectorStore.findSimilar(vectorType, query, limit);

  return results.map((result) => ({
    id: result.vector.id,
    score: result.similarity,
    metadata: transform
      ? transform(result.vector)
      : (result.vector.metadata as T),
  }));
}

if (import.meta.main) {
  // Example usage
  (async () => {
    const vectorStore = await getVectorStore();

    // Check if we have any vectors
    const malePortraits = vectorStore.getVectors("portraits-male");
    const femalePortraits = vectorStore.getVectors("portraits-female");
    console.log(
      `Available vectors: ${malePortraits.length} male portraits, ${femalePortraits.length} female portraits`
    );

    // Example query
    const query = "young male with silver hair";
    const results = await similaritySearch({
      vectorType: "portraits-male",
      query,
      limit: 3,
    });

    console.log(`Search query: "${query}"`);
    if (results.length === 0) {
      console.log("No results found. Check if vectors are properly loaded.");
    } else {
      console.log(
        "Search results:",
        results.map((r) => ({
          similarity: r.score.toFixed(4),
          id: r.id,
          metadata: r.metadata,
        }))
      );
    }
  })();
}
