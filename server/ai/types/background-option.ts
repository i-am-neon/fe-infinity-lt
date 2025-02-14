import { z } from "zod";

export enum BackgroundOptions {
  Arena = "Arena",
  Bedroom = "Bedroom",
  BlackBackground = "Black Background",
  CastleRuins = "Castle Ruins",
  CastleSepia = "Castle Sepia",
  Clearing = "Clearing",
  DeepForest = "Deep Forest",
  Forest = "Forest",
  ForestDark = "Forest Dark",
  GradoCastle = "Grado Castle",
  Hill = "Hill",
  House = "House",
  InsideCastle = "Inside Castle",
  Plains = "Plains",
  Ruins = "Ruins",
  Town = "Town",
  TownSunset = "Town Sunset",
  Village = "Village",
  VillageGate = "Village Gate",
}

export const BackgroundOptionsSchema = z.nativeEnum(BackgroundOptions);
export type BackgroundOption = z.infer<typeof BackgroundOptionsSchema>;

export const backgroundImageMap: Record<BackgroundOption, string> = {
  [BackgroundOptions.Arena]: "Arena",
  [BackgroundOptions.Bedroom]: "Bedroom",
  [BackgroundOptions.BlackBackground]: "BlackBackground",
  [BackgroundOptions.CastleRuins]: "CastleRuins",
  [BackgroundOptions.CastleSepia]: "CastleSepia",
  [BackgroundOptions.Clearing]: "Clearing",
  [BackgroundOptions.DeepForest]: "DeepForest",
  [BackgroundOptions.Forest]: "Forest",
  [BackgroundOptions.ForestDark]: "ForestDark",
  [BackgroundOptions.GradoCastle]: "GradoCastle",
  [BackgroundOptions.Hill]: "Hill",
  [BackgroundOptions.House]: "House",
  [BackgroundOptions.InsideCastle]: "InsideCastle",
  [BackgroundOptions.Plains]: "Plains",
  [BackgroundOptions.Ruins]: "Ruins",
  [BackgroundOptions.Town]: "Town",
  [BackgroundOptions.TownSunset]: "TownSunset",
  [BackgroundOptions.Village]: "Village",
  [BackgroundOptions.VillageGate]: "VillageGate",
};

