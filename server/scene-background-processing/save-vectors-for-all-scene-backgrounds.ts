import generateAndStoreVector from "../vector-db/generate-and-store-vector.ts";
import { VectorType } from "../vector-db/types/vector-type.ts";

export default async function saveVectorsForAllSceneBackgrounds(
  options: { fileName: string; description: string }[]
): Promise<void> {
  console.log(`Processing ${options.length} scene backgrounds...`);
  for (const option of options) {
    const text = `Scene description: ${option.description}`;
    await generateAndStoreVector({
      text,
      metadata: option,
      vectorType: "scene-backgrounds" as VectorType,
    });
  }
  console.log(`Finished processing scene backgrounds`);
}

if (import.meta.main) {
  await saveVectorsForAllSceneBackgrounds([
    { fileName: "Boat", description: "A small wooden boat floating on calm water with a distant shoreline." },
  ]);
}