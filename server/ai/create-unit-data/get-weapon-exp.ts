import { FE8Class } from "@/types/fe8-class.ts";
import { WeaponType } from "@/types/character/weapon-type.ts";

/*
 This function returns the wexp_gain object for a unit with the given FE8 class, level, and promotion status.
 
 We define a classWeaponMap listing the weapon types each class may wield.
 Our simple rank logic:
   - If unpromoted:
       if level < 10 => rank = E (1)
       else => rank = D (31)
   - If promoted:
       if level < 5 => rank = D (31)
       else => rank = C (71)

 Then for each weapon type in that class’s array,
 we set its experience to [true, rankExpValue, 251].
 For weapon types not in that class’s array, we set [false, 0, 251].
*/

type WeaponExperience = [boolean, number, number];

export default function getWeaponExp({
  className,
  level,
  isPromoted,
}: {
  className: FE8Class;
  level: number;
  isPromoted: boolean;
}): {
  Sword: WeaponExperience;
  Lance: WeaponExperience;
  Axe: WeaponExperience;
  Bow: WeaponExperience;
  Staff: WeaponExperience;
  Light: WeaponExperience;
  Anima: WeaponExperience;
  Dark: WeaponExperience;
  Default: WeaponExperience;
} {
  // Master map for class => list of weapon types
  const classWeaponMap: Record<FE8Class, WeaponType[]> = {
    Citizen: [],
    Dancer: [],
    Myrmidon: ["Sword"],
    Mercenary: ["Sword"],
    Thief: ["Sword"],
    Rogue: ["Sword"],
    Recruit: ["Lance"],
    Soldier: ["Lance"],
    Cavalier: ["Sword", "Lance"],
    "Pegasus Knight": ["Lance"],
    Journeyman: ["Axe"],
    Fighter: ["Axe"],
    Warrior: ["Axe", "Bow"],
    Pirate: ["Axe"],
    Brigand: ["Axe"],
    Archer: ["Bow"],
    Ranger: ["Bow", "Sword"],
    Monk: ["Light"],
    Cleric: ["Staff"],
    Mage: ["Anima"],
    Shaman: ["Dark"],
    Troubadour: ["Staff", "Anima"],
    Valkyrie: ["Staff", "Light"],
    "Wyvern Rider": ["Lance"],
    Revenant: [],
    Entombed: [],
    "Sword Wight": ["Sword"],
    "Bow Wight": ["Bow"],
    Mogall: ["Dark"],
    Manakete: [],

    // Promoted classes:
    Swordmaster: ["Sword"],
    Hero: ["Sword", "Axe"],
    Assassin: ["Sword"],
    Paladin: ["Sword", "Lance"],
    "Great Knight": ["Sword", "Lance", "Axe"],
    Falcoknight: ["Sword", "Lance"],
    Knight: ["Lance"],
    General: ["Sword", "Lance", "Axe"],
    Berserker: ["Axe"],
    Sniper: ["Bow"],
    Bishop: ["Staff", "Light"],
    Sage: ["Anima", "Staff"],
    "Mage Knight": ["Anima", "Staff"],
    "Wyvern Lord": ["Lance", "Axe"],
    "Wyvern Knight": ["Lance"],
    Necromancer: ["Dark", "Anima"],
    "Sword Bonewalker": ["Sword"],
    "Bow Bonewalker": ["Bow"],
    "Arch Mogall": ["Dark"],
  };

  // Decide the base rank
  let rankExpVal = 1; // E rank
  if (!isPromoted) {
    rankExpVal = level < 10 ? weaponRankExpMap.E : weaponRankExpMap.D;
  } else {
    rankExpVal = level < 5 ? weaponRankExpMap.D : weaponRankExpMap.C;
  }

  const usableWeapons = classWeaponMap[className] || [];

  function wexpFor(weapon: WeaponType): WeaponExperience {
    if (usableWeapons.includes(weapon)) {
      return [true, rankExpVal, 251];
    }
    return [false, 0, 251];
  }

  return {
    Sword: wexpFor("Sword"),
    Lance: wexpFor("Lance"),
    Axe: wexpFor("Axe"),
    Bow: wexpFor("Bow"),
    Staff: wexpFor("Staff"),
    Light: wexpFor("Light"),
    Anima: wexpFor("Anima"),
    Dark: wexpFor("Dark"),
    Default: [false, 0, 251],
  };
}

export const weaponRankExpMap = {
  E: 1,
  D: 31,
  C: 71,
  B: 121,
  A: 181,
  S: 251,
};

if (import.meta.main) {
  // Quick test
  console.log(
    "Myrmidon: ",
    getWeaponExp({ className: "Myrmidon", level: 1, isPromoted: false })
  );
  console.log(
    "Monk: ",
    getWeaponExp({ className: "Monk", level: 10, isPromoted: false })
  );
  console.log(
    "Great Knight:",
    getWeaponExp({ className: "Great Knight", level: 15, isPromoted: true })
  );
}

