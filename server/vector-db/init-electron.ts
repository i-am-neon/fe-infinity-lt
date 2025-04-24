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
    // In packaged mode, always clear existing vectors to ensure fresh data
    const isPackagedApp = Deno.env.get("NODE_ENV") === "production";
    const clearExisting = isPackagedApp ? true : false;

    console.log(`Running in ${isPackagedApp ? "packaged" : "development"} mode, clearExisting=${clearExisting}`);
    const vectorStore = await initializeVectorDb(clearExisting);

    // Step 2: Log existing vector counts before overwriting
    const vectorTypes: VectorType[] = ["maps", "portraits-male", "portraits-female", "music", "items", "scene-backgrounds"];

    for (const type of vectorTypes) {
      const vectors = vectorStore.getVectors(type);
      console.log(`Found ${vectors.length} existing ${type} vectors (will be overwritten)`);
    }

    // Step 3: Always seed the vector database with fresh data
    console.log("Overwriting vector data with seed data...");
    await seedVectors();

    // Step 4: Verify seeding worked
    for (const type of vectorTypes) {
      const newVectors = vectorStore.getVectors(type);
      console.log(`After seeding, found ${newVectors.length} ${type} vectors`);

      if (newVectors.length === 0) {
        console.warn(`Vector seeding did not result in any ${type} vectors. Check seed files.`);
      }
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