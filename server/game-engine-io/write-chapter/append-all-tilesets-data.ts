"use server";

import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import appendTilesetData from "@/game-engine-io/write-chapter/append-tileset-data.ts";

export default async function appendAllTilesetsData(
  projectNameEndingInDotLtProj: string
): Promise<void> {
  const tilesetsSourcePath = getPathWithinServer("assets/tilesets");
  for await (const entry of Deno.readDir(tilesetsSourcePath)) {
    if (!entry.isFile) continue;
    if (!entry.name.endsWith(".png")) continue;
    const nid = entry.name.substring(0, entry.name.length - 4);
    await appendTilesetData({ projectNameEndingInDotLtProj, mapNid: nid });
  }
}

if (import.meta.main) {
  await appendAllTilesetsData("_test.ltproj");
  console.log("Appended tileset data for all .png files successfully.");
}
