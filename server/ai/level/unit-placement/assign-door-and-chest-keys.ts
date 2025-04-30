import getTerrainGridFromMapName from "@/ai/level/unit-placement/get-terrain-grid-from-tilemap.ts";
import { getTerrainGridSize } from "@/ai/level/unit-placement/get-terrain-grid-size.ts";
import {
  EnemyGenericUnit,
  EnemyGenericUnitWithStartingItems,
} from "@/ai/types/unit-placement.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import { getChestsForMap } from "@/map-region-processing/get-chests-for-map.ts";
import { getDoorsForMap } from "@/map-region-processing/get-doors-for-map.ts";
import { TerrainType } from "@/types/maps/terrain-type.ts";
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";


function unitHasItem(
  unit: EnemyGenericUnitWithStartingItems,
  itemName: string
): boolean {
  if (!unit.startingItems) return false;
  return unit.startingItems.some(([name]) => name === itemName);
}

export default function assignDoorAndChestKeys(
  { enemies, originalMapName }: { enemies: EnemyGenericUnit[]; originalMapName: string; }): EnemyGenericUnitWithStartingItems[] {
  const logger = getCurrentLogger();
  const newEnemies: EnemyGenericUnitWithStartingItems[] = enemies.map((e) => ({
    ...e,
  }));
  if (!originalMapName) {
    throw new Error("originalMapName is required");
  }

  const terrainGrid = getTerrainGridFromMapName(originalMapName);

  // Get map boundaries
  const { width, height } = getTerrainGridSize(terrainGrid);
  const minX = 0;
  const minY = 0;
  const maxX = width - 1;
  const maxY = height - 1;

  // Find all door and chest cells
  const allDoorCells: Array<{ x: number; y: number }> = [];
  let chestCells: Array<{ x: number; y: number }> = [];
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
  let groupedDoors: Array<Array<{ x: number; y: number }>> = [];

  // Get door regions from getDoorsForMap
  try {
    const mapsDir = join(Deno.cwd(), "server", "assets", "maps");
    const filePath = join(mapsDir, `${originalMapName}.json`);

    // Check if the file exists before trying to access it
    try {
      const fileInfo = Deno.statSync(filePath);
    } catch (fileError) {
      logger.warn(`Map file does not exist: ${filePath}`, { error: String(fileError) });
      // If file doesn't exist, fall back to basic grouping
      groupedDoors = groupDoorCells(allDoorCells);
      // Don't attempt to read the non-existent file
      throw new Error(`Map file not found: ${filePath}`);
    }

    const doorRegions = getDoorsForMap(filePath);
    logger.info(`Found ${doorRegions.length} door regions in map file`);

    // Transform door regions to our format
    const layerNids = new Set<string>();

    // First collect unique layer NIDs (some doors may appear multiple times)
    doorRegions.forEach(region => {
      layerNids.add(region.layerNid);
    });

    // Process each unique door layer
    layerNids.forEach(nid => {
      const tilesForLayer: Array<{ x: number; y: number }> = [];

      // Collect all tiles from regions with this layer NID
      doorRegions
        .filter(region => region.layerNid === nid)
        .forEach(region => {
          region.tiles.forEach(tile => {
            // Avoid duplicates
            if (!tilesForLayer.some(t => t.x === tile.x && t.y === tile.y)) {
              tilesForLayer.push(tile);
            }
          });
        });

      if (tilesForLayer.length > 0) {
        groupedDoors.push(tilesForLayer);
      }
    });

    // Also try to get chest data using getChestsForMap
    try {
      const chestRegions = getChestsForMap(filePath);
      if (chestRegions.length > 0) {
        // Replace terrain-based chest cells with the more accurate data from getChestsForMap
        chestCells = chestRegions.map(chest => chest.coordinates);
      }
    } catch (chestError) {
      logger.error(`Error getting chest regions for map ${originalMapName}:`, { error: String(chestError) });
      // Keep using terrain-based chest cells as fallback
    }
  } catch (error) {
    logger.error(`Error getting door regions for map ${originalMapName}:`, { error: String(error) });
    // Fall back to original method
    // logger.info(`Falling back to grouping door cells by adjacency for ${allDoorCells.length} cells`);
    groupedDoors = groupDoorCells(allDoorCells);
  }

  // If both methods failed, create individual door groups as final fallback
  if (groupedDoors.length === 0 && allDoorCells.length > 0) {
    logger.warn(`No door groups were created for map ${originalMapName}. Using fallback of one group per door cell.`);
    groupedDoors = allDoorCells.map(cell => [cell]);
  }

  function groupDoorCells(doorCells: Array<{ x: number; y: number }>): Array<Array<{ x: number; y: number }>> {
    const grouped: Array<Array<{ x: number; y: number }>> = [];
    const visitedDoorCells = new Set<string>();

    for (const doorCell of doorCells) {
      const key = `${doorCell.x},${doorCell.y}`;
      if (visitedDoorCells.has(key)) {
        continue;
      }

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
          { x: current.x + 1, y: current.y, dir: "right" },
          { x: current.x - 1, y: current.y, dir: "left" },
          { x: current.x, y: current.y + 1, dir: "down" },
          { x: current.x, y: current.y - 1, dir: "up" },
        ];

        for (const adj of adjacentCells) {
          const adjKey = `${adj.x},${adj.y}`;
          const isAdjacent = doorCells.some(cell => cell.x === adj.x && cell.y === adj.y);

          if (!visitedDoorCells.has(adjKey) && isAdjacent) {
            queue.push({ x: adj.x, y: adj.y });
          }
        }
      }

      if (doorGroup.length > 0) {
        grouped.push(doorGroup);
      }
    }

    // Even if there's only one door cell per group, make sure we create groups
    if (grouped.length === 0 && doorCells.length > 0) {
      return doorCells.map(cell => [cell]);
    }

    return grouped;
  }

  function getManhattanDist(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
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
      // Fallback: Just assign key to closest enemy regardless of side
      const centerX = doorGroup.reduce((sum, cell) => sum + cell.x, 0) / doorGroup.length;
      const centerY = doorGroup.reduce((sum, cell) => sum + cell.y, 0) / doorGroup.length;

      let closestEnemyIndex = -1;
      let closestDist = Number.MAX_SAFE_INTEGER;

      for (let i = 0; i < newEnemies.length; i++) {
        const e = newEnemies[i];
        if (!unitHasItem(e, "Door_Key")) {
          const dist = getManhattanDist(centerX, centerY, e.x, e.y);
          if (dist < closestDist) {
            closestDist = dist;
            closestEnemyIndex = i;
          }
        }
      }

      if (closestEnemyIndex >= 0) {
        const chosenUnit = newEnemies[closestEnemyIndex];
        ensureStartingItemsArray(chosenUnit);
        chosenUnit.startingItems!.push(["Door_Key", true]);
      }

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

    // Stronger fallback: If still no suitable enemy, just pick any enemy
    if (closestEnemyIndex < 0 && newEnemies.length > 0) {
      for (let i = 0; i < newEnemies.length; i++) {
        const dist = getManhattanDist(centerX, centerY, newEnemies[i].x, newEnemies[i].y);
        if (dist < closestDist) {
          closestDist = dist;
          closestEnemyIndex = i;
        }
      }
    }

    if (closestEnemyIndex >= 0) {
      const chosenUnit = newEnemies[closestEnemyIndex];
      ensureStartingItemsArray(chosenUnit);
      chosenUnit.startingItems!.push(["Door_Key", true]);
    }
  }

  // Assign chest keys to nearest enemies
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

  logger.info("Assigned door and chest keys to enemies", {
    originalMapName,
    enemiesWithKeys: newEnemies.filter((e) => unitHasItem(e, "Door_Key") || unitHasItem(e, "Chest_Key")),
    // allDoorCells,
    // chestCells,
    // enemies,
    // terrainGrid,
    // doorGroupsCount: groupedDoors.length,
    // doorsWithAssignedKeys: groupedDoors.map(doorGroup => {
    //   const centerX = doorGroup.reduce((sum, cell) => sum + cell.x, 0) / doorGroup.length;
    //   const centerY = doorGroup.reduce((sum, cell) => sum + cell.y, 0) / doorGroup.length;
    //   const hasAssignedKey = newEnemies.some(e =>
    //     unitHasItem(e, "Door_Key") &&
    //     getManhattanDist(centerX, centerY, e.x, e.y) < 20
    //   );
    //   return {
    //     doorCells: doorGroup,
    //     hasAssignedKey,
    //   };
    // }),
  });

  return newEnemies;
}

