import { WeaponOption } from "@/ai/create-unit-data/item-options/get-all-weapon-options.ts";

// If needed, we can define a smaller subset for special/legendary weapons here:
const specialWeaponNids = [
  // Some killer weapons:
  "Killing_Edge",
  "Killer_Lance",
  "Killer_Axe",
  "Killer_Bow",
  // Brave weapons:
  "Brave_Sword",
  "Brave_Lance",
  "Brave_Axe",
  "Brave_Bow",
  // Effective weapons:
  "Armorslayer",
  "Horseslayer",
  "Dragon_Axe",
  "Wyrmslayer",
  "Halberd",
  "Zanbato",
  "Heavy_Spear",
  // Reaver weapons:
  "Swordreaver",
  "Swordslayer",
  "Axereaver",
  "Lancereaver"
];

const legendaryWeaponNids = [
  // S-rank or legendary
  "Audhulma",
  "Vidofnir",
  "Garm",
  "Nidhogg",
  "Latona",
  "Ivaldi",
  "Excalibur",
  "Gleipnir",
  "Naglfar"
];

// Minimal set of normal weapons data for convenience:
const allWeaponOptions: WeaponOption[] = [
  { nid: "Iron_Sword", name: "Iron Sword", levelRequired: "E", type: "Sword" },
  { nid: "Slim_Sword", name: "Slim Sword", levelRequired: "E", type: "Sword" },
  { nid: "Steel_Sword", name: "Steel Sword", levelRequired: "D", type: "Sword" },
  { nid: "Silver_Sword", name: "Silver Sword", levelRequired: "A", type: "Sword" },
  { nid: "Iron_Blade", name: "Iron Blade", levelRequired: "D", type: "Sword" },
  { nid: "Steel_Blade", name: "Steel Blade", levelRequired: "C", type: "Sword" },
  { nid: "Silver_Blade", name: "Silver Blade", levelRequired: "A", type: "Sword" },
  { nid: "Poison_Sword", name: "Poison Sword", levelRequired: "D", type: "Sword" },
  { nid: "Killing_Edge", name: "Killing Edge", levelRequired: "C", type: "Sword" },
  { nid: "Armorslayer", name: "Armorslayer", levelRequired: "D", type: "Sword" },
  { nid: "Wyrmslayer", name: "Wyrmslayer", levelRequired: "C", type: "Sword" },
  { nid: "Zanbato", name: "Zanbato", levelRequired: "D", type: "Sword" },
  { nid: "Lancereaver", name: "Lancereaver", levelRequired: "C", type: "Sword" },
  { nid: "Brave_Sword", name: "Brave Sword", levelRequired: "B", type: "Sword" },
  { nid: "Shamshir", name: "Shamshir", levelRequired: "D", type: "Sword" },
  { nid: "Light_Brand", name: "Light Brand", levelRequired: "C", type: "Sword" },
  { nid: "Runesword", name: "Runesword", levelRequired: "A", type: "Sword" },
  { nid: "Wind_Sword", name: "Wind Sword", levelRequired: "B", type: "Sword" },
  { nid: "Audhulma", name: "Audhulma", levelRequired: "S", type: "Sword" },

  { nid: "Iron_Lance", name: "Iron Lance", levelRequired: "E", type: "Lance" },
  { nid: "Slim_Lance", name: "Slim Lance", levelRequired: "E", type: "Lance" },
  { nid: "Steel_Lance", name: "Steel Lance", levelRequired: "D", type: "Lance" },
  { nid: "Silver_Lance", name: "Silver Lance", levelRequired: "A", type: "Lance" },
  { nid: "Toxin_Lance", name: "Toxin Lance", levelRequired: "E", type: "Lance" },
  { nid: "Killer_Lance", name: "Killer Lance", levelRequired: "C", type: "Lance" },
  { nid: "Javelin", name: "Javelin", levelRequired: "E", type: "Lance" },
  { nid: "Short_Spear", name: "Short Spear", levelRequired: "C", type: "Lance" },
  { nid: "Spear", name: "Spear", levelRequired: "B", type: "Lance" },
  { nid: "Brave_Lance", name: "Brave Lance", levelRequired: "B", type: "Lance" },
  { nid: "Horseslayer", name: "Horseslayer", levelRequired: "D", type: "Lance" },
  { nid: "Heavy_Spear", name: "Heavy Spear", levelRequired: "D", type: "Lance" },
  { nid: "Dragonspear", name: "Dragonspear", levelRequired: "C", type: "Lance" },
  { nid: "Axereaver", name: "Axereaver", levelRequired: "C", type: "Lance" },
  { nid: "Vidofnir", name: "Vidofnir", levelRequired: "S", type: "Lance" },

  { nid: "Iron_Axe", name: "Iron Axe", levelRequired: "E", type: "Axe" },
  { nid: "Steel_Axe", name: "Steel Axe", levelRequired: "E", type: "Axe" },
  { nid: "Silver_Axe", name: "Silver Axe", levelRequired: "A", type: "Axe" },
  { nid: "Poison_Axe", name: "Poison Axe", levelRequired: "D", type: "Axe" },
  { nid: "Hatchet", name: "Hatchet", levelRequired: "E", type: "Axe" },
  { nid: "Hand_Axe", name: "Hand Axe", levelRequired: "E", type: "Axe" },
  { nid: "Tomahawk", name: "Tomahawk", levelRequired: "A", type: "Axe" },
  { nid: "Killer_Axe", name: "Killer Axe", levelRequired: "C", type: "Axe" },
  { nid: "Halberd", name: "Halberd", levelRequired: "D", type: "Axe" },
  { nid: "Hammer", name: "Hammer", levelRequired: "D", type: "Axe" },
  { nid: "Dragon_Axe", name: "Dragon Axe", levelRequired: "C", type: "Axe" },
  { nid: "Devil_Axe", name: "Devil Axe", levelRequired: "D", type: "Axe" },
  { nid: "Swordreaver", name: "Swordreaver", levelRequired: "C", type: "Axe" },
  { nid: "Swordslayer", name: "Swordslayer", levelRequired: "C", type: "Axe" },
  { nid: "Brave_Axe", name: "Brave Axe", levelRequired: "B", type: "Axe" },
  { nid: "Battle_Axe", name: "Battle Axe", levelRequired: "B", type: "Axe" },
  { nid: "Garm", name: "Garm", levelRequired: "S", type: "Axe" },

  { nid: "Iron_Bow", name: "Iron Bow", levelRequired: "E", type: "Bow" },
  { nid: "Steel_Bow", name: "Steel Bow", levelRequired: "D", type: "Bow" },
  { nid: "Silver_Bow", name: "Silver Bow", levelRequired: "A", type: "Bow" },
  { nid: "Poison_Bow", name: "Poison Bow", levelRequired: "D", type: "Bow" },
  { nid: "Killer_Bow", name: "Killer Bow", levelRequired: "C", type: "Bow" },
  { nid: "Brave_Bow", name: "Brave Bow", levelRequired: "B", type: "Bow" },
  { nid: "Short_Bow", name: "Short Bow", levelRequired: "D", type: "Bow" },
  { nid: "Longbow", name: "Longbow", levelRequired: "D", type: "Bow" },
  { nid: "Nidhogg", name: "Nidhogg", levelRequired: "S", type: "Bow" },

  { nid: "Lightning", name: "Lightning", levelRequired: "E", type: "Light" },
  { nid: "Shine", name: "Shine", levelRequired: "D", type: "Light" },
  { nid: "Divine", name: "Divine", levelRequired: "C", type: "Light" },
  { nid: "Purge", name: "Purge", levelRequired: "B", type: "Light" },
  { nid: "Aura", name: "Aura", levelRequired: "A", type: "Light" },
  { nid: "Ivaldi", name: "Ivaldi", levelRequired: "S", type: "Light" },

  { nid: "Fire", name: "Fire", levelRequired: "E", type: "Anima" },
  { nid: "Thunder", name: "Thunder", levelRequired: "D", type: "Anima" },
  { nid: "Elfire", name: "Elfire", levelRequired: "C", type: "Anima" },
  { nid: "Bolting", name: "Bolting", levelRequired: "B", type: "Anima" },
  { nid: "Fimbulvetr", name: "Fimbulvetr", levelRequired: "A", type: "Anima" },
  { nid: "Excalibur", name: "Excalibur", levelRequired: "S", type: "Anima" },
  { nid: "Sear", name: "Sear", levelRequired: "C", type: "Anima" },

  { nid: "Flux", name: "Flux", levelRequired: "D", type: "Dark" },
  { nid: "Luna", name: "Luna", levelRequired: "C", type: "Dark" },
  { nid: "Nosferatu", name: "Nosferatu", levelRequired: "C", type: "Dark" },
  { nid: "Eclipse", name: "Eclipse", levelRequired: "B", type: "Dark" },
  { nid: "Fenrir", name: "Fenrir", levelRequired: "A", type: "Dark" },
  { nid: "Gleipnir", name: "Gleipnir", levelRequired: "S", type: "Dark" },
  { nid: "Naglfar", name: "Naglfar", levelRequired: "S", type: "Dark" }
];

