import storeVector from "@/vector-db/store-vector.ts";

export async function seedVectors(): Promise<void> {
  const seedFilePath = new URL("./seed-vectors.json", import.meta.url).pathname;
  let vectorsData: Array<{
    id: string;
    embedding: number[];
    metadata: Record<string, unknown>;
  }> = [];
  try {
    const data = await Deno.readTextFile(seedFilePath);
    vectorsData = JSON.parse(data);
    console.log("Loaded seed vectors from file:", seedFilePath);
  } catch (e) {
    console.log("No seed vectors file found, not seeding any vectors.");
    return;
  }

  for (const vector of vectorsData) {
    console.log("Seeding vector:", vector.id);
    const vectorType = vector.metadata.type === "map" ? "maps" : "portraits";
    await storeVector({
      id: vector.id,
      embedding: vector.embedding,
      metadata: vector.metadata,
      vectorType,
    });
  }

  console.log("Seeding complete. Vectors have been stored in the database.");
}

if (import.meta.main) {
  await seedVectors();
}

