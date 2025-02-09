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
    console.log("No seed vectors file found, using default sample vectors.");
    const dimension = 1536;
    vectorsData = [
      {
        id: "portrait-1",
        embedding: new Array(dimension).fill(0.1),
        metadata: { type: "portrait", name: "Portrait One" },
      },
      {
        id: "map-1",
        embedding: new Array(dimension).fill(0.2),
        metadata: { type: "map", name: "Map One" },
      },
    ];
  }

  for (const vector of vectorsData) {
    console.log("Seeding vector:", vector.id);
    await storeVector(vector.id, vector.embedding, vector.metadata);
  }

  console.log("Seeding complete. Vectors have been stored in the database.");
}

if (import.meta.main) {
  await seedVectors();
}
