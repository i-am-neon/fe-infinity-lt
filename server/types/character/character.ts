import { PortraitMetadata } from "@/types/portraits/portrait-metadata.ts";
import { UnitData } from "@/types/character/unit-data.ts";

export type Character = {
  unitData: UnitData;
  portraitMetadata: PortraitMetadata;
};

