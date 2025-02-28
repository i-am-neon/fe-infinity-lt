import correctUnitPlacement from "@/ai/level/unit-placement/correct-unit-placement.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import genBossAndPlayerAndGreenUnitCoords from "./gen-boss-and-player-and-green-unit-coords.ts";
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
  const [
    originalGenericEnemies,
    { bossCoords, playerUnitsCoords, greenUnitsCoords },
  ] = await Promise.all([
    getGenericEnemies({
      terrainGrid,
      chapterIdea,
      mapMetadata,
      chapterNumber,
    }),
    genBossAndPlayerAndGreenUnitCoords({
      terrainGrid,
      chapterIdea,
      mapMetadata,
    }),
  ]);

  // Collect existing positions (boss and player units)
  const existingPositions = [
    { x: bossCoords.x, y: bossCoords.y },
    ...playerUnitsCoords.map((unit) => ({ x: unit.x, y: unit.y })),
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
    greenUnits: greenUnitsCoords || [],
  };
}

