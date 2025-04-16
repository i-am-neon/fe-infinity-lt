import { ensureDirSync } from "https://deno.land/std/fs/mod.ts";
import { PortraitMetadata } from "@/types/portraits/portrait-metadata.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

const CHECKPOINT_DIR = getPathWithinServer("data/portrait-checkpoints");
const CHECKPOINT_FILE = `${CHECKPOINT_DIR}/portrait-metadata.json`;

// Ensure the checkpoint directory exists
ensureDirSync(CHECKPOINT_DIR);

// Type for our checkpoint data
interface PortraitMetadataCheckpoint {
    [portraitKey: string]: PortraitMetadata;
}

// Generate a key for a portrait based on its path
function getPortraitKey(imagePath: string): string {
    const fileName = imagePath.split("/").pop() || "";
    return fileName;
}

// Load the checkpoint data
async function loadCheckpointData(): Promise<PortraitMetadataCheckpoint> {
    try {
        const text = await Deno.readTextFile(CHECKPOINT_FILE);
        return JSON.parse(text);
    } catch (error) {
        // If file doesn't exist or has invalid JSON, return empty object
        if (error instanceof Deno.errors.NotFound) {
            return {};
        }
        console.error("Error loading portrait metadata checkpoint data:", error);
        return {};
    }
}

// Save the checkpoint data
async function saveCheckpointData(data: PortraitMetadataCheckpoint): Promise<void> {
    await Deno.writeTextFile(CHECKPOINT_FILE, JSON.stringify(data, null, 2));
}

// Get portrait metadata from the checkpoint or return null if not found
export async function getPortraitMetadataFromCheckpoint(
    imagePath: string
): Promise<PortraitMetadata | null> {
    const checkpointData = await loadCheckpointData();
    const portraitKey = getPortraitKey(imagePath);
    return checkpointData[portraitKey] || null;
}

// Save portrait metadata to the checkpoint
export async function savePortraitMetadataToCheckpoint(
    imagePath: string,
    portraitMetadata: PortraitMetadata
): Promise<void> {
    const checkpointData = await loadCheckpointData();
    const portraitKey = getPortraitKey(imagePath);
    checkpointData[portraitKey] = portraitMetadata;
    await saveCheckpointData(checkpointData);
}

// Delete portrait metadata from the checkpoint to force refresh on next use
export async function deletePortraitMetadataFromCheckpoint(
    imagePath: string
): Promise<boolean> {
    const checkpointData = await loadCheckpointData();
    const portraitKey = getPortraitKey(imagePath);

    if (portraitKey in checkpointData) {
        delete checkpointData[portraitKey];
        await saveCheckpointData(checkpointData);
        return true;
    }

    return false;
}

// List all saved portrait metadata entries
export async function listPortraitCheckpointEntries(): Promise<string[]> {
    const checkpointData = await loadCheckpointData();
    return Object.keys(checkpointData);
} 