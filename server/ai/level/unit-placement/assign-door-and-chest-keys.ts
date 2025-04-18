import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import {
  EnemyGenericUnit,
  EnemyGenericUnitWithStartingItems,
} from "@/ai/types/unit-placement.ts";
import { ch3TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";
import getTerrainGridFromMapName from "@/ai/level/unit-placement/get-terrain-grid-from-tilemap.ts";
import { TerrainType } from "@/types/maps/terrain-type.ts";
import { getTerrainGridSize } from "@/ai/level/unit-placement/get-terrain-grid-size.ts";

export default function assignDoorAndChestKeys(
  terrainGrid: TerrainGrid,
  enemies: EnemyGenericUnit[]
): EnemyGenericUnitWithStartingItems[] {
  const newEnemies: EnemyGenericUnitWithStartingItems[] = enemies.map((e) => ({
    ...e,
  }));

  // Get map boundaries
  const { width, height } = getTerrainGridSize(terrainGrid);
  const minX = 0;
  const minY = 0;
  const maxX = width - 1;
  const maxY = height - 1;

  // Find all door and chest cells
  const allDoorCells: Array<{ x: number; y: number }> = [];
  const chestCells: Array<{ x: number; y: number }> = [];
  const wallCells: Array<{ x: number; y: number }> = [];

  for (const key in terrainGrid) {
    const [xStr, yStr] = key.split(",");
    const x = parseInt(xStr, 10);
    const y = parseInt(yStr, 10);

    const terrain = terrainGrid[key];
    if (terrain === "Door") {
      allDoorCells.push({ x, y });
    } else if (terrain === "Chest") {
      chestCells.push({ x, y });
    } else if (terrain === "Wall") {
      wallCells.push({ x, y });
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

  function getTerrainAt(x: number, y: number): TerrainType | undefined {
    return terrainGrid[`${x},${y}`];
  }

  // Check if a point is inside the map bounds
  function isInBounds(x: number, y: number): boolean {
    return x >= minX && x <= maxX && y >= minY && y <= maxY && getTerrainAt(x, y) !== undefined;
  }

  // Function to identify rooms by flood fill
  function floodFill(
    startX: number,
    startY: number,
    blockedCells = new Set<string>(),
    maxSize = 1000
  ): { area: Set<string>, touchesMapEdge: boolean } {
    const visited = new Set<string>();
    const queue: Array<{ x: number; y: number }> = [{ x: startX, y: startY }];
    let touchesMapEdge = false;

    while (queue.length > 0 && visited.size < maxSize) {
      const { x, y } = queue.shift()!;
      const key = `${x},${y}`;

      if (visited.has(key) || blockedCells.has(key)) continue;

      // Check if this point is at the map edge
      if (x === minX || x === maxX || y === minY || y === maxY) {
        touchesMapEdge = true;
      }

      const terrain = getTerrainAt(x, y);
      if (!terrain || terrain === "Wall" || terrain === "Door") continue;

      visited.add(key);

      // Add adjacent cells
      const adjacentCells = [
        { x: x + 1, y: y },
        { x: x - 1, y: y },
        { x: x, y: y + 1 },
        { x: x, y: y - 1 },
      ];

      for (const adj of adjacentCells) {
        if (isInBounds(adj.x, adj.y)) {
          queue.push(adj);
        }
      }
    }

    return { area: visited, touchesMapEdge };
  }

  function getAdjacentPassableCells(doorGroup: Array<{ x: number; y: number }>): Array<{ x: number; y: number; side: number }> {
    const doorCellsSet = new Set(doorGroup.map(cell => `${cell.x},${cell.y}`));
    const passableCells: Array<{ x: number; y: number; side: number }> = [];

    // Check if door is horizontal (all cells have same y) or vertical (all cells have same x)
    const isHorizontal = doorGroup.length > 1 && doorGroup.every(cell => cell.y === doorGroup[0].y);
    const isVertical = doorGroup.length > 1 && doorGroup.every(cell => cell.x === doorGroup[0].x);

    for (const doorCell of doorGroup) {
      // Based on door orientation, check the appropriate sides
      let sidesToCheck: Array<{ dx: number; dy: number; side: number }>;

      if (isHorizontal) {
        // For horizontal doors, check north (side 1) and south (side 2)
        sidesToCheck = [
          { dx: 0, dy: -1, side: 1 }, // North
          { dx: 0, dy: 1, side: 2 }   // South
        ];
      } else if (isVertical) {
        // For vertical doors, check west (side 1) and east (side 2)
        sidesToCheck = [
          { dx: -1, dy: 0, side: 1 }, // West
          { dx: 1, dy: 0, side: 2 }   // East
        ];
      } else {
        // For single-cell doors, check all four directions
        sidesToCheck = [
          { dx: 0, dy: -1, side: 1 }, // North
          { dx: 0, dy: 1, side: 2 },  // South
          { dx: -1, dy: 0, side: 3 }, // West
          { dx: 1, dy: 0, side: 4 }   // East
        ];
      }

      for (const { dx, dy, side } of sidesToCheck) {
        const x = doorCell.x + dx;
        const y = doorCell.y + dy;
        const key = `${x},${y}`;

        if (!doorCellsSet.has(key) && isInBounds(x, y)) {
          const terrain = getTerrainAt(x, y);
          if (terrain && terrain !== "Wall" && terrain !== "Door") {
            passableCells.push({ x, y, side });
          }
        }
      }
    }

    return passableCells;
  }

  // For each door group, identify rooms on both sides
  for (const doorGroup of groupedDoors) {
    // Get passable cells adjacent to the door, grouped by side
    const adjacentCells = getAdjacentPassableCells(doorGroup);

    if (adjacentCells.length < 1) {
      // No passable cells found adjacent to the door, skip this door
      continue;
    }

    // Group cells by side
    const side1Cells = adjacentCells.filter(cell => cell.side % 2 === 1);
    const side2Cells = adjacentCells.filter(cell => cell.side % 2 === 0);

    // Need at least one cell on each side
    if (side1Cells.length === 0 || side2Cells.length === 0) {
      continue;
    }

    // Create blocked cells set to prevent flood fill from going through doors
    const blockedCells = new Set<string>();
    for (const doorCell of doorGroup) {
      blockedCells.add(`${doorCell.x},${doorCell.y}`);
    }

    // Do flood fill from a cell on side 1
    const side1Result = floodFill(side1Cells[0].x, side1Cells[0].y, blockedCells);

    // Do flood fill from a cell on side 2
    const side2Result = floodFill(side2Cells[0].x, side2Cells[0].y, blockedCells);

    // Determine which side is inside vs outside
    let insideArea: Set<string>;
    let outsideArea: Set<string>;
    let insideSide: number;

    if (side1Result.touchesMapEdge && !side2Result.touchesMapEdge) {
      // Side 1 touches the edge but side 2 doesn't - side 2 is inside
      insideArea = side2Result.area;
      outsideArea = side1Result.area;
      insideSide = 2;
    } else if (!side1Result.touchesMapEdge && side2Result.touchesMapEdge) {
      // Side 2 touches the edge but side 1 doesn't - side 1 is inside
      insideArea = side1Result.area;
      outsideArea = side2Result.area;
      insideSide = 1;
    } else {
      // Both areas touch the edge or neither does - use size as tiebreaker
      // The smaller area is probably inside
      if (side1Result.area.size <= side2Result.area.size) {
        insideArea = side1Result.area;
        outsideArea = side2Result.area;
        insideSide = 1;
      } else {
        insideArea = side2Result.area;
        outsideArea = side1Result.area;
        insideSide = 2;
      }
    }

    // Double check each unit to see if it's inside or outside
    const unitsInside: boolean[] = [];
    for (const enemy of enemies) {
      const unitKey = `${enemy.x},${enemy.y}`;
      unitsInside.push(insideArea.has(unitKey));
    }

    // Calculate center of door for distance checks
    const centerX = doorGroup.reduce((sum, cell) => sum + cell.x, 0) / doorGroup.length;
    const centerY = doorGroup.reduce((sum, cell) => sum + cell.y, 0) / doorGroup.length;

    // Find closest enemy that's OUTSIDE the room
    let closestEnemyIndex = -1;
    let closestDist = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < newEnemies.length; i++) {
      const e = newEnemies[i];

      // Skip units inside the room and units that already have a door key
      if (unitsInside[i] || unitHasItem(newEnemies[i], "Door_Key")) {
        continue;
      }

      const dist = getManhattanDist(centerX, centerY, e.x, e.y);
      if (dist < closestDist) {
        closestDist = dist;
        closestEnemyIndex = i;
      }
    }

    // If no suitable enemy found outside, fall back to any enemy that doesn't have a key yet
    if (closestEnemyIndex < 0) {
      for (let i = 0; i < newEnemies.length; i++) {
        if (!unitHasItem(newEnemies[i], "Door_Key")) {
          const dist = getManhattanDist(centerX, centerY, newEnemies[i].x, newEnemies[i].y);
          if (dist < closestDist) {
            closestDist = dist;
            closestEnemyIndex = i;
          }
        }
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
  // this map has door that spans multiple tiles
  const terrainGrid = getTerrainGridFromMapName('CesarianCapitalAssassin');
  const enemies: EnemyGenericUnit[] = [
    { x: 5, y: 7, class: "Archer", aiGroup: "Attack" }, // on the inside of the room, should not get a door key
    { x: 10, y: 15, class: "Archer", aiGroup: "Attack" }, // should on the outside of the room should get the door key
    { x: 20, y: 20, class: "Archer", aiGroup: "Attack" }, // should get chest key
  ];
  const res = assignDoorAndChestKeys(terrainGrid, enemies);
  console.log("enemies :>> ", res);
}

