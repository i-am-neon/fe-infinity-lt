import createNewProject from "./game-engine-io/create-new-project.ts";
import writeChapter from "./game-engine-io/write-chapter/write-chapter.ts";
import writeStubChapter from "@/game-engine-io/write-chapter/write-stub-chapter.ts";
import shortUuid from "./lib/short-uuid.ts";
import runGame from "./run-game.ts";
import { Chapter } from "@/types/game-engine/chapter.ts";

export default async function run() {
  const projectName = shortUuid();

  // Create new project
  const projectNameEndingInDotLtProj = await createNewProject(projectName);

  // Generate data for initial chapter
  const stubChapter: Chapter = {
    number: 0,
    name: "It's da Prologue bishhh",
    level: {
      nid: "0",
      name: "Prologue",
      tilemap: "Prologue",
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
          nid: "Seth",
          team: "player",
          ai: "None",
          roam_ai: null,
          ai_group: null,
          starting_position: [4, 4],
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
        {
          nid: "O'Neill",
          team: "enemy",
          ai: "Guard",
          roam_ai: null,
          ai_group: null,
          starting_position: [10, 8],
          starting_traveler: null,
          generic: false,
        },
      ],
      regions: [],
      unit_groups: [
        {
          nid: "Enemy1",
          units: ["101", "102"],
          positions: {
            "101": [14, 7],
            "102": [14, 8],
          },
        },
      ],
      ai_groups: [],
    },
    events: [
      {
        name: "Intro",
        trigger: "level_start",
        level_nid: "0",
        condition: "True",
        commands: [],
        only_once: false,
        priority: 20,
        _source: [
          "add_portrait;Eirika;Right",
          "speak;Eirika;Welcome to FE Infinity!",
        ],
      },
      {
        name: "OnlyBoss",
        trigger: "combat_end",
        level_nid: "0",
        condition: "len(game.get_enemy_units()) == 1",
        commands: [],
        only_once: true,
        priority: 20,
        _source: [
          "add_portrait;Seth;Left",
          "speak;Seth;All that's left is their leader...",
          "remove_portrait;Seth",
        ],
      },
      {
        name: "DeathONeill",
        trigger: "unit_death",
        level_nid: "0",
        condition: 'unit.nid == "O\'Neill"',
        commands: [],
        only_once: false,
        priority: 20,
        _source: [
          "add_portrait;O'Neill;Left",
          "speak;O'Neill;What? How?",
          "expression;O'Neill;CloseEyes",
          "remove_portrait;O'Neill",
        ],
      },
      {
        name: "Defeat Boss",
        trigger: "combat_end",
        level_nid: "0",
        condition: 'game.check_dead("O\'Neill")',
        commands: [],
        only_once: false,
        priority: 20,
        _source: ["win_game"],
      },
      {
        name: "Outro",
        trigger: "level_end",
        level_nid: "0",
        condition: "True",
        commands: [],
        only_once: false,
        priority: 22,
        _source: [
          "transition;Close",
          "change_background;Forest",
          "transition;Open",
          "add_portrait;Seth;Left;no_block",
          "speak;Seth;Well, that was the prologue!",
          "transition;Close",
        ],
      },
    ],
  };

  // Modify project files
  await writeChapter({ projectNameEndingInDotLtProj, chapter: stubChapter });

  await writeStubChapter({
    projectNameEndingInDotLtProj,
    chapterNumber: 1,
  });

  console.log("✅ Project created successfully! Running game...");

  // Run game
  await runGame(projectNameEndingInDotLtProj);
}

if (import.meta.main) {
  await run();
}

