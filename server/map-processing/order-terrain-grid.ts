import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import { TerrainType } from "@/types/maps/terrain-type.ts";
import { ch3TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";

export default function orderTerrainGrid(
  terrainGrid: TerrainGrid
): TerrainGrid {
  const coords = Object.keys(terrainGrid).map((key) => {
    const [xStr, yStr] = key.split(",");
    const x = parseInt(xStr, 10);
    const y = parseInt(yStr, 10);
    return { x, y };
  });

  const maxX = Math.max(...coords.map((c) => c.x));
  const maxY = Math.max(...coords.map((c) => c.y));

  const orderedGrid: TerrainGrid = {};
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      const coordKey = `${x},${y}`;
      orderedGrid[coordKey] = terrainGrid[coordKey] || ("Plain" as TerrainType);
    }
  }

  return orderedGrid;
}

if (import.meta.main) {
  const ordered = orderTerrainGrid(ch3TerrainGrid);
  console.log("ordered :>> ", ordered);
}
