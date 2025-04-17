import copyFileToLtMaker from "@/file-io/copy-file-to-lt-maker.ts";
import readOrCreateJSON from "@/game-engine-io/read-or-create-json.ts";
import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";

/**
 * Copy scene background images into the project's panoramas folder and
 * update panoramas.json, appending any new backgrounds.
 */
export async function copyBackgroundsAndUpdateJson({
  projectNameEndingInDotLtProj,
  backgrounds,
}: {
  projectNameEndingInDotLtProj: string;
  backgrounds: string[];
}): Promise<void> {
  const relativePanoDir = `${projectNameEndingInDotLtProj}/resources/panoramas`;
  const panoDir = getPathWithinLtMaker(relativePanoDir);
  const panoJsonPath = `${panoDir}/panoramas.json`;

  // Load existing panoramas.json or create it if missing
  const [entries, wasFallback] = await readOrCreateJSON<[string, number][]>(
    panoJsonPath,
    [],
    panoJsonPath
  );

  for (const name of backgrounds) {
    // Skip if already present
    if (entries.some(([existing]) => existing === name)) {
      continue;
    }
    // Copy image file
    const sourcePath = `assets/scene-backgrounds/${name}.png`;
    await copyFileToLtMaker({
      filePathInServer: sourcePath,
      ltMakerSubdirectory: relativePanoDir,
      newFileName: `${name}.png`,
    });
    // Append to JSON with default count 1
    entries.push([name, 1]);
  }

  // Write updated JSON if not initial fallback creation
  if (!wasFallback) {
    await Deno.writeTextFile(panoJsonPath, JSON.stringify(entries, null, 2));
  }
}

if (import.meta.main) {
  // Example usage
  copyBackgroundsAndUpdateJson({
    projectNameEndingInDotLtProj: "testing_proj.ltproj",
    backgrounds: ["Boat", "Castle1_Dark"],
  }).catch((error) => {
    console.error("Error copying backgrounds:", error);
  });
}