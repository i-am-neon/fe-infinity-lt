import {
    listCheckpointEntries,
    deleteMapVisualSummaryFromCheckpoint
} from "./map-visual-summary-checkpoint.ts";
import {
    listMapMetadataCheckpointEntries,
    deleteMapMetadataFromCheckpoint
} from "./map-metadata-checkpoint.ts";

enum CheckpointType {
    VisualSummary = "visual-summary",
    MapMetadata = "map-metadata"
}

async function listCheckpoints(type: CheckpointType = CheckpointType.VisualSummary) {
    let entries: string[];

    if (type === CheckpointType.VisualSummary) {
        entries = await listCheckpointEntries();
        console.log("Current visual summary checkpoint entries:");
    } else {
        entries = await listMapMetadataCheckpointEntries();
        console.log("Current map metadata checkpoint entries:");
    }

    if (entries.length === 0) {
        console.log("  No entries found.");
        return;
    }

    entries.forEach((entry, index) => {
        console.log(`  ${index + 1}. ${entry}`);
    });
}

async function deleteCheckpoint(mapKey: string, type: CheckpointType = CheckpointType.VisualSummary) {
    // Parse the key format fileName__mapSetting
    const parts = mapKey.split("__");
    if (parts.length !== 2) {
        console.error("Invalid map key format. Expected format: fileName__mapSetting");
        return;
    }

    const [fileName, mapSetting] = parts;
    let deleted: boolean;

    if (type === CheckpointType.VisualSummary) {
        deleted = await deleteMapVisualSummaryFromCheckpoint(fileName, mapSetting);
        if (deleted) {
            console.log(`Successfully deleted visual summary checkpoint for: ${mapKey}`);
        } else {
            console.log(`Visual summary checkpoint not found for: ${mapKey}`);
        }
    } else {
        deleted = await deleteMapMetadataFromCheckpoint(fileName, mapSetting);
        if (deleted) {
            console.log(`Successfully deleted map metadata checkpoint for: ${mapKey}`);
        } else {
            console.log(`Map metadata checkpoint not found for: ${mapKey}`);
        }
    }
}

async function main() {
    const args = Deno.args;
    const command = args[0]?.toLowerCase();

    if (!command || command === "list") {
        const type = args[1]?.toLowerCase() === "metadata"
            ? CheckpointType.MapMetadata
            : CheckpointType.VisualSummary;

        await listCheckpoints(type);
        return;
    }

    if (command === "delete") {
        const mapKey = args[1];
        if (!mapKey) {
            console.error("Please provide a map key to delete.");
            console.log("Usage: deno run -A manage-checkpoints.ts delete <mapKey> [checkpoint-type]");
            return;
        }

        const type = args[2]?.toLowerCase() === "metadata"
            ? CheckpointType.MapMetadata
            : CheckpointType.VisualSummary;

        await deleteCheckpoint(mapKey, type);
        return;
    }

    if (command === "help") {
        console.log("Checkpoint Management Utility");
        console.log("Commands:");
        console.log("  list [checkpoint-type]       - List all checkpoint entries");
        console.log("  delete <mapKey> [checkpoint-type] - Delete a specific checkpoint entry");
        console.log("  help                         - Show this help message");
        console.log("");
        console.log("Checkpoint Types:");
        console.log("  visual-summary (default)     - Manage visual summary checkpoints");
        console.log("  metadata                     - Manage map metadata checkpoints");
        return;
    }

    console.error(`Unknown command: ${command}`);
    console.log("Use 'help' to see available commands.");
}

if (import.meta.main) {
    main().catch(console.error);
} 