import { join } from "https://deno.land/std/path/mod.ts";
import { Tilemap } from "@/types/maps/tilemap.ts";
import getTerrainLTNid from "@/map-processing/lookup-tables/terrain-name-to-lt-nid-map.ts";

export interface HousesAndVillages {
  position: { x: number; y: number };
  normalLayerNid: string | null;
  ruinsLayerNid: string | null;
}

export function getHousesAndVillagesForMap(
  filePath: string
): HousesAndVillages[] {
  const buildings: HousesAndVillages[] = [];

  try {
    const fileContent = Deno.readTextFileSync(filePath);
    const mapData = JSON.parse(fileContent) as Tilemap;

    // Get the base layer to find houses and villages in the terrain grid
    const baseLayer = mapData.layers.find((layer) => layer.nid === "base");
    if (!baseLayer || !baseLayer.terrain_grid) {
      return buildings;
    }

    // Find all house and village coordinates
    const allBuildingCoords: { x: number; y: number }[] = [];

    for (const [coord, terrain] of Object.entries(baseLayer.terrain_grid)) {
      if (
        terrain === getTerrainLTNid("House") ||
        terrain === getTerrainLTNid("Village")
      ) {
        const [x, y] = coord.split(",").map(Number);
        allBuildingCoords.push({ x, y });
      }
    }

    // For each building position, find the associated layers
    for (const buildingCoords of allBuildingCoords) {
      const { x, y } = buildingCoords;
      const coordKey = `${x},${y}`;

      let normalLayerNid: string | null = null;
      let ruinsLayerNid: string | null = null;

      // Find normal and ruins layers for this position
      for (const layer of mapData.layers) {
        if (layer.nid === "base") continue;

        // Check if this layer has a sprite at the position
        if (layer.sprite_grid && layer.sprite_grid[coordKey]) {
          // Check terrain type to determine if this is ruins or normal
          if (
            layer.terrain_grid &&
            layer.terrain_grid[coordKey] &&
            layer.terrain_grid[coordKey] === "Ruins"
          ) {
            ruinsLayerNid = layer.nid;
          } else {
            normalLayerNid = layer.nid;
          }
        }
      }

      buildings.push({
        position: buildingCoords,
        normalLayerNid,
        ruinsLayerNid,
      });
    }

    return buildings;
  } catch (error) {
    console.error(`Error processing map file ${filePath}:`, error);
    return buildings;
  }
}

if (import.meta.main) {
  const mapsDir = join(Deno.cwd(), "server", "assets", "maps");
  const mapFile = "Chapter7OstiasRebellion_Diff_Tileset__by_Shin19.json";
  const filePath = join(mapsDir, mapFile);

  const buildings = getHousesAndVillagesForMap(filePath);
  console.log(`Map: ${mapFile.replace(".json", "")}`);
  console.log(JSON.stringify(buildings, null, 2));
}

