import { join } from "https://deno.land/std/path/mod.ts";
import { Tilemap } from "@/types/maps/tilemap.ts";
import getTerrainLTNid from "@/map-processing/lookup-tables/terrain-name-to-lt-nid-map.ts";

export interface ShopPosition {
  position: { x: number; y: number };
  type: "Armory" | "Vendor";
}

export function getArmoriesAndVendorsForMap(filePath: string): ShopPosition[] {
  const shops: ShopPosition[] = [];

  try {
    const fileContent = Deno.readTextFileSync(filePath);
    const mapData = JSON.parse(fileContent) as Tilemap;

    // Get the base layer to find armories and vendors in the terrain grid
    const baseLayer = mapData.layers.find((layer) => layer.nid === "base");
    if (!baseLayer || !baseLayer.terrain_grid) {
      return shops;
    }

    // Find all armory and vendor coordinates
    for (const [coord, terrain] of Object.entries(baseLayer.terrain_grid)) {
      if (
        terrain === getTerrainLTNid("Armory") ||
        terrain === getTerrainLTNid("Vendor")
      ) {
        const [x, y] = coord.split(",").map(Number);
        const type =
          terrain === getTerrainLTNid("Armory") ? "Armory" : "Vendor";

        shops.push({
          position: { x, y },
          type,
        });
      }
    }

    return shops;
  } catch (error) {
    console.error(`Error processing map file ${filePath}:`, error);
    return shops;
  }
}

if (import.meta.main) {
  const mapsDir = join(Deno.cwd(), "server", "assets", "maps");
  const mapFile =
    "Knights_Villagers_Bandits_3_(0E_00_72_10)__by_Aura_Wolf.json";
  const filePath = join(mapsDir, mapFile);

  const shops = getArmoriesAndVendorsForMap(filePath);
  console.log(`Map: ${mapFile.replace(".json", "")}`);
  console.log(JSON.stringify(shops, null, 2));
}

