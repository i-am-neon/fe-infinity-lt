import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { PortraitMetadata } from "@/types/portraits/portrait-metadata.ts";

export default function writeAllPortraitOptions(
  portraitMetadatas: PortraitMetadata[]
): void {
  const outputPath = getPathWithinServer(
    "portrait-processing/all-portrait-options.ts"
  );
  const outputContent = `import { PortraitMetadata } from "@/types/portraits/portrait-metadata.ts";

  export const allPortraitOptions: PortraitMetadata[] = ${JSON.stringify(
    portraitMetadatas,
    null,
    2
  )};`;

  Deno.writeTextFileSync(outputPath, outputContent);
}

if (import.meta.main) {
  writeAllPortraitOptions([
    {
      gender: "male",
      age: "mature adult",
      hairColor: "silver",
      eyeColor: "red",
      vibe: "mysterious, regal, wise",
      clothing: "ornate robe",
      accessories: "earrings",
      originalName: "2",
      eyeMouthOffsets: { mouthX: 0, mouthY: 0, eyeX: 0, eyeY: 0 },
    },
    {
      gender: "female",
      age: "young adult",
      hairColor: "purple",
      eyeColor: "purple",
      vibe: "confident, bold, adventurous",
      clothing: "red and gold outfit",
      accessories: "earrings, headband",
      originalName: "3",
      eyeMouthOffsets: { mouthX: 0, mouthY: 0, eyeX: 0, eyeY: 0 },
    },
    {
      gender: "male",
      age: "young adult",
      hairColor: "red",
      eyeColor: "yellow",
      vibe: "mysterious, confident, regal",
      clothing: "fur-lined cloak",
      originalName: "1",
      eyeMouthOffsets: { mouthX: 0, mouthY: 0, eyeX: 0, eyeY: 0 },
    },
    {
      gender: "female",
      age: "young adult",
      hairColor: "teal",
      eyeColor: "purple",
      vibe: "mystical, serene, elegant",
      clothing: "ornate dress",
      accessories: "headband, earrings",
      originalName: "0",
      eyeMouthOffsets: { mouthX: 0, mouthY: 0, eyeX: 0, eyeY: 0 },
    },
  ]);
}

