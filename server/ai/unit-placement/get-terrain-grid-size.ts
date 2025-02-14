import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import { ch1TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";

export function getTerrainGridSize(terrainGrid: TerrainGrid): {
  width: number;
  height: number;
} {
  const coords = Object.keys(terrainGrid).map((key) => {
    const [xStr, yStr] = key.split(",");
    return { x: parseInt(xStr, 10), y: parseInt(yStr, 10) };
  });

  const maxX = Math.max(...coords.map((c) => c.x));
  const maxY = Math.max(...coords.map((c) => c.y));

  return { width: maxX + 1, height: maxY + 1 };
}

if (import.meta.main) {
  console.log(getTerrainGridSize(ch1TerrainGrid));
}
