import assignDoorAndChestKeys from "@/ai/level/unit-placement/assign-door-and-chest-keys.ts";
import correctUnitPlacement from "@/ai/level/unit-placement/correct-unit-placement.ts";
import { NonGenericUnitPlacementResult } from "@/ai/level/unit-placement/gen-boss-and-player-and-recruitable-unit-coords.ts";
import genGenericUnitClassAndAi from "./gen-generic-unit-class-and-ai.ts";
import { genUnitSquads } from "@/ai/level/unit-placement/gen-unit-squads.ts";
import getEnemyComposition from "@/ai/level/unit-placement/get-enemy-composition.ts";
import getGenericEnemyCountNumberRange from "@/ai/level/unit-placement/get-generic-enemy-number-range.ts";
import getTerrainGridFromMapName from "@/ai/level/unit-placement/get-terrain-grid-from-tilemap.ts";
import { getTerrainGridSize } from "@/ai/level/unit-placement/get-terrain-grid-size.ts";
import { testPrologueChapter } from "@/ai/test-data/prologueTestData.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { EnemyGenericUnit, EnemyGenericUnitWithStartingItems } from "@/ai/types/unit-placement.ts";
import { allMapOptions } from "@/map-processing/all-map-options.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";

export default async function getGenericEnemies({
  terrainGrid,
  chapterIdea,
  mapMetadata,
  chapterNumber,
  nonGenericUnitPlacementResult,
}: {
  terrainGrid: TerrainGrid;
  chapterIdea: ChapterIdea;
  mapMetadata: MapMetadata;
  chapterNumber: number;
  nonGenericUnitPlacementResult: NonGenericUnitPlacementResult;
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
    mapName: mapMetadata.originalName,
    nonGenericUnitPlacementResult,
  });
  const enemyGenericUnitPlacement: EnemyGenericUnit[] = await Promise.all(
    unitSquadsByRegion.flatMap((regionSquadInfo) => {
      return regionSquadInfo.placement.map(async (p) => {
        const { unitType, x, y } = p;
        const { aiGroup, "class": unitClass } = await genGenericUnitClassAndAi(unitType);
        const unit: EnemyGenericUnit = {
          x, y, aiGroup, "class": unitClass
        };
        return unit;
      });
    })
  );
  const correctedUnits = correctUnitPlacement({
    terrainGrid,
    units: enemyGenericUnitPlacement,
  });

  const finalUnits = assignDoorAndChestKeys({ terrainGrid, enemies: correctedUnits, originalMapName: mapMetadata.originalName });
  return finalUnits;
}

if (import.meta.main) {
  const res = await getGenericEnemies({
    terrainGrid: getTerrainGridFromMapName("(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19"),
    chapterIdea: testPrologueChapter.idea,
    chapterNumber: 0,
    mapMetadata: allMapOptions.find(
      (map) => map.originalName === "(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19"
    ) as MapMetadata,
    nonGenericUnitPlacementResult: {
      boss: { region: "Eastern Ruins", coords: { x: 12, y: 0 } },
      playerUnits: { regions: ["Western Lakeside Village"] },
      recruitableUnits: [
        {
          nid: "Evelyn",
          firstSeenAs: "allied NPC",
          region: "Central Crossroads",
          coords: { x: 6, y: 4 }
        }
      ]
    }
  });
  console.log(res);
}

