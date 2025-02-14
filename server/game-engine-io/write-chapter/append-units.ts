import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import readOrCreateJSON from "@/game-engine-io/read-or-create-json.ts";
import { UnitData } from "../../types/character/unit-data.ts";

export async function appendSingleUnit({
  projectNameEndingInDotLtProj,
  newUnit,
}: {
  projectNameEndingInDotLtProj: string;
  newUnit: UnitData;
}): Promise<void> {
  const filePath = getPathWithinLtMaker(
    `${projectNameEndingInDotLtProj}/game_data/units.json`
  );

  const [units, wasFallback] = await readOrCreateJSON<UnitData[]>(
    filePath,
    [newUnit],
    projectNameEndingInDotLtProj
  );

  if (wasFallback) {
    return;
  }

  if (units.some((unit) => unit.nid === newUnit.nid)) {
    throw new Error(`Unit with nid ${newUnit.nid} already exists`);
  }

  units.push(newUnit);
  await Deno.writeTextFile(filePath, JSON.stringify(units, null, 2));
}

export default async function appendUnits({
  projectNameEndingInDotLtProj,
  newUnits,
}: {
  projectNameEndingInDotLtProj: string;
  newUnits: UnitData[];
}): Promise<void> {
  const filePath = getPathWithinLtMaker(
    `${projectNameEndingInDotLtProj}/game_data/units.json`
  );

  const [units, wasFallback] = await readOrCreateJSON<UnitData[]>(
    filePath,
    newUnits,
    projectNameEndingInDotLtProj
  );

  if (wasFallback) {
    return;
  }

  for (const newUnit of newUnits) {
    if (units.some((u) => u.nid === newUnit.nid)) {
      throw new Error(`Unit with nid ${newUnit.nid} already exists`);
    }
    units.push(newUnit);
  }

  await Deno.writeTextFile(filePath, JSON.stringify(units, null, 2));
}

if (import.meta.main) {
  (async () => {
    await appendSingleUnit({
      projectNameEndingInDotLtProj: "_test.ltproj",
      newUnit: {
        nid: "MyChar",
        name: "MyChar",
        desc: "My custom unit",
        variant: null,
        level: 1,
        klass: "Fighter",
        tags: [],
        bases: {
          HP: 20,
          STR: 5,
          MAG: 0,
          SKL: 5,
          SPD: 7,
          LCK: 3,
          DEF: 4,
          RES: 1,
          CON: 10,
          MOV: 5,
        },
        growths: {
          HP: 50,
          STR: 40,
          MAG: 10,
          SKL: 40,
          SPD: 40,
          LCK: 30,
          DEF: 20,
          RES: 15,
          CON: 0,
          MOV: 0,
        },
        stat_cap_modifiers: {},
        starting_items: [["Iron Axe", false]],
        learned_skills: [],
        unit_notes: [],
        wexp_gain: {
          Sword: [false, 0, 251],
          Lance: [false, 0, 251],
          Axe: [true, 1, 251],
          Bow: [false, 0, 251],
          Staff: [false, 0, 251],
          Light: [false, 0, 251],
          Anima: [false, 0, 251],
          Dark: [false, 0, 251],
          Default: [false, 0, 251],
        },
        alternate_classes: [],
        portrait_nid: "MyChar",
        affinity: "Fire",
        fields: [],
      },
    });
    console.log("Appended new unit successfully.");

    await appendUnits({
      projectNameEndingInDotLtProj: "_test.ltproj",
      newUnits: [
        {
          nid: "Char2",
          name: "Char2",
          desc: "Another custom unit",
          variant: null,
          level: 5,
          klass: "Archer",
          tags: [],
          bases: {
            HP: 18,
            STR: 6,
            MAG: 0,
            SKL: 7,
            SPD: 6,
            LCK: 2,
            DEF: 3,
            RES: 0,
            CON: 8,
            MOV: 5,
          },
          growths: {
            HP: 40,
            STR: 35,
            MAG: 10,
            SKL: 45,
            SPD: 30,
            LCK: 25,
            DEF: 20,
            RES: 10,
            CON: 0,
            MOV: 0,
          },
          stat_cap_modifiers: {},
          starting_items: [["Iron Bow", false]],
          learned_skills: [],
          unit_notes: [],
          wexp_gain: {
            Sword: [false, 0, 251],
            Lance: [false, 0, 251],
            Axe: [false, 0, 251],
            Bow: [true, 31, 251],
            Staff: [false, 0, 251],
            Light: [false, 0, 251],
            Anima: [false, 0, 251],
            Dark: [false, 0, 251],
            Default: [false, 0, 251],
          },
          alternate_classes: [],
          portrait_nid: "Char2",
          affinity: "Thunder",
          fields: [],
        },
      ],
    });
    console.log("Appended multiple new units successfully.");
  })();
}

