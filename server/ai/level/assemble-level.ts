import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { Level, LevelRegion, Unit } from "@/types/level.ts";

export default function assembleLevel({
  chapterIdea,
  chapterNumber,
  chosenMapName,
  units,
  playerPhaseMusic,
  enemyPhaseMusic,
  regions,
}: {
  chapterIdea: ChapterIdea;
  chapterNumber: number;
  chosenMapName: string;
  units: Unit[];
  playerPhaseMusic: string;
  enemyPhaseMusic: string;
  regions: LevelRegion[];
}): Level {
  return {
    nid: chapterNumber.toString(),
    name:
      chapterNumber === 0
        ? `Prologue: ${chapterIdea.title}`
        : `Ch. ${chapterNumber}: ${chapterIdea.title}`,
    tilemap: chosenMapName,
    bg_tilemap: null,
    party: "Eirika",
    music: {
      player_phase: playerPhaseMusic,
      enemy_phase: enemyPhaseMusic,
      other_phase: null,
      enemy2_phase: null,
      player_battle: null,
      enemy_battle: null,
      other_battle: null,
      enemy2_battle: null,
    },
    objective: {
      simple: "Defeat boss",
      win: "Defeat boss",
      loss: "Party dies",
    },
    roam: false,
    roam_unit: "Eirika",
    go_to_overworld: false,
    should_record: true,
    units,
    regions,
    unit_groups: [],
    ai_groups: [],
  };
}

