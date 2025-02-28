import { weaponRankExpMap } from "@/ai/create-unit-data/get-weapon-exp.ts";

/**
 * Determines which magic/staff ranks are available based on chapter progression
 */
function getAllowedRanks(
  chapter: number
): Array<keyof typeof weaponRankExpMap> {
  if (chapter <= 6) {
    return ["E", "D"];
  } else if (chapter <= 10) {
    return ["D", "C"];
  } else if (chapter <= 14) {
    return ["D", "C", "B"];
  } else if (chapter <= 18) {
    return ["C", "B", "A"];
  } else {
    return ["B", "A", "S"];
  }
}

/**
 * Decides what items are available in a vendor shop based on the chapter number.
 * Returns a standard set of consumables, staves, and magic tomes, plus some chance
 * of special items appropriate for the chapter.
 * Also returns stock information: -1 for unlimited, positive number for limited stock.
 */
export default function decideVendorItems(chapterNumber: number): [string, number][] {
  const allowedRanks = getAllowedRanks(chapterNumber);
  const itemList: [string, number][] = [];

  // Standard healing and utility items (always available, unlimited stock)
  itemList.push(["Vulnerary", -1], ["Antitoxin", -1], ["Door_Key", -1], ["Chest_Key", -1]);

  // Better healing items in later chapters (unlimited stock)
  if (chapterNumber >= 5) {
    itemList.push(["Elixir", -1]);
  }

  if (chapterNumber >= 9) {
    itemList.push(["Pure_Water", -1]);
  }

  // Lockpick with some progression (unlimited stock)
  if (chapterNumber >= 4) {
    itemList.push(["Lockpick", -1]);
  }

  // Standard staves by rank (unlimited stock)
  if (allowedRanks.includes("E")) {
    itemList.push(["Heal", -1]);
  }

  if (allowedRanks.includes("D")) {
    itemList.push(["Mend", -1], ["Torch", -1]);
  }

  if (allowedRanks.includes("C")) {
    itemList.push(["Recover", -1]);
  }

  if (allowedRanks.includes("B")) {
    itemList.push(["Physic", -1]);
  }

  if (allowedRanks.includes("A")) {
    // Only add one high-rank staff (unlimited stock)
    const highRankStaves = ["Barrier", "Silence", "Sleep"];
    itemList.push(
      [highRankStaves[Math.floor(Math.random() * highRankStaves.length)], -1]
    );
  }

  // Standard magic tomes by rank (unlimited stock)
  if (allowedRanks.includes("E")) {
    itemList.push(["Fire", -1], ["Lightning", -1], ["Flux", -1]);
  }

  if (allowedRanks.includes("D")) {
    itemList.push(["Thunder", -1], ["Shine", -1]);
  }

  if (allowedRanks.includes("C")) {
    itemList.push(["Elfire", -1], ["Divine", -1], ["Luna", -1]);
  }

  if (allowedRanks.includes("B")) {
    // Add at least one B-rank tome (unlimited stock)
    const bRankTomes = ["Bolting", "Purge", "Eclipse"];
    itemList.push([bRankTomes[Math.floor(Math.random() * bRankTomes.length)], -1]);
  }

  if (allowedRanks.includes("A")) {
    const aRankTomes = ["Fimbulvetr", "Aura", "Fenrir"];
    // Add at least one A-rank tome (unlimited stock)
    itemList.push([aRankTomes[Math.floor(Math.random() * aRankTomes.length)], -1]);
  }

  // Promotion items based on chapter progression (limited stock of 1)
  if (chapterNumber >= 8 && chapterNumber < 15) {
    // Add some class-specific promotion items
    const promoItems = [
      "Hero_Crest",
      "Knight_Crest",
      "Orion_Bolt",
      "Guiding_Ring",
      "Elysian_Whip",
      "Ocean_Seal",
    ];
    // Add 1-2 promotion items
    const numPromo = Math.min(2, promoItems.length);

    // Shuffle and select
    for (let i = promoItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [promoItems[i], promoItems[j]] = [promoItems[j], promoItems[i]];
    }

    for (let i = 0; i < numPromo; i++) {
      itemList.push([promoItems[i], 1]);
    }
  }

  if (chapterNumber >= 15) {
    // Later chapters have Master Seal (limited stock of 1)
    itemList.push(["Master_Seal", 1]);
  }

  // Now add 1-2 randomized special items based on chapter progression
  let numSpecial = 1;
  if (chapterNumber >= 10) {
    numSpecial = Math.floor(Math.random() * 2) + 1;
  }

  const specialItems: string[] = [];

  // Stat boosters with increased variety in later chapters
  if (chapterNumber >= 6) {
    specialItems.push("Angelic_Robe"); // HP
    specialItems.push("Energy_Ring"); // Str
  }

  if (chapterNumber >= 10) {
    specialItems.push("Secret_Book"); // Skl
    specialItems.push("Speedwing"); // Spd
    specialItems.push("Goddess_Icon"); // Lck
  }

  if (chapterNumber >= 14) {
    specialItems.push("Dragonshield"); // Def
    specialItems.push("Talisman"); // Res
  }

  if (chapterNumber >= 18) {
    specialItems.push("Body_Ring"); // Con
    specialItems.push("Metis_s_Tome"); // All stats
  }

  // Special magic items in very late chapters
  if (chapterNumber >= 8) {
    specialItems.push("Nosferatu");
  }

  if (chapterNumber >= 10) {
    specialItems.push("Warp");
  }

  // Shuffle and select random special items
  for (let i = specialItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [specialItems[i], specialItems[j]] = [specialItems[j], specialItems[i]];
  }

  // Add selected special items (limited stock of 1)
  for (let i = 0; i < Math.min(numSpecial, specialItems.length); i++) {
    itemList.push([specialItems[i], 1]);
  }

  return itemList;
}

if (import.meta.main) {
  console.log("Chapter 1 Vendor:", decideVendorItems(1));
  console.log("Chapter 8 Vendor:", decideVendorItems(8));
  console.log("Chapter 15 Vendor:", decideVendorItems(15));
  console.log("Chapter 22 Vendor:", decideVendorItems(22));
}