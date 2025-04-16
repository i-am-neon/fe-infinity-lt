import correctUnitPlacement from "@/ai/level/unit-placement/correct-unit-placement.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import genBossAndPlayerAndRecruitableUnitCoords from "./gen-boss-and-player-and-recruitable-unit-coords.ts";
import getGenericEnemies from "./get-generic-enemies.ts";
import getPlayerUnitPlacement from "@/ai/level/unit-placement/get-player-unit-placement.ts";

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

  const playerRegion = mapMetadata.distinctRegions.find(
    (region) =>
      region.name === nonGenericUnitPlacementResult.playerUnits.regions[0]
  );
  if (!playerRegion) {
    throw new Error("Player region not found in map metadata");
  }

  const playerUnitCoords = getPlayerUnitPlacement({
    terrainGrid,
    // TODO: don't hardcode
    numUnits: 8,
    startX: playerRegion.fromX,
    startY: playerRegion.fromY,
  })

  return {
    bossCoords: nonGenericUnitPlacementResult.boss.coords,
    playerUnitCoords,
    genericEnemies,
    recruitableUnits: nonGenericUnitPlacementResult.recruitableUnits,
  };
}

