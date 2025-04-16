import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import assembleMapMetadata from "./assemble-map-metadata.ts";
import chunkGridIntoQuadrants from "../lib/chunk-grid-into-quadrants.ts";
import { ch5TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";

// This test verifies the checkpoint system works by:
// 1. Running assembleMapMetadata for the first time (should process the image)
// 2. Running it again (should use the checkpoint)
// 3. Running it with forceRefresh=true (should process the image again)

async function runTest() {
    const testMapPath = getPathWithinServer("assets/test/Chpt5.png");
    const mapQuadrants = chunkGridIntoQuadrants(ch5TerrainGrid);

    console.log("--- First Run (should process the image) ---");
    console.time("First run");
    await assembleMapMetadata({
        mapQuadrants,
        imagePath: testMapPath,
    });
    console.timeEnd("First run");

    console.log("\n--- Second Run (should use checkpoint) ---");
    console.time("Second run");
    await assembleMapMetadata({
        mapQuadrants,
        imagePath: testMapPath,
    });
    console.timeEnd("Second run");

    console.log("\n--- Third Run with forceRefresh=true (should process the image again) ---");
    console.time("Force refresh run");
    await assembleMapMetadata({
        mapQuadrants,
        imagePath: testMapPath,
        forceRefresh: true,
    });
    console.timeEnd("Force refresh run");

    console.log("\n--- Fourth Run (should use newly cached checkpoint) ---");
    console.time("After force refresh run");
    await assembleMapMetadata({
        mapQuadrants,
        imagePath: testMapPath,
    });
    console.timeEnd("After force refresh run");
}

if (import.meta.main) {
    runTest()
        .then(() => console.log("Test completed"))
        .catch((err) => console.error("Test failed:", err));
} 