import { PortraitMetadata } from "@/types/portraits/portrait-metadata.ts";
import generateAndStoreVector from "@/vector-db-js/generate-and-store-vector.ts";
import { VectorType } from "@/vector-db-js/types/vector-type.ts";

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

    // Determine which gender-specific table to use
    const vectorType: VectorType = portraitMetadata.gender === "male"
      ? "portraits-male"
      : "portraits-female";

    await generateAndStoreVector({
      text,
      metadata: portraitMetadata,
      vectorType,
    });
  }
}

if (import.meta.main) {
  const samplePortraits: PortraitMetadata[] = [
    {
      gender: "male",
      age: "mature adult",
      hairColor: "silver",
      eyeColor: "red",
      vibe: "mysterious, regal, enigmatic",
      clothing: "dark robe with gold accents",
      originalName: "portrait-1",
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
      originalName: "portrait-2",
      blinkingOffset: [24, 24],
      smilingOffset: [24, 40],
    }
  ];
  
  saveVectorsForAllPortraits(samplePortraits)
    .then(() => console.log("Saved vectors for portraits"))
    .catch(console.error);
}