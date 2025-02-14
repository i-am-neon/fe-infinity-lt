import { testChapterIdea } from "@/ai/test-data/chapter-ideas.ts";
import {
  testMapMetadata,
  testTerrainGrid,
} from "@/ai/test-data/unit-placement.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { EnemyGenericUnit } from "@/ai/types/unit-placement.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import correctUnitPlacement from "./correct-unit-placement.ts";
import genUnitSquads from "./gen-unit-squads.ts";
import getEnemyComposition from "./get-enemy-composition.ts";
import getGenericEnemyCountNumberRange from "./get-generic-enemy-number-range.ts";
import { getTerrainGridSize } from "./get-terrain-grid-size.ts";
import placeEnemyGenericUnits from "./place-enemy-generic-units.ts";

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
  const enemyGenericUnitPlacement = await placeEnemyGenericUnits({
    terrainGrid,
    chapterIdea,
    mapMetadata,
    regionSquadInfo: unitSquadsByRegion,
    enemyComposition,
  });
  const correctedUnits = correctUnitPlacement({
    terrainGrid,
    units: enemyGenericUnitPlacement,
  });
  return correctedUnits;
}

if (import.meta.main) {
  const res = await getGenericEnemies({
    terrainGrid: testTerrainGrid,
    chapterIdea: testChapterIdea,
    chapterNumber: 0,
    mapMetadata: testMapMetadata,
  });
  console.log(res);
}

