import {
  getLtMakerPath,
  getPathWithinLtMaker,
} from "@/file-io/get-path-within-lt-maker.ts";
import writeFileWithinLtMaker from "@/file-io/write-file-within-lt-maker.ts";
import runPythonScript from "@/lib/run-python-script.ts";
import { sluggify } from "@/lib/sluggify.ts";
import removeWithinLtMaker from "@/file-io/remove-within-lt-maker.ts";

export default async function initializeProject(projectName: string) {
  const initProjectScriptPath = getPathWithinLtMaker("create_new_project.py");
  const newProjectNameEndingInDotLtProj = `_${sluggify(projectName)}.ltproj`;
  const gameNid = "_" + sluggify(projectName);
  // python initialize_new_project.py <nid> <title> <lt_project_base_path> <new_project_relative_path>
  await runPythonScript({
    pathToPythonScript: initProjectScriptPath,
    args: [
      sluggify(projectName),
      projectName,
      getLtMakerPath(),
      newProjectNameEndingInDotLtProj,
    ],
  });

  // Empty levels.json and events.json
  await writeFileWithinLtMaker({
    relativePath: `${newProjectNameEndingInDotLtProj}/game_data/levels.json`,
    text: "[]",
  });
  await writeFileWithinLtMaker({
    relativePath: `${newProjectNameEndingInDotLtProj}/game_data/events.json`,
    text: "[]",
  });
  await writeFileWithinLtMaker({
    relativePath: `${newProjectNameEndingInDotLtProj}/game_data/units.json`,
    // Eirika must be in the game so it doesn't crash
    text: `[
    {
        "nid": "Eirika",
        "name": "Eirika",
        "desc": "The princess of the Kingdom of\\nRenais. She's elegant and kind.",
        "variant": null,
        "level": 1,
        "klass": "Eirika_Lord",
        "tags": [
            "Lord"
        ],
        "bases": {
            "HP": 16,
            "STR": 4,
            "MAG": 2,
            "SKL": 8,
            "SPD": 9,
            "LCK": 5,
            "DEF": 3,
            "CON": 5,
            "MOV": 5,
            "RES": 1
        },
        "growths": {
            "HP": 70,
            "STR": 40,
            "MAG": 20,
            "SKL": 60,
            "SPD": 60,
            "LCK": 60,
            "DEF": 30,
            "CON": 0,
            "MOV": 0,
            "RES": 30
        },
        "stat_cap_modifiers": {},
        "starting_items": [
            [
                "Vulnerary",
                false
            ],
            [
                "Rapier",
                false
            ]
        ],
        "learned_skills": [],
        "unit_notes": [],
        "wexp_gain": {
            "Sword": [
                true,
                1,
                251
            ],
            "Lance": [
                false,
                0,
                251
            ],
            "Axe": [
                false,
                0,
                251
            ],
            "Bow": [
                false,
                0,
                251
            ],
            "Staff": [
                false,
                0,
                251
            ],
            "Light": [
                false,
                0,
                251
            ],
            "Anima": [
                false,
                0,
                251
            ],
            "Dark": [
                false,
                0,
                251
            ],
            "Default": [
                false,
                0,
                251
            ]
        },
        "alternate_classes": [],
        "portrait_nid": "Eirika",
        "affinity": "Light",
        "fields": []
    }
]`,
  });

  // Remove tilemaps
  await removeWithinLtMaker({
    relativePath: `${newProjectNameEndingInDotLtProj}/resources/tilemaps/tilemap_data`,
    preserveDirectory: true,
  });

  return {
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    gameNid,
  };
}

if (import.meta.main) {
  await initializeProject("My Project");
}

