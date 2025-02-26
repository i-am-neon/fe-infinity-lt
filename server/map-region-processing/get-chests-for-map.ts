import { join } from "https://deno.land/std/path/mod.ts";
import { openChestSprites } from "@/map-region-processing/open-chest-sprites.ts";

// Define the structure of a chest object
interface ChestObject {
  layerNid: string;
  coordinates: {
    x: number;
    y: number;
  };
}

/**
 * Gets chest regions from a specific map JSON file
 * @param filePath Path to the map JSON file (use getPathWithinServer when passing this in, this fn doesn't do that)
 * @returns Array of chest objects
 */
export async function getChestsForMap(
  filePath: string
): Promise<ChestObject[]> {
  const chests: ChestObject[] = [];

  try {
    const fileContent = await Deno.readTextFile(filePath);
    const mapData = JSON.parse(fileContent);

    // Process each layer in the map
    for (const layer of mapData.layers) {
      const layerNid = layer.nid;
      const spriteGrid = layer.sprite_grid;

      if (!spriteGrid) continue;

      // Check each coordinate in the sprite grid
      for (const [coord, sprite] of Object.entries(spriteGrid)) {
        if (!Array.isArray(sprite) || sprite.length < 2) continue;

        const [tilesetId, spriteCoords] = sprite as [string, [number, number]];
        if (!Array.isArray(spriteCoords) || spriteCoords.length < 2) continue;

        const [spriteX, spriteY] = spriteCoords;
        const [x, y] = coord.split(",").map(Number);

        // Get the last two characters of the tilesetId
        const lastTwoChars = tilesetId.slice(-2);

        // Check if this is a chest sprite
        if (
          openChestSprites[lastTwoChars] &&
          openChestSprites[lastTwoChars].x === spriteX &&
          openChestSprites[lastTwoChars].y === spriteY
        ) {
          // Add the chest object
          chests.push({
            layerNid,
            coordinates: { x, y },
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error processing map file ${filePath}:`, error);
  }

  return chests;
}

// Run the script directly
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
        const chests = await getChestsForMap(filePath);

        // Only log maps that have chests
        if (chests.length > 0) {
          console.log(`Map: ${mapFile.replace(".json", "")}`);
          console.log(JSON.stringify(chests, null, 2));
          console.log("----------------------------");
        }
      }
    } catch (error) {
      console.error("Error reading maps directory:", error);
    }
  })();
}

