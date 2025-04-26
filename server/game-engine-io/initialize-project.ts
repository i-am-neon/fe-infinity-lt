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
import modifyConstant, { updateProjectConstants } from "@/game-engine-io/modify-constant.ts";
import { copyMusicAndUpdateJson } from "@/game-engine-io/write-chapter/copy-music.ts";
import copyGenericPortraitsToProject from "@/file-io/copy-generic-portraits-to-project.ts";
import modifyEquation from "@/game-engine-io/modify-equation.ts";
import modifyItem from "@/game-engine-io/modify-item.ts";
import { isElectronEnvironment } from "@/lib/env-detector.ts";
import { appendTranslations } from "@/game-engine-io/write-chapter/append-translations.ts";
import createNewProject from "@/game-engine-io/create-new-project.ts";

export default async function initializeProject(projectName: string) {
  const newProjectNameEndingInDotLtProj = `_${sluggify(projectName)}.ltproj`;
  const gameNid = "_" + sluggify(projectName);

  console.log(`Initializing project:
    Project Name: ${projectName}
    Slugified Name: ${sluggify(projectName)}
    Project Path: ${newProjectNameEndingInDotLtProj}
    Game NID: ${gameNid}
  `);

  // Get the lt-maker path and ensure it uses forward slashes for Wine compatibility
  const ltMakerPath = getLtMakerPath().replace(/\\/g, '/');

  // Normalize the project path to use forward slashes
  const normalizedProjectPath = newProjectNameEndingInDotLtProj.replace(/\\/g, '/');

  // Simplify arguments for Wine compatibility when in Electron
  // Wine has issues with complex paths and quotes, so we'll use simpler values
  const projectNid = sluggify(projectName);

  // Remove special characters and quotes from the title for safety in Windows Electron
  const sanitizedTitle = isElectronEnvironment() && Deno.build.os === "windows" 
    ? projectName.replace(/["']/g, '').trim() 
    : projectName;

  console.log(`Initializing project with paths:
    - LT Maker Path: ${ltMakerPath}
    - Project NID: ${projectNid}
    - Project Title: ${sanitizedTitle}
    - Project Path: ${normalizedProjectPath}
  `);

  try {
    // Call our TypeScript implementation instead of Python script
    await createNewProject(
      projectNid,
      sanitizedTitle,
      ltMakerPath,
      normalizedProjectPath
    );

    // Directly update the constants.json file with our new function
    // This is a more reliable approach than using the Python serialization
    console.log("Directly updating game_nid and title in constants.json...");
    await updateProjectConstants({
      projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
      gameNid: projectNid,
      title: sanitizedTitle,
    });
  } catch (error: unknown) {
    console.error(`Project initialization failed: ${error}`);
    if (error instanceof Error) {
      throw new Error(`Project initialization failed: ${error.message}`);
    } else {
      throw new Error(`Project initialization failed: ${String(error)}`);
    }
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
    throw new Error(`Project initialization failed: metadata.json was not created for ${projectName}`);
  }

  // Verify game_nid and title were correctly set in constants.json
  const constantsPath = getPathWithinLtMaker(`${normalizedProjectPath}/game_data/constants.json`);
  try {
    const constantsText = await Deno.readTextFile(constantsPath);
    const constants = JSON.parse(constantsText) as Array<[string, any]>;
    
    let foundGameNid;
    let foundTitle;
    
    for (const [key, value] of constants) {
      if (key === "game_nid") {
        foundGameNid = value;
      } else if (key === "title") {
        foundTitle = value;
      }
    }
    
    console.log(`Constants verification:
      Found game_nid: ${foundGameNid} (expected: ${projectNid})
      Found title: ${foundTitle} (expected: ${sanitizedTitle})
    `);
    
    // If values don't match, update them again as a fallback
    if (foundGameNid !== projectNid || foundTitle !== sanitizedTitle) {
      console.warn(`Constants verification failed! Attempting to update constants again...`);
      await updateProjectConstants({
        projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
        gameNid: projectNid,
        title: sanitizedTitle,
      });
    }
  } catch (err) {
    console.error(`Error verifying constants.json: ${err}`);
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

  // Fix staff equations
  await modifyEquation({
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    nid: "HEAL",
    newExpression: "MAG + 10",
  })
  await modifyEquation({
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    nid: "MEND",
    newExpression: "MAG + 20",
  })
  await modifyEquation({
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    nid: "PHYSIC",
    newExpression: "MAG + 15",
  })
  // Apply staff equations to items
  try {
    await modifyItem({
      projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
      nid: "Mend",
      componentKey: "equation_heal",
      newValue: "MEND",
    });
  } catch (error) {
    console.log(`Skipping Mend item modification: ${error}`);
  }

  try {
    await modifyItem({
      projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
      nid: "Physic",
      componentKey: "equation_heal",
      newValue: "PHYSIC",
    });
  } catch (error) {
    console.log(`Skipping Physic item modification: ${error}`);
  }

  // Make Shamshir available for thieves and rogues
  try {
    await modifyItem({
      projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
      nid: "Shamshir",
      componentKey: "prf_class",
      newValue: [
        "Myrmidon",
        "Swordmaster",
        "Eirika_Lord",
        "Assassin",
        "Sword_Bonewalker",
        "Sword_Wight",
        "Thief",
        "Rogue",
      ],
    });
  } catch (error) {
    console.log(`Skipping Shamshir item modification: ${error}`);
  }

  // remove "_attribution" from title screen
  await appendTranslations({
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    newTranslations: [
      { nid: "_attribution", text: "" },
    ],
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