import { weaponRankExpMap } from "@/ai/create-unit-data/get-weapon-exp.ts";

/**
 * Determines which weapon ranks are available based on chapter progression
 */
function getAllowedRanks(
  chapter: number
): Array<keyof typeof weaponRankExpMap> {
  if (chapter <= 8) {
    return ["E", "D"];
  } else if (chapter <= 12) {
    return ["D", "C"];
  } else if (chapter <= 16) {
    return ["D", "C", "B"];
  } else if (chapter <= 20) {
    return ["C", "B", "A"];
  } else {
    return ["B", "A", "S"];
  }
}

/**
 * Decides what items are available in an armory shop based on the chapter number.
 * Returns a set of standard weapons based on rank, plus some chance of special weapons.
 * Also returns stock information: -1 for unlimited, positive number for limited stock.
 */
export default function decideArmoryItems(chapterNumber: number): [string, number][] {
  const allowedRanks = getAllowedRanks(chapterNumber);
  const itemList: [string, number][] = [];

  // Standard melee weapons by rank (unlimited stock)
  if (allowedRanks.includes("E")) {
    itemList.push(["Iron_Sword", -1], ["Iron_Lance", -1], ["Iron_Axe", -1], ["Slim_Sword", -1]);
  }

  if (allowedRanks.includes("D")) {
    itemList.push(["Steel_Sword", -1], ["Steel_Lance", -1], ["Steel_Axe", -1], ["Iron_Blade", -1]);
  }

  if (allowedRanks.includes("C")) {
    itemList.push(["Steel_Blade", -1], ["Brave_Sword", -1]);
  }

  if (allowedRanks.includes("B")) {
    // B-rank typically includes specialized weapons
    const specializedWeapons = [
      "Wyrmslayer",
      "Lancereaver",
      "Axereaver",
      "Swordreaver",
    ];
    // Add 1-2 specialized weapons
    for (let i = 0; i < Math.min(2, specializedWeapons.length); i++) {
      itemList.push([specializedWeapons[i], -1]);
    }
  }

  if (allowedRanks.includes("A")) {
    itemList.push(["Silver_Sword", -1], ["Silver_Lance", -1], ["Silver_Axe", -1]);
  }

  // Standard ranged weapons (unlimited stock)
  if (allowedRanks.includes("E")) {
    itemList.push(["Iron_Bow", -1], ["Javelin", -1], ["Hand_Axe", -1]);
  }

  if (allowedRanks.includes("D")) {
    itemList.push(["Steel_Bow", -1]);
  }

  if (allowedRanks.includes("C")) {
    itemList.push(["Short_Spear", -1]);
  }

  if (allowedRanks.includes("B")) {
    // 50% chance to add these rarer B-rank weapons
    if (Math.random() > 0.5) {
      itemList.push(["Longbow", -1]);
    }
  }

  if (allowedRanks.includes("A")) {
    itemList.push(["Silver_Bow", -1]);
    // Add advanced throwing weapons with 50% chance
    if (Math.random() > 0.5) {
      const advancedThrowing = ["Spear", "Tomahawk"];
      itemList.push(
        [advancedThrowing[Math.floor(Math.random() * advancedThrowing.length)], -1]
      );
    }
  }

  // Now add 1-2 randomized special weapons based on chapter progression
  const numSpecial = Math.floor(Math.random() * 2) + 1;
  const specialWeapons: string[] = [];

  // Weapons that counter specific unit types
  if (chapterNumber >= 4) {
    specialWeapons.push("Armorslayer", "Heavy_Spear", "Hammer");
  }

  if (chapterNumber >= 6) {
    specialWeapons.push("Horseslayer", "Halberd", "Zanbato");
  }

  // Brave weapons in later chapters
  if (chapterNumber >= 12) {
    specialWeapons.push(
      "Killer_Bow",
      "Killing_Edge",
      "Killer_Lance",
      "Killer_Axe"
    );
  }

  // Magic weapons in later chapters
  if (chapterNumber >= 14) {
    specialWeapons.push("Light_Brand", "Wind_Sword", "Runesword");
  }

  if (chapterNumber >= 18) {
    specialWeapons.push(
      "Brave_Sword",
      "Brave_Lance",
      "Brave_Axe",
      "Brave_Bow",
      "Silver_Blade"
    );
  }

  // Shuffle and select random special weapons
  for (let i = specialWeapons.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [specialWeapons[i], specialWeapons[j]] = [
      specialWeapons[j],
      specialWeapons[i],
    ];
  }

  // Add selected special weapons (limited stock of 1)
  for (let i = 0; i < Math.min(numSpecial, specialWeapons.length); i++) {
    itemList.push([specialWeapons[i], 1]);
  }

  return itemList;
}

if (import.meta.main) {
  console.log("Chapter 1 Armory:", decideArmoryItems(1));
  console.log("Chapter 8 Armory:", decideArmoryItems(8));
  console.log("Chapter 15 Armory:", decideArmoryItems(15));
  console.log("Chapter 22 Armory:", decideArmoryItems(22));
}