import {
  getLtMakerPath,
  getPathWithinLtMaker,
} from "@/file-io/get-path-within-lt-maker.ts";
import writeFileWithinLtMaker from "@/file-io/write-file-within-lt-maker.ts";
import runPythonScript from "@/lib/run-python-script.ts";
import { sluggify } from "@/lib/sluggify.ts";
import removeWithinLtMaker from "@/file-io/remove-within-lt-maker.ts";
import copyTilesetsToProject from "@/file-io/copy-tilesets-to-project.ts";
import appendAllTilesetsData from "@/game-engine-io/write-chapter/append-all-tilesets-data.ts";
import modifyConstant from "@/game-engine-io/modify-constant.ts";
import { copyMusicAndUpdateJson } from "@/game-engine-io/write-chapter/copy-music.ts";
import copyGenericPortraitsToProject from "@/file-io/copy-generic-portraits-to-project.ts";

export default async function initializeProject(projectName: string) {
  const initProjectScriptPath = getPathWithinLtMaker("create_new_project.py");
  const newProjectNameEndingInDotLtProj = `_${sluggify(projectName)}.ltproj`;
  const gameNid = "_" + sluggify(projectName);
  
  // Get the lt-maker path and ensure it uses forward slashes for Wine compatibility
  const ltMakerPath = getLtMakerPath().replace(/\\/g, '/');
  
  // Normalize the project path to use forward slashes
  const normalizedProjectPath = newProjectNameEndingInDotLtProj.replace(/\\/g, '/');
  
  console.log(`Initializing project with paths:
    - Script: ${initProjectScriptPath}
    - LT Maker Path: ${ltMakerPath}
    - Project NID: ${sluggify(projectName)}
    - Project Title: ${projectName}
    - Project Path: ${normalizedProjectPath}
  `);
  
  // Run the Python script and capture its output for debugging
  const { output, error } = await runPythonScript({
    pathToPythonScript: initProjectScriptPath,
    args: [
      sluggify(projectName),
      projectName,
      ltMakerPath,
      normalizedProjectPath,
    ],
  });
  
  console.log(`Python script output: ${output}`);
  
  if (error) {
    console.error(`Python script error: ${error}`);
    throw new Error(`Project initialization failed: Python script error: ${error}`);
  }
  
  // Check if the project directory was created
  const projectDirPath = getPathWithinLtMaker(normalizedProjectPath);
  try {
    const projectDirInfo = await Deno.stat(projectDirPath);
    console.log(`Project directory created: ${projectDirPath} (isDirectory: ${projectDirInfo.isDirectory})`);
    
    // List files in the project directory for debugging
    try {
      const entries = await Array.fromAsync(Deno.readDir(projectDirPath));
      console.log(`Files in project directory: ${entries.map(e => e.name).join(', ')}`);
    } catch (err) {
      console.error(`Failed to read project directory: ${err}`);
    }
  } catch (err) {
    console.error(`Project directory was not created at ${projectDirPath}`, err);
  }
  
  // Verify metadata.json was created
  const metadataPath = getPathWithinLtMaker(`${normalizedProjectPath}/metadata.json`);
  try {
    await Deno.stat(metadataPath);
    console.log(`Successfully created metadata.json at ${metadataPath}`);
  } catch (err) {
    console.error(`Failed to find metadata.json at ${metadataPath}`, err);
    
    // Try to inspect the create_new_project.py script to see if it's the issue
    try {
      const pythonScriptContent = await Deno.readTextFile(initProjectScriptPath);
      console.log(`Python script content first 500 chars: ${pythonScriptContent.substring(0, 500)}`);
    } catch (readErr) {
      console.error(`Failed to read Python script: ${readErr}`);
    }
    
    throw new Error(`Project initialization failed: metadata.json was not created for ${projectName}`);
  }

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

  // Remove portraits
  await removeWithinLtMaker({
    relativePath: `${newProjectNameEndingInDotLtProj}/resources/portraits`,
    preserveDirectory: true,
  });

  // Add generic villager portraits
  await copyGenericPortraitsToProject(newProjectNameEndingInDotLtProj);

  // Remove tilemaps
  await removeWithinLtMaker({
    relativePath: `${newProjectNameEndingInDotLtProj}/resources/tilemaps/tilemap_data`,
    preserveDirectory: true,
  });

  // Add all tilesets
  await removeWithinLtMaker({
    relativePath: `${newProjectNameEndingInDotLtProj}/resources/tilesets`,
    preserveDirectory: true,
  });
  await writeFileWithinLtMaker({
    relativePath: `${newProjectNameEndingInDotLtProj}/resources/tilesets/tileset.json`,
    text: "[]",
  });

  await copyTilesetsToProject(newProjectNameEndingInDotLtProj);
  await appendAllTilesetsData(newProjectNameEndingInDotLtProj);

  // Modify game settings to my liking
  await modifyConstant({
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    key: "turnwheel",
    newValue: false,
  });
  await modifyConstant({
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    key: "bexp",
    newValue: true,
  });
  await modifyConstant({
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    key: "auto_promote",
    newValue: true,
  });
  await modifyConstant({
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    key: "convoy_on_death",
    newValue: true,
  });
  await modifyConstant({
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    key: "info_menu_blink",
    newValue: true,
  });

  // Remove music that plays during battle
  await removeWithinLtMaker({
    relativePath: `${newProjectNameEndingInDotLtProj}/resources/music/Attack.ogg`,
  });
  await removeWithinLtMaker({
    relativePath: `${newProjectNameEndingInDotLtProj}/resources/music/Defense.ogg`,
  });

  // Add music for stub chapter
  await copyMusicAndUpdateJson({
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    music: ["memories-of-green"],
  });

  return {
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    gameNid,
  };
}

if (import.meta.main) {
  await initializeProject("My Project");
}