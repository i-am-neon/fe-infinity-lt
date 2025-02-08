import { MapMetadata, MapMetadataSchema } from "@/types/maps/map-metadata.ts";
import { SubGrid } from "@/types/maps/sub-grid.ts";
import chunkGridIntoQuadrants from "../lib/chunk-grid-into-quadrants.ts";
import { MAP_METADATA_EXAMPLES } from "./map-metadata-examples.ts";
import { ch5TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";
import getMapSetting from "@/map-processing/gen-map-metadata/get-map-setting.ts";
import processMapImage from "@/map-processing/gen-map-metadata/process-map-image.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

const systemMessage = `You are an advanced Fire Emblem Tactician. The map data you receive might be split into multiple “chunks” or “quadrants” for convenience, but these chunks do NOT represent true boundaries within the map. They are purely for data transmission.

Your goal is to treat the map as a continuous whole and identify distinct regions based on passable terrain that is continuously connected. Impassable terrain such as walls, cliffs, or mountains (if present) should always be respected as boundaries between regions. If two areas of passable terrain are separated by walls or other impassable obstacles, they must be considered separate regions. Conversely, if two areas of passable terrain connect (without crossing impassable tiles), they should belong to the same region—unless a door or gate is intentionally treated as a choke point to consider separately.

Specific Requirements:
1. **No Overlapping Regions**: Each passable tile belongs to exactly one region.
2. **Use Meaningful Names**: Do not label any region as “Northwest,” “Northeast,” etc. Instead, choose descriptive names that reflect the layout (e.g., “Main Hall,” “Castle Courtyard,” “Merchant Road”).
3. **Single Region per Continuous Area**: If a region spans multiple chunks, unify it into one region. Do not split a continuous passable area just because it appears in multiple chunks.
4. **Impassable Terrain as Boundaries**: Treat walls, cliffs, mountains, or similar terrain as strict boundaries. Do not merge two areas if they are separated by any impassable tiles.
5. **Heuristics**:
 - Castles are typically a 3x3 square of walls, with a 'Gate' tile at the bottom center.
 - Villages are typically a 3x3 square of walls, with a 'Village' tile at the bottom center.
 - When you see these structures, they are key areas within the region and the region should be named accordingly. For example: "Castle Courtyard," "Village Square." If a Castle or Village is detected, it must be included in the regions

For each region you identify:
- Provide a short name for the region (not referencing chunks).
- Include a list of terrain types it contains.
- Include bounding coordinates (fromX, fromY, toX, toY).
- Give a concise description of its significance (e.g., defensive value, important items, or strategic positioning).

After listing distinct regions, also provide:
- Key points of interest (chests, gates, thrones, etc.).
- Choke points (doors, narrow passages).
- Strategic considerations (how to defend, how to attack, mobility constraints, etc.).

Constraints:
- Output must follow the provided JSON schema.
- No overlapping regions are allowed.
- Do not rely on the arbitrary chunk divisions.
- Do not merge distinct passable areas if they are completely separated by walls or other impassable terrain.
- For outdoor maps, pay special attention to subtle transitions in terrain. Divide regions based on natural boundaries such as changes in vegetation, water bodies, or elevation differences. Avoid grouping the entire map into one region unless there is a clear natural division. Consider features like small forests, isolated hills, or natural chokepoints that can split a large field into tactically distinct zones.

Using the Map Visual Summary:
- You will be provided with a visual summary of the map, with a general guess for the regions to give more context.
- Use this as a starting point, but do not rely on it as the final answer. The visual summary is generated automatically and may not always be accurate. Your task is to refine the regions based on the rules and heuristics provided above.
- You may come up with new or slightly different regions than the visual summary. This is expected and encouraged, as long as your regions follow the guidelines.

${MAP_METADATA_EXAMPLES}`;

export default async function genMapMetadata({
  mapQuadrants,
  imagePath,
}: {
  mapQuadrants: SubGrid[];
  imagePath: string;
}): Promise<MapMetadata> {
  const mapSetting = getMapSetting(mapQuadrants);

  const mapVisualSummary = await processMapImage({ imagePath, mapSetting });

  const mapMetadata = await generateStructuredData({
    systemMessage,
    prompt: `Map Quadrants: ${JSON.stringify(
      mapQuadrants
    )}\nMap Visual Summary: ${JSON.stringify(mapVisualSummary)}`,
    schema: MapMetadataSchema.omit({
      givenName: true,
      originalName: true,
      description: true,
      setting: true,
    }),
  });

  const originalName = imagePath
    .split("/")
    .pop()
    ?.replace(/\.png$/, "");
  if (!originalName) {
    throw new Error(
      "Failed to extract original name from image path: " + imagePath
    );
  }

  return {
    ...mapMetadata,
    givenName: mapVisualSummary.name,
    originalName,
    description: mapVisualSummary.description,
    setting: mapSetting,
  };
}

if (import.meta.main) {
  console.time("Map Metadata Generation");
  genMapMetadata({
    mapQuadrants: chunkGridIntoQuadrants(ch5TerrainGrid),
    imagePath: getPathWithinServer("assets/test/Chpt5.png"),
  })
    .then((res) => {
      console.timeEnd("Map Metadata Generation");
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
}

