import { FE8Class } from "@/types/fe8-class.ts";
import {
  classWeaponMap,
  weaponRankExpMap,
} from "@/ai/create-unit-data/get-weapon-exp.ts";
import filterWeapons from "./filter-weapons.ts";
import { WeaponOption } from "./get-all-weapon-options.ts";

export default function decideGenericUnitWeapons({
  fe8Class,
  level,
  isPromoted,
}: {
  fe8Class: FE8Class;
  level: number;
  isPromoted: boolean;
}): WeaponOption[] {
  let rankExpVal = 1;
  if (!isPromoted) {
    rankExpVal = level < 10 ? weaponRankExpMap.E : weaponRankExpMap.D;
  } else {
    rankExpVal = level < 5 ? weaponRankExpMap.D : weaponRankExpMap.C;
  }

  const possibleWeaponTypes = classWeaponMap[fe8Class] || [];
  if (!possibleWeaponTypes.length) {
    return [];
  }

  // Pick 1 weapon type at random from the possible types
  const chosenType =
    possibleWeaponTypes[Math.floor(Math.random() * possibleWeaponTypes.length)];

  // Map the rankExpVal back to a rank key
  const ranksArr = [
    "E",
    "D",
    "C",
    "B",
    "A",
    "S",
  ] as (keyof typeof weaponRankExpMap)[];
  let rankIndex = ranksArr.findIndex((r) => weaponRankExpMap[r] === rankExpVal);
  if (rankIndex === -1) rankIndex = 0;

  const minRank = ranksArr[rankIndex];
  const maxRank = ranksArr[rankIndex];

  const candidateWeapons = filterWeapons({
    desiredType: chosenType,
    minRank,
    maxRank,
  });
  if (!candidateWeapons.length) {
    return [];
  }

  const chosenWeapon =
    candidateWeapons[Math.floor(Math.random() * candidateWeapons.length)];
  return [chosenWeapon];
}

if (import.meta.main) {
  const example = decideGenericUnitWeapons({
    fe8Class: "Paladin",
    level: 7,
    isPromoted: true,
  });
  console.log("Decided weapons for a level 7 Knight:", example);
}

