import { VectorType } from "@/vector-db/types/vector-type.ts";
import {
  initElectronVectorDb,
  storeElectronVector,
  electronSimilaritySearch,
} from "@/vector-db/electron-similarity.ts";
import initVectorDb from "@/vector-db/init.ts";
import storeVector from "@/vector-db/store-vector.ts";
import { pgSimilaritySearch } from "@/vector-db/similarity-search.ts";
import {
  isElectronEnvironment,
  isPostgresAvailable,
} from "@/lib/env-detector.ts";

// Determine if we should use in-memory implementation
let useInMemory = isElectronEnvironment();

/**
 * Initialize the appropriate vector database based on the environment
 */
export async function initializeVectorDb(): Promise<void> {
  // Check if PostgreSQL is available (overrides initial detection)
  const pgAvailable = await isPostgresAvailable();
  useInMemory = !pgAvailable || useInMemory;

  if (useInMemory) {
    console.log("Initializing Electron vector DB (in-memory)");
    await initElectronVectorDb();
  } else {
    console.log("Initializing PostgreSQL vector DB");
    try {
      await initVectorDb();
    } catch (error) {
      console.warn(
        "Failed to initialize PostgreSQL vector DB, falling back to in-memory:",
        error
      );
      useInMemory = true;
      await initElectronVectorDb();
    }
  }
}

/**
 * Store a vector in the appropriate database
 */
export async function adaptiveStoreVector({
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
  if (useInMemory) {
    await storeElectronVector({ id, embedding, metadata, vectorType });
  } else {
    try {
      await storeVector({ id, embedding, metadata, vectorType });
    } catch (error) {
      console.warn(
        "Failed to store vector in PostgreSQL, falling back to in-memory:",
        error
      );
      // Fall back to in-memory storage on failure
      useInMemory = true;
      await storeElectronVector({ id, embedding, metadata, vectorType });
    }
  }
}

/**
 * Perform a similarity search using the appropriate implementation
 */
export async function adaptiveSimilaritySearch({
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
  if (useInMemory) {
    return await electronSimilaritySearch({ searchQuery, topK, vectorType });
  } else {
    try {
      return await pgSimilaritySearch({ searchQuery, topK, vectorType });
    } catch (error) {
      console.warn(
        "Failed to search with PostgreSQL, falling back to in-memory:",
        error
      );
      // Fall back to in-memory search on failure
      useInMemory = true;
      return await electronSimilaritySearch({ searchQuery, topK, vectorType });
    }
  }
}

if (import.meta.main) {
  await initializeVectorDb();
  console.log(
    `Vector DB adapter initialized (isElectron=${isElectronEnvironment()}, useInMemory=${useInMemory})`
  );
}

