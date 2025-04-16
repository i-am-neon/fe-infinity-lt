import {
  PortraitMetadata,
  PortraitMetadataSchema,
} from "@/types/portraits/portrait-metadata.ts";
import generateStructuredDataWithImage from "../ai/lib/generate-structured-data-with-image.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import autoFramePortrait from "@/portrait-processing/auto-frame-portrait.ts";
import {
  getPortraitMetadataFromCheckpoint,
  savePortraitMetadataToCheckpoint
} from "./portrait-metadata-checkpoint.ts";

const systemMessage = `Generate metadata for a portrait of this character.
Guidelines:
- "vibe" should be a three-word description of the character's vibe separated by commas.
- "accessories" should include any eye wear, jewelry, etc.

If the thing does not exist, simply do not include it in the return value. For example if there is no facial hair or accessories, simply don't include the "facialHair" or "accessories" field in the return value.`;

export default async function genPortraitMetadata(
  imagePath: string,
  forceRefresh = false,
): Promise<PortraitMetadata> {
  // Check if portrait metadata already exists in checkpoint (unless forced refresh)
  if (!forceRefresh) {
    const cachedMetadata = await getPortraitMetadataFromCheckpoint(imagePath);
    if (cachedMetadata) {
      console.log(`Using cached portrait metadata for: ${imagePath}`);
      return cachedMetadata;
    }
  }

  console.log(`${forceRefresh ? "Force refreshing" : "Not found in checkpoint"}, processing portrait: ${imagePath}`);

  const metadata = await generateStructuredDataWithImage({
    systemMessage,
    imagePath,
    schema: PortraitMetadataSchema.omit({
      originalName: true,
      smilingOffset: true,
      blinkingOffset: true,
    }),
  });

  const originalName = imagePath
    .split("/")
    .pop()
    ?.replace(/\.png$/, "");
  if (!originalName) {
    throw new Error(
      "Failed to extract original name from image path: " + imagePath
    );
  }

  const { blinkingOffset, smilingOffset } = await autoFramePortrait(imagePath);

  const portraitMetadata: PortraitMetadata = {
    ...metadata,
    originalName,
    blinkingOffset,
    smilingOffset,
  };

  // Save portrait metadata to checkpoint for future use
  await savePortraitMetadataToCheckpoint(imagePath, portraitMetadata);
  console.log(`Saved portrait metadata to checkpoint for: ${imagePath}`);

  return portraitMetadata;
}

if (import.meta.main) {
  const res = await genPortraitMetadata(
    getPathWithinServer("assets/test/portrait0.png")
  );
  console.log(res);
}

