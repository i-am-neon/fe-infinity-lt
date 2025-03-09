import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { ensureDir } from "jsr:@std/fs";
import { isElectronEnvironment } from "@/lib/env-detector.ts";
import { join } from "jsr:@std/path";
import { VectorType } from "./types/vector-type.ts";
import { VectorStore } from "./vector-store.ts";

// Determine the appropriate data directory based on environment
const getDataDirectory = (): string => {
  if (isElectronEnvironment()) {
    // If USER_DATA_PATH is set by Electron, use that
    const userDataPath = Deno.env.get("USER_DATA_PATH");
    if (userDataPath) {
      return join(userDataPath, "vector-db-data");
    }
    
    // Fallback to app path
    const appPath = Deno.env.get("APP_PATH");
    if (appPath) {
      return join(appPath, "vector-db-data");
    }
    
    // Last resort, use current directory
    return "./vector-db-data";
  }
  
  // Use standard server path for non-Electron environments
  return getPathWithinServer("/vector-db/data");
};

const DATA_DIR = getDataDirectory();
const SUPPORTED_VECTOR_TYPES: VectorType[] = [
  "maps",
  "portraits-male",
  "portraits-female",
  "music",
  "items",
];

let vectorStore: VectorStore | null = null;

export async function initializeVectorDb(
  clearExisting = false
): Promise<VectorStore> {
  // Check for command line arguments
  if (Deno.args.includes("--clear")) {
    clearExisting = true;
  }

  console.log(`Initializing vector database at: ${DATA_DIR}`);
  
  // Ensure the data directory exists
  await ensureDir(DATA_DIR);

  // Initialize the vector store
  vectorStore = new VectorStore(DATA_DIR);
  await vectorStore.initialize(clearExisting);

  // Log the count of vectors for each type
  for (const vectorType of SUPPORTED_VECTOR_TYPES) {
    const vectors = vectorStore.getVectors(vectorType);
    console.log(`Loaded ${vectors.length} vectors for ${vectorType}`);
  }

  console.log("Vector database initialized");
  return vectorStore;
}

/**
 * Get the initialized vector store instance.
 * Will initialize the vector store if it hasn't been initialized yet.
 */
export async function getVectorStore(): Promise<VectorStore> {
  if (vectorStore) {
    return vectorStore;
  }

  return await initializeVectorDb();
}

if (import.meta.main) {
  const clearExisting = Deno.args.includes("--clear");
  initializeVectorDb(clearExisting);
}