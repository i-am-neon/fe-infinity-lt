import { WeaponRank, WeaponType } from "@/types/character/weapon-type.ts";

const basicWeaponsMap: Record<WeaponType, Record<WeaponRank, string>> = {
  Sword: {
    E: "Iron_Sword",
    D: "Steel_Sword",
    C: "Silver_Sword",
    B: "KillingEdge",
    A: "BraveSword",
    S: "Audhulma",
  },
  Lance: {
    E: "Iron_Lance",
    D: "Steel_Lance",
    C: "Silver_Lance",
    B: "Killer_Lance",
    A: "Brave_Lance",
    S: "Vidofnir",
  },
  Axe: {
    E: "Iron_Axe",
    D: "Steel_Axe",
    C: "Silver_Axe",
    B: "Killer_Axe",
    A: "Brave_Axe",
    S: "Garm",
  },
  Bow: {
    E: "Iron_Bow",
    D: "Steel_Bow",
    C: "Silver_Bow",
    B: "Killer_Bow",
    A: "Brave_Bow",
    S: "Nidhogg",
  },
  Staff: {
    E: "Heal",
    D: "Mend",
    C: "Physic",
    B: "Recover",
    A: "Warp",
    S: "Latona",
  },
  Light: {
    E: "Lightning",
    D: "Shine",
    C: "Divine",
    B: "Purge",
    A: "Aura",
    S: "Ivaldi",
  },
  Anima: {
    E: "Fire",
    D: "Thunder",
    C: "Elfire",
    B: "Bolganone",
    A: "Fimbulvetr",
    S: "Excalibur",
  },
  Dark: {
    E: "Flux",
    D: "Nosferatu",
    C: "Eclipse",
    B: "Luna",
    A: "Fenrir",
    S: "Gleipnir",
  },
};

export default function getBasicWeapon(
  type: WeaponType,
  rank: WeaponRank
): [string, boolean] {
  const rankMap = basicWeaponsMap[type];
  if (!rankMap) {
    throw new Error(`No weapon data found for type ${type}`);
  }
  const nid = rankMap[rank];
  if (!nid) {
    throw new Error(`No basic weapon for type ${type} and rank ${rank}`);
  }
  return [nid, false];
}

if (import.meta.main) {
  console.log(getBasicWeapon("Sword", "A"));
}

