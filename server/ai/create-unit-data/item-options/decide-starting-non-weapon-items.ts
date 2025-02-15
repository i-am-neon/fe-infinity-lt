import {
  attributeIncreaseItems,
  promotionItems,
} from "@/ai/create-unit-data/item-options/non-weapon-item-options.ts";

/**
 * Decides the non-weapon items for a player unit, green unit, or boss.
 * Returns an array of [itemNid, isDroppable].
 */
export interface DecideStartingNonWeaponItemsOptions {
  isBoss?: boolean;
  isPromoted?: boolean;
  level: number;
  chapterNumber: number;
}

/**
 * Decide an array of items for the unit based on the rules:
 * 1) Always give a Vulnerary or Elixir
 *    - If the unit is promoted or level >= 15, there's a chance to give an Elixir.
 *    - If the unit is a boss, that chance is 50%, else 30%.
 * 2) Potentially give exactly one more item, chosen from promotion items (ch >= 5), attribute items, or gems.
 *    Weighted random approach example:
 *       - 50% chance no extra item
 *       - 25% chance promotion item (if chapter >= 5)
 *       - 15% chance attribute item
 *       - 10% chance gem
 * 3) Gems: pick Red Gem if chapter < 10, Blue Gem if chapter < 20, else White Gem.
 * 4) Return items as [nid, false].
 */
export default function decideStartingNonWeaponItems(
  opts: DecideStartingNonWeaponItemsOptions
): [string, boolean][] {
  const { isBoss = false, isPromoted = false, level, chapterNumber } = opts;
  const items: [string, boolean][] = [];

  // 1) Always give a healing item with increasing chance for Elixir based on chapterNumber
  let chanceElixir = 0;
  if (chapterNumber >= 5) {
    chanceElixir = ((chapterNumber - 5) / 15) * 2;
  }
  if ((isPromoted || level >= 15) && Math.random() < chanceElixir) {
    items.push(["Elixir", isBoss ? true : false]);
  } else {
    items.push(["Vulnerary", isBoss ? true : false]);
  }

  // 2) Possibly give one extra item
  // Weighted approach example:
  // - 50% no extra item
  // - 25% promotion item (only if chapterNumber >= 5)
  // - 15% attribute item
  // - 25% gem
  const rand = Math.random();
  let cumulative = 0;

  // 50% no extra
  cumulative += 0.5;
  if (rand < cumulative) {
    return items; // no extra item
  }

  // 25% promotion item, only if chapter >= 5
  const promotionChance = chapterNumber >= 5 ? 0.25 : 0;
  const attributeChance = 0.15;
  const gemChance = 0.25;
  // If promotionChance is 0, it effectively redistributes or reduces the odds
  // In that scenario, the actual "next" region might be smaller.

  let nextCutoff = cumulative + promotionChance;
  if (rand < nextCutoff) {
    // Pick a random promotion item
    const pItem =
      promotionItems[Math.floor(Math.random() * promotionItems.length)];
    items.push([pItem, isBoss ? true : false]);
    return items;
  }

  // 15% attribute item
  cumulative = nextCutoff;
  nextCutoff += attributeChance;
  if (rand < nextCutoff) {
    const aItem =
      attributeIncreaseItems[
        Math.floor(Math.random() * attributeIncreaseItems.length)
      ];
    items.push([aItem, isBoss ? true : false]);
    return items;
  }

  // 10% gem
  cumulative = nextCutoff;
  nextCutoff += gemChance;
  if (rand < nextCutoff) {
    let gem = "Red_Gem";
    if (chapterNumber >= 20) {
      gem = "White_Gem";
    } else if (chapterNumber >= 10) {
      gem = "Blue_Gem";
    }
    items.push([gem, isBoss ? true : false]);
    return items;
  }

  // If none of the above triggered due to truncated sum, then no item
  return items;
}

if (import.meta.main) {
  const testCases: DecideStartingNonWeaponItemsOptions[] = [
    { level: 1, chapterNumber: 1 },
    { isBoss: true, level: 4, chapterNumber: 2 },
    { isPromoted: true, level: 10, chapterNumber: 5 },
    { isPromoted: true, level: 20, chapterNumber: 15, isBoss: true },
    { level: 18, chapterNumber: 25 },
    { level: 14, chapterNumber: 5 },
  ];
  for (const tc of testCases) {
    const res = decideStartingNonWeaponItems(tc);
    console.log("Options:", tc, "=> items", res);
  }
}
