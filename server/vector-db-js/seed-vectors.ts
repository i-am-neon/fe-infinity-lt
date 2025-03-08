import { VectorType, Vector } from "@/vector-db-js/types/vector-type.ts";
import { storeVector, clearVectors } from "@/vector-db-js/vector-store.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

export async function seedVectors(seedFiles?: Record<VectorType, string>): Promise<void> {
  // Default seed files paths if not provided
  const defaultSeedFiles: Record<VectorType, string> = {
    "maps": getPathWithinServer("vector-db-js/seed-data/maps.json"),
    "portraits-male": getPathWithinServer("vector-db-js/seed-data/portraits-male.json"),
    "portraits-female": getPathWithinServer("vector-db-js/seed-data/portraits-female.json"),
    "music": getPathWithinServer("vector-db-js/seed-data/music.json"),
    "items": getPathWithinServer("vector-db-js/seed-data/items.json")
  };
  
  const filesToSeed = seedFiles || defaultSeedFiles;
  
  for (const [vectorType, filePath] of Object.entries(filesToSeed)) {
    await seedVectorsFromFile(vectorType as VectorType, filePath);
  }
  
  console.log("Vector seeding complete");
}

async function seedVectorsFromFile(vectorType: VectorType, filePath: string): Promise<void> {
  console.log(`Seeding ${vectorType} vectors from ${filePath}...`);
  
  try {
    // Clear existing vectors
    await clearVectors(vectorType);
    
    // Read seed file
    const fileContent = await Deno.readTextFile(filePath).catch(() => "[]");
    const vectors = JSON.parse(fileContent) as Vector[];
    
    // Store each vector
    for (const vector of vectors) {
      await storeVector({
        id: vector.id,
        embedding: vector.embedding,
        metadata: vector.metadata,
        vectorType
      });
    }
    
    console.log(`Seeded ${vectors.length} vectors for ${vectorType}`);
  } catch (error) {
    console.error(`Error seeding vectors for ${vectorType}:`, error);
    console.log(`Skipping ${vectorType} vectors seeding`);
  }
}

if (import.meta.main) {
  await seedVectors();
}