import storeVector from "@/vector-db/store-vector.ts";

export async function seedVectors(): Promise<void> {
  await seedVectorsFromFile("./seed-vectors/maps.json", "maps");
  await seedVectorsFromFile("./seed-vectors/portraits.json", "portraits");
  console.log("Seeding complete. Vectors have been stored in the database.");
}

async function seedVectorsFromFile(fileName: string, vectorType: "maps" | "portraits") {
  const filePath = new URL(fileName, import.meta.url).pathname;
  let vectorsData: Array<{ id: string; embedding: number[]; metadata: Record<string, unknown> }> = [];
  try {
    const data = await Deno.readTextFile(filePath);
    vectorsData = JSON.parse(data);
    console.log(`Loaded seed vectors for ${vectorType} from file: ${filePath}`);
  } catch (e) {
    console.log(`No seed vectors file found for ${vectorType}, skipping.`);
    return;
  }

  for (const vector of vectorsData) {
    console.log(`Seeding ${vectorType} vector:`, vector);
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