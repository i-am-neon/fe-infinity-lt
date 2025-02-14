import { ch3TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";

export default function getSubTerrainGrid({
  terrainGrid,
  fromX,
  fromY,
  toX,
  toY,
}: {
  terrainGrid: TerrainGrid;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}): TerrainGrid {
  const result: TerrainGrid = {};
  for (let y = fromY; y <= toY; y++) {
    for (let x = fromX; x <= toX; x++) {
      const key = `${x},${y}`;
      if (terrainGrid[key]) {
        result[key] = terrainGrid[key];
      }
    }
  }
  return result;
}

if (import.meta.main) {
  const sub = getSubTerrainGrid({
    terrainGrid: ch3TerrainGrid,
    fromX: 3,
    fromY: 2,
    toX: 6,
    toY: 5,
  });
  console.log("Sub Terrain Grid from (3,2) to (6,5):", sub);
}

