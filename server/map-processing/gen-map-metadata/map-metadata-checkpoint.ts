import { ensureDirSync } from "https://deno.land/std/fs/mod.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

const CHECKPOINT_DIR = getPathWithinServer("data/map-checkpoints");
const CHECKPOINT_FILE = `${CHECKPOINT_DIR}/map-metadata.json`;

// Ensure the checkpoint directory exists
ensureDirSync(CHECKPOINT_DIR);

// Type for our checkpoint data
interface MapMetadataCheckpoint {
    [mapKey: string]: MapMetadata;
}

// Generate a key for a map based on its path and setting
function getMapKey(imagePath: string, mapSetting: string): string {
    const fileName = imagePath.split("/").pop() || "";
    return `${fileName}__${mapSetting}`;
}

// Load the checkpoint data
async function loadCheckpointData(): Promise<MapMetadataCheckpoint> {
    try {
        const text = await Deno.readTextFile(CHECKPOINT_FILE);
        return JSON.parse(text);
    } catch (error) {
        // If file doesn't exist or has invalid JSON, return empty object
        if (error instanceof Deno.errors.NotFound) {
            return {};
        }
        console.error("Error loading map metadata checkpoint data:", error);
        return {};
    }
}

// Save the checkpoint data
async function saveCheckpointData(data: MapMetadataCheckpoint): Promise<void> {
    await Deno.writeTextFile(CHECKPOINT_FILE, JSON.stringify(data, null, 2));
}

// Get map metadata from the checkpoint or return null if not found
export async function getMapMetadataFromCheckpoint(
    imagePath: string,
    mapSetting: string
): Promise<MapMetadata | null> {
    const checkpointData = await loadCheckpointData();
    const mapKey = getMapKey(imagePath, mapSetting);
    return checkpointData[mapKey] || null;
}

// Save map metadata to the checkpoint
export async function saveMapMetadataToCheckpoint(
    imagePath: string,
    mapSetting: string,
    mapMetadata: MapMetadata
): Promise<void> {
    const checkpointData = await loadCheckpointData();
    const mapKey = getMapKey(imagePath, mapSetting);
    checkpointData[mapKey] = mapMetadata;
    await saveCheckpointData(checkpointData);
}

// Delete map metadata from the checkpoint to force refresh on next use
export async function deleteMapMetadataFromCheckpoint(
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

// List all saved map metadata entries
export async function listMapMetadataCheckpointEntries(): Promise<string[]> {
    const checkpointData = await loadCheckpointData();
    return Object.keys(checkpointData);
} 