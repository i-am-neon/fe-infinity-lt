import { MapMetadata, MapMetadataSchema } from "@/types/maps/map-metadata.ts";
import { SubGrid } from "@/types/maps/sub-grid.ts";
import chunkGridIntoQuadrants from "@/map-processing/chunk-grid-into-quadrants.ts";
import { MAP_METADATA_EXAMPLES } from "@/map-processing/map-metadata-examples.ts";
import { ch5TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";

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

${MAP_METADATA_EXAMPLES}`;

export default async function genMapMetadata(
  mapQuadrants: SubGrid[]
): Promise<MapMetadata> {
  const result = await generateStructuredData({
    systemMessage,
    prompt: `Map Quadrants: ${JSON.stringify(mapQuadrants)}`,
    schema: MapMetadataSchema.omit({ setting: true }),
  });
  const setting = getSetting(mapQuadrants);
  return { ...result, setting };
}

function getSetting(
  mapQuadrants: SubGrid[]
): "indoor" | "outdoor" | "mixed indoor and outdoor" {
  const indoorTerrains = new Set<string>(["Floor", "Stairs", "Pillar"]);
  const outdoorTerrains = new Set<string>([
    "Plain",
    "Road",
    "Forest",
    "Mountain",
  ]);
  let indoorCount = 0;
  let outdoorCount = 0;
  for (const quadrant of mapQuadrants) {
    for (const terrain of Object.values(quadrant.data)) {
      if (indoorTerrains.has(terrain)) {
        indoorCount++;
      } else if (outdoorTerrains.has(terrain)) {
        outdoorCount++;
      }
    }
  }
  const total = indoorCount + outdoorCount;
  if (total === 0) {
    return "outdoor";
  }
  const ratio = indoorCount / total;
  if (ratio > 0.6) {
    return "indoor";
  } else if (ratio < 0.4) {
    return "outdoor";
  } else {
    return "mixed indoor and outdoor";
  }
}

if (import.meta.main) {
  console.time("Map Metadata Generation");
  genMapMetadata(chunkGridIntoQuadrants(ch5TerrainGrid))
    .then((res) => {
      console.timeEnd("Map Metadata Generation");
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
}

