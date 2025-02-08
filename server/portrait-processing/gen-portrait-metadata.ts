import {
  PortraitMetadata,
  PortraitMetadataSchema,
} from "@/types/portraits/portrait-metadata.ts";
import generateStructuredDataWithImage from "@/lib/generate-structured-data-with-image.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

const systemMessage = `Generate metadata for a portrait of this character.
Guidelines:
- "vibe" should be a three-word description of the character's vibe separated by commas.
- "accessories" should include any eye wear, jewelry, etc.

If the thing does not exist, simply do not include it in the return value. For example if there is no facial hair or accessories, simply don't include the "facialHair" or "accessories" field in the return value.`;

export default async function genPortraitMetadata(
  imagePath: string
): Promise<PortraitMetadata> {
  const metadata = await generateStructuredDataWithImage({
    systemMessage,
    imagePath,
    schema: PortraitMetadataSchema.omit({
      originalName: true,
      eyeMouthOffsets: true,
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

  return {
    ...metadata,
    originalName,
    eyeMouthOffsets: {
      mouthX: 0,
      mouthY: 0,
      eyeX: 0,
      eyeY: 0,
    },
  };
}

if (import.meta.main) {
  const res = await genPortraitMetadata(
    getPathWithinServer("assets/test/portrait0.png")
  );
  console.log(res);
}

