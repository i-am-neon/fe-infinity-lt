import { Tilemap } from "@/types/maps/tilemap.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import convertLTGridToTerrainGrid from "@/map-processing/lib/convert-lt-grid-to-terrain-grid.ts";
import { LTGrid } from "@/ai/types/lt-grid.ts";

export default function getTerrainGridFromMapName(
  mapName: string
): TerrainGrid {
  const tilemap: Tilemap = JSON.parse(
    Deno.readTextFileSync(getPathWithinServer(`assets/maps/${mapName}.json`))
  );
  const ltGrid: LTGrid = tilemap.layers[0].terrain_grid;
  const terrainGrid: TerrainGrid = convertLTGridToTerrainGrid(ltGrid);
  return terrainGrid;
}

if (import.meta.main) {
  console.log(getTerrainGridFromMapName("(7)Ch01_Diff_Tileset__by_Shin19"));
}

