import getGenericEnemies from "./get-generic-enemies.ts";
import genBossAndPlayerAndGreenUnitCoords from "./gen-boss-and-player-and-green-unit-coords.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";

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
  const [originalGenericEnemies, { boss, playerUnits, greenUnits }] =
    await Promise.all([
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

  // If any enemies are on Player Units or Boss, remove them
  const playerPositions = new Set(playerUnits.map((u) => `${u.x},${u.y}`));
  const genericEnemies = originalGenericEnemies.filter(
    (e) =>
      !playerPositions.has(`${e.x},${e.y}`) &&
      `${e.x},${e.y}` !== `${boss.x},${boss.y}`
  );

  return {
    boss,
    playerUnits,
    genericEnemies,
    greenUnits: greenUnits || [],
  };
}

