import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import readOrCreateJSON from "@/game-engine-io/read-or-create-json.ts";

type TilesetData = {
  nid: string;
  terrain_grid: Record<string, unknown>;
  autotiles: Record<string, unknown>;
};

export default async function appendTilesetData({
  projectNameEndingInDotLtProj,
  mapNid,
}: {
  projectNameEndingInDotLtProj: string;
  mapNid: string;
}): Promise<void> {
  const filePath = getPathWithinLtMaker(
    `${projectNameEndingInDotLtProj}/resources/tilesets/tileset.json`
  );

  const newTileset: TilesetData = {
    nid: mapNid,
    terrain_grid: {},
    autotiles: {},
  };

  const [tilesets, wasFallback] = await readOrCreateJSON<TilesetData[]>(
    filePath,
    [newTileset],
    projectNameEndingInDotLtProj
  );

  if (wasFallback) {
    return;
  }

  if (tilesets.some((t) => t.nid === mapNid)) {
    throw new Error(`Tileset data with nid ${mapNid} already exists`);
  }

  tilesets.push(newTileset);
  await Deno.writeTextFile(filePath, JSON.stringify(tilesets, null, 2));
}

if (import.meta.main) {
  await appendTilesetData({
    projectNameEndingInDotLtProj: "_test.ltproj",
    mapNid: "SomeMap",
  });
  console.log("Appended tileset data successfully.");
}
