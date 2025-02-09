import storeVector from "@/vector-db/store-vector.ts";

/**
 * Seeds the database with precomputed vector embeddings.
 * This script inserts sample vectors into the "vectors" table so that
 * once a user clones the repository they can run similarity searches
 * on already seeded vectors.
 */
async function seedVectors(): Promise<void> {
  const dimension = 1536;

  // Sample vector for a portrait: an array of 1536 numbers (all 0.1 for demonstration)
  const portraitVector = {
    id: "portrait-1",
    embedding: new Array(dimension).fill(0.1),
    metadata: { type: "portrait", name: "Portrait One" },
  };

  // Sample vector for a map: an array of 1536 numbers (all 0.2 for demonstration)
  const mapVector = {
    id: "map-1",
    embedding: new Array(dimension).fill(0.2),
    metadata: { type: "map", name: "Map One" },
  };

  console.log("Seeding vector:", portraitVector.id);
  await storeVector(
    portraitVector.id,
    portraitVector.embedding,
    portraitVector.metadata
  );
  console.log("Seeding vector:", mapVector.id);
  await storeVector(mapVector.id, mapVector.embedding, mapVector.metadata);

  console.log("Seeding complete. Vectors have been stored in the database.");
}

if (import.meta.main) {
  await seedVectors();
}
