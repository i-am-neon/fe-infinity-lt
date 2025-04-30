import correctUnitPlacement from "@/ai/level/unit-placement/correct-unit-placement.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import genBossAndPlayerAndRecruitableUnitCoords from "./gen-boss-and-player-and-recruitable-unit-coords.ts";
import getGenericEnemies from "./get-generic-enemies.ts";
import getPlayerUnitPlacement from "@/ai/level/unit-placement/get-player-unit-placement.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";

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
  const logger = getCurrentLogger();
  const nonGenericUnitPlacementResult = await genBossAndPlayerAndRecruitableUnitCoords({
    terrainGrid,
    chapterIdea,
    mapMetadata,
  });

  // Get player unit positions first
  const playerRegion = mapMetadata.distinctRegions.find(
    (region) =>
      region.name === nonGenericUnitPlacementResult.playerUnits.regions[0]
  );
  if (!playerRegion) {
    throw new Error("Player region not found in map metadata");
  }

  const playerUnitCoords = getPlayerUnitPlacement({
    terrainGrid,
    fromX: playerRegion.fromX,
    fromY: playerRegion.fromY,
    toX: playerRegion.toX,
    toY: playerRegion.toY,
  });

  const originalGenericEnemies = await getGenericEnemies({
    terrainGrid,
    chapterIdea,
    mapMetadata,
    chapterNumber,
    nonGenericUnitPlacementResult,
  });

  // Collect existing positions (boss, player, and recruitable units)
  const existingPositions = [
    // boss
    nonGenericUnitPlacementResult.boss.coords,
    // player units (important for prologue where players have fixed positions)
    ...(chapterNumber === 0 ? playerUnitCoords : []),
    // recruitable units
    ...nonGenericUnitPlacementResult.recruitableUnits.map(unit => unit.coords),
  ];

  // Correct enemy positions to avoid overlap with player units and boss
  const genericEnemies = correctUnitPlacement({
    terrainGrid,
    units: originalGenericEnemies,
    existingPositions,
  });

  logger.info("assembleUnitPlacement result", {
    bossCoords: nonGenericUnitPlacementResult.boss.coords,
    playerUnitCoords,
    genericEnemies,
    recruitableUnits: nonGenericUnitPlacementResult.recruitableUnits,
  });

  return {
    bossCoords: nonGenericUnitPlacementResult.boss.coords,
    playerUnitCoords,
    genericEnemies,
    recruitableUnits: nonGenericUnitPlacementResult.recruitableUnits,
  };
}

