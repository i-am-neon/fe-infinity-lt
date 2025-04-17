import similaritySearch from "@/vector-db/similarity-search.ts";
import { SceneBackgroundMetadataWithFileName } from "@/types/scene-background-metadata.ts";
import { allSceneBackgroundOptions } from "@/scene-background-processing/all-scene-background-options.ts";

/**
 * Choose the most similar scene background based on a text description.
 * @param description - A string describing the desired scene.
 * @returns The matching SceneBackgroundMetadataWithFileName.
 */
export default async function chooseBackground(
  description: string
): Promise<SceneBackgroundMetadataWithFileName> {
  // Perform similarity search against the scene-backgrounds vector store
  const results = await similaritySearch<{ fileName: string }>({
    vectorType: "scene-backgrounds",
    query: description,
    limit: 1,
  });

  if (results.length === 0) {
    throw new Error(`No matching scene backgrounds found for: ${description}`);
  }

  const { fileName } = results[0].metadata;
  const option = allSceneBackgroundOptions.find(
    (opt) => opt.fileName === fileName
  );
  if (!option) {
    throw new Error(`Scene background option not found for filename: ${fileName}`);
  }

  return option;
}

// Example usage
if (import.meta.main) {
  const testDescription =
    "A wooden ship afloat on calm waters with a distant horizon";
  chooseBackground(testDescription)
    .then((res) => console.log("Chosen background:", res))
    .catch(console.error);
}

