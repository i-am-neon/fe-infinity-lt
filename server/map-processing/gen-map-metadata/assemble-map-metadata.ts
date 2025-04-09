import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { SubGrid } from "@/types/maps/sub-grid.ts";
import chunkGridIntoQuadrants from "../lib/chunk-grid-into-quadrants.ts";
import { ch5TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";
import getMapSetting from "@/map-processing/gen-map-metadata/get-map-setting.ts";
import processMapImage from "@/map-processing/gen-map-metadata/process-map-image.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import genMapMetadata from "./gen-map-metadata.ts";

export default async function assembleMapMetadata({
    mapQuadrants,
    imagePath,
}: {
    mapQuadrants: SubGrid[];
    imagePath: string;
}): Promise<MapMetadata> {
    const mapSetting = getMapSetting(mapQuadrants);

    const mapVisualSummary = await processMapImage({ imagePath, mapSetting });

    const mapMetadata = await genMapMetadata({
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
    assembleMapMetadata({
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