// For staff, we won't strictly exclude them, but you can keep them in normal pool if you want. But let's keep it simple and allow them.

function getMaxRankForChapter(chapter: number): string {
  // ch 1–4 => D, 5–8 => C, 9–12 => B, 13–16 => A, 17+ => S
  if (chapter <= 4) return "D";
  if (chapter <= 8) return "C";
  if (chapter <= 12) return "B";
  if (chapter <= 16) return "A";
  return "S";
}

const rankOrder = ["E", "D", "C", "B", "A", "S"];

// pickWeapon: picks normal weapon from E..maxRank, unless we do special or legendary
function pickWeapon(chapter: number): string {
  const maxRank = getMaxRankForChapter(chapter);

  // Possibly roll for Legendary from chapter >= 13
  let legendaryChance = 0;
  if (chapter >= 13 && chapter < 20) {
    legendaryChance = 2; // 2% for early lategame
  } else if (chapter >= 20) {
    legendaryChance = 5; // up to 5% near end
  }

  const rollLegendary = Math.random() * 100 < legendaryChance;
  if (rollLegendary) {
    // pick random from legendaryWeaponNids
    const rIndex = Math.floor(Math.random() * legendaryWeaponNids.length);
    return legendaryWeaponNids[rIndex];
  }

  // Next, chance for special subset (like 10%):
  let specialChance = 10;
  if (chapter <= 5) {
    specialChance = 5;
  } else if (chapter >= 15) {
    specialChance = 15;
  }
  const rollSpecial = Math.random() * 100 < specialChance;
  if (rollSpecial) {
    // pick random from specialWeaponNids that is within maxRank
    // We'll do a quick filter based on the rank too
    const specialCandidates = allWeaponOptions.filter((w) =>
      specialWeaponNids.includes(w.nid) &&
      rankOrder.indexOf(w.levelRequired) <= rankOrder.indexOf(maxRank)
    );
    if (specialCandidates.length > 0) {
      const randIndex = Math.floor(Math.random() * specialCandidates.length);
      return specialCandidates[randIndex].nid;
    }
    // fallback to normal if none match
  }

  // Otherwise pick normal weapon from E..maxRank
  const normalCandidates = allWeaponOptions.filter((w) =>
    rankOrder.indexOf(w.levelRequired) <= rankOrder.indexOf(maxRank)
  );
  if (!normalCandidates.length) {
    // fallback
    return "Iron_Sword";
  }
  const randomIndex = Math.floor(Math.random() * normalCandidates.length);
  return normalCandidates[randomIndex].nid;
}

