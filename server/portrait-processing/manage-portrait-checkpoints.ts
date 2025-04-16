import {
    listPortraitCheckpointEntries,
    deletePortraitMetadataFromCheckpoint
} from "./portrait-metadata-checkpoint.ts";

async function listCheckpoints() {
    const entries = await listPortraitCheckpointEntries();
    console.log("Current portrait metadata checkpoint entries:");

    if (entries.length === 0) {
        console.log("  No entries found.");
        return;
    }

    entries.forEach((entry, index) => {
        console.log(`  ${index + 1}. ${entry}`);
    });
}

async function deleteCheckpoint(portraitFileName: string) {
    const deleted = await deletePortraitMetadataFromCheckpoint(portraitFileName);

    if (deleted) {
        console.log(`Successfully deleted portrait metadata checkpoint for: ${portraitFileName}`);
    } else {
        console.log(`Portrait metadata checkpoint not found for: ${portraitFileName}`);
    }
}

async function main() {
    const args = Deno.args;
    const command = args[0]?.toLowerCase();

    if (!command || command === "list") {
        await listCheckpoints();
        return;
    }

    if (command === "delete") {
        const portraitFileName = args[1];
        if (!portraitFileName) {
            console.error("Please provide a portrait file name to delete.");
            console.log("Usage: deno run -A manage-portrait-checkpoints.ts delete <portrait-file-name>");
            return;
        }

        await deleteCheckpoint(portraitFileName);
        return;
    }

    if (command === "help") {
        console.log("Portrait Checkpoint Management Utility");
        console.log("Commands:");
        console.log("  list               - List all checkpoint entries");
        console.log("  delete <fileName>  - Delete a specific checkpoint entry");
        console.log("  help               - Show this help message");
        return;
    }

    console.error(`Unknown command: ${command}`);
    console.log("Use 'help' to see available commands.");
}

if (import.meta.main) {
    main().catch(console.error);
} 