import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import readOrCreateJSON from "@/game-engine-io/read-or-create-json.ts";

export interface ModifyConstantOptions {
  projectNameEndingInDotLtProj: string;
  key: string;
  newValue: unknown;
}

export default async function modifyConstant({
  projectNameEndingInDotLtProj,
  key,
  newValue,
}: ModifyConstantOptions): Promise<void> {
  const filePath = getPathWithinLtMaker(
    `${projectNameEndingInDotLtProj}/game_data/constants.json`
  );

  const [constantsData, wasFallback] = await readOrCreateJSON<
    [string, unknown][]
  >(filePath, [], filePath);

  let found = false;
  for (const entry of constantsData) {
    if (entry[0] === key) {
      entry[1] = newValue;
      found = true;
      break;
    }
  }
  if (!found) {
    constantsData.push([key, newValue]);
  }

  if (!wasFallback) {
    await Deno.writeTextFile(filePath, JSON.stringify(constantsData, null, 2));
  }
}

/**
 * Updates both game_nid and title in the project's constants.json file.
 * Works with the array-of-arrays structure used in the LT engine.
 */
export async function updateProjectConstants({
  projectNameEndingInDotLtProj,
  gameNid,
  title,
}: {
  projectNameEndingInDotLtProj: string;
  gameNid: string;
  title: string;
}): Promise<void> {
  console.log(`Updating project constants for ${projectNameEndingInDotLtProj}:
    game_nid: ${gameNid}
    title: ${title}
  `);

  const filePath = getPathWithinLtMaker(
    `${projectNameEndingInDotLtProj}/game_data/constants.json`
  );

  try {
    // Read the current constants file
    const constantsText = await Deno.readTextFile(filePath);
    const constants = JSON.parse(constantsText) as Array<[string, any]>;

    // Update the game_nid and title values
    let gameNidUpdated = false;
    let titleUpdated = false;

    for (let i = 0; i < constants.length; i++) {
      const [key, value] = constants[i];
      
      if (key === "game_nid") {
        constants[i] = ["game_nid", gameNid];
        gameNidUpdated = true;
        console.log(`Updated game_nid constant to: ${gameNid}`);
      } else if (key === "title") {
        constants[i] = ["title", title];
        titleUpdated = true;
        console.log(`Updated title constant to: ${title}`);
      }
    }

    // If any key wasn't found, add it
    if (!gameNidUpdated) {
      constants.push(["game_nid", gameNid]);
      console.log(`Added game_nid constant: ${gameNid}`);
    }
    
    if (!titleUpdated) {
      constants.push(["title", title]);
      console.log(`Added title constant: ${title}`);
    }

    // Write the updated constants back to the file
    await Deno.writeTextFile(filePath, JSON.stringify(constants, null, 2));
    console.log(`Constants updated successfully for ${projectNameEndingInDotLtProj}`);

    // Verify the update
    try {
      const verifyText = await Deno.readTextFile(filePath);
      const verifyConstants = JSON.parse(verifyText) as Array<[string, any]>;
      
      for (const [key, value] of verifyConstants) {
        if (key === "game_nid") {
          console.log(`Verified game_nid: ${value}`);
        } else if (key === "title") {
          console.log(`Verified title: ${value}`);
        }
      }
    } catch (err) {
      console.error(`Error verifying constants update: ${err}`);
    }

    return;
  } catch (err) {
    console.error(`Error updating project constants: ${err}`);
    throw new Error(`Failed to update project constants: ${err}`);
  }
}

if (import.meta.main) {
  // Example usage
  modifyConstant({
    projectNameEndingInDotLtProj: "_blood-and-blight.ltproj",
    key: "turnwheel",
    newValue: false,
  }).then(() => {
    console.log("Constant updated successfully.");
  });
}
