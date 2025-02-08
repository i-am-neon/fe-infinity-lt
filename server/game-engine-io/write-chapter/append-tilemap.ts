import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { Tilemap } from "../../types/maps/tilemap.ts";
import { stubTilemapPrologue } from "@/test-data/stub-tilemap.ts";

/**
 * Writes a new JSON file for the specified chapter containing just the provided tilemap
 * wrapped in a single-element array.
 */
export default async function appendTilemap({
  projectNameEndingInDotLtProj,
  chapterNumber,
  tilemap,
}: {
  projectNameEndingInDotLtProj: string;
  chapterNumber: number;
  tilemap: Tilemap;
}): Promise<void> {
  const filePath = getPathWithinLtMaker(
    `${projectNameEndingInDotLtProj}/resources/tilemaps/tilemap_data/chapter${chapterNumber}.json`
  );

  const fileContent = JSON.stringify([tilemap], null, 2);
  await Deno.writeTextFile(filePath, fileContent);
}

// Example usage
if (import.meta.main) {
  appendTilemap({
    projectNameEndingInDotLtProj: "_test.ltproj",
    chapterNumber: 0,
    tilemap: stubTilemapPrologue,
  }).then(() => {
    console.log("Created tilemap file successfully.");
  });
}

