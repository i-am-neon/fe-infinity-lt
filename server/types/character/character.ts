import { PortraitMetadata } from "@/types/portraits/portrait-metadata.ts";
import { UnitData } from "@/types/character/unit-data.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";

export type Character = {
  characterIdea: CharacterIdea;
  unitData: UnitData;
  portraitMetadata: PortraitMetadata;
};

