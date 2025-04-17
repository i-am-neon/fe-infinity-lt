import { ensureDirSync } from "https://deno.land/std/fs/mod.ts";
import { SceneBackgroundMetadata } from "@/types/scene-background-metadata.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

const CHECKPOINT_DIR = getPathWithinServer(
  "data/scene-background-checkpoints"
);
const CHECKPOINT_FILE = `${CHECKPOINT_DIR}/scene-background-metadata.json`;

ensureDirSync(CHECKPOINT_DIR);

interface SceneBackgroundCheckpoint {
  [key: string]: SceneBackgroundMetadata;
}

async function loadCheckpointData(): Promise<SceneBackgroundCheckpoint> {
  try {
    const text = await Deno.readTextFile(CHECKPOINT_FILE);
    return JSON.parse(text) as SceneBackgroundCheckpoint;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return {};
    }
    console.error(
      "Error loading scene background checkpoint data:",
      error
    );
    return {};
  }
}

async function saveCheckpointData(
  data: SceneBackgroundCheckpoint
): Promise<void> {
  await Deno.writeTextFile(
    CHECKPOINT_FILE,
    JSON.stringify(data, null, 2)
  );
}

export async function getSceneBackgroundMetadataFromCheckpoint(
  imagePath: string
): Promise<SceneBackgroundMetadata | null> {
  const data = await loadCheckpointData();
  const key = imagePath
    .split("/")
    .pop()
    ?.replace(/\.[^/.]+$/, "") || "";
  return data[key] || null;
}

export async function saveSceneBackgroundMetadataToCheckpoint(
  imagePath: string,
  metadata: SceneBackgroundMetadata
): Promise<void> {
  const data = await loadCheckpointData();
  const key = imagePath
    .split("/")
    .pop()
    ?.replace(/\.[^/.]+$/, "") || "";
  data[key] = metadata;
  await saveCheckpointData(data);
}