import { SceneBackgroundMetadata, SceneBackgroundMetadataSchema } from "@/types/scene-background-metadata.ts";
import generateStructuredDataWithImage from "../ai/lib/generate-structured-data-with-image.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import {
  getSceneBackgroundMetadataFromCheckpoint,
  saveSceneBackgroundMetadataToCheckpoint,
} from "./scene-background-metadata-checkpoint.ts";

const systemMessage = `Generate a one sentence description of this scene.`;

export default async function genSceneBackgroundMetadata(
  imagePath: string,
  forceRefresh = false
): Promise<{ fileName: string } & SceneBackgroundMetadata> {
  if (!forceRefresh) {
    const cached = await getSceneBackgroundMetadataFromCheckpoint(imagePath);
    if (cached) {
      console.log(`Using cached description for: ${imagePath}`);
      const fileName = imagePath
        .split("/")
        .pop()
        ?.replace(/\.[^/.]+$/, "")!;
      return { fileName, ...cached };
    }
  }

  console.log(
    `${forceRefresh ? "Force refreshing" : "Not found in checkpoint"}, processing: ${imagePath}`
  );

  const metadata = await generateStructuredDataWithImage({
    systemMessage,
    imagePath,
    schema: SceneBackgroundMetadataSchema,
  });

  const fileName = imagePath
    .split("/")
    .pop()
    ?.replace(/\.[^/.]+$/, "")!;

  await saveSceneBackgroundMetadataToCheckpoint(imagePath, metadata);
  console.log(`Saved description to checkpoint for: ${imagePath}`);

  return { fileName, ...metadata };
}

if (import.meta.main) {
  const imagePath = getPathWithinServer(
    "assets/scene-backgrounds/Boat.png"
  );
  const res = await genSceneBackgroundMetadata(imagePath);
  console.log(res);
}