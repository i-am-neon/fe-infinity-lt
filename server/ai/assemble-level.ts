import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { Level } from "@/types/level.ts";
import chooseMap from "@/ai/choose-map.ts";

export default async function assembleLevel({
  chapterIdea,
  chapterNumber,
}: {
  chapterIdea: ChapterIdea;
  chapterNumber: number;
}): Promise<Level> {
  const chosenMap = await chooseMap(chapterIdea);
  return {
    nid: chapterNumber.toString(),
    name: chapterIdea.title,
    tilemap: chosenMap,
    bg_tilemap: null,
    party: "Eirika",
    music: {
      player_phase: "Distant Roads",
      enemy_phase: "Shadow of the Enemy",
      other_phase: null,
      enemy2_phase: null,
      player_battle: "Attack",
      enemy_battle: "Defense",
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
    units: [
      {
        nid: "Eirika",
        team: "player",
        ai: "None",
        roam_ai: null,
        ai_group: null,
        starting_position: [4, 5],
        starting_traveler: null,
        generic: false,
      },
      {
        nid: "101",
        variant: null,
        level: 1,
        klass: "Fighter",
        faction: "Soldier",
        starting_items: [["Iron_Axe", false]],
        starting_skills: [],
        team: "enemy",
        ai: "Attack",
        roam_ai: null,
        ai_group: "",
        starting_position: [9, 6],
        starting_traveler: null,
        generic: true,
      },
      {
        nid: "102",
        variant: null,
        level: 2,
        klass: "Fighter",
        faction: "Soldier",
        starting_items: [["Iron_Axe", false]],
        starting_skills: [],
        team: "enemy",
        ai: "Attack",
        roam_ai: null,
        ai_group: "",
        starting_position: [8, 6],
        starting_traveler: null,
        generic: true,
      },
    ],
    regions: [],
    unit_groups: [],
    ai_groups: [],
  };
}

