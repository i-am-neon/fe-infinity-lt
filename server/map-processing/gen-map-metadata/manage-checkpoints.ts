import {
    listCheckpointEntries,
    deleteMapVisualSummaryFromCheckpoint
} from "./map-visual-summary-checkpoint.ts";

async function listCheckpoints() {
    const entries = await listCheckpointEntries();
    console.log("Current checkpoint entries:");

    if (entries.length === 0) {
        console.log("  No entries found.");
        return;
    }

    entries.forEach((entry, index) => {
        console.log(`  ${index + 1}. ${entry}`);
    });
}

async function deleteCheckpoint(mapKey: string) {
    // Parse the key format fileName__mapSetting
    const parts = mapKey.split("__");
    if (parts.length !== 2) {
        console.error("Invalid map key format. Expected format: fileName__mapSetting");
        return;
    }

    const [fileName, mapSetting] = parts;
    const deleted = await deleteMapVisualSummaryFromCheckpoint(fileName, mapSetting);

    if (deleted) {
        console.log(`Successfully deleted checkpoint for: ${mapKey}`);
    } else {
        console.log(`Checkpoint not found for: ${mapKey}`);
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
        const mapKey = args[1];
        if (!mapKey) {
            console.error("Please provide a map key to delete.");
            console.log("Usage: deno run -A manage-checkpoints.ts delete <mapKey>");
            return;
        }

        await deleteCheckpoint(mapKey);
        return;
    }

    if (command === "help") {
        console.log("Checkpoint Management Utility");
        console.log("Commands:");
        console.log("  list              - List all checkpoint entries");
        console.log("  delete <mapKey>   - Delete a specific checkpoint entry");
        console.log("  help              - Show this help message");
        return;
    }

    console.error(`Unknown command: ${command}`);
    console.log("Use 'help' to see available commands.");
}

if (import.meta.main) {
    main().catch(console.error);
} 