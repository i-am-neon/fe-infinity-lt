import { WeaponRank, WeaponType } from "@/types/character/weapon-type.ts";

const basicWeaponsMap: Record<WeaponType, Record<WeaponRank, string>> = {
  Sword: {
    E: "IronSword",
    D: "SteelSword",
    C: "SilverSword",
    B: "KillingEdge",
    A: "BraveSword",
    S: "Audhulma",
  },
  Lance: {
    E: "IronLance",
    D: "SteelLance",
    C: "SilverLance",
    B: "KillerLance",
    A: "BraveLance",
    S: "Vidofnir",
  },
  Axe: {
    E: "IronAxe",
    D: "SteelAxe",
    C: "SilverAxe",
    B: "KillerAxe",
    A: "BraveAxe",
    S: "Garm",
  },
  Bow: {
    E: "IronBow",
    D: "SteelBow",
    C: "SilverBow",
    B: "KillerBow",
    A: "BraveBow",
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
