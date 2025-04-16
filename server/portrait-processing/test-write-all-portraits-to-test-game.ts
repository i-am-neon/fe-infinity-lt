import { allPortraitOptions } from "./all-portrait-options.ts";
import { appendPortraitsJson } from "@/game-engine-io/write-character/append-portraits-json.ts";
import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { copy } from "https://deno.land/std/fs/copy.ts";
import { ensureDir } from "https://deno.land/std/fs/ensure_dir.ts";
import * as path from "https://deno.land/std/path/mod.ts";

/**
 * Writes all portrait options to the default.ltproj
 */
async function writeAllPortraitsToTestGame() {
    const projectName = "default.ltproj";

    console.log(`Starting to write ${allPortraitOptions.length} portraits to ${projectName}...`);

    // First add all portraits to portraits.json
    for (let i = 0; i < allPortraitOptions.length; i++) {
        const portrait = allPortraitOptions[i];
        const nid = portrait.originalName;

        try {
            await appendPortraitsJson({
                projectNameEndingInDotLtProj: projectName,
                nid,
                blinkingOffset: portrait.blinkingOffset,
                smilingOffset: portrait.smilingOffset,
            });

            console.log(`Added portrait ${i + 1}/${allPortraitOptions.length}: ${nid}`);
        } catch (error) {
            console.error(`Error adding portrait ${nid}:`, error);
        }
    }

    // Then copy portrait image files
    console.log("Copying portrait image files...");
    const sourceDir = path.resolve("server/assets/portraits");
    const destDir = getPathWithinLtMaker(`${projectName}/resources/portraits`);

    try {
        // Ensure the destination directory exists
        await ensureDir(destDir);

        // Copy all files from source to destination
        await copy(sourceDir, destDir, { overwrite: true });

        console.log(`Successfully copied portrait images from ${sourceDir} to ${destDir}`);
    } catch (error) {
        console.error("Error copying portrait images:", error);
    }

    console.log("Finished writing all portraits to the test game!");
}

// Execute the function
writeAllPortraitsToTestGame().catch(error => {
    console.error("Failed to write portraits:", error);
});

if (import.meta.main) {
    // This will run if script is executed directly
    // Already calling the function above
}
