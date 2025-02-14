import {
  FE8Class,
  UnpromotedFE8Classes,
  PromotedFE8Classes,
  PromotedFE8Class,
} from "@/types/fe8-class.ts";
import getWeaponExp from "@/ai/create-unit-data/get-weapon-exp.ts";
import { WeaponType } from "@/types/character/weapon-type.ts";

// Define a WeaponRank type. We'll keep it simpler: S, A, B, C, D, E, or None
export type WeaponRank = "S" | "A" | "B" | "C" | "D" | "E" | "None";

export type ClassOption = {
  name: FE8Class;
  description: string;
  movementGroup: string;
  promotionLevel: "unpromoted" | "promoted";
  tags: string[];
  usableWeapons: {
    type: WeaponType;
    rank: WeaponRank;
  }[];
};

// Determines the rank from a numeric wexp value.
function getWeaponRank(wexpValue: number): WeaponRank {
  if (wexpValue >= 251) return "S";
  if (wexpValue >= 181) return "A";
  if (wexpValue >= 121) return "B";
  if (wexpValue >= 71) return "C";
  if (wexpValue >= 31) return "D";
  if (wexpValue >= 1) return "E";
  return "None";
}

// Basic movement group assumption
function getMovementGroup(fe8Class: FE8Class): string {
  // Example approach. Adjust as needed:
  const flying = [
    "Pegasus Knight",
    "Falcoknight",
    "Wyvern Rider",
    "Wyvern Lord",
    "Wyvern Knight",
    "Arch Mogall",
  ];
  const mounted = [
    "Cavalier",
    "Paladin",
    "Great Knight",
    "Troubadour",
    "Valkyrie",
    "Ranger",
    "Mage Knight",
  ];
  if (flying.includes(fe8Class)) return "flying";
  if (mounted.includes(fe8Class)) return "mounted";
  return "foot";
}

function getDescription(fe8Class: FE8Class): string {
  // You can map descriptions if needed, but for now just return fe8Class
  // or parse from the big string in fe8-class if you prefer
  return fe8Class;
}

function isPromotedClass(cls: FE8Class): cls is PromotedFE8Class {
  return (PromotedFE8Classes as readonly FE8Class[]).includes(cls);
}

export function getAllClassOptions(): ClassOption[] {
  const allClasses: FE8Class[] = [
    ...UnpromotedFE8Classes,
    ...PromotedFE8Classes,
  ];

  return allClasses.map((cls) => {
    const promotionLevel = isPromotedClass(cls) ? "promoted" : "unpromoted";
    // We'll do a quick weaponExp usage with hypothetical level=1
    // If class is promoted, assume level=1 but isPromoted=true
    const wexp = getWeaponExp({
      className: cls,
      level: 1,
      isPromoted: promotionLevel === "promoted",
    });

    const usableWeapons: { type: WeaponType; rank: WeaponRank }[] = [];
    for (const [weaponType, [canUse, wexpValue]] of Object.entries(wexp)) {
      if (canUse && weaponType !== "Default") {
        // ensure type is valid
        if (
          weaponType === "Sword" ||
          weaponType === "Lance" ||
          weaponType === "Axe" ||
          weaponType === "Bow" ||
          weaponType === "Staff" ||
          weaponType === "Light" ||
          weaponType === "Anima" ||
          weaponType === "Dark"
        ) {
          usableWeapons.push({
            type: weaponType,
            rank: getWeaponRank(wexpValue),
          });
        }
      }
    }

    return {
      name: cls,
      description: getDescription(cls),
      movementGroup: getMovementGroup(cls),
      promotionLevel,
      tags: [],
      usableWeapons,
    };
  });
}

if (import.meta.main) {
  const allOptions = getAllClassOptions();
  console.log("allOptions", JSON.stringify(allOptions, null, 2));
}

