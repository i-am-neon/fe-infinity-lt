import { WeaponOption } from "./get-all-weapon-options.ts";

const specialWeaponNids = [
  "Killing_Edge",
  "Killer_Lance",
  "Killer_Axe",
  "Killer_Bow",
  "Brave_Sword",
  "Brave_Lance",
  "Brave_Axe",
  "Brave_Bow",
  "Armorslayer",
  "Horseslayer",
  "Dragon_Axe",
  "Wyrmslayer",
  "Halberd",
  "Zanbato",
  "Heavy_Spear",
  "Swordreaver",
  "Swordslayer",
  "Axereaver",
  "Lancereaver",
];

const legendaryWeaponNids = [
  "Audhulma",
  "Vidofnir",
  "Garm",
  "Nidhogg",
  "Latona",
  "Ivaldi",
  "Excalibur",
  "Gleipnir",
  "Naglfar",
];

// We'll add staff items as well
// We'll define staff items with rank: Heal=E, Mend=D, Recover=C, Physic=B, Fortify=A, Warp=A, Latona=S
const allWeaponOptions: WeaponOption[] = [
  // Swords
  // { nid: "Iron_Sword", name: "Iron Sword", levelRequired: "E", type: "Sword" },
  // { nid: "Slim_Sword", name: "Slim Sword", levelRequired: "E", type: "Sword" },
  // {
  //   nid: "Steel_Sword",
  //   name: "Steel Sword",
  //   levelRequired: "D",
  //   type: "Sword",
  // },
  {
    nid: "Silver_Sword",
    name: "Silver Sword",
    levelRequired: "A",
    type: "Sword",
  },
  { nid: "Iron_Blade", name: "Iron Blade", levelRequired: "D", type: "Sword" },
  {
    nid: "Steel_Blade",
    name: "Steel Blade",
    levelRequired: "C",
    type: "Sword",
  },
  {
    nid: "Silver_Blade",
    name: "Silver Blade",
    levelRequired: "A",
    type: "Sword",
  },
  {
    nid: "Poison_Sword",
    name: "Poison Sword",
    levelRequired: "D",
    type: "Sword",
  },
  {
    nid: "Killing_Edge",
    name: "Killing Edge",
    levelRequired: "C",
    type: "Sword",
  },
  {
    nid: "Armorslayer",
    name: "Armorslayer",
    levelRequired: "D",
    type: "Sword",
  },
  { nid: "Wyrmslayer", name: "Wyrmslayer", levelRequired: "C", type: "Sword" },
  { nid: "Zanbato", name: "Zanbato", levelRequired: "D", type: "Sword" },
  {
    nid: "Lancereaver",
    name: "Lancereaver",
    levelRequired: "C",
    type: "Sword",
  },
  {
    nid: "Brave_Sword",
    name: "Brave Sword",
    levelRequired: "B",
    type: "Sword",
  },
  { nid: "Shamshir", name: "Shamshir", levelRequired: "D", type: "Sword" },
  {
    nid: "Light_Brand",
    name: "Light Brand",
    levelRequired: "C",
    type: "Sword",
  },
  { nid: "Runesword", name: "Runesword", levelRequired: "A", type: "Sword" },
  { nid: "Wind_Sword", name: "Wind Sword", levelRequired: "B", type: "Sword" },
  { nid: "Audhulma", name: "Audhulma", levelRequired: "S", type: "Sword" },

  // Lances
  // { nid: "Iron_Lance", name: "Iron Lance", levelRequired: "E", type: "Lance" },
  // { nid: "Slim_Lance", name: "Slim Lance", levelRequired: "E", type: "Lance" },
  // {
  //   nid: "Steel_Lance",
  //   name: "Steel Lance",
  //   levelRequired: "D",
  //   type: "Lance",
  // },
  {
    nid: "Silver_Lance",
    name: "Silver Lance",
    levelRequired: "A",
    type: "Lance",
  },
  {
    nid: "Toxin_Lance",
    name: "Toxin Lance",
    levelRequired: "D",
    type: "Lance",
  },
  {
    nid: "Killer_Lance",
    name: "Killer Lance",
    levelRequired: "C",
    type: "Lance",
  },
  { nid: "Javelin", name: "Javelin", levelRequired: "E", type: "Lance" },
  {
    nid: "Short_Spear",
    name: "Short Spear",
    levelRequired: "C",
    type: "Lance",
  },
  { nid: "Spear", name: "Spear", levelRequired: "B", type: "Lance" },
  {
    nid: "Brave_Lance",
    name: "Brave Lance",
    levelRequired: "B",
    type: "Lance",
  },
  {
    nid: "Horseslayer",
    name: "Horseslayer",
    levelRequired: "D",
    type: "Lance",
  },
  {
    nid: "Heavy_Spear",
    name: "Heavy Spear",
    levelRequired: "D",
    type: "Lance",
  },
  {
    nid: "Dragonspear",
    name: "Dragonspear",
    levelRequired: "C",
    type: "Lance",
  },
  { nid: "Axereaver", name: "Axereaver", levelRequired: "C", type: "Lance" },
  { nid: "Vidofnir", name: "Vidofnir", levelRequired: "S", type: "Lance" },

  // Axes
  // { nid: "Iron_Axe", name: "Iron Axe", levelRequired: "E", type: "Axe" },
  // { nid: "Steel_Axe", name: "Steel Axe", levelRequired: "E", type: "Axe" },
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

  // Bows
  // { nid: "Iron_Bow", name: "Iron Bow", levelRequired: "E", type: "Bow" },
  // { nid: "Steel_Bow", name: "Steel Bow", levelRequired: "D", type: "Bow" },
  { nid: "Silver_Bow", name: "Silver Bow", levelRequired: "A", type: "Bow" },
  { nid: "Poison_Bow", name: "Poison Bow", levelRequired: "D", type: "Bow" },
  { nid: "Killer_Bow", name: "Killer Bow", levelRequired: "C", type: "Bow" },
  { nid: "Brave_Bow", name: "Brave Bow", levelRequired: "B", type: "Bow" },
  { nid: "Short_Bow", name: "Short Bow", levelRequired: "D", type: "Bow" },
  { nid: "Longbow", name: "Longbow", levelRequired: "D", type: "Bow" },
  { nid: "Nidhogg", name: "Nidhogg", levelRequired: "S", type: "Bow" },

  // Light
  // { nid: "Lightning", name: "Lightning", levelRequired: "E", type: "Light" },
  { nid: "Shine", name: "Shine", levelRequired: "D", type: "Light" },
  { nid: "Divine", name: "Divine", levelRequired: "C", type: "Light" },
  { nid: "Purge", name: "Purge", levelRequired: "B", type: "Light" },
  { nid: "Aura", name: "Aura", levelRequired: "A", type: "Light" },
  { nid: "Ivaldi", name: "Ivaldi", levelRequired: "S", type: "Light" },

  // Anima
  // { nid: "Fire", name: "Fire", levelRequired: "E", type: "Anima" },
  { nid: "Thunder", name: "Thunder", levelRequired: "D", type: "Anima" },
  { nid: "Elfire", name: "Elfire", levelRequired: "C", type: "Anima" },
  { nid: "Bolting", name: "Bolting", levelRequired: "B", type: "Anima" },
  { nid: "Fimbulvetr", name: "Fimbulvetr", levelRequired: "A", type: "Anima" },
  { nid: "Excalibur", name: "Excalibur", levelRequired: "S", type: "Anima" },
  { nid: "Sear", name: "Sear", levelRequired: "C", type: "Anima" },

  // Dark
  // { nid: "Flux", name: "Flux", levelRequired: "D", type: "Dark" },
  { nid: "Luna", name: "Luna", levelRequired: "C", type: "Dark" },
  { nid: "Nosferatu", name: "Nosferatu", levelRequired: "C", type: "Dark" },
  { nid: "Eclipse", name: "Eclipse", levelRequired: "B", type: "Dark" },
  { nid: "Fenrir", name: "Fenrir", levelRequired: "A", type: "Dark" },
  { nid: "Gleipnir", name: "Gleipnir", levelRequired: "S", type: "Dark" },
  { nid: "Naglfar", name: "Naglfar", levelRequired: "S", type: "Dark" },

  // Staves
  // { nid: "Heal", name: "Heal", levelRequired: "E", type: "Staff" },
  { nid: "Mend", name: "Mend", levelRequired: "D", type: "Staff" },
  { nid: "Recover", name: "Recover", levelRequired: "C", type: "Staff" },
  { nid: "Physic", name: "Physic", levelRequired: "B", type: "Staff" },
  { nid: "Fortify", name: "Fortify", levelRequired: "A", type: "Staff" },
  { nid: "Warp", name: "Warp", levelRequired: "A", type: "Staff" },
  { nid: "Latona", name: "Latona", levelRequired: "S", type: "Staff" },
];

