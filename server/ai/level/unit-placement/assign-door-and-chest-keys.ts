import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import {
  EnemyGenericUnit,
  EnemyGenericUnitWithStartingItems,
} from "@/ai/types/unit-placement.ts";
import { ch3TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";

export default function assignDoorAndChestKeys(
  terrainGrid: TerrainGrid,
  enemies: EnemyGenericUnit[]
): EnemyGenericUnitWithStartingItems[] {
  const newEnemies: EnemyGenericUnitWithStartingItems[] = enemies.map((e) => ({
    ...e,
  }));

  const doorCells: Array<{ x: number; y: number }> = [];
  const chestCells: Array<{ x: number; y: number }> = [];

  for (const key in terrainGrid) {
    const [xStr, yStr] = key.split(",");
    const x = parseInt(xStr, 10);
    const y = parseInt(yStr, 10);
    const terrain = terrainGrid[key];
    if (terrain === "Door") {
      doorCells.push({ x, y });
    } else if (terrain === "Chest") {
      chestCells.push({ x, y });
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

  for (const { x, y } of doorCells) {
    let closestEnemyIndex = -1;
    let closestDist = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < newEnemies.length; i++) {
      const e = newEnemies[i];
      const dist = getManhattanDist(x, y, e.x, e.y);
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
  const terrainGrid = ch3TerrainGrid;
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

