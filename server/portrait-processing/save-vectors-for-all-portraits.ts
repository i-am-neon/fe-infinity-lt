import { PortraitMetadata } from "@/types/portraits/portrait-metadata.ts";
import generateAndStoreVector from "@/vector-db/generate-and-store-vector.ts";
import shortUuid from "@/lib/short-uuid.ts";

export default async function saveVectorsForAllPortraits(
  portraitMetadatas: PortraitMetadata[]
): Promise<void> {
  for (const portraitMetadata of portraitMetadatas) {
    const text = `Portrait Details:
Original Name: ${portraitMetadata.originalName}
Gender: ${portraitMetadata.gender}
Age: ${portraitMetadata.age}
Hair Color: ${portraitMetadata.hairColor}
Eye Color: ${portraitMetadata.eyeColor}
Vibe: ${portraitMetadata.vibe}
Clothing: ${portraitMetadata.clothing}
Headgear: ${portraitMetadata.headgear || "None"}
Facial Hair: ${portraitMetadata.facialHair || "None"}
Accessories: ${portraitMetadata.accessories || "None"}`;
    await generateAndStoreVector({
      id: shortUuid(),
      text,
      metadata: portraitMetadata,
      vectorType: "portraits",
    });
  }
}

if (import.meta.main) {
  await saveVectorsForAllPortraits([
    {
      gender: "male",
      age: "mature adult",
      hairColor: "silver",
      eyeColor: "red",
      vibe: "mysterious, regal, enigmatic",
      clothing: "dark robe with gold accents",
      originalName: "2",
      blinkingOffset: [32, 24],
      smilingOffset: [32, 40],
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
      blinkingOffset: [24, 24],
      smilingOffset: [24, 40],
    },
    {
      gender: "male",
      age: "young adult",
      hairColor: "red",
      eyeColor: "yellow",
      vibe: "mysterious, confident, regal",
      clothing: "fur-lined cloak",
      accessories: "earrings",
      originalName: "1",
      blinkingOffset: [24, 24],
      smilingOffset: [24, 40],
    },
    {
      gender: "female",
      age: "young adult",
      hairColor: "teal",
      eyeColor: "purple",
      vibe: "mystical,elegant,calm",
      clothing: "white and gold outfit",
      accessories: "headband, earrings",
      originalName: "0",
      blinkingOffset: [24, 32],
      smilingOffset: [24, 48],
    },
  ]);
}