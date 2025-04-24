import { initializeVectorDb } from "@/vector-db/init.ts";
import { seedVectors } from "@/vector-db/seed-vectors.ts";
import { isElectronEnvironment } from "@/lib/env-detector.ts";
import { join } from "jsr:@std/path";
import { VectorType } from "@/vector-db/types/vector-type.ts";

/**
 * Initializes and seeds the vector database specifically for Electron environment
 */
export async function initVectorDbForElectron(): Promise<void> {
  if (!isElectronEnvironment()) {
    console.log("Not in Electron environment, skipping Electron-specific initialization");
    return;
  }

  console.log("Initializing vector database for Electron environment...");

  try {
    // Step 1: Initialize the vector database
    const vectorStore = await initializeVectorDb(false);

    // Step 2: Check if we have any vectors already for each type
    const vectorTypes: VectorType[] = ["maps", "portraits-male", "portraits-female", "music", "items", "scene-backgrounds"];
    const emptyVectorTypes: VectorType[] = [];

    for (const type of vectorTypes) {
      const vectors = vectorStore.getVectors(type);
      console.log(`Found ${vectors.length} existing ${type} vectors`);

      if (vectors.length === 0) {
        emptyVectorTypes.push(type);
      }
    }

    // Step 3: Seed the vector database if any type has zero vectors
    if (emptyVectorTypes.length > 0) {
      console.log(`Found empty vector types: ${emptyVectorTypes.join(", ")}. Seeding from seed files...`);
      await seedVectors();

      // Step 4: Verify seeding worked
      for (const type of emptyVectorTypes) {
        const newVectors = vectorStore.getVectors(type);
        console.log(`After seeding, found ${newVectors.length} ${type} vectors`);

        if (newVectors.length === 0) {
          console.warn(`Vector seeding did not result in any ${type} vectors. Check seed files.`);
        }
      }
    } else {
      console.log("All vector types have existing vectors, skipping seeding");
    }

    console.log("Vector database initialization complete");
  } catch (error) {
    console.error("Error initializing vector database for Electron:", error);
    throw error;
  }
}

// Allow running this file directly
if (import.meta.main) {
  await initVectorDbForElectron();
}