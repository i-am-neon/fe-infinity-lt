import createEmbedding from "@/vector-db/create-embedding.ts";
import { ensureDir } from "jsr:@std/fs";
import { join } from "jsr:@std/path";
import { VectorType } from "./types/vector-type.ts";
import { getVectorStore } from "./init.ts";

export type Vector = {
  id: string;
  embedding: number[];
  text: string;
  metadata: Record<string, unknown>;
};

export class VectorStore {
  private dataDir: string;
  vectors: Record<VectorType, Vector[]> = {
    maps: [],
    "portraits-male": [],
    "portraits-female": [],
    music: [],
    items: [],
    "scene-backgrounds": [],
  };

  constructor(dataDir: string) {
    this.dataDir = dataDir;
  }

  /**
   * Initializes the vector store by loading all vectors from disk.
   * @param clearExisting Whether to clear existing vectors in memory before loading (default: true)
   */
  async initialize(clearExisting = true): Promise<void> {
    // Ensure the data directory exists
    await ensureDir(this.dataDir);

    // Only clear if specified
    if (clearExisting) {
      // Reset vectors
      this.vectors = {
        maps: [],
        "portraits-male": [],
        "portraits-female": [],
        music: [],
        items: [],
        "scene-backgrounds": [],
      };
    }

    // Load all vectors from disk
    await this.loadVectors("maps");
    await this.loadVectors("portraits-male");
    await this.loadVectors("portraits-female");
    await this.loadVectors("music");
    await this.loadVectors("items");
    await this.loadVectors("scene-backgrounds");
  }

  /**
   * Loads vectors from disk for the given vector type.
   */
  private async loadVectors(vectorType: VectorType): Promise<void> {
    try {
      const filePath = join(this.dataDir, `${vectorType}.json`);
      const text = await Deno.readTextFile(filePath);
      const existingVectors = JSON.parse(text) as Vector[];

      // Only add vectors that don't already exist (based on id)
      const existingIds = new Set(this.vectors[vectorType].map((v) => v.id));
      for (const vector of existingVectors) {
        if (!existingIds.has(vector.id)) {
          this.vectors[vectorType].push(vector);
        }
      }
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        console.error(`Error loading vectors for ${vectorType}:`, error);
      }
      // If the file doesn't exist, we'll just have an empty array
    }
  }

  /**
   * Saves all vectors to disk for the given vector type.
   */
  async saveVectors(vectorType: VectorType): Promise<void> {
    const filePath = join(this.dataDir, `${vectorType}.json`);
    await Deno.writeTextFile(
      filePath,
      JSON.stringify(this.vectors[vectorType], null, 2)
    );
  }

  /**
   * Clears all vectors for the given vector type.
   */
  async clearVectors(vectorType: VectorType): Promise<void> {
    this.vectors[vectorType] = [];
    await this.saveVectors(vectorType);
  }

  /**
   * Returns all vectors for the given vector type.
   */
  getVectors(vectorType: VectorType): Vector[] {
    return this.vectors[vectorType];
  }

  /**
   * Adds a vector to the store and saves it to disk.
   */
  async addVector(
    vectorType: VectorType,
    id: string,
    embedding: number[],
    text: string,
    metadata: Record<string, unknown>
  ): Promise<void> {
    // Add the vector to memory
    this.vectors[vectorType].push({
      id,
      embedding,
      text,
      metadata,
    });

    // Save to disk
    await this.saveVectors(vectorType);
  }

  /**
   * Calculates the cosine similarity between two vectors.
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Find the most similar vectors to the given query.
   */
  async findSimilar(
    vectorType: VectorType,
    query: string,
    limit = 5
  ): Promise<Array<{ vector: Vector; similarity: number }>> {
    // Generate an embedding for the query
    const embedding = await createEmbedding({ text: query });

    // Calculate similarity for each vector
    const similarities = this.vectors[vectorType].map((vector) => ({
      vector,
      similarity: this.cosineSimilarity(embedding, vector.embedding),
    }));

    // Sort by similarity (descending)
    similarities.sort((a, b) => b.similarity - a.similarity);

    // Return the top results
    return similarities.slice(0, limit);
  }
}

/**
 * Generates a unique ID for a vector.
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Clears all vectors for the given vector type.
 */
export async function clearVectors(vectorType: VectorType): Promise<void> {
  const vectorStore = await getVectorStore();
  await vectorStore.clearVectors(vectorType);
}

/**
 * Stores a vector in the vector store.
 */
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
  const vectorStore = await getVectorStore();
  await vectorStore.addVector(vectorType, id, embedding, "", metadata);
}