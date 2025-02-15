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
