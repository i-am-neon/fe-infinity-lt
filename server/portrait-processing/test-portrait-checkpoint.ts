import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import genPortraitMetadata from "./gen-portrait-metadata.ts";

// This test verifies the portrait metadata checkpoint system works by:
// 1. Running genPortraitMetadata for a test portrait (should process the portrait)
// 2. Running it again (should use the checkpoint)
// 3. Running it with forceRefresh=true (should process the portrait again)
// 4. Running it normal again (should use the newly cached checkpoint)

async function runTest() {
    const testPortraitPath = getPathWithinServer("assets/test/portrait0.png");

    console.log("--- First Run (should process the portrait) ---");
    console.time("First run");
    await genPortraitMetadata(testPortraitPath);
    console.timeEnd("First run");

    console.log("\n--- Second Run (should use checkpoint) ---");
    console.time("Second run");
    await genPortraitMetadata(testPortraitPath);
    console.timeEnd("Second run");

    console.log("\n--- Third Run with forceRefresh=true (should process the portrait again) ---");
    console.time("Force refresh run");
    await genPortraitMetadata(testPortraitPath, true);
    console.timeEnd("Force refresh run");

    console.log("\n--- Fourth Run (should use newly cached checkpoint) ---");
    console.time("After force refresh run");
    await genPortraitMetadata(testPortraitPath);
    console.timeEnd("After force refresh run");
}

if (import.meta.main) {
    runTest()
        .then(() => console.log("Test completed"))
        .catch((err) => console.error("Test failed:", err));
} 