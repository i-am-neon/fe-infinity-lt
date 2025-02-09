import createEmbedding from "@/vector-db/create-embedding.ts";
import initVectorDb from "@/vector-db/init.ts";
import { seedVectors } from "@/vector-db/seed-vectors.ts";
import similaritySearch from "@/vector-db/similarity-search.ts";

/**
 * Runs a full test by initializing the vector DB, generating embeddings for sample texts,
 * storing sample vectors, updating the seed vectors file, and performing a similarity search using one of the sample vectors as the query.
 */
async function testSeedVectors(): Promise<void> {
  await initVectorDb();
  await seedVectors();

  // Use the embedding of "sample-1" as the query vector
  const queryVector = await createEmbedding({ text: "fancy boy" });
  const results = await similaritySearch(queryVector, 3);
  console.log("Similarity search results for sample-1:");
  console.log(results);
}

if (import.meta.main) {
  await testSeedVectors();
}

