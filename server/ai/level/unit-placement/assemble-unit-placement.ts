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
  const [genericEnemies, { boss, playerUnits, greenUnits }] = await Promise.all(
    [
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
    ]
  );

  return {
    boss,
    playerUnits,
    genericEnemies,
    greenUnits: greenUnits || [],
  };
}

