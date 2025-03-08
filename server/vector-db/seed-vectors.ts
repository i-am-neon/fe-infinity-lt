import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { ensureDir } from "@std/fs";
import { Vector, VectorType } from "./types/vector-type.ts";
import { clearVectors, storeVector } from "./vector-store.ts";

export async function seedVectors(
  seedFiles?: Record<VectorType, string>
): Promise<void> {
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
  };

  const filesToSeed = seedFiles || defaultSeedFiles;

  for (const [vectorType, filePath] of Object.entries(filesToSeed)) {
    await seedVectorsFromFile(vectorType as VectorType, filePath);
  }

  console.log("Vector seeding complete");
}

async function seedVectorsFromFile(
  vectorType: VectorType,
  filePath: string
): Promise<void> {
  console.log(`Seeding ${vectorType} vectors from ${filePath}...`);

  try {
    // Clear existing vectors
    await clearVectors(vectorType);

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
        `/vector-db/data/${
          vectorType === "maps"
            ? "maps"
            : vectorType === "portraits-male"
            ? "portraits-male"
            : vectorType === "portraits-female"
            ? "portraits-female"
            : vectorType === "items"
            ? "items"
            : "music"
        }.json`
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

    // If we have data files but no seed files, copy them
    if (vectors.length === 0) {
      const dataFilePath = getPathWithinServer(
        `/vector-db/data/${
          vectorType === "maps"
            ? "maps"
            : vectorType === "portraits-male"
            ? "portraits-male"
            : vectorType === "portraits-female"
            ? "portraits-female"
            : vectorType === "items"
            ? "items"
            : "music"
        }.json`
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

    // Store each vector
    for (const vector of vectors) {
      await storeVector({
        id: vector.id,
        embedding: vector.embedding,
        metadata: vector.metadata,
        vectorType,
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

