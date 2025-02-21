import {
  testMapMetadata,
  testTerrainGrid,
} from "@/ai/test-data/unit-placement.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { EnemyGenericUnitWithStartingItems } from "@/ai/types/unit-placement.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import assignDoorAndChestKeys from "@/ai/level/unit-placement/assign-door-and-chest-keys.ts";
import correctUnitPlacement from "@/ai/level/unit-placement/correct-unit-placement.ts";
import genUnitSquads from "@/ai/level/unit-placement/gen-unit-squads.ts";
import getEnemyComposition from "@/ai/level/unit-placement/get-enemy-composition.ts";
import getGenericEnemyCountNumberRange from "@/ai/level/unit-placement/get-generic-enemy-number-range.ts";
import { getTerrainGridSize } from "@/ai/level/unit-placement/get-terrain-grid-size.ts";
import placeEnemyGenericUnits from "@/ai/level/unit-placement/place-enemy-generic-units.ts";
import { testPrologueChapter } from "@/ai/test-data/prologueTestData.ts";

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
}): Promise<EnemyGenericUnitWithStartingItems[]> {
  const enemyComposition = getEnemyComposition(chapterNumber);
  const enemyCountRange = getGenericEnemyCountNumberRange({
    mapSize: getTerrainGridSize(terrainGrid),
    chapter: chapterNumber,
  });
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

  const finalUnits = assignDoorAndChestKeys(terrainGrid, correctedUnits);
  return finalUnits;
}

if (import.meta.main) {
  const res = await getGenericEnemies({
    terrainGrid: testTerrainGrid,
    chapterIdea: testPrologueChapter.idea,
    chapterNumber: 0,
    mapMetadata: testMapMetadata,
  });
  console.log(res);
}

