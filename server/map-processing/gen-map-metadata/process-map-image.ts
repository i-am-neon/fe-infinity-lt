import { MapSetting } from "@/types/maps/map-setting.ts";
import generateStructuredDataWithImage from "../../ai/lib/generate-structured-data-with-image.ts";
import {
  MapVisualSummary,
  MapVisualSummarySchema,
} from "@/types/maps/map-visual-summary.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

const systemMessage = `You are a master Fire Emblem cartographer examining a top-down map image.

The image will be a map from Fire Emblem: Sacred Stones on the GBA. Use this knowledge to identify what common structures are like such as armories, vendors, arenas, villages, castles, forts, and more.

From this image alone, derive a creative, concise map name, a short overall description, and identify multiple key regions.

Each region must have a concise name, a brief descriptive highlight, and a rough location (try to be specific e.g., "top left," "center right", "bottom center right", "top center left", etc.).

## Guidelines for Regions:
1. **No Overlapping Regions**: Each passable tile belongs to exactly one region.
2. **Use Meaningful Names**: Do not label any region as “Northwest,” “Northeast,” etc. Instead, choose descriptive names that reflect the layout (e.g., “Main Hall,” “Castle Courtyard,” “Merchant Road”).
3. **Single Region per Continuous Area**: If a region spans multiple chunks, unify it into one region. Do not split a continuous passable area just because it appears in multiple chunks.
4. **Impassable Terrain as Boundaries**: Treat walls, cliffs, mountains, or similar terrain as strict boundaries. Do not merge two areas if they are separated by any impassable tiles.
5. Try to be fully exhaustive when enumerating the regions. You should include regions even if they are small.
`;

export default function processMapImage({
  imagePath,
  mapSetting,
}: {
  imagePath: string;
  mapSetting: MapSetting;
}): Promise<MapVisualSummary> {
  return generateStructuredDataWithImage<MapVisualSummary>({
    systemMessage,
    prompt: `Map Setting: ${mapSetting}`,
    imagePath,
    schema: MapVisualSummarySchema,
  });
}

if (import.meta.main) {
  processMapImage({
    imagePath: getPathWithinServer("assets/test/Chpt5.png"),
    mapSetting: "outdoor",
  }).then((res) => {
    console.log(res);
  });
}

