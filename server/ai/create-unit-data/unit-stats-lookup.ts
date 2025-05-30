import { StatValues } from "@/types/character/unit-data.ts";
import { FE8Class } from "@/types/fe8-class.ts";

export const unitStatsLookup: Record<
  FE8Class,
  { base: StatValues; growth: StatValues }
> = {
  Myrmidon: {
    base: {
      HP: 16,
      STR: 4,
      MAG: 0,
      SKL: 9,
      SPD: 9,
      LCK: 2,
      DEF: 2,
      RES: 0,
      CON: 8,
      MOV: 5,
    },
    growth: {
      HP: 70,
      STR: 35,
      MAG: 0,
      SKL: 40,
      SPD: 40,
      LCK: 30,
      DEF: 15,
      RES: 20,
      CON: 0,
      MOV: 0,
    },
  },
  Mercenary: {
    base: {
      HP: 18,
      STR: 4,
      MAG: 0,
      SKL: 8,
      SPD: 8,
      LCK: 2,
      DEF: 4,
      RES: 0,
      CON: 9,
      MOV: 5,
    },
    growth: {
      HP: 80,
      STR: 40,
      MAG: 0,
      SKL: 40,
      SPD: 32,
      LCK: 30,
      DEF: 18,
      RES: 20,
      CON: 0,
      MOV: 0,
    },
  },
  Thief: {
    base: {
      HP: 16,
      STR: 3,
      MAG: 0,
      SKL: 1,
      SPD: 9,
      LCK: 2,
      DEF: 2,
      RES: 0,
      CON: 6,
      MOV: 6,
    },
    growth: {
      HP: 50,
      STR: 5,
      MAG: 0,
      SKL: 45,
      SPD: 40,
      LCK: 40,
      DEF: 5,
      RES: 20,
      CON: 0,
      MOV: 0,
    },
  },
  Rogue: {
    base: {
      HP: 16,
      STR: 3,
      MAG: 0,
      SKL: 1,
      SPD: 9,
      LCK: 2,
      DEF: 2,
      RES: 0,
      CON: 7,
      MOV: 6,
    },
    growth: {
      HP: 50,
      STR: 10,
      MAG: 0,
      SKL: 45,
      SPD: 35,
      LCK: 40,
      DEF: 5,
      RES: 20,
      CON: 0,
      MOV: 0,
    },
  },
  Recruit: {
    base: {
      HP: 13,
      STR: 3,
      MAG: 0,
      SKL: 0,
      SPD: 1,
      LCK: 2,
      DEF: 0,
      RES: 1,
      CON: 6,
      MOV: 4,
    },
    growth: {
      HP: 75,
      STR: 45,
      MAG: 0,
      SKL: 40,
      SPD: 40,
      LCK: 40,
      DEF: 25,
      RES: 35,
      CON: 0,
      MOV: 0,
    },
  },
  Soldier: {
    base: {
      HP: 20,
      STR: 3,
      MAG: 0,
      SKL: 0,
      SPD: 1,
      LCK: 2,
      DEF: 0,
      RES: 0,
      CON: 6,
      MOV: 5,
    },
    growth: {
      HP: 80,
      STR: 50,
      MAG: 0,
      SKL: 30,
      SPD: 20,
      LCK: 25,
      DEF: 12,
      RES: 15,
      CON: 0,
      MOV: 0,
    },
  },
  Cavalier: {
    base: {
      HP: 20,
      STR: 5,
      MAG: 0,
      SKL: 2,
      SPD: 5,
      LCK: 2,
      DEF: 6,
      RES: 0,
      CON: 9,
      MOV: 7,
    },
    growth: {
      HP: 75,
      STR: 35,
      MAG: 0,
      SKL: 40,
      SPD: 28,
      LCK: 30,
      DEF: 15,
      RES: 15,
      CON: 0,
      MOV: 0,
    },
  },
  "Pegasus Knight": {
    base: {
      HP: 14,
      STR: 4,
      MAG: 0,
      SKL: 5,
      SPD: 5,
      LCK: 2,
      DEF: 3,
      RES: 2,
      CON: 5,
      MOV: 7,
    },
    growth: {
      HP: 65,
      STR: 35,
      MAG: 0,
      SKL: 40,
      SPD: 40,
      LCK: 35,
      DEF: 12,
      RES: 35,
      CON: 0,
      MOV: 0,
    },
  },
  Journeyman: {
    base: {
      HP: 14,
      STR: 3,
      MAG: 0,
      SKL: 0,
      SPD: 1,
      LCK: 2,
      DEF: 1,
      RES: 0,
      CON: 8,
      MOV: 4,
    },
    growth: {
      HP: 85,
      STR: 55,
      MAG: 0,
      SKL: 40,
      SPD: 32,
      LCK: 40,
      DEF: 18,
      RES: 20,
      CON: 0,
      MOV: 0,
    },
  },
  Fighter: {
    base: {
      HP: 20,
      STR: 5,
      MAG: 0,
      SKL: 2,
      SPD: 4,
      LCK: 2,
      DEF: 2,
      RES: 0,
      CON: 11,
      MOV: 5,
    },
    growth: {
      HP: 85,
      STR: 55,
      MAG: 0,
      SKL: 35,
      SPD: 30,
      LCK: 15,
      DEF: 15,
      RES: 15,
      CON: 0,
      MOV: 0,
    },
  },
  Warrior: {
    base: {
      HP: 28,
      STR: 8,
      MAG: 0,
      SKL: 5,
      SPD: 6,
      LCK: 2,
      DEF: 5,
      RES: 0,
      CON: 13,
      MOV: 6,
    },
    growth: {
      HP: 80,
      STR: 45,
      MAG: 0,
      SKL: 25,
      SPD: 20,
      LCK: 15,
      DEF: 16,
      RES: 17,
      CON: 0,
      MOV: 0,
    },
  },
  Pirate: {
    base: {
      HP: 19,
      STR: 4,
      MAG: 0,
      SKL: 2,
      SPD: 6,
      LCK: 2,
      DEF: 3,
      RES: 0,
      CON: 10,
      MOV: 5,
    },
    growth: {
      HP: 75,
      STR: 50,
      MAG: 0,
      SKL: 35,
      SPD: 25,
      LCK: 15,
      DEF: 10,
      RES: 13,
      CON: 0,
      MOV: 0,
    },
  },
  Brigand: {
    base: {
      HP: 20,
      STR: 5,
      MAG: 0,
      SKL: 1,
      SPD: 5,
      LCK: 2,
      DEF: 3,
      RES: 0,
      CON: 12,
      MOV: 5,
    },
    growth: {
      HP: 82,
      STR: 50,
      MAG: 0,
      SKL: 30,
      SPD: 20,
      LCK: 15,
      DEF: 10,
      RES: 13,
      CON: 0,
      MOV: 0,
    },
  },
  Archer: {
    base: {
      HP: 18,
      STR: 4,
      MAG: 0,
      SKL: 3,
      SPD: 3,
      LCK: 2,
      DEF: 3,
      RES: 0,
      CON: 7,
      MOV: 5,
    },
    growth: {
      HP: 70,
      STR: 35,
      MAG: 0,
      SKL: 40,
      SPD: 32,
      LCK: 35,
      DEF: 15,
      RES: 15,
      CON: 0,
      MOV: 0,
    },
  },
  Ranger: {
    base: {
      HP: 21,
      STR: 7,
      MAG: 0,
      SKL: 6,
      SPD: 7,
      LCK: 2,
      DEF: 6,
      RES: 3,
      CON: 9,
      MOV: 7,
    },
    growth: {
      HP: 60,
      STR: 25,
      MAG: 0,
      SKL: 30,
      SPD: 35,
      LCK: 25,
      DEF: 15,
      RES: 15,
      CON: 0,
      MOV: 0,
    },
  },
  Monk: {
    base: {
      HP: 18,
      STR: 0,
      MAG: 1,
      SKL: 1,
      SPD: 2,
      LCK: 2,
      DEF: 1,
      RES: 5,
      CON: 6,
      MOV: 5,
    },
    growth: {
      HP: 50,
      STR: 0,
      MAG: 30,
      SKL: 35,
      SPD: 32,
      LCK: 45,
      DEF: 8,
      RES: 40,
      CON: 0,
      MOV: 0,
    },
  },
  Cleric: {
    base: {
      HP: 16,
      STR: 0,
      MAG: 1,
      SKL: 2,
      SPD: 2,
      LCK: 2,
      DEF: 0,
      RES: 6,
      CON: 4,
      MOV: 5,
    },
    growth: {
      HP: 50,
      STR: 0,
      MAG: 30,
      SKL: 35,
      SPD: 32,
      LCK: 45,
      DEF: 8,
      RES: 50,
      CON: 0,
      MOV: 0,
    },
  },
  Mage: {
    base: {
      HP: 16,
      STR: 0,
      MAG: 1,
      SKL: 2,
      SPD: 3,
      LCK: 2,
      DEF: 3,
      RES: 5,
      CON: 5,
      MOV: 5,
    },
    growth: {
      HP: 55,
      STR: 0,
      MAG: 55,
      SKL: 40,
      SPD: 35,
      LCK: 20,
      DEF: 5,
      RES: 30,
      CON: 0,
      MOV: 0,
    },
  },
  Shaman: {
    base: {
      HP: 16,
      STR: 0,
      MAG: 2,
      SKL: 1,
      SPD: 2,
      LCK: 2,
      DEF: 2,
      RES: 4,
      CON: 7,
      MOV: 5,
    },
    growth: {
      HP: 50,
      STR: 0,
      MAG: 50,
      SKL: 32,
      SPD: 30,
      LCK: 20,
      DEF: 10,
      RES: 30,
      CON: 0,
      MOV: 0,
    },
  },
  Troubadour: {
    base: {
      HP: 15,
      STR: 0,
      MAG: 1,
      SKL: 1,
      SPD: 3,
      LCK: 2,
      DEF: 2,
      RES: 5,
      CON: 5,
      MOV: 6,
    },
    growth: {
      HP: 50,
      STR: 0,
      MAG: 25,
      SKL: 35,
      SPD: 55,
      LCK: 45,
      DEF: 12,
      RES: 40,
      CON: 0,
      MOV: 0,
    },
  },
  Valkyrie: {
    base: {
      HP: 19,
      STR: 0,
      MAG: 4,
      SKL: 3,
      SPD: 5,
      LCK: 2,
      DEF: 4,
      RES: 8,
      CON: 6,
      MOV: 7,
    },
    growth: {
      HP: 45,
      STR: 0,
      MAG: 35,
      SKL: 25,
      SPD: 45,
      LCK: 40,
      DEF: 10,
      RES: 40,
      CON: 0,
      MOV: 0,
    },
  },
  "Wyvern Rider": {
    base: {
      HP: 20,
      STR: 7,
      MAG: 0,
      SKL: 3,
      SPD: 5,
      LCK: 2,
      DEF: 8,
      RES: 0,
      CON: 10,
      MOV: 7,
    },
    growth: {
      HP: 80,
      STR: 45,
      MAG: 0,
      SKL: 35,
      SPD: 30,
      LCK: 25,
      DEF: 25,
      RES: 15,
      CON: 0,
      MOV: 0,
    },
  },
  Revenant: {
    base: {
      HP: 25,
      STR: 2,
      MAG: 0,
      SKL: 0,
      SPD: 0,
      LCK: 2,
      DEF: 0,
      RES: 0,
      CON: 6,
      MOV: 4,
    },
    growth: {
      HP: 95,
      STR: 50,
      MAG: 0,
      SKL: 30,
      SPD: 20,
      LCK: 10,
      DEF: 10,
      RES: 13,
      CON: 0,
      MOV: 0,
    },
  },
  Entombed: {
    base: {
      HP: 35,
      STR: 3,
      MAG: 0,
      SKL: 0,
      SPD: 1,
      LCK: 2,
      DEF: 0,
      RES: 0,
      CON: 6,
      MOV: 5,
    },
    growth: {
      HP: 85,
      STR: 40,
      MAG: 0,
      SKL: 25,
      SPD: 17,
      LCK: 50,
      DEF: 10,
      RES: 13,
      CON: 0,
      MOV: 0,
    },
  },
  "Sword Wight": {
    base: {
      HP: 21,
      STR: 7,
      MAG: 0,
      SKL: 5,
      SPD: 6,
      LCK: 2,
      DEF: 5,
      RES: 2,
      CON: 9,
      MOV: 6,
    },
    growth: {
      HP: 65,
      STR: 25,
      MAG: 0,
      SKL: 25,
      SPD: 20,
      LCK: 10,
      DEF: 15,
      RES: 22,
      CON: 0,
      MOV: 0,
    },
  },
  "Bow Wight": {
    base: {
      HP: 21,
      STR: 6,
      MAG: 0,
      SKL: 6,
      SPD: 5,
      LCK: 2,
      DEF: 5,
      RES: 2,
      CON: 8,
      MOV: 6,
    },
    growth: {
      HP: 65,
      STR: 30,
      MAG: 0,
      SKL: 30,
      SPD: 20,
      LCK: 10,
      DEF: 15,
      RES: 20,
      CON: 0,
      MOV: 0,
    },
  },
  Mogall: {
    base: {
      HP: 15,
      STR: 0,
      MAG: 2,
      SKL: 1,
      SPD: 2,
      LCK: 2,
      DEF: 2,
      RES: 4,
      CON: 4,
      MOV: 5,
    },
    growth: {
      HP: 50,
      STR: 0,
      MAG: 45,
      SKL: 32,
      SPD: 30,
      LCK: 30,
      DEF: 10,
      RES: 28,
      CON: 0,
      MOV: 0,
    },
  },
  Swordmaster: {
    base: {
      HP: 21,
      STR: 6,
      MAG: 0,
      SKL: 11,
      SPD: 10,
      LCK: 2,
      DEF: 5,
      RES: 2,
      CON: 9,
      MOV: 6,
    },
    growth: {
      HP: 65,
      STR: 25,
      MAG: 0,
      SKL: 30,
      SPD: 30,
      LCK: 25,
      DEF: 15,
      RES: 22,
      CON: 0,
      MOV: 0,
    },
  },
  Hero: {
    base: {
      HP: 22,
      STR: 6,
      MAG: 0,
      SKL: 9,
      SPD: 10,
      LCK: 2,
      DEF: 8,
      RES: 2,
      CON: 11,
      MOV: 6,
    },
    growth: {
      HP: 75,
      STR: 30,
      MAG: 0,
      SKL: 30,
      SPD: 20,
      LCK: 25,
      DEF: 20,
      RES: 20,
      CON: 0,
      MOV: 0,
    },
  },
  Assassin: {
    base: {
      HP: 16,
      STR: 3,
      MAG: 0,
      SKL: 1,
      SPD: 9,
      LCK: 2,
      DEF: 2,
      RES: 0,
      CON: 8,
      MOV: 6,
    },
    growth: {
      HP: 50,
      STR: 5,
      MAG: 0,
      SKL: 45,
      SPD: 40,
      LCK: 40,
      DEF: 5,
      RES: 20,
      CON: 0,
      MOV: 0,
    },
  },
  Paladin: {
    base: {
      HP: 23,
      STR: 7,
      MAG: 0,
      SKL: 4,
      SPD: 7,
      LCK: 2,
      DEF: 8,
      RES: 3,
      CON: 11,
      MOV: 8,
    },
    growth: {
      HP: 70,
      STR: 25,
      MAG: 0,
      SKL: 30,
      SPD: 18,
      LCK: 25,
      DEF: 12,
      RES: 20,
      CON: 0,
      MOV: 0,
    },
  },
  "Great Knight": {
    base: {
      HP: 21,
      STR: 8,
      MAG: 0,
      SKL: 4,
      SPD: 6,
      LCK: 2,
      DEF: 11,
      RES: 3,
      CON: 13,
      MOV: 6,
    },
    growth: {
      HP: 70,
      STR: 30,
      MAG: 0,
      SKL: 20,
      SPD: 15,
      LCK: 20,
      DEF: 21,
      RES: 20,
      CON: 0,
      MOV: 0,
    },
  },
  Falcoknight: {
    base: {
      HP: 20,
      STR: 6,
      MAG: 0,
      SKL: 7,
      SPD: 7,
      LCK: 2,
      DEF: 5,
      RES: 4,
      CON: 6,
      MOV: 8,
    },
    growth: {
      HP: 60,
      STR: 30,
      MAG: 0,
      SKL: 30,
      SPD: 30,
      LCK: 30,
      DEF: 12,
      RES: 30,
      CON: 0,
      MOV: 0,
    },
  },
  Knight: {
    base: {
      HP: 17,
      STR: 5,
      MAG: 0,
      SKL: 2,
      SPD: 0,
      LCK: 2,
      DEF: 9,
      RES: 0,
      CON: 13,
      MOV: 4,
    },
    growth: {
      HP: 80,
      STR: 40,
      MAG: 0,
      SKL: 30,
      SPD: 15,
      LCK: 25,
      DEF: 28,
      RES: 20,
      CON: 0,
      MOV: 0,
    },
  },
  General: {
    base: {
      HP: 21,
      STR: 8,
      MAG: 0,
      SKL: 4,
      SPD: 3,
      LCK: 2,
      DEF: 13,
      RES: 3,
      CON: 15,
      MOV: 5,
    },
    growth: {
      HP: 75,
      STR: 30,
      MAG: 0,
      SKL: 20,
      SPD: 10,
      LCK: 20,
      DEF: 23,
      RES: 25,
      CON: 0,
      MOV: 0,
    },
  },
  Berserker: {
    base: {
      HP: 24,
      STR: 7,
      MAG: 0,
      SKL: 6,
      SPD: 7,
      LCK: 2,
      DEF: 6,
      RES: 0,
      CON: 13,
      MOV: 6,
    },
    growth: {
      HP: 75,
      STR: 50,
      MAG: 0,
      SKL: 35,
      SPD: 25,
      LCK: 15,
      DEF: 10,
      RES: 13,
      CON: 0,
      MOV: 0,
    },
  },
  Sniper: {
    base: {
      HP: 21,
      STR: 7,
      MAG: 0,
      SKL: 6,
      SPD: 5,
      LCK: 2,
      DEF: 5,
      RES: 2,
      CON: 8,
      MOV: 6,
    },
    growth: {
      HP: 65,
      STR: 30,
      MAG: 0,
      SKL: 30,
      SPD: 20,
      LCK: 30,
      DEF: 15,
      RES: 20,
      CON: 0,
      MOV: 0,
    },
  },
  Bishop: {
    base: {
      HP: 21,
      STR: 0,
      MAG: 4,
      SKL: 4,
      SPD: 4,
      LCK: 2,
      DEF: 3,
      RES: 8,
      CON: 7,
      MOV: 6,
    },
    growth: {
      HP: 45,
      STR: 0,
      MAG: 35,
      SKL: 25,
      SPD: 22,
      LCK: 40,
      DEF: 8,
      RES: 40,
      CON: 0,
      MOV: 0,
    },
  },
  Sage: {
    base: {
      HP: 20,
      STR: 0,
      MAG: 5,
      SKL: 4,
      SPD: 4,
      LCK: 2,
      DEF: 5,
      RES: 5,
      CON: 7,
      MOV: 6,
    },
    growth: {
      HP: 45,
      STR: 0,
      MAG: 45,
      SKL: 30,
      SPD: 25,
      LCK: 15,
      DEF: 10,
      RES: 40,
      CON: 0,
      MOV: 0,
    },
  },
  "Mage Knight": {
    base: {
      HP: 20,
      STR: 0,
      MAG: 4,
      SKL: 3,
      SPD: 5,
      LCK: 2,
      DEF: 5,
      RES: 5,
      CON: 8,
      MOV: 7,
    },
    growth: {
      HP: 45,
      STR: 40,
      MAG: 40,
      SKL: 30,
      SPD: 40,
      LCK: 30,
      DEF: 10,
      RES: 40,
      CON: 0,
      MOV: 0,
    },
  },
  "Wyvern Lord": {
    base: {
      HP: 25,
      STR: 9,
      MAG: 0,
      SKL: 5,
      SPD: 7,
      LCK: 2,
      DEF: 10,
      RES: 1,
      CON: 11,
      MOV: 8,
    },
    growth: {
      HP: 75,
      STR: 40,
      MAG: 0,
      SKL: 30,
      SPD: 20,
      LCK: 20,
      DEF: 20,
      RES: 17,
      CON: 0,
      MOV: 0,
    },
  },
  "Wyvern Knight": {
    base: {
      HP: 20,
      STR: 7,
      MAG: 0,
      SKL: 7,
      SPD: 8,
      LCK: 2,
      DEF: 7,
      RES: 1,
      CON: 10,
      MOV: 8,
    },
    growth: {
      HP: 65,
      STR: 35,
      MAG: 0,
      SKL: 30,
      SPD: 30,
      LCK: 25,
      DEF: 15,
      RES: 20,
      CON: 0,
      MOV: 0,
    },
  },
  Necromancer: {
    base: {
      HP: 18,
      STR: 0,
      MAG: 9,
      SKL: 4,
      SPD: 5,
      LCK: 2,
      DEF: 3,
      RES: 8,
      CON: 7,
      MOV: 6,
    },
    growth: {
      HP: 45,
      STR: 0,
      MAG: 55,
      SKL: 30,
      SPD: 25,
      LCK: 20,
      DEF: 10,
      RES: 35,
      CON: 0,
      MOV: 0,
    },
  },
  "Sword Bonewalker": {
    base: {
      HP: 20,
      STR: 4,
      MAG: 0,
      SKL: 2,
      SPD: 3,
      LCK: 2,
      DEF: 3,
      RES: 0,
      CON: 7,
      MOV: 5,
    },
    growth: {
      HP: 80,
      STR: 50,
      MAG: 0,
      SKL: 30,
      SPD: 20,
      LCK: 10,
      DEF: 12,
      RES: 15,
      CON: 0,
      MOV: 0,
    },
  },
  "Bow Bonewalker": {
    base: {
      HP: 18,
      STR: 4,
      MAG: 0,
      SKL: 3,
      SPD: 2,
      LCK: 2,
      DEF: 3,
      RES: 0,
      CON: 6,
      MOV: 5,
    },
    growth: {
      HP: 70,
      STR: 35,
      MAG: 0,
      SKL: 40,
      SPD: 32,
      LCK: 10,
      DEF: 15,
      RES: 15,
      CON: 0,
      MOV: 0,
    },
  },
  "Arch Mogall": {
    base: {
      HP: 17,
      STR: 0,
      MAG: 6,
      SKL: 3,
      SPD: 3,
      LCK: 2,
      DEF: 3,
      RES: 7,
      CON: 5,
      MOV: 6,
    },
    growth: {
      HP: 45,
      STR: 0,
      MAG: 55,
      SKL: 30,
      SPD: 25,
      LCK: 20,
      DEF: 10,
      RES: 28,
      CON: 0,
      MOV: 0,
    },
  },
  // Manakete: {
  //   base: {
  //     HP: 20,
  //     STR: 0,
  //     MAG: 0,
  //     SKL: 0,
  //     SPD: 2,
  //     LCK: 2,
  //     DEF: 2,
  //     RES: 2,
  //     CON: 5,
  //     MOV: 6,
  //   },
  //   growth: {
  //     HP: 95,
  //     STR: 40,
  //     MAG: 40,
  //     SKL: 30,
  //     SPD: 20,
  //     LCK: 25,
  //     DEF: 0,
  //     RES: 10,
  //     CON: 0,
  //     MOV: 0,
  //   },
  // },
};