if (import.meta.main) {
  // this map has door that spans multiple tiles
  // const enemies: EnemyGenericUnit[] = [
  //   { x: 5, y: 7, class: "Archer", aiGroup: "Attack" }, // on the inside of the room, should not get a door key
  //   { x: 10, y: 15, class: "Archer", aiGroup: "Attack" }, // should on the outside of the room should get the door key
  //   { x: 20, y: 20, class: "Archer", aiGroup: "Attack" }, // should get chest key
  // ];
  // const res = assignDoorAndChestKeys(terrainGrid, enemies);
  // console.log("enemies :>> ", res);

  // Has three doors
  const enemies: EnemyGenericUnit[] = [
    {
      "x": 3,
      "y": 13,
      "aiGroup": "Defend",
      "class": "Soldier"
    },
    {
      "x": 5,
      "y": 14,
      "aiGroup": "Attack",
      "class": "Archer"
    },
    {
      "x": 4,
      "y": 8,
      "aiGroup": "Defend",
      "class": "Mercenary"
    },
    {
      "x": 7,
      "y": 10,
      "aiGroup": "Guard",
      "class": "Fighter"
    },
    {
      "x": 7,
      "y": 6,
      "aiGroup": "Defend",
      "class": "Archer"
    },
    {
      "x": 11,
      "y": 3,
      "aiGroup": "Guard",
      "class": "Revenant"
    },
    {
      "x": 12,
      "y": 3,
      "aiGroup": "Guard",
      "class": "Sword Bonewalker"
    },
    {
      "x": 11,
      "y": 1,
      "aiGroup": "Attack",
      "class": "Bow Bonewalker"
    },
    {
      "x": 7,
      "y": 2,
      "aiGroup": "Defend",
      "class": "Cavalier"
    },
    {
      "x": 9,
      "y": 3,
      "aiGroup": "Defend",
      "class": "Myrmidon"
    }
  ];
  const res = assignDoorAndChestKeys({ enemies, originalMapName: 'Alusq_FE8_0A009B0C_in_the_dark__by_FEU' });
  console.log("enemies with keys :>> ", res.filter((e) => unitHasItem(e, "Door_Key") || unitHasItem(e, "Chest_Key")));
  // // Has three doors
  // const terrainGrid = getTerrainGridFromMapName('Underground');
  // const enemies: EnemyGenericUnit[] = [
  //   {
  //     "x": 1,
  //     "y": 4,
  //     "aiGroup": "Guard",
  //     "class": "Soldier"
  //   },
  //   {
  //     "x": 3,
  //     "y": 7,
  //     "aiGroup": "Defend",
  //     "class": "Archer",
  //   },
  //   {
  //     "x": 5,
  //     "y": 9,
  //     "aiGroup": "Defend",
  //     "class": "Soldier"
  //   },
  //   {
  //     "x": 2,
  //     "y": 7,
  //     "aiGroup": "Thief",
  //     "class": "Thief"
  //   },
  //   {
  //     "x": 2,
  //     "y": 8,
  //     "aiGroup": "Guard",
  //     "class": "Soldier"
  //   },
  //   {
  //     "x": 3,
  //     "y": 5,
  //     "aiGroup": "Guard",
  //     "class": "Knight"
  //   },
  //   {
  //     "x": 4,
  //     "y": 0,
  //     "aiGroup": "Defend",
  //     "class": "Archer"
  //   },
  //   {
  //     "x": 9,
  //     "y": 1,
  //     "aiGroup": "Guard",
  //     "class": "Soldier"
  //   },
  //   {
  //     "x": 10,
  //     "y": 1,
  //     "aiGroup": "Guard",
  //     "class": "Soldier"
  //   },
  //   {
  //     "x": 5,
  //     "y": 11,
  //     "aiGroup": "Defend",
  //     "class": "Archer"
  //   }
  // ];
  // const res = assignDoorAndChestKeys({ terrainGrid, enemies, originalMapName: 'Underground' });
  // console.log("enemies :>> ", res);
}



