import createEmbedding from "@/vector-db-js/create-embedding.ts";
import {
  SimilarityResult,
  VectorType,
} from "@/vector-db-js/types/vector-type.ts";
import { similaritySearch as performSimilaritySearch, initVectorStore } from "@/vector-db-js/vector-store.ts";

export default async function similaritySearch({
  searchQuery,
  topK = 3,
  vectorType,
}: {
  searchQuery: string;
  topK: number;
  vectorType: VectorType;
}): Promise<SimilarityResult[]> {
  // Reload vectors to ensure we have the latest data
  await initVectorStore();
  
  // Generate embedding for the search query
  const queryEmbedding = await createEmbedding({ text: searchQuery });

  // Perform similarity search
  return performSimilaritySearch({
    queryEmbedding,
    topK,
    vectorType,
  });
}

if (import.meta.main) {
  // Example usage
  const results = await similaritySearch({
    searchQuery: "blonde girl",
    topK: 3,
    vectorType: "portraits-female",
  });

  console.log("Search results:", results);
}