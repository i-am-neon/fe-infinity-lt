import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import getAllSceneBackgroundFileNames from "./get-all-scene-background-paths.ts";
import genSceneBackgroundMetadata from "./gen-scene-background-metadata.ts";
import saveVectorsForAllSceneBackgrounds from "./save-vectors-for-all-scene-backgrounds.ts";
import writeAllSceneBackgroundOptions from "./write-all-scene-background-options.ts";

export default async function processAllSceneBackgrounds(
  forceRefresh = false
): Promise<void> {
  const fileNames = getAllSceneBackgroundFileNames();
  console.log(
    `Starting to process ${fileNames.length} scene backgrounds`
  );
  const results = await Promise.all(
    fileNames.map((name) =>
      genSceneBackgroundMetadata(
        getPathWithinServer(`assets/scene-backgrounds/${name}`),
        forceRefresh
      )
    )
  );
  console.log(
    `✅🤖 Completed metadata for ${results.length} scene backgrounds`
  );
  await saveVectorsForAllSceneBackgrounds(results);
  console.log(
    `✅💾 Completed saving vectors for ${results.length} scene backgrounds`
  );
  writeAllSceneBackgroundOptions(results);
  console.log(
    `✅📝 Completed writing scene background options for ${results.length} scene backgrounds to "server/scene-background-processing/all-scene-background-options.ts"`
  );
}

if (import.meta.main) {
  const forceRefresh = Deno.args.includes("--force-refresh");
  processAllSceneBackgrounds(forceRefresh);
}