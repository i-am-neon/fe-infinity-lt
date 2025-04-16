import { ensureDirSync } from "https://deno.land/std/fs/mod.ts";
import { MapVisualSummary } from "@/types/maps/map-visual-summary.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

const CHECKPOINT_DIR = getPathWithinServer("data/map-checkpoints");
const CHECKPOINT_FILE = `${CHECKPOINT_DIR}/map-visual-summaries.json`;

// Ensure the checkpoint directory exists
ensureDirSync(CHECKPOINT_DIR);

// Type for our checkpoint data
interface MapVisualSummaryCheckpoint {
    [mapKey: string]: MapVisualSummary;
}

// Generate a key for a map based on its path and setting
function getMapKey(imagePath: string, mapSetting: string): string {
    const fileName = imagePath.split("/").pop() || "";
    return `${fileName}__${mapSetting}`;
}

// Load the checkpoint data
async function loadCheckpointData(): Promise<MapVisualSummaryCheckpoint> {
    try {
        const text = await Deno.readTextFile(CHECKPOINT_FILE);
        return JSON.parse(text);
    } catch (error) {
        // If file doesn't exist or has invalid JSON, return empty object
        if (error instanceof Deno.errors.NotFound) {
            return {};
        }
        console.error("Error loading checkpoint data:", error);
        return {};
    }
}

// Save the checkpoint data
async function saveCheckpointData(data: MapVisualSummaryCheckpoint): Promise<void> {
    await Deno.writeTextFile(CHECKPOINT_FILE, JSON.stringify(data, null, 2));
}

// Get a map visual summary from the checkpoint or return null if not found
export async function getMapVisualSummaryFromCheckpoint(
    imagePath: string,
    mapSetting: string
): Promise<MapVisualSummary | null> {
    const checkpointData = await loadCheckpointData();
    const mapKey = getMapKey(imagePath, mapSetting);
    return checkpointData[mapKey] || null;
}

// Save a map visual summary to the checkpoint
export async function saveMapVisualSummaryToCheckpoint(
    imagePath: string,
    mapSetting: string,
    mapVisualSummary: MapVisualSummary
): Promise<void> {
    const checkpointData = await loadCheckpointData();
    const mapKey = getMapKey(imagePath, mapSetting);
    checkpointData[mapKey] = mapVisualSummary;
    await saveCheckpointData(checkpointData);
}

// Delete a map entry from the checkpoint to force refresh on next use
export async function deleteMapVisualSummaryFromCheckpoint(
    imagePath: string,
    mapSetting: string
): Promise<boolean> {
    const checkpointData = await loadCheckpointData();
    const mapKey = getMapKey(imagePath, mapSetting);

    if (mapKey in checkpointData) {
        delete checkpointData[mapKey];
        await saveCheckpointData(checkpointData);
        return true;
    }

    return false;
}

// List all saved map visual summaries
export async function listCheckpointEntries(): Promise<string[]> {
    const checkpointData = await loadCheckpointData();
    return Object.keys(checkpointData);
} 