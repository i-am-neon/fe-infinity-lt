import { appendEvents } from "@/game-engine-io/write-chapter/append-events.ts";
import { appendLevel } from "@/game-engine-io/write-chapter/append-level.ts";

export default async function writeStubChapter({
  projectNameEndingInDotLtProj,
  chapterNumber,
}: {
  projectNameEndingInDotLtProj: string;
  chapterNumber: number;
}): Promise<void> {
  await appendLevel({
    projectNameEndingInDotLtProj,
    newLevel: {
      nid: `${chapterNumber}`,
      name: `Chapter ${chapterNumber}`,
      tilemap: "(7)Ch01_Diff_Tileset__by_Shin19",
      music: {
        player_phase: "memories-of-green",
        enemy_phase: "Distant Roads",
        other_phase: null,
        enemy2_phase: null,
        player_battle: "Attack",
        enemy_battle: "Defense",
        other_battle: null,
        enemy2_battle: null,
      },
      tags: ["stub"],
    },
  });
  await appendEvents({
    projectNameEndingInDotLtProj,
    newEvents: [
      {
        name: "stub",
        trigger: "level_start",
        level_nid: `${chapterNumber}`,
        _source: [
          "speak;hint;This chapter has not been created yet!|You must close the game, create the chapter, and then restart the game to play it.",
        ],
      },
    ],
  });
}

