import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { SubGrid } from "@/types/maps/sub-grid.ts";
import chunkGridIntoQuadrants from "../lib/chunk-grid-into-quadrants.ts";
import { ch5TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";
import getMapSetting from "@/map-processing/gen-map-metadata/get-map-setting.ts";
import processMapImage from "@/map-processing/gen-map-metadata/process-map-image.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import genMapMetadata from "./gen-map-metadata.ts";
import {
    getMapVisualSummaryFromCheckpoint,
    saveMapVisualSummaryToCheckpoint
} from "./map-visual-summary-checkpoint.ts";
import {
    getMapMetadataFromCheckpoint,
    saveMapMetadataToCheckpoint
} from "./map-metadata-checkpoint.ts";
import getTerrainGridFromMapName from "@/ai/level/unit-placement/get-terrain-grid-from-tilemap.ts";

export default async function assembleMapMetadata({
    mapQuadrants,
    imagePath,
    forceRefresh = false,
}: {
    mapQuadrants: SubGrid[];
    imagePath: string;
    forceRefresh?: boolean;
}): Promise<MapMetadata> {
    const mapSetting = getMapSetting(mapQuadrants);

    // Check if map metadata already exists in checkpoint (unless forced refresh)
    if (!forceRefresh) {
        const cachedMetadata = await getMapMetadataFromCheckpoint(imagePath, mapSetting);
        if (cachedMetadata) {
            console.log(`Using cached map metadata for: ${imagePath}`);
            return cachedMetadata;
        }
    }

    // Try to get the map visual summary from checkpoint (unless forced refresh)
    let mapVisualSummary = forceRefresh ? null : await getMapVisualSummaryFromCheckpoint(imagePath, mapSetting);

    // If not found in checkpoint or forced refresh, process the image and save to checkpoint
    if (!mapVisualSummary) {
        console.log(`${forceRefresh ? "Force refreshing" : "Not found in checkpoint"}, processing image: ${imagePath}`);
        mapVisualSummary = await processMapImage({ imagePath, mapSetting });

        // Save to checkpoint for future use
        await saveMapVisualSummaryToCheckpoint(imagePath, mapSetting, mapVisualSummary);
    } else {
        console.log(`Using cached map visual summary for: ${imagePath}`);
    }

    const generatedMetadata = await genMapMetadata({
        mapQuadrants,
        mapVisualSummary,
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

    const mapMetadata: MapMetadata = {
        ...generatedMetadata,
        givenName: mapVisualSummary.name,
        originalName,
        description: mapVisualSummary.description,
        setting: mapSetting,
    };

    // Save map metadata to checkpoint for future use
    await saveMapMetadataToCheckpoint(imagePath, mapSetting, mapMetadata);
    console.log(`Saved map metadata to checkpoint for: ${imagePath}`);

    return mapMetadata;
}

if (import.meta.main) {
    console.time("Map Metadata Generation");
    assembleMapMetadata({
        mapQuadrants: chunkGridIntoQuadrants(getTerrainGridFromMapName("(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19")),
        imagePath: getPathWithinServer("assets/test/maps/(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19.png"),
        // Uncomment to force refresh:
        // forceRefresh: true,
    })
        .then((res) => {
            console.timeEnd("Map Metadata Generation");
            console.log(res);
        })
        .catch((err) => {
            console.error(err);
        });
} 