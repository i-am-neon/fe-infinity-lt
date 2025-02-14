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
  [BackgroundOptions.Arena]: "Arena.png",
  [BackgroundOptions.Bedroom]: "Bedroom.png",
  [BackgroundOptions.BlackBackground]: "BlackBackground.png",
  [BackgroundOptions.CastleRuins]: "CastleRuins.png",
  [BackgroundOptions.CastleSepia]: "CastleSepia.png",
  [BackgroundOptions.Clearing]: "Clearing.png",
  [BackgroundOptions.DeepForest]: "DeepForest.png",
  [BackgroundOptions.Forest]: "Forest.png",
  [BackgroundOptions.ForestDark]: "ForestDark.png",
  [BackgroundOptions.GradoCastle]: "GradoCastle.png",
  [BackgroundOptions.Hill]: "Hill.png",
  [BackgroundOptions.House]: "House.png",
  [BackgroundOptions.InsideCastle]: "InsideCastle.png",
  [BackgroundOptions.Plains]: "Plains.png",
  [BackgroundOptions.Ruins]: "Ruins.png",
  [BackgroundOptions.Town]: "Town.png",
  [BackgroundOptions.TownSunset]: "TownSunset.png",
  [BackgroundOptions.Village]: "Village.png",
  [BackgroundOptions.VillageGate]: "VillageGate.png",
};

