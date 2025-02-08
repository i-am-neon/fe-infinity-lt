import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import { TerrainType } from "@/types/maps/terrain-type.ts";
import { TERRAIN_TYPE_MAP } from "@/map-processing/lookup-tables/terrain-type-map.ts";
import { ch5LTGrid } from "@/map-processing/test-data/lt-grids.ts";

export default function convertLTGridToTerrainGrid(
  sampleData: Record<string, string>
): TerrainGrid {
  const result: TerrainGrid = {};

  for (const [coords, codeStr] of Object.entries(sampleData)) {
    if (codeStr === "Fence") {
      result[coords] = "Wall";
      continue;
    }
    if (codeStr === "Ruins") {
      result[coords] = "Ruins";
      continue;
    }
    const code = parseInt(codeStr, 10);
    if (!TERRAIN_TYPE_MAP[code]) {
      console.warn(
        `No terrain type found for code ${code}. Coords: ${coords}. codeStr: ${codeStr}`
      );
    }
    result[coords] = (TERRAIN_TYPE_MAP[code] || "Plain") as TerrainType;
  }

  return result;
}

if (import.meta.main) {
  const res = convertLTGridToTerrainGrid(ch5LTGrid);
  console.log("res :>> ", res);
}

