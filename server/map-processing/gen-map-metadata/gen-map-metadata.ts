import { MapMetadataSchema } from "@/types/maps/map-metadata.ts";
import { SubGrid } from "@/types/maps/sub-grid.ts";
import generateStructuredData from "../../ai/lib/generate-structured-data.ts";
import { MAP_METADATA_EXAMPLES } from "./map-metadata-examples.ts";
import { MapVisualSummary } from "@/types/maps/map-visual-summary.ts";
import chunkGridIntoQuadrants from "@/map-processing/lib/chunk-grid-into-quadrants.ts";
import getTerrainGridFromMapName from "@/ai/level/unit-placement/get-terrain-grid-from-tilemap.ts";

const systemMessage = `You are an advanced Fire Emblem Tactician. The map data you receive might be split into multiple "chunks" or "quadrants" for convenience, but these chunks do NOT represent true boundaries within the map. They are purely for data transmission.

Your goal is to treat the map as a continuous whole and identify distinct regions based on passable terrain that is continuously connected. Impassable terrain such as walls, cliffs, or mountains (if present) should always be respected as boundaries between regions. If two areas of passable terrain are separated by walls or other impassable obstacles, they must be considered separate regions. Conversely, if two areas of passable terrain connect (without crossing impassable tiles), they should belong to the same region—unless a door or gate is intentionally treated as a choke point to consider separately.

Specific Requirements:
1. **No Overlapping Regions**: Each passable tile belongs to exactly one region.
2. **Use Meaningful Names**: Do not label any region as "Northwest," "Northeast," etc. Instead, choose descriptive names that reflect the layout (e.g., "Main Hall," "Castle Courtyard," "Merchant Road").
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
    mapVisualSummary,
}: {
    mapQuadrants: SubGrid[];
    mapVisualSummary: MapVisualSummary;
}) {
    return generateStructuredData({
        fnName: "genMapMetadata",
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
        model: "strong",
    });
}

if (import.meta.main) {

    const testMap1Quadrants = chunkGridIntoQuadrants(getTerrainGridFromMapName("(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19"));
    const testMap2Quadrants = chunkGridIntoQuadrants(getTerrainGridFromMapName("Knights_Villagers_Bandits_1_(01_00_02_03)__by_Aura_Wolf"));
    const testMap3Quadrants = chunkGridIntoQuadrants(getTerrainGridFromMapName("Knights_Villagers_Bandits_8_(18_00_19_1A)__by_Aura_Wolf"));

    const testMap1VisualSummary = {
        name: "Crossroads of Commerce",
        description: "A bustling outdoor map featuring a network of roads connecting key locations such as villages, a castle, and a vendor. The map is characterized by its strategic pathways and surrounding natural terrain.",
        regions: [
            {
                name: "Western Village",
                description: "A quaint village located near a body of water, providing a peaceful retreat.",
                location: "top left"
            },
            {
                name: "Central Crossroads",
                description: "The main intersection of roads, serving as a hub for movement across the map.",
                location: "center"
            },
            {
                name: "Eastern Castle",
                description: "A fortified castle, offering strategic advantage and protection.",
                location: "top right"
            },
            {
                name: "Southern Vendor",
                description: "A small vendor area, ideal for purchasing supplies and equipment.",
                location: "bottom center right"
            },
            {
                name: "Northern Pathway",
                description: "A narrow path leading north, surrounded by trees and natural terrain.",
                location: "top center"
            }
        ]
    }

    genMapMetadata({
        mapQuadrants: testMap1Quadrants,
        mapVisualSummary: testMap1VisualSummary,
    })
        .then((res) => {
            console.log("Test Map Metadata:", res);
        })
        .catch((err) => {
            console.error("Error generating Test Map metadata:", err);
        });
}