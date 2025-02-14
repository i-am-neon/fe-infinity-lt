import storeVector from "@/vector-db/store-vector.ts";
import pool from "@/vector-db/connection.ts";

export async function seedVectors(): Promise<void> {
  const client = await pool.connect();
  try {
    console.log("Truncating maps_vectors and portraits_vectors tables...");
    await client.query("TRUNCATE TABLE maps_vectors, portraits_vectors;");
    console.log("Tables truncated. Fresh seeding will begin now.");
  } finally {
    client.release();
  }

  await seedVectorsFromFile("./seed-vectors/maps.json", "maps");
  await seedVectorsFromFile("./seed-vectors/portraits.json", "portraits");
  console.log("Seeding complete. Vectors have been stored in the database.");
}

async function seedVectorsFromFile(
  fileName: string,
  vectorType: "maps" | "portraits"
) {
  const filePath = new URL(fileName, import.meta.url).pathname;
  let vectorsData: Array<{
    id: string;
    embedding: number[];
    metadata: Record<string, unknown>;
  }> = [];
  try {
    const data = await Deno.readTextFile(filePath);
    vectorsData = JSON.parse(data);
    console.log(`Loaded seed vectors for ${vectorType} from file: ${filePath}`);
    console.log(
      `Vectors data read from file has length = ${vectorsData.length}`
    );
  } catch (e) {
    console.log(`No seed vectors file found for ${vectorType}, skipping.`);
    return;
  }

  for (const vector of vectorsData) {
    console.log(`Seeding ${vectorType} vector:`, vector.id);
    await storeVector({
      id: vector.id,
      embedding: vector.embedding,
      metadata: vector.metadata,
      vectorType,
    });
  }
}

if (import.meta.main) {
  await seedVectors();
}

