import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { ensureDir } from "@std/fs";
import { Vector, VectorType } from "./types/vector-type.ts";
import { clearVectors, storeVector } from "./vector-store.ts";
import { getVectorStore } from "./init.ts";
import { isElectronEnvironment } from "@/lib/env-detector.ts";

export async function seedVectors(
  seedFiles?: Record<VectorType, string>,
  clearExisting?: boolean
): Promise<void> {
  // Default clearExisting to true in production/packaged electron mode
  if (clearExisting === undefined) {
    const isPackagedApp = Deno.env.get("NODE_ENV") === "production";
    const isElectron = isElectronEnvironment();
    clearExisting = isPackagedApp && isElectron ? true : false;
    console.log(`Auto-determined clearExisting=${clearExisting} for vector seeding (isPackaged=${isPackagedApp}, isElectron=${isElectron})`);
  }

  // Default seed files paths if not provided
  const defaultSeedFiles: Record<VectorType, string> = {
    maps: getPathWithinServer("vector-db/seed-data/maps.json"),
    "portraits-male": getPathWithinServer(
      "vector-db/seed-data/portraits-male.json"
    ),
    "portraits-female": getPathWithinServer(
      "vector-db/seed-data/portraits-female.json"
    ),
    music: getPathWithinServer("vector-db/seed-data/music.json"),
    items: getPathWithinServer("vector-db/seed-data/items.json"),
    "scene-backgrounds": getPathWithinServer(
      "vector-db/seed-data/scene-backgrounds.json"
    ),
  };

  const filesToSeed = seedFiles || defaultSeedFiles;

  for (const [vectorType, filePath] of Object.entries(filesToSeed)) {
    await seedVectorsFromFile(vectorType as VectorType, filePath, clearExisting);
  }

  console.log("Vector seeding complete");
}

async function seedVectorsFromFile(
  vectorType: VectorType,
  filePath: string,
  clearExisting = false
): Promise<void> {
  console.log(`Seeding ${vectorType} vectors from ${filePath}...`);

  try {
    // Get current vector store
    const vectorStore = await getVectorStore();
    const existingVectors = vectorStore.getVectors(vectorType);

    // Clear existing vectors only if requested
    if (clearExisting) {
      await clearVectors(vectorType);
    }

    // Read seed file
    let vectors: Vector[] = [];
    try {
      const fileContent = await Deno.readTextFile(filePath);
      vectors = JSON.parse(fileContent) as Vector[];
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) {
        console.log(`No seed file found at ${filePath}, creating empty file`);
        // Extract directory path from filePath
        const lastSlashIndex = filePath.lastIndexOf("/");
        const dirPath =
          lastSlashIndex !== -1 ? filePath.substring(0, lastSlashIndex) : ".";
        await ensureDir(dirPath);
        await Deno.writeTextFile(filePath, "[]");
      } else {
        throw err;
      }
    }

    // If we have data files but no seed files, copy them
    if (vectors.length === 0) {
      const dataFilePath = getPathWithinServer(
        `vector-db/data/${vectorType}.json`
      );

      try {
        const dataContent = await Deno.readTextFile(dataFilePath);
        const dataVectors = JSON.parse(dataContent) as Vector[];
        if (dataVectors.length > 0) {
          console.log(
            `Found ${dataVectors.length} vectors in data file, copying to seed file`
          );
          vectors = dataVectors;
          await Deno.writeTextFile(filePath, JSON.stringify(vectors, null, 2));
        }
      } catch (dataErr) {
        // Ignore if data file doesn't exist either
      }
    }

    // Store each vector (skip if it already exists)
    let addedCount = 0;
    const existingIds = new Set(existingVectors.map(v => v.id));

    for (const vector of vectors) {
      if (!clearExisting && existingIds.has(vector.id)) {
        // Skip existing vector
        continue;
      }

      await storeVector({
        id: vector.id,
        embedding: vector.embedding,
        metadata: vector.metadata,
        vectorType,
      });
      addedCount++;
    }

    console.log(`Seeded ${addedCount} vectors for ${vectorType}`);
  } catch (error) {
    console.error(`Error seeding vectors for ${vectorType}:`, error);
    console.log(`Skipping ${vectorType} vectors seeding`);
  }
}

if (import.meta.main) {
  await seedVectors();
}