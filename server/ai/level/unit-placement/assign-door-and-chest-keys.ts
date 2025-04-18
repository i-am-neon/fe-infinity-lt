import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import {
  EnemyGenericUnit,
  EnemyGenericUnitWithStartingItems,
} from "@/ai/types/unit-placement.ts";
import { ch3TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";
import getTerrainGridFromMapName from "@/ai/level/unit-placement/get-terrain-grid-from-tilemap.ts";

export default function assignDoorAndChestKeys(
  terrainGrid: TerrainGrid,
  enemies: EnemyGenericUnit[]
): EnemyGenericUnitWithStartingItems[] {
  const newEnemies: EnemyGenericUnitWithStartingItems[] = enemies.map((e) => ({
    ...e,
  }));

  // Find all door and chest cells
  const allDoorCells: Array<{ x: number; y: number }> = [];
  const chestCells: Array<{ x: number; y: number }> = [];

  for (const key in terrainGrid) {
    const [xStr, yStr] = key.split(",");
    const x = parseInt(xStr, 10);
    const y = parseInt(yStr, 10);
    const terrain = terrainGrid[key];
    if (terrain === "Door") {
      allDoorCells.push({ x, y });
    } else if (terrain === "Chest") {
      chestCells.push({ x, y });
    }
  }

  // Group adjacent door cells
  const groupedDoors: Array<Array<{ x: number; y: number }>> = [];
  const visitedDoorCells = new Set<string>();

  for (const doorCell of allDoorCells) {
    const key = `${doorCell.x},${doorCell.y}`;
    if (visitedDoorCells.has(key)) continue;

    const doorGroup: Array<{ x: number; y: number }> = [];
    const queue: Array<{ x: number; y: number }> = [doorCell];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentKey = `${current.x},${current.y}`;

      if (visitedDoorCells.has(currentKey)) continue;
      visitedDoorCells.add(currentKey);
      doorGroup.push(current);

      // Check adjacent cells (up, down, left, right)
      const adjacentCells = [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 },
      ];

      for (const adj of adjacentCells) {
        const adjKey = `${adj.x},${adj.y}`;
        if (
          !visitedDoorCells.has(adjKey) &&
          allDoorCells.some(cell => cell.x === adj.x && cell.y === adj.y)
        ) {
          queue.push(adj);
        }
      }
    }

    if (doorGroup.length > 0) {
      groupedDoors.push(doorGroup);
    }
  }

  function getManhattanDist(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  function unitHasItem(
    unit: EnemyGenericUnitWithStartingItems,
    itemName: string
  ): boolean {
    if (!unit.startingItems) return false;
    return unit.startingItems.some(([name]) => name === itemName);
  }

  function ensureStartingItemsArray(unit: EnemyGenericUnitWithStartingItems) {
    if (!unit.startingItems) {
      unit.startingItems = [];
    }
  }

  // Assign one key per door group
  for (const doorGroup of groupedDoors) {
    // Use the center of the door group to find the closest enemy
    const centerX = doorGroup.reduce((sum, cell) => sum + cell.x, 0) / doorGroup.length;
    const centerY = doorGroup.reduce((sum, cell) => sum + cell.y, 0) / doorGroup.length;

    let closestEnemyIndex = -1;
    let closestDist = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < newEnemies.length; i++) {
      const e = newEnemies[i];
      const dist = getManhattanDist(centerX, centerY, e.x, e.y);
      if (dist < closestDist && !unitHasItem(e, "Door_Key")) {
        closestDist = dist;
        closestEnemyIndex = i;
      }
    }

    if (closestEnemyIndex >= 0) {
      const chosenUnit = newEnemies[closestEnemyIndex];
      ensureStartingItemsArray(chosenUnit);
      chosenUnit.startingItems!.push(["Door_Key", true]);
    }
  }

  for (const { x, y } of chestCells) {
    let closestEnemyIndex = -1;
    let closestDist = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < newEnemies.length; i++) {
      const e = newEnemies[i];
      const dist = getManhattanDist(x, y, e.x, e.y);
      if (dist < closestDist && !unitHasItem(e, "Chest_Key")) {
        closestDist = dist;
        closestEnemyIndex = i;
      }
    }
    if (closestEnemyIndex >= 0) {
      const chosenUnit = newEnemies[closestEnemyIndex];
      ensureStartingItemsArray(chosenUnit);
      chosenUnit.startingItems!.push(["Chest_Key", true]);
    }
  }

  return newEnemies;
}

if (import.meta.main) {
  // this map has chests and doors
  // const terrainGrid = ch3TerrainGrid;
  // this map has door that spans multiple tiles
  const terrainGrid = getTerrainGridFromMapName('CesarianCapitalAssassin');
  const enemies: EnemyGenericUnit[] = [
    { x: 0, y: 0, class: "Archer", aiGroup: "Attack" }, // should get chest key
    { x: 8, y: 0, class: "Archer", aiGroup: "Attack" }, // should get chest key
    { x: 16, y: 0, class: "Archer", aiGroup: "Attack" }, // should get chest key
    { x: 0, y: 14, class: "Archer", aiGroup: "Attack" }, // should get chest key or door key
    { x: 0, y: 15, class: "Archer", aiGroup: "Attack" }, // should get chest key or door key
  ];
  const res = assignDoorAndChestKeys(terrainGrid, enemies);
  console.log("enemies :>> ", res);
}

