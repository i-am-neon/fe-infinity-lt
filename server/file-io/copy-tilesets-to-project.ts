import copyFileToLtMaker from "@/file-io/copy-file-to-lt-maker.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { join } from "node:path";

export default async function copyTilesetsToProject(
  newProjectNameEndingInDotLtProj: string
): Promise<void> {
  const tilesetsSourcePath = getPathWithinServer("assets/tilesets");
  const tilesetsDestinationDir = join(
    newProjectNameEndingInDotLtProj,
    "resources",
    "tilesets"
  );

  for await (const entry of Deno.readDir(tilesetsSourcePath)) {
    if (!entry.isFile) continue;
    const filePathInServer = join("assets", "tilesets", entry.name);
    await copyFileToLtMaker({
      filePathInServer,
      ltMakerSubdirectory: tilesetsDestinationDir,
    });
  }
}

if (import.meta.main) {
  await copyTilesetsToProject("_test.ltproj");
  console.log("Tilesets copied successfully.");
}

