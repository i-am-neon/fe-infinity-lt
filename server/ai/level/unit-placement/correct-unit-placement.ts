import { EnemyGenericUnit } from "@/ai/types/unit-placement.ts";
import { ch4TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";
import { FE8Class } from "@/types/fe8-class.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import { getAllClassOptions } from "./get-all-class-options.ts";
import { getTerrainGridSize } from "./get-terrain-grid-size.ts";

const movementGroupByClass: Partial<Record<FE8Class, string>> = {};
(() => {
  const allClassOptions = getAllClassOptions();
  allClassOptions.forEach((opt) => {
    const c = opt.name as FE8Class;
    movementGroupByClass[c] = opt.movementGroup;
  });
})();

function isTileValidForMovementGroup(
  terrain: string,
  movementGroup: string
): boolean {
  const baseTerrains = [
    "Plain",
    "Forest",
    "Bridge",
    "Stairs",
    "Floor",
    "Road",
    "Pillar",
    "Barrel",
    "House",
    "Fort",
    "Gate",
    "Armory",
    "Vendor",
    "Village",
    "Throne",
  ];
  if (!baseTerrains.includes(terrain)) {
    if (
      movementGroup === "Fliers" &&
      ["Thicket", "Lake", "Sea", "River", "Mountain", "Cliff"].includes(terrain)
    ) {
      return true;
    }
    if (
      movementGroup === "Pirates" &&
      ["Sea", "Lake", "River"].includes(terrain)
    ) {
      return true;
    }
    if (
      movementGroup === "Bandits" &&
      ["Mountain", "Cliff"].includes(terrain)
    ) {
      return true;
    }
    return false;
  }

  // Prevent Heavy Cav units from being placed on Hill tiles
  if (movementGroup === "Heavy Cav" && terrain === "Hill") {
    return false;
  }

  return true;
}

function clampCoord(
  x: number,
  y: number,
  width: number,
  height: number
): { x: number; y: number } {
  const clampedX = Math.max(0, Math.min(x, width - 1));
  const clampedY = Math.max(0, Math.min(y, height - 1));
  return { x: clampedX, y: clampedY };
}

function findNearestValidTile(
  terrainGrid: TerrainGrid,
  startX: number,
  startY: number,
  movementGroup: string
): { x: number; y: number } | null {
  const { width, height } = getTerrainGridSize(terrainGrid);
  const start = clampCoord(startX, startY, width, height);

  const startKey = `${start.x},${start.y}`;
  if (
    terrainGrid[startKey] &&
    isTileValidForMovementGroup(terrainGrid[startKey], movementGroup)
  ) {
    return start;
  }

  const queue: Array<{ x: number; y: number }> = [start];
  const visited = new Set<string>([startKey]);

  let idx = 0;
  while (idx < queue.length) {
    const { x, y } = queue[idx++];
    const key = `${x},${y}`;
    const terrain = terrainGrid[key];
    if (terrain && isTileValidForMovementGroup(terrain, movementGroup)) {
      return { x, y };
    }
    for (const [dx, dy] of [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < width && ny < height) {
        const nKey = `${nx},${ny}`;
        if (!visited.has(nKey)) {
          visited.add(nKey);
          queue.push({ x: nx, y: ny });
        }
      }
    }
  }

  // No valid tile was found
  return null;
}

export default function correctUnitPlacement<
  T extends { x: number; y: number; class?: FE8Class }
>({
  terrainGrid,
  units,
  existingPositions = [],
}: {
  terrainGrid: TerrainGrid;
  units: T[];
  existingPositions?: Array<{ x: number; y: number }>;
}): T[] {
  // Keep track of all occupied positions
  const occupiedPositions = new Set(
    existingPositions.map((pos) => `${pos.x},${pos.y}`)
  );

  return units.reduce((processedUnits, unit) => {
    const mg = movementGroupByClass[unit.class ?? "Brigand"] || "Regular";
    const key = `${unit.x},${unit.y}`;
    const terrain = terrainGrid[key];

    let newUnit = unit;
    let newX = unit.x;
    let newY = unit.y;

    // Check if position is valid for terrain
    if (!terrain || !isTileValidForMovementGroup(terrain, mg)) {
      const nearest = findNearestValidTile(terrainGrid, unit.x, unit.y, mg);
      // If no valid position found, skip this unit entirely
      if (nearest === null) {
        return processedUnits;
      }
      newX = nearest.x;
      newY = nearest.y;
      newUnit = { ...unit, x: newX, y: newY } as T;
    }

    // Check if position is already occupied
    const posKey = `${newX},${newY}`;
    if (occupiedPositions.has(posKey)) {
      // Find nearest valid unoccupied tile
      const nearest = findNearestValidUnoccupiedTile(
        terrainGrid,
        newX,
        newY,
        mg,
        occupiedPositions
      );

      // If no valid position found, skip this unit entirely
      if (nearest === null) {
        return processedUnits;
      }

      newUnit = { ...unit, x: nearest.x, y: nearest.y } as T;
    }

    // Add processed unit position to occupied positions
    occupiedPositions.add(`${newUnit.x},${newUnit.y}`);

    return [...processedUnits, newUnit];
  }, [] as T[]);
}

function findNearestValidUnoccupiedTile(
  terrainGrid: TerrainGrid,
  startX: number,
  startY: number,
  movementGroup: string,
  occupiedPositions: Set<string>
): { x: number; y: number } | null {
  const { width, height } = getTerrainGridSize(terrainGrid);
  const start = clampCoord(startX, startY, width, height);

  const startKey = `${start.x},${start.y}`;
  if (
    terrainGrid[startKey] &&
    isTileValidForMovementGroup(terrainGrid[startKey], movementGroup) &&
    !occupiedPositions.has(startKey)
  ) {
    return start;
  }

  const queue: Array<{ x: number; y: number }> = [start];
  const visited = new Set<string>([startKey]);

  let idx = 0;
  while (idx < queue.length) {
    const { x, y } = queue[idx++];
    const key = `${x},${y}`;
    const terrain = terrainGrid[key];
    if (
      terrain &&
      isTileValidForMovementGroup(terrain, movementGroup) &&
      !occupiedPositions.has(key)
    ) {
      return { x, y };
    }
    for (const [dx, dy] of [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < width && ny < height) {
        const nKey = `${nx},${ny}`;
        if (!visited.has(nKey)) {
          visited.add(nKey);
          queue.push({ x: nx, y: ny });
        }
      }
    }
  }

  // No valid unoccupied tile was found
  return null;
}

if (import.meta.main) {
  const sampleUnits: EnemyGenericUnit[] = [
    { x: 100, y: 100, class: "Brigand", aiGroup: "None" }, // out of bounds
    { x: 7, y: 0, class: "Pegasus Knight", aiGroup: "None" }, // wall
    { x: 10, y: 0, class: "Cavalier", aiGroup: "None" }, // cliff
    { x: 8, y: 7, class: "Archer", aiGroup: "None" }, // river
    { x: 0, y: 7, class: "Cavalier", aiGroup: "None" }, // hill
    { x: 0, y: 0, class: "Berserker", aiGroup: "None" }, // forest, no change needed
  ];
  // Test with overlap
  const existingPositions = [{ x: 0, y: 0 }]; // Position overlaps with the Berserker
  const corrected = correctUnitPlacement({
    terrainGrid: ch4TerrainGrid,
    units: sampleUnits,
    existingPositions,
  });
  console.log("Corrected placements:", corrected);
}

