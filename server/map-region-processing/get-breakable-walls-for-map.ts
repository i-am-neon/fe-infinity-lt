import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { Tilemap } from "@/types/maps/tilemap.ts";
import { breakableWallSprites } from "@/map-region-processing/breakable-wall-sprites.ts";

export interface BreakableWall {
  layerNid: string;
  positions: { x: number; y: number }[];
}

export function getBreakableWallsForMap(filePath: string): BreakableWall[] {
  // First collect all individual wall tiles
  const individualWalls: { layerNid: string; position: { x: number; y: number } }[] = [];

  try {
    const fileContent = Deno.readTextFileSync(filePath);
    const mapData = JSON.parse(fileContent) as Tilemap;

    // Process each layer in the map (except base)
    for (const layer of mapData.layers.filter(
      (layer) => layer.nid !== "base"
    )) {
      const layerNid = layer.nid;
      
      // We need to look at the base layer to find the breakable wall sprites
      const baseLayer = mapData.layers.find((l) => l.nid === "base");
      if (!baseLayer || !baseLayer.sprite_grid) continue;

      // Check each coordinate in the base layer sprite grid
      for (const [coord, sprite] of Object.entries(baseLayer.sprite_grid)) {
        if (!Array.isArray(sprite) || sprite.length < 2) continue;

        const [tilesetId, spriteCoords] = sprite as [string, [number, number]];
        if (!Array.isArray(spriteCoords) || spriteCoords.length < 2) continue;

        const [spriteX, spriteY] = spriteCoords;
        const [x, y] = coord.split(",").map(Number);

        // Get the last two characters of the tilesetId
        const lastTwoChars = tilesetId.slice(-2);

        // Check if this is a breakable wall sprite
        const possibleWalls = breakableWallSprites[lastTwoChars];
        if (!possibleWalls) continue;

        // If any sprite matches spriteX, spriteY, we add this tile as a breakable wall
        if (possibleWalls.some((ws) => ws.x === spriteX && ws.y === spriteY)) {
          // Check if we have the corresponding layer for this coordinate
          if (layer.sprite_grid && layer.sprite_grid[`${x},${y}`]) {
            individualWalls.push({
              layerNid,
              position: { x, y },
            });
          }
        }
      }
    }

    // Group adjacent walls with the same layer
    return groupAdjacentWalls(individualWalls);
  } catch (error) {
    console.error(`Error processing map file ${filePath}:`, error);
  }

  return [];
}

// Function to group adjacent wall tiles with the same layer ID
function groupAdjacentWalls(
  walls: { layerNid: string; position: { x: number; y: number } }[]
): BreakableWall[] {
  const wallGroups: BreakableWall[] = [];
  const processedCoords = new Set<string>();

  // For each wall
  for (const wall of walls) {
    const coordKey = `${wall.position.x},${wall.position.y}`;
    
    // Skip if already processed
    if (processedCoords.has(coordKey)) continue;
    
    // Start a new group with this wall
    const layerNid = wall.layerNid;
    const group: { x: number; y: number }[] = [{ ...wall.position }];
    processedCoords.add(coordKey);
    
    // Find all connected walls using a breadth-first search
    const queue = [wall.position];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      // Check adjacent positions (non-diagonal)
      const adjacentPositions = [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 },
      ];
      
      for (const adjacent of adjacentPositions) {
        const adjCoordKey = `${adjacent.x},${adjacent.y}`;
        
        // Skip if already processed
        if (processedCoords.has(adjCoordKey)) continue;
        
        // Check if there's a wall at this position with the same layer
        const adjacentWall = walls.find(
          w =>
            w.position.x === adjacent.x &&
            w.position.y === adjacent.y &&
            w.layerNid === layerNid
        );
        
        if (adjacentWall) {
          group.push({ ...adjacent });
          queue.push(adjacent);
          processedCoords.add(adjCoordKey);
        }
      }
    }
    
    // Add this group to our result
    wallGroups.push({
      layerNid,
      positions: group,
    });
  }
  
  return wallGroups;
}

if (import.meta.main) {
  const mapsDir = join(Deno.cwd(), "server", "assets", "maps");
  const mapFile = "Nobles_Evil_Doers_5_(6C_00_A3_6E)__by_Aura_Wolf.json";
  const filePath = join(mapsDir, mapFile);
  
  const breakableWalls = getBreakableWallsForMap(filePath);
  console.log(`Map: ${mapFile.replace(".json", "")}`);
  console.log(JSON.stringify(breakableWalls, null, 2));
  console.log("----------------------------");
}