function pickHealingItem(chapter: number): string {
  // ch 1–5 => heavily skew low-tier (80% pure/antitoxin, 20% elixir)
  // ch 6–12 => 50/50
  // ch 13+ => 100% elixir
  if (chapter >= 13) {
    return "Elixir";
  } else if (chapter <= 5) {
    // 80 vs 20
    const roll = Math.random() * 100;
    if (roll < 80) {
      // pick from pure or antitoxin
      return Math.random() < 0.5 ? "Pure_Water" : "Antitoxin";
    } else {
      return "Elixir";
    }
  } else {
    // 6..12 => 50/50
    return Math.random() < 0.5 ? "Pure_Water" : "Elixir";
  }
}

const statBoosters = [
  "Angelic_Robe",
  "Energy_Ring",
  "Secret_Book",
  "Speedwing",
  "Goddess_Icon",
  "Dragonshield",
  "Talisman",
  "Body_Ring",
  "Metis_s_Tome"
];

// pickStatBooster: uniform distribution
function pickStatBooster(): string {
  const idx = Math.floor(Math.random() * statBoosters.length);
  return statBoosters[idx];
}

/**
 * Returns an item NID for the chest, based on the current chapter's progression.
 */
export default function getChestLoot(chapterNumber: number): string {
  // 30% healing, 30% weapon, 30% stat booster, 10% master
  const roll = Math.random() * 100;
  if (roll < 30) {
    // healing
    return pickHealingItem(chapterNumber);
  } else if (roll < 60) {
    // weapon
    return pickWeapon(chapterNumber);
  } else if (roll < 90) {
    // stat booster
    return pickStatBooster();
  } else {
    // master seal
    return "Master_Seal";
  }
}

// Example usage
if (import.meta.main) {
  const testChapters = [1, 5, 6, 12, 13, 17, 20];
  for (const ch of testChapters) {
    console.log(`Chapter ${ch} => Chest Loot:`, getChestLoot(ch));
  }
}