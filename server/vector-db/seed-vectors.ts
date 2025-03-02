import storeVector from "@/vector-db/store-vector.ts";
import pool from "@/vector-db/connection.ts";
import { VectorType } from "@/vector-db/types/vector-type.ts";

export async function seedVectors(): Promise<void> {
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

  await seedVectorsFromFile("./seed-vectors/maps.json", "maps");
  await seedVectorsFromFile(
    "./seed-vectors/portraits-male.json",
    "portraits-male"
  );
  await seedVectorsFromFile(
    "./seed-vectors/portraits-female.json",
    "portraits-female"
  );
  await seedVectorsFromFile("./seed-vectors/music.json", "music");
  console.log("Seeding complete. Vectors have been stored in the database.");
}

async function seedVectorsFromFile(fileName: string, vectorType: VectorType) {
  const filePath = new URL(fileName, import.meta.url).pathname;
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
    await storeVector({
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

