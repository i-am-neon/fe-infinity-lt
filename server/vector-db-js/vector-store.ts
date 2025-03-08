import { Vector, VectorType, SimilarityResult } from "@/vector-db-js/types/vector-type.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { ensureDir } from "@std/fs";
import shortUuid from "@/lib/short-uuid.ts";

// Constants
const VECTOR_DATA_DIR = getPathWithinServer("vector-db-js/data");
const VECTOR_FILE_MAP: Record<VectorType, string> = {
  "maps": `${VECTOR_DATA_DIR}/maps.json`,
  "portraits-male": `${VECTOR_DATA_DIR}/portraits-male.json`,
  "portraits-female": `${VECTOR_DATA_DIR}/portraits-female.json`,
  "music": `${VECTOR_DATA_DIR}/music.json`,
  "items": `${VECTOR_DATA_DIR}/items.json`
};

// In-memory vector storage
const vectorStore: Record<VectorType, Vector[]> = {
  "maps": [],
  "portraits-male": [],
  "portraits-female": [],
  "music": [],
  "items": []
};

// Initialize the vector store
export async function initVectorStore(): Promise<void> {
  // Ensure the data directory exists
  await ensureDir(VECTOR_DATA_DIR);
  
  // Load all vector types
  await Promise.all(
    Object.entries(VECTOR_FILE_MAP).map(async ([type, filePath]) => {
      await loadVectorsFromFile(type as VectorType);
    })
  );
  
  console.log("Vector store initialized");
}

// Load vectors from file
async function loadVectorsFromFile(vectorType: VectorType): Promise<void> {
  const filePath = VECTOR_FILE_MAP[vectorType];
  try {
    const fileContent = await Deno.readTextFile(filePath);
    vectorStore[vectorType] = JSON.parse(fileContent);
    console.log(`Loaded ${vectorStore[vectorType].length} vectors for ${vectorType}`);
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      console.error(`Error loading vectors for ${vectorType}:`, error);
    }
    // Initialize as empty array if file doesn't exist
    vectorStore[vectorType] = [];
    // Create the file
    await Deno.writeTextFile(filePath, JSON.stringify([], null, 2));
    console.log(`Created empty vector store for ${vectorType}`);
  }
}

// Save vectors to file
async function saveVectorsToFile(vectorType: VectorType): Promise<void> {
  const filePath = VECTOR_FILE_MAP[vectorType];
  try {
    await Deno.writeTextFile(
      filePath,
      JSON.stringify(vectorStore[vectorType], null, 2)
    );
  } catch (error) {
    console.error(`Error saving vectors for ${vectorType}:`, error);
  }
}

// Store a vector
export async function storeVector({
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
  const existingIndex = vectorStore[vectorType].findIndex(v => v.id === id);
  
  if (existingIndex >= 0) {
    // Update existing vector
    vectorStore[vectorType][existingIndex] = { id, embedding, metadata };
  } else {
    // Add new vector
    vectorStore[vectorType].push({ id, embedding, metadata });
  }
  
  // Save to file
  await saveVectorsToFile(vectorType);
}

// Calculate cosine similarity
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

// Perform similarity search
export async function similaritySearch({
  queryEmbedding,
  topK = 3,
  vectorType,
}: {
  queryEmbedding: number[];
  topK: number;
  vectorType: VectorType;
}): Promise<SimilarityResult[]> {
  // Get vectors for this type
  const vectors = vectorStore[vectorType];

  // Calculate similarity scores
  const results = vectors.map(vector => {
    const similarity = cosineSimilarity(queryEmbedding, vector.embedding);
    return {
      id: vector.id,
      score: similarity,
      metadata: vector.metadata
    };
  });

  // Sort by similarity (highest first) and take top K
  return results.sort((a, b) => b.score - a.score).slice(0, topK);
}

// Generate a unique ID
export function generateId(): string {
  return shortUuid();
}

// Clear all vectors for a type
export async function clearVectors(vectorType: VectorType): Promise<void> {
  vectorStore[vectorType] = [];
  await saveVectorsToFile(vectorType);
}

// Get all vectors for a type
export function getAllVectors(vectorType: VectorType): Vector[] {
  return [...vectorStore[vectorType]];
}

if (import.meta.main) {
  await initVectorStore();
  console.log("Vector store initialized");
  
  // Example: Store a vector
  const sampleVector = {
    id: generateId(),
    embedding: new Array(1536).fill(0).map(() => Math.random() * 2 - 1),
    metadata: { name: "Test vector", description: "A test vector" }
  };
  
  await storeVector({
    ...sampleVector,
    vectorType: "maps"
  });
  
  console.log("Vector stored successfully");
}