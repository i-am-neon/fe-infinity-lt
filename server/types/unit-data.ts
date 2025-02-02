import { FE8Class } from "@/types/fe8-class.ts";

type WeaponExperience = [boolean, number, number]; // [Usable, Starting Exp, Max Exp]. Max Exp is always 251
// Weapon Rank Progression Totals: 0: not usable. E: 1, D: 31, C: 71, B: 121, A: 181, S: 251
// For example, Weapon Level "E": [true, 1, 251]
// For example, Weapon Level "D": [true, 31, 251], and so on.
// If the weapon is usable, it must be at least level "E".

export type UnitData = {
  nid: string; // Should exactly match name
  name: string;
  desc: string; // Should exactly match provided description
  variant: string | null; // Should always be null
  level: number; // The level the character starts at when first seen in game. Should be in line with the given chapter number (the whole game has 10 chapters)
  // "klass": Should match the class name exactly from the provided list of options
  klass: FE8Class;
  tags: string[]; // Should always be an empty list
  bases: {
    // Should be in line with Fire Emblem 8 base stats given the unit's level
    HP: number;
    STR: number;
    MAG: number;
    SKL: number;
    SPD: number;
    LCK: number;
    DEF: number;
    RES: number;
    CON: number;
    MOV: number;
  };
  growths: {
    // Should be in line with Fire Emblem 8 growth rates given the unit's level
    HP: number;
    STR: number;
    MAG: number;
    SKL: number;
    SPD: number;
    LCK: number;
    DEF: number;
    RES: number;
    CON: number;
    MOV: number;
  };
  stat_cap_modifiers: Record<string, number>; // Should always be an empty object
  starting_items: [string, boolean][]; // [name, isDroppable]. Name should match the item names exactly from the provided list of options. A unit can only have droppable items isEnemy = true
  learned_skills: string[]; // Should always be an empty list
  unit_notes: string[]; // Should always be an empty list
  wexp_gain: {
    // Usable weapons should match if the class can use them, same rules as FE8. See below list of "Class Weapons"
    // If the class has usable weapons, it should show up as usable here even if they aren't holding a weapon of that type.
    // Should be in line with the character's level and if they are a promoted class or not
    Sword: WeaponExperience;
    Lance: WeaponExperience;
    Axe: WeaponExperience;
    Bow: WeaponExperience;
    Staff: WeaponExperience;
    Light: WeaponExperience;
    Anima: WeaponExperience;
    Dark: WeaponExperience;
    Default: WeaponExperience; // Should always be [false, 0, 251]
  };
  alternate_classes: string[]; // Should always be an empty list
  portrait_nid: string; // Should exactly match name
  affinity: string; // Should exactly match one: Anima, Dark, Fire, Ice, Light, Thunder, Wind
  fields: string[]; // Should always be an empty list
};

