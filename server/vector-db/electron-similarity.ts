import { VectorType } from "@/vector-db/types/vector-type.ts";
import createEmbedding from "@/vector-db/create-embedding.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

// Simple in-memory store for vectors
const vectorsStore: Record<
  VectorType,
  Array<{
    id: string;
    embedding: number[];
    metadata: Record<string, unknown>;
  }>
> = {
  maps: [],
  "portraits-male": [],
  "portraits-female": [],
  music: [],
  items: [],
};

let initialized = false;

// Calculate cosine similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

// Load vectors from seed files
async function loadVectorsFromFile(vectorType: VectorType): Promise<void> {
  const filePath = getFilePath(vectorType);

  try {
    const fileContent = await Deno.readTextFile(filePath);
    const vectors = JSON.parse(fileContent);
    vectorsStore[vectorType] = vectors;
    console.log(`Loaded ${vectors.length} vectors for ${vectorType}`);
  } catch (error) {
    console.error(`Failed to load vectors for ${vectorType}:`, error);
    vectorsStore[vectorType] = [];
  }
}

// Get the path to the seed file for a specific vector type
function getFilePath(vectorType: VectorType): string {
  let fileName;

  switch (vectorType) {
    case "maps":
      fileName = "maps.json";
      break;
    case "portraits-male":
      fileName = "portraits-male.json";
      break;
    case "portraits-female":
      fileName = "portraits-female.json";
      break;
    case "music":
      fileName = "music.json";
      break;
    case "items":
      fileName = "items.json";
      break;
    default:
      throw new Error(`Unknown vector type: ${vectorType}`);
  }

  return getPathWithinServer(`/vector-db/seed-vectors/${fileName}`);
}

// Initialize by loading all vector types
export async function initElectronVectorDb(): Promise<void> {
  if (initialized) return;

  await Promise.all([
    loadVectorsFromFile("maps"),
    loadVectorsFromFile("portraits-male"),
    loadVectorsFromFile("portraits-female"),
    loadVectorsFromFile("music"),
    loadVectorsFromFile("items"),
  ]);

  initialized = true;
  console.log("Electron vector DB initialized");
}

// Store a vector (just adds to memory in this implementation)
export async function storeElectronVector({
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
  // Check if vector with this ID already exists
  const existingIndex = vectorsStore[vectorType].findIndex((v) => v.id === id);

  if (existingIndex >= 0) {
    // Update existing vector
    vectorsStore[vectorType][existingIndex] = { id, embedding, metadata };
  } else {
    // Add new vector
    vectorsStore[vectorType].push({ id, embedding, metadata });
  }
}

// Similarity search implementation
export async function electronSimilaritySearch({
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
  // Make sure the DB is initialized
  if (!initialized) {
    await initElectronVectorDb();
  }

  // Get query embedding
  const queryEmbedding = await createEmbedding({ text: searchQuery });

  // Get vectors for this type
  const vectors = vectorsStore[vectorType];

  // Calculate similarity scores
  const results = vectors.map((vector) => {
    const similarity = cosineSimilarity(queryEmbedding, vector.embedding);
    return {
      id: vector.id,
      score: similarity,
      metadata: vector.metadata,
    };
  });

  // Sort by similarity (highest first) and take top K
  return results.sort((a, b) => b.score - a.score).slice(0, topK);
}

if (import.meta.main) {
  await initElectronVectorDb();

  // Example search
  const results = await electronSimilaritySearch({
    searchQuery: "mountains",
    topK: 3,
    vectorType: "maps",
  });

  console.log("Search results:", results);
}
