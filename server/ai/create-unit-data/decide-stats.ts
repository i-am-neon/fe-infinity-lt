import { FE8Class } from "@/types/fe8-class.ts";
import { StatValues } from "../../types/character/unit-data.ts";
import { unitStatsLookup } from "@/ai/create-unit-data/unit-stats-lookup.ts";
import { StatBoon } from "@/ai/types/stat-boons.ts";

export default function decideStats({
  fe8Class,
  level,
  isPromoted,
  statBoons,
}: {
  fe8Class: FE8Class;
  level: number;
  isPromoted: boolean;
  statBoons?: StatBoon;
}): {
  baseStats: StatValues;
  growthRates: StatValues;
} {
  const data = unitStatsLookup[fe8Class] || unitStatsLookup["Cavalier"];

  const baseStats = { ...data.base };
  const growthRates = { ...data.growth };

  // Apply stat boosts if provided
  if (statBoons) {
    // Apply base stat boosts
    for (const boost of statBoons.baseStatBoosts) {
      baseStats[boost.stat] += boost.value;
    }

    // Apply growth rate boosts
    for (const boost of statBoons.growthRateBoosts) {
      growthRates[boost.stat] += boost.value;
    }
  }

  const effectiveLevel = isPromoted ? level + 20 : level;
  if (effectiveLevel > 1) {
    for (let i = 2; i <= effectiveLevel; i++) {
      for (const stat of Object.keys(baseStats) as (keyof StatValues)[]) {
        const roll = Math.random() * 100;
        if (roll < growthRates[stat]) {
          baseStats[stat]++;
        }
      }
    }
  }

  return { baseStats, growthRates };
}

if (import.meta.main) {
  const testInputs: {
    fe8Class: FE8Class;
    level: number;
    isPromoted: boolean;
  }[] = [
      { fe8Class: "Cleric", level: 1, isPromoted: false },
      { fe8Class: "Myrmidon", level: 20, isPromoted: false },
      { fe8Class: "Knight", level: 20, isPromoted: false },
      { fe8Class: "Wyvern Lord", level: 20, isPromoted: true },
      { fe8Class: "Paladin", level: 20, isPromoted: true },
    ];
  const results = testInputs.map((input) => {
    const stats = decideStats({
      fe8Class: input.fe8Class,
      level: input.level,
      isPromoted: input.isPromoted,
    });
    return {
      fe8Class: input.fe8Class,
      level: input.level,
      isPromoted: input.isPromoted,
      baseStats: stats.baseStats,
      growthRates: stats.growthRates,
    };
  });
  console.log(JSON.stringify(results, null, 2));
}

