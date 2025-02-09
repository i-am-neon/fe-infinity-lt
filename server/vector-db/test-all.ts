import initVectorDb from "@/vector-db/init.ts";
import storeVector from "@/vector-db/store-vector.ts";
import similaritySearch from "@/vector-db/similarity-search.ts";
import createEmbedding from "@/vector-db/create-embedding.ts";

const sampleVectors = [
  {
    id: "sample-1",
    text: "A portrait of a noble man with a stern expression.",
    metadata: { type: "portrait", name: "Portrait A" },
  },
  {
    id: "sample-2",
    text: "A portrait of a young woman with a kind smile.",
    metadata: { type: "portrait", name: "Portrait B" },
  },
  {
    id: "sample-3",
    text: "A detailed map of a fantasy kingdom with rivers and mountains.",
    metadata: { type: "map", name: "Map A" },
  },
  {
    id: "sample-4",
    text: "An ancient map showing ruins and hidden treasures.",
    metadata: { type: "map", name: "Map B" },
  },
];

/**
 * Runs a full test by initializing the vector DB, generating embeddings for sample texts,
 * storing sample vectors, and performing a similarity search using one of the sample vectors as the query.
 */
async function testAll(): Promise<void> {
  await initVectorDb();
  console.log("Initialized vector DB.");

  const vectorData = [];
  for (const sample of sampleVectors) {
    const embedding = await createEmbedding({ text: sample.text });
    await storeVector(sample.id, embedding, sample.metadata);
    console.log(`Stored vector: ${sample.id}`);
    vectorData.push({ ...sample, embedding });
  }

  // Use the embedding of "sample-1" as the query vector
  const queryVector = await createEmbedding({ text: "fancy boy" });
  const results = await similaritySearch(queryVector, 3);
  console.log("Similarity search results for sample-1:");
  console.log(results);
}

if (import.meta.main) {
  await testAll();
}
