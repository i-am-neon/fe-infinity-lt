import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import assembleMapMetadata from "@/map-processing/gen-map-metadata/assemble-map-metadata.ts";
import chunkGridIntoQuadrants from "@/map-processing/lib/chunk-grid-into-quadrants.ts";
import convertLTGridToTerrainGrid from "@/map-processing/lib/convert-lt-grid-to-terrain-grid.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { Tilemap } from "@/types/maps/tilemap.ts";

export default function processMap(mapName: string): Promise<MapMetadata> {
  const imagePath = getPathWithinServer(`assets/maps/images/${mapName}.png`);
  const jsonPath = getPathWithinServer(`assets/maps/${mapName}.json`);

  // Conver the JSON file into a map quadrants of terrain for processing
  const tilemap: Tilemap = JSON.parse(Deno.readTextFileSync(jsonPath));
  const baseLayer = tilemap.layers.find((layer) => layer.nid === "base");
  if (!baseLayer) {
    throw new Error("No base layer found in tilemap: " + jsonPath);
  }
  const baseLayerLTGrid = baseLayer.terrain_grid;
  const terrainGrid = convertLTGridToTerrainGrid(baseLayerLTGrid);
  const mapQuadrants = chunkGridIntoQuadrants(terrainGrid);

  // Process map image and data
  return assembleMapMetadata({
    mapQuadrants,
    imagePath,
  });
}

if (import.meta.main) {
  const res = await processMap(
    "(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19"
  );
  console.log(res);
}

