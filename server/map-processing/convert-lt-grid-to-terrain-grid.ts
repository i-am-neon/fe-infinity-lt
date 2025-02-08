import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import { TerrainType } from "@/types/maps/terrain-type.ts";
import { TERRAIN_TYPE_MAP } from "@/map-processing/lookup-tables/terrain-type-map.ts";
import { ch5LTGrid } from "@/map-processing/test-data/lt-grids.ts";

export default function convertLTGrid(
  sampleData: Record<string, string>
): TerrainGrid {
  const result: TerrainGrid = {};

  for (const [coords, codeStr] of Object.entries(sampleData)) {
    const code = parseInt(codeStr, 10);
    result[coords] = (TERRAIN_TYPE_MAP[code] || "Plain") as TerrainType;
  }

  return result;
}

if (import.meta.main) {
  const res = convertLTGrid(ch5LTGrid);
  console.log("res :>> ", res);
}

