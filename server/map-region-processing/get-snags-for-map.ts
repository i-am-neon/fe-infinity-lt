import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { Tilemap } from "@/types/maps/tilemap.ts";
import { snagSprites } from "@/map-region-processing/snag-sprites.ts";

export interface SnagInfo {
  layerNid: string;
  position: { x: number; y: number };
}

export function getSnagForMap(filePath: string): SnagInfo[] {
  const snags: SnagInfo[] = [];

  try {
    const fileContent = Deno.readTextFileSync(filePath);
    const mapData = JSON.parse(fileContent) as Tilemap;

    // Process each layer in the map (except base)
    for (const layer of mapData.layers.filter(
      (layer) => layer.nid !== "base"
    )) {
      const layerNid = layer.nid;

      // We need to look at the base layer to find the snag sprites
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

        // Check if this is a snag sprite
        const possibleSnags = snagSprites[lastTwoChars];
        if (!possibleSnags) continue;

        // If any sprite matches spriteX, spriteY, we add this tile as a snag
        if (possibleSnags.some((ss) => ss.x === spriteX && ss.y === spriteY)) {
          // Check if we have the corresponding layer for this coordinate
          if (layer.sprite_grid && layer.sprite_grid[`${x},${y}`]) {
            snags.push({
              layerNid,
              position: { x, y },
            });
          }
        }
      }
    }

    return snags;
  } catch (error) {
    console.error(`Error processing map file ${filePath}:`, error);
  }

  return [];
}

if (import.meta.main) {
  const mapsDir = join(Deno.cwd(), "server", "assets", "maps");

  // Self-invoking async function to handle the async operations
  (async () => {
    try {
      const mapFiles: string[] = [];

      // Collect all JSON files in the maps directory
      for await (const entry of Deno.readDir(mapsDir)) {
        if (entry.isFile && entry.name.endsWith(".json")) {
          mapFiles.push(entry.name);
        }
      }

      // Process each map file
      for (const mapFile of mapFiles) {
        const filePath = join(mapsDir, mapFile);
        const snags = getSnagForMap(filePath);

        // Only log maps that have chests
        if (snags.length > 0) {
          console.log(`Map: ${mapFile.replace(".json", "")}`);
          console.log(JSON.stringify(snags, null, 2));
          console.log("----------------------------");
        }
      }
    } catch (error) {
      console.error("Error reading maps directory:", error);
    }
  })();
}

