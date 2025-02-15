import {
  classWeaponMap,
  weaponRankExpMap,
} from "@/ai/create-unit-data/get-weapon-exp.ts";
import { FE8Class } from "@/types/fe8-class.ts";
import filterWeapons from "./filter-weapons.ts";
import getBasicWeapon from "./get-basic-weapon.ts";

export default function decideUnitWeapons({
  fe8Class,
  level,
  isPromoted,
}: {
  fe8Class: FE8Class;
  level: number;
  isPromoted: boolean;
}): [string, boolean][] {
  // Determine rank for basic weapon
  let rank: keyof typeof weaponRankExpMap = "E";
  if (!isPromoted) {
    rank = level < 10 ? "E" : "D";
  } else {
    rank = level < 5 ? "D" : "C";
  }

  const possibleWeaponTypes = classWeaponMap[fe8Class] || [];
  if (!possibleWeaponTypes.length) {
    return [];
  }

  // Always give one basic weapon from getBasicWeapon
  const chosenType =
    possibleWeaponTypes[Math.floor(Math.random() * possibleWeaponTypes.length)];
  const [basicNid] = getBasicWeapon(chosenType, rank);
  const weapons: [string, boolean][] = [[basicNid, false]];

  // Chance to add another basic weapon if multiple weapon types
  if (possibleWeaponTypes.length > 1) {
    let baseChance = 0.15;
    if (isPromoted) {
      baseChance += 0.1;
    }
    if (level > 5) {
      // Increase chance the higher the level, up to some max
      baseChance += Math.min(0.05 * (level - 5), 0.3);
    }
    if (Math.random() < baseChance) {
      const otherTypes = possibleWeaponTypes.filter((t) => t !== chosenType);
      if (otherTypes.length) {
        const secondType =
          otherTypes[Math.floor(Math.random() * otherTypes.length)];
        const [secondBasicNid] = getBasicWeapon(secondType, rank);
        weapons.push([secondBasicNid, false]);
      }
    }
  }

  // 0-2 extra random weapons from filterWeapons, excluding the basic(s)
  let extraCount = 0;
  const baseExtraChance = isPromoted ? 0.4 : 0.2;
  if (Math.random() < baseExtraChance) extraCount++;
  if (Math.random() < baseExtraChance / 2) extraCount++;

  // Gather all valid weapons from filterWeapons for each type
  // only including rank=rank
  const allCandidates = possibleWeaponTypes.flatMap((t) =>
    filterWeapons({
      desiredType: t,
      minRank: rank,
      maxRank: rank,
    })
  );

  // exclude any we've already included
  const existing = new Set(weapons.map((w) => w[0]));
  const extraPool = allCandidates.filter((c) => !existing.has(c.nid));

  for (let i = 0; i < extraCount; i++) {
    if (!extraPool.length) break;
    const randIndex = Math.floor(Math.random() * extraPool.length);
    weapons.push([extraPool[randIndex].nid, false]);
    extraPool.splice(randIndex, 1);
  }

  // Convert from WeaponOption to [weaponNid, false]
  return weapons;
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

