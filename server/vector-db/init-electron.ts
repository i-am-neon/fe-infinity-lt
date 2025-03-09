import { initializeVectorDb } from "@/vector-db/init.ts";
import { seedVectors } from "@/vector-db/seed-vectors.ts";
import { isElectronEnvironment } from "@/lib/env-detector.ts";
import { join } from "jsr:@std/path";

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
    
    // Step 2: Check if we have any vectors already
    const mapsVectors = vectorStore.getVectors("maps");
    console.log(`Found ${mapsVectors.length} existing map vectors`);
    
    // Only seed if we don't have vectors
    if (mapsVectors.length === 0) {
      console.log("No existing vectors found, seeding from seed files...");
      
      // Step 3: Seed the vector database
      await seedVectors();
      
      // Step 4: Verify seeding worked
      const newMapsVectors = vectorStore.getVectors("maps");
      console.log(`After seeding, found ${newMapsVectors.length} map vectors`);
      
      if (newMapsVectors.length === 0) {
        console.warn("Vector seeding did not result in any vectors. Check seed files.");
      }
    } else {
      console.log("Vectors already exist, skipping seeding");
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