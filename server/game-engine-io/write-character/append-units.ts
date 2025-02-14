import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import readOrCreateJSON from "@/game-engine-io/read-or-create-json.ts";
import { stubCharacterCedric } from "@/test-data/stub-characters.ts";
import { UnitData } from "@/types/character/unit-data.ts";

export async function appendUnit({
  projectNameEndingInDotLtProj,
  unitData,
}: {
  projectNameEndingInDotLtProj: string;
  unitData: UnitData;
}): Promise<void> {
  const filePath = getPathWithinLtMaker(
    `${projectNameEndingInDotLtProj}/game_data/units.json`
  );

  const [units, wasFallback] = await readOrCreateJSON<UnitData[]>(
    filePath,
    [unitData],
    projectNameEndingInDotLtProj
  );

  if (wasFallback) {
    return;
  }

  if (units.some((unit) => unit.nid === unitData.nid)) {
    throw new Error(`Unit with nid ${unitData.nid} already exists`);
  }

  units.push(unitData);
  await Deno.writeTextFile(filePath, JSON.stringify(units, null, 2));
}

if (import.meta.main) {
  (async () => {
    await appendUnit({
      projectNameEndingInDotLtProj: "_test.ltproj",
      unitData: stubCharacterCedric.unitData,
    });
    console.log("Appended new unit successfully.");
  })();
}

