import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import { EnemyGenericUnit } from "@/ai/types/unit-placement.ts";
import correctUnitPlacement from "@/ai/unit-placement/correct-unit-placement.ts";
import genUnitSquads from "@/ai/unit-placement/gen-unit-squads.ts";
import getEnemyComposition from "@/ai/unit-placement/get-enemy-composition.ts";
import getGenericEnemyCountNumberRange from "@/ai/unit-placement/get-generic-enemy-number-range.ts";
import { getTerrainGridSize } from "@/ai/unit-placement/get-terrain-grid-size.ts";
import placeEnemyGenericUnits from "@/ai/unit-placement/place-enemy-generic-units.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";

export default async function getGenericEnemies({
  terrainGrid,
  chapterIdea,
  mapMetadata,
  chapterNumber,
}: {
  terrainGrid: TerrainGrid;
  chapterIdea: ChapterIdea;
  mapMetadata: MapMetadata;
  chapterNumber: number;
}): Promise<EnemyGenericUnit[]> {
  const enemyComposition = getEnemyComposition(chapterNumber);
  const enemyCountRange = getGenericEnemyCountNumberRange(
    getTerrainGridSize(terrainGrid)
  );
  const unitSquadsByRegion = await genUnitSquads({
    terrainGrid,
    chapterIdea,
    mapMetadata,
    enemyComposition,
    enemyCountRange,
  });
  console.log("unitSquadsByRegion :>> ", unitSquadsByRegion);
  const EnemyGenericUnitPlacement = await placeEnemyGenericUnits({
    terrainGrid,
    chapterIdea,
    mapMetadata,
    regionSquadInfo: unitSquadsByRegion,
    enemyComposition,
  });
  console.log("EnemyGenericUnitPlacement :>> ", EnemyGenericUnitPlacement);
  const correctedUnits = correctUnitPlacement({
    terrainGrid,
    units: EnemyGenericUnitPlacement,
  });
  return correctedUnits;
}

