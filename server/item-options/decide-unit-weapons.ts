import {
  classWeaponMap,
  weaponRankExpMap,
} from "@/ai/create-unit-data/get-weapon-exp.ts";
import { specialWeaponNids } from "@/item-options/special-weapons.ts";
import { FE8Class } from "@/types/fe8-class.ts";
import filterWeapons from "./filter-weapons.ts";
import getBasicWeapon from "./get-basic-weapon.ts";

// Monster class to weapon mapping
const monsterWeaponMap: Partial<Record<FE8Class, string[]>> = {
  Mogall: ["Evil_Eye"],
  "Arch Mogall": ["Crimson_Eye"],
  Manakete: ["Dragonstone"],
};

// Get appropriate claw based on level
function getClawByLevel(level: number, isPromoted: boolean): string {
  const effectiveLevel = isPromoted ? level + 20 : level;

  if (effectiveLevel < 10) {
    return "Rotten_Claw";
  } else if (effectiveLevel < 20) {
    return "Fetid_Claw";
  } else {
    return "Sharp_Claw";
  }
}

export default function decideUnitWeapons({
  fe8Class,
  level,
  isPromoted,
  isBoss = false,
}: {
  fe8Class: FE8Class;
  level: number;
  isPromoted: boolean;
  isBoss?: boolean;
}): [string, boolean][] {
  // Initialize weapons array
  const weapons: [string, boolean][] = [];

  // Handle monster classes
  if (fe8Class === "Revenant" || fe8Class === "Entombed") {
    const clawType = getClawByLevel(level, isPromoted);
    weapons.push([clawType, isBoss]);
    return weapons;
  }

  // Check if the class is another type of monster with specific weapons
  if (monsterWeaponMap[fe8Class]) {
    const monsterWeapons = monsterWeaponMap[fe8Class]!;
    const weaponChoice =
      monsterWeapons[Math.floor(Math.random() * monsterWeapons.length)];
    weapons.push([weaponChoice, isBoss]);
    return weapons;
  }

  // Handle regular classes
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
  weapons.push([basicNid, false]);

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

  // Now determine which weapon should be droppable
  // First, check if there are any special weapons in the list
  const specialWeapons = weapons.filter(([nid]) =>
    specialWeaponNids.includes(nid)
  );

  // If there are special weapons, give them priority for being droppable
  if (specialWeapons.length > 0) {
    // Calculate chance based on whether it's a boss
    const dropChance = isBoss ? 0.6 : 0.3;
    if (Math.random() < dropChance) {
      // Randomly choose one special weapon to be droppable
      const randomIndex = Math.floor(Math.random() * specialWeapons.length);
      const specialWeaponNid = specialWeapons[randomIndex][0];

      // Mark the special weapon as droppable
      for (let i = 0; i < weapons.length; i++) {
        if (weapons[i][0] === specialWeaponNid) {
          weapons[i] = [weapons[i][0], true];
          break;
        }
      }

      // Return with one special weapon droppable
      return weapons;
    }
  }

  // If no special weapons or they weren't chosen to be droppable, check normal weapons for generics
  if (!isBoss) {
    // 30% chance for a normal weapon to be droppable for generics
    if (Math.random() < 0.3) {
      // Randomly choose one weapon to be droppable
      const randomIndex = Math.floor(Math.random() * weapons.length);
      weapons[randomIndex] = [weapons[randomIndex][0], true];
    }
  }

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
  const bossShaman = decideUnitWeapons({
    fe8Class: "Shaman",
    level: 12,
    isPromoted: false,
    isBoss: true,
  });
  console.log("bossShaman", bossShaman);
  const entombed = decideUnitWeapons({
    fe8Class: "Entombed",
    level: 1,
    isPromoted: false,
  });
  console.log("entombed", entombed);
}

