import { adaptiveStoreVector } from "@/vector-db/adapter.ts";
import pool from "@/vector-db/connection.ts";
import { VectorType } from "@/vector-db/types/vector-type.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

// Check if running in Electron
const isElectron =
  Deno.env.get("ELECTRON_RUN_AS_NODE") === "1" ||
  Deno.env.get("DB_PATH") !== undefined;

export async function seedVectors(): Promise<void> {
  if (!isElectron) {
    // Only truncate tables if using PostgreSQL
    const client = await pool.connect();
    try {
      console.log(
        "Truncating maps_vectors, portraits_male_vectors, portraits_female_vectors, and music_vectors tables..."
      );
      await client.query(
        "TRUNCATE TABLE maps_vectors, portraits_male_vectors, portraits_female_vectors, music_vectors;"
      );
      console.log("Tables truncated. Fresh seeding will begin now.");
    } finally {
      client.release();
    }
  } else {
    console.log("Running in Electron mode, skipping table truncation");
  }

  await seedVectorsFromFile("maps");
  await seedVectorsFromFile("portraits-male");
  await seedVectorsFromFile("portraits-female");
  await seedVectorsFromFile("music");
  await seedVectorsFromFile("items");
  console.log("Seeding complete. Vectors have been stored in the database.");
}

async function seedVectorsFromFile(vectorType: VectorType) {
  const filePath = getPathWithinServer(
    `/vector-db/seed-vectors/${
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

  let vectorsData: Array<{
    id: string;
    embedding: number[];
    metadata: Record<string, unknown>;
  }> = [];

  try {
    const data = await Deno.readTextFile(filePath);
    vectorsData = JSON.parse(data);
  } catch (e) {
    console.log(`No seed vectors file found for ${vectorType}, skipping.`);
    return;
  }

  for (const vector of vectorsData) {
    await adaptiveStoreVector({
      id: vector.id,
      embedding: vector.embedding,
      metadata: vector.metadata,
      vectorType,
    });
  }

  console.log(
    `Stored ${vectorsData.length} vectors for ${vectorType} in the database.`
  );
}

if (import.meta.main) {
  await seedVectors();
}
