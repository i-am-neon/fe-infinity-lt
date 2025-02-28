import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { Tilemap } from "@/types/maps/tilemap.ts";
import { doorSprites } from "@/map-region-processing/door-sprites.ts";

export interface DoorRegion {
  layerNid: string;
  tiles: {
    x: number;
    y: number;
  }[];
}

export function getDoorsForMap(filePath: string): DoorRegion[] {
  const doors: DoorRegion[] = [];

  try {
    const doorTiles: { x: number; y: number }[] = [];
    const fileContent = Deno.readTextFileSync(filePath);
    const mapData = JSON.parse(fileContent) as Tilemap;

    // 1. Get all the door tiles from the base layer

    // The closed door sprites are in the base layer, the door layer is what it turns into after the door is unlocked, like a floor.
    const baseLayer = mapData.layers.find((layer) => layer.nid === "base");
    if (!baseLayer) {
      throw new Error("Base layer not found");
    }
    const spriteGrid = baseLayer.sprite_grid;

    for (const [coord, sprite] of Object.entries(spriteGrid)) {
      if (!Array.isArray(sprite) || sprite.length < 2) continue;

      const [tilesetId, spriteCoords] = sprite as [string, [number, number]];
      if (!Array.isArray(spriteCoords) || spriteCoords.length < 2) continue;

      const [spriteX, spriteY] = spriteCoords;
      const [x, y] = coord.split(",").map(Number);

      // Get the last two characters of the tileset ID
      const lastTwoChars = tilesetId.slice(-2);

      // Check if doorSprites has an array for that key
      const possibleDoors = doorSprites[lastTwoChars];
      if (!possibleDoors) continue;
      // If any sprite matches spriteX, spriteY, we add this tile as a door
      if (possibleDoors.some((ds) => ds.x === spriteX && ds.y === spriteY)) {
        doorTiles.push({ x, y });
      }
    }
    // 2. Use the door tiles to find each's layer, then return that layer nid and tiles within that region

    doorTiles.forEach((doorTile) => {
      mapData.layers
        .filter((l) => l.nid !== "base")
        .forEach((layer) => {
          if (layer.sprite_grid[`${doorTile.x},${doorTile.y}`]) {
            // Create a set of adjacent coords (non-diagonal)
            const adjacentCoords = [
              { x: doorTile.x, y: doorTile.y }, // Center
              { x: doorTile.x + 1, y: doorTile.y }, // Right
              { x: doorTile.x - 1, y: doorTile.y }, // Left
              { x: doorTile.x, y: doorTile.y + 1 }, // Down
              { x: doorTile.x, y: doorTile.y - 1 }, // Up
            ];

            doors.push({
              layerNid: layer.nid,
              tiles: adjacentCoords,
            });
          }
        });
    });
    return doors;
  } catch (error) {
    console.error(`Error processing map file ${filePath}:`, error);
  }

  return doors;
}

if (import.meta.main) {
  const mapsDir = join(Deno.cwd(), "server", "assets", "maps");
  // (async () => {
  //   try {
  //     const mapFiles: string[] = [];
  //     for await (const entry of Deno.readDir(mapsDir)) {
  //       if (entry.isFile && entry.name.endsWith(".json")) {
  //         mapFiles.push(entry.name);
  //       }
  //     }

  //     for (const mapFile of mapFiles) {
  //       const filePath = join(mapsDir, mapFile);
  //       const foundDoors = getDoorsForMap(filePath);

  //       if (foundDoors.length > 0) {
  //         console.log(`Map: ${mapFile.replace(".json", "")}`);
  //         console.log(JSON.stringify(foundDoors, null, 2));
  //         console.log("----------------------------");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error reading maps directory:", error);
  //   }
  // })();
  // same just for Nobles_Evil_Doers_5_(6C_00_A3_6E)__by_Aura_Wolf:
  const mapFile = "Nobles_Evil_Doers_11_(3C_00_68_3E)__by_Aura_Wolf.json";
  const filePath = join(mapsDir, mapFile);
  const foundDoors = getDoorsForMap(filePath);
  console.log(`Map: ${mapFile.replace(".json", "")}`);
  console.log(JSON.stringify(foundDoors, null, 2));
  console.log("----------------------------");
}

