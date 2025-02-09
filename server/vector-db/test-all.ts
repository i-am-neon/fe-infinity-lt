import initVectorDb from "@/vector-db/init.ts";
import storeVector from "@/vector-db/store-vector.ts";
import similaritySearch from "@/vector-db/similarity-search.ts";

const dimension = 1536;

const sampleVectors = [
  {
    id: "sample-1",
    embedding: new Array(dimension).fill(0).map(() => Math.random()),
    metadata: { type: "portrait", name: "Portrait A" },
  },
  {
    id: "sample-2",
    embedding: new Array(dimension).fill(0).map(() => Math.random()),
    metadata: { type: "portrait", name: "Portrait B" },
  },
  {
    id: "sample-3",
    embedding: new Array(dimension).fill(0).map(() => Math.random()),
    metadata: { type: "map", name: "Map A" },
  },
  {
    id: "sample-4",
    embedding: new Array(dimension).fill(0).map(() => Math.random()),
    metadata: { type: "map", name: "Map B" },
  },
];

/**
 * Runs a full test by initializing the vector DB, storing sample vectors, and
 * performing a similarity search using one of the sample vectors as the query.
 */
async function testAll(): Promise<void> {
  await initVectorDb();
  console.log("Initialized vector DB.");

  for (const vector of sampleVectors) {
    await storeVector(vector.id, vector.embedding, vector.metadata);
    console.log(`Stored vector: ${vector.id}`);
  }

  // Use the embedding of "sample-1" as the query vector
  const queryVector = sampleVectors[3].embedding;
  const results = await similaritySearch(queryVector, 3);
  console.log("Similarity search results for sample-1:");
  console.log(results);
}

if (import.meta.main) {
  await testAll();
}

