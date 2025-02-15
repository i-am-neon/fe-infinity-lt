import chooseMap from "@/ai/choose-map.ts";
import getLevelUnits from "@/ai/level/get-level-units.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { UnitData } from "@/types/character/unit-data.ts";
import { Level } from "@/types/level.ts";

export default async function assembleLevel({
  chapterIdea,
  chapterNumber,
  playerUnitDatas,
  bossUnitData,
  playerPhaseMusic,
  enemyPhaseMusic,
}: {
  chapterIdea: ChapterIdea;
  chapterNumber: number;
  playerUnitDatas: UnitData[];
  bossUnitData: UnitData;
  playerPhaseMusic: string;
  enemyPhaseMusic: string;
}): Promise<Level> {
  const chosenMap = await chooseMap(chapterIdea);

  const units = await getLevelUnits({
    chosenMap,
    chapterIdea,
    chapterNumber,
    playerUnitDatas,
    bossUnitData,
  });

  return {
    nid: chapterNumber.toString(),
    name:
      chapterNumber === 0
        ? `Prologue: ${chapterIdea.title}`
        : `Ch. ${chapterNumber}: ${chapterIdea.title}`,
    tilemap: chosenMap,
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
      loss: "Eirika dies",
    },
    roam: false,
    roam_unit: "Eirika",
    go_to_overworld: false,
    should_record: true,
    units,
    regions: [],
    unit_groups: [],
    ai_groups: [],
  };
}

