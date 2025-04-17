import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import readOrCreateJSON from "@/game-engine-io/read-or-create-json.ts";

export interface ModifyEquationOptions {
  projectNameEndingInDotLtProj: string;
  nid: string;
  newExpression: string;
}

export default async function modifyEquation({
  projectNameEndingInDotLtProj,
  nid,
  newExpression,
}: ModifyEquationOptions): Promise<void> {
  const filePath = getPathWithinLtMaker(
    `${projectNameEndingInDotLtProj}/game_data/equations.json`
  );

  const [equationsData, wasFallback] = await readOrCreateJSON<
    { nid: string; expression: string }[]
  >(filePath, [], filePath);

  let found = false;
  for (const entry of equationsData) {
    if (entry.nid === nid) {
      entry.expression = newExpression;
      found = true;
      break;
    }
  }
  if (!found) {
    equationsData.push({ nid, expression: newExpression });
  }

  if (!wasFallback) {
    await Deno.writeTextFile(filePath, JSON.stringify(equationsData, null, 2));
  }
}

if (import.meta.main) {
  modifyEquation({
    projectNameEndingInDotLtProj: "_the-grand-tourney.ltproj",
    nid: "MEND",
    newExpression: "MAG + 20",
  }).then(() => {
    console.log("Equation updated successfully.");
  });
}