// New rank progression:
//  1..8 => [D]
//  9..12 => [C, B]
// 13..16 => [C, B, A]
// 17..20 => [B, A, S]
// 21+   => [A, S]
function getAllowedRanks(chapter: number): string[] {
  if (chapter <= 8) {
    return ["D"];
  } else if (chapter <= 12) {
    return ["C", "B"];
  } else if (chapter <= 16) {
    return ["C", "B", "A"];
  } else if (chapter <= 20) {
    return ["B", "A", "S"];
  } else {
    return ["A", "S"];
  }
}

function pickWeapon(chapter: number): string {
  const allowedRanks = getAllowedRanks(chapter);

  // Possibly roll for Legendary from ch >= 13
  let legendaryChance = 0;
  if (chapter >= 13 && chapter < 20) {
    legendaryChance = 2;
  } else if (chapter >= 20) {
    legendaryChance = 5;
  }

  if (Math.random() * 100 < legendaryChance) {
    const rIndex = Math.floor(Math.random() * legendaryWeaponNids.length);
    return legendaryWeaponNids[rIndex];
  }

  // chance for special subset
  let specialChance = 10;
  if (chapter <= 5) {
    specialChance = 5;
  } else if (chapter >= 15) {
    specialChance = 15;
  }
  if (Math.random() * 100 < specialChance) {
    const specialCandidates = allWeaponOptions.filter(
      (w) =>
        specialWeaponNids.includes(w.nid) &&
        allowedRanks.includes(w.levelRequired)
    );
    if (specialCandidates.length > 0) {
      const randIndex = Math.floor(Math.random() * specialCandidates.length);
      return specialCandidates[randIndex].nid;
    }
  }

  // normal pick
  const normalCandidates = allWeaponOptions.filter((w) =>
    allowedRanks.includes(w.levelRequired)
  );
  if (!normalCandidates.length) {
    return "Iron_Sword"; // fallback
  }
  const randomIndex = Math.floor(Math.random() * normalCandidates.length);
  return normalCandidates[randomIndex].nid;
}

function pickHealingItem(chapter: number): string {
  if (chapter >= 13) {
    return "Elixir";
  } else if (chapter <= 5) {
    const roll = Math.random() * 100;
    if (roll < 80) {
      return Math.random() < 0.5 ? "Pure_Water" : "Antitoxin";
    } else {
      return "Elixir";
    }
  } else {
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
  "Metis_s_Tome",
];

function pickStatBooster(): string {
  const idx = Math.floor(Math.random() * statBoosters.length);
  return statBoosters[idx];
}

/**
 * Returns an item NID for the chest, based on the current chapter's progression.
 */
export default function getLoot(chapterNumber: number): string {
  const roll = Math.random() * 100;
  if (roll < 15) {
    return pickHealingItem(chapterNumber);
  } else if (roll < 60) {
    return pickWeapon(chapterNumber);
  } else if (roll < 85) {
    return pickStatBooster();
  } else {
    // Don't give Master Seal in early chapters
    if (chapterNumber < 5) {
      // Return either a weapon or stat booster instead
      return Math.random() < 0.5 ? pickWeapon(chapterNumber) : pickStatBooster();
    }
    return "Master_Seal";
  }
}

if (import.meta.main) {
  const testChapters = [1, 8, 9, 12, 13, 16, 17, 20, 21, 25];
  for (const ch of testChapters) {
    console.log(`Chapter ${ch} => Chest Loot: `, getLoot(ch));
  }
}

