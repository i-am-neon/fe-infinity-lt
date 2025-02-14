import { FE8Class } from "@/types/fe8-class.ts";
import {
  classWeaponMap,
  weaponRankExpMap,
} from "@/ai/create-unit-data/get-weapon-exp.ts";
import filterWeapons from "./filter-weapons.ts";
import { WeaponOption } from "./get-all-weapon-options.ts";

export default function decideUnitWeapons({
  fe8Class,
  level,
  isPromoted,
}: {
  fe8Class: FE8Class;
  level: number;
  isPromoted: boolean;
}): [string, boolean][] {
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

  const chosenType =
    possibleWeaponTypes[Math.floor(Math.random() * possibleWeaponTypes.length)];
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

  const weapons: WeaponOption[] = [chosenWeapon];

  if (possibleWeaponTypes.length > 1) {
    let baseChance = 0.15 + Math.max(0, level - 5) * 0.02;
    if (isPromoted) {
      baseChance += 0.1;
    }
    if (Math.random() < baseChance) {
      const otherTypes = possibleWeaponTypes.filter((t) => t !== chosenType);
      if (otherTypes.length > 0) {
        const secondType =
          otherTypes[Math.floor(Math.random() * otherTypes.length)];
        const secondCandidates = filterWeapons({
          desiredType: secondType,
          minRank,
          maxRank,
        });
        if (secondCandidates.length) {
          const secondWeapon =
            secondCandidates[
              Math.floor(Math.random() * secondCandidates.length)
            ];
          weapons.push(secondWeapon);
        }
      }
    }
  }

  // Convert from WeaponOption to [weaponNid, false]
  return weapons.map((w) => [w.nid, false]);
}

if (import.meta.main) {
  const paladin = decideUnitWeapons({
    fe8Class: "Paladin",
    level: 7,
    isPromoted: true,
  });
  console.log("paladin", paladin);
  const fighter = decideUnitWeapons({
    fe8Class: "Fighter",
    level: 2,
    isPromoted: false,
  });
  console.log("fighter", fighter);
  const shaman = decideUnitWeapons({
    fe8Class: "Shaman",
    level: 12,
    isPromoted: false,
  });
  console.log("shaman", shaman);
}

