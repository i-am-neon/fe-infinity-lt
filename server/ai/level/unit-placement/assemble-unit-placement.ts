import correctUnitPlacement from "@/ai/level/unit-placement/correct-unit-placement.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import genBossAndPlayerAndRecruitableUnitCoords from "./gen-boss-and-player-and-recruitable-unit-coords.ts";
import getGenericEnemies from "./get-generic-enemies.ts";

export default async function assembleUnitPlacement({
  terrainGrid,
  chapterIdea,
  mapMetadata,
  chapterNumber,
}: {
  terrainGrid: TerrainGrid;
  chapterIdea: ChapterIdea;
  mapMetadata: MapMetadata;
  chapterNumber: number;
}) {
  const nonGenericUnitPlacementResult = await genBossAndPlayerAndRecruitableUnitCoords({
    terrainGrid,
    chapterIdea,
    mapMetadata,
  })
  const originalGenericEnemies = await getGenericEnemies({
    terrainGrid,
    chapterIdea,
    mapMetadata,
    chapterNumber,
    nonGenericUnitPlacementResult,
  })

  // Collect existing positions (boss, player, and recruitable units)
  const existingPositions = [
    // boss
    nonGenericUnitPlacementResult.boss.coords,
    // enemy generics
    ...originalGenericEnemies.map((unit) => ({ x: unit.x, y: unit.y })),
  ];

  // Correct enemy positions to avoid overlap with player units and boss
  const genericEnemies = correctUnitPlacement({
    terrainGrid,
    units: originalGenericEnemies,
    existingPositions,
  });

  return {
    bossCoords,
    playerUnitsCoords,
    genericEnemies,
    recruitableUnits,
  };
}

