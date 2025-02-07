import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import initializeProject from "@/game-engine-io/initialize-project.ts";
import appendUnits from "@/game-engine-io/write-chapter/append-units.ts";
import writeChapter from "@/game-engine-io/write-chapter/write-chapter.ts";
import removeExistingGame from "@/lib/remove-existing-game.ts";
import runGame from "@/run-game.ts";
import {
  stubCharacterBozla,
  stubCharacterBroNeill,
} from "@/test-data/stub-characters.ts";
import { Chapter } from "@/types/chapter.ts";

export default async function writeTestMapGame(): Promise<void> {
  const projectName = "test-map";
  await removeExistingGame(projectName);

  // Create new project
  const { projectNameEndingInDotLtProj, gameNid } = await initializeProject(
    projectName
  );

  // Add the only characters we'll use in this test
  const characters = [stubCharacterBozla, stubCharacterBroNeill];
  await appendUnits({
    projectNameEndingInDotLtProj,
    newUnits: characters.map((c) => c.unitData),
  });

  const mapsSourcePath = getPathWithinServer("assets/maps");

  let counter = 0;
  for await (const entry of Deno.readDir(mapsSourcePath)) {
    if (!entry.isFile) continue;
    if (!entry.name.endsWith(".json")) continue;
    const mapName = entry.name.slice(0, -5);
    console.log("Writing chapter for map:", mapName);

    const filePath = `${mapsSourcePath}/${entry.name}`;
    const fileContents = await Deno.readTextFile(filePath);
    const tilemap = JSON.parse(fileContents); // Parse JSON file
    tilemap.nid = counter.toString();

    const chapter: Chapter = {
      title: `${counter}: ${mapName}`,
      number: counter,
      newCharacters: [],
      level: {
        nid: counter.toString(),
        name: `${counter}: ${mapName}`,
        tilemap: counter.toString(),
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
            starting_position: [0, 0],
            starting_traveler: null,
            generic: false,
          },
          {
            nid: "Bozla",
            team: "player",
            ai: "None",
            roam_ai: null,
            ai_group: null,
            starting_position: [1, 1],
            starting_traveler: null,
            generic: false,
          },
          {
            nid: "BroNeill",
            team: "enemy",
            ai: "Guard",
            roam_ai: null,
            ai_group: null,
            starting_position: [0, 1],
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
            "add_portrait;Bozla;Right",
            `speak;Bozla;This is to test the map, "${mapName}".`,
          ],
        },
        {
          name: "Defeat Boss",
          trigger: "combat_end",
          level_nid: "0",
          condition: 'game.check_dead("BroNeill")',
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
            "add_portrait;Bozla;Right",
            `speak;Bozla;That was to test the map, "${mapName}". Now moving on.`,
          ],
        },
      ],
      tilemap,
    };

    // Write chapter
    await writeChapter({ projectNameEndingInDotLtProj, chapter });

    counter += 1;
  }

  await runGame(projectNameEndingInDotLtProj);
}

if (import.meta.main) {
  await writeTestMapGame();
  console.log("Wrote test map game successfully.");
}

