import { ch1TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";
import { SubGrid } from "@/types/maps/sub-grid.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import orderTerrainGrid from "@/map-processing/order-terrain-grid.ts";

export default function chunkGridIntoQuadrants(
  terrainGrid: TerrainGrid
): SubGrid[] {
  const orderedTerrainGrid = orderTerrainGrid(terrainGrid);
  const coords = Object.entries(orderedTerrainGrid).map(([key, terrain]) => {
    const [x, y] = key.split(",").map(Number);
    return { x, y, terrain };
  });

  const minX = Math.min(...coords.map((c) => c.x));
  const maxX = Math.max(...coords.map((c) => c.x));
  const minY = Math.min(...coords.map((c) => c.y));
  const maxY = Math.max(...coords.map((c) => c.y));

  if (maxX < 10 || maxY < 10) {
    return [{ label: "Full Grid", data: orderedTerrainGrid }];
  }

  const totalWidth = maxX - minX + 1;
  const totalHeight = maxY - minY + 1;

  const midX = Math.floor(minX + totalWidth / 2);
  const midY = Math.floor(minY + totalHeight / 2);

  const xOverlap = Math.floor(totalWidth * 0.25);
  const yOverlap = Math.floor(totalHeight * 0.25);

  const northwest: TerrainGrid = {};
  const northeast: TerrainGrid = {};
  const southwest: TerrainGrid = {};
  const southeast: TerrainGrid = {};

  coords.forEach(({ x, y, terrain }) => {
    const inNorth = y <= midY + yOverlap;
    const inSouth = y >= midY - yOverlap;
    const inWest = x <= midX + xOverlap;
    const inEast = x >= midX - xOverlap;

    if (inNorth && inWest) {
      northwest[`${x},${y}`] = terrain;
    }
    if (inNorth && inEast) {
      northeast[`${x},${y}`] = terrain;
    }
    if (inSouth && inWest) {
      southwest[`${x},${y}`] = terrain;
    }
    if (inSouth && inEast) {
      southeast[`${x},${y}`] = terrain;
    }
  });

  return [
    { label: "Northwest Quadrant", data: northwest },
    { label: "Northeast Quadrant", data: northeast },
    { label: "Southwest Quadrant", data: southwest },
    { label: "Southeast Quadrant", data: southeast },
  ];
}

if (import.meta.main) {
  const res = chunkGridIntoQuadrants(ch1TerrainGrid);
  console.log("res :>> ", res);
}

