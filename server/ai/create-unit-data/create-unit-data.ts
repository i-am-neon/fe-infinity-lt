import { UnitData } from "@/types/character/unit-data.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";
import decideLevel from "@/ai/create-unit-data/decide-level.ts";
import decideClassForNonGeneric from "./decide-class-for-non-generic.ts";
import decideStats from "@/ai/create-unit-data/decide-stats.ts";
import genCharacterStatBoons from "@/ai/create-unit-data/gen-character-stat-boons.ts";
import { testCharIdeaThorne } from "@/ai/test-data/character-ideas.ts";
import getWeaponExp from "@/ai/create-unit-data/get-weapon-exp.ts";
import { FE8ClassToLTNidMap } from "@/types/fe8-class.ts";
import decideUnitWeapons from "../../item-options/decide-unit-weapons.ts";
import decideStartingNonWeaponItems from "../../item-options/decide-starting-non-weapon-items.ts";
import hasLockpick from "@/item-options/has-lockpick.ts";
import replaceBadCharacters from "@/lib/formatting/replace-bad-characters.ts";

export default async function createUnitData({
  characterIdea,
  chapterNumber,
}: {
  characterIdea: CharacterIdea;
  chapterNumber: number;
}): Promise<UnitData> {
  let { isPromoted, level } = decideLevel(chapterNumber);
  if (
    characterIdea.firstSeenAs === "ally" ||
    characterIdea.firstSeenAs === "allied NPC"
  ) {
    level += 2;
    if (!isPromoted && level > 20) {
      level = 20;
    } else if (isPromoted && level > 20) {
      level = 20;
    }
  }
  const klass = await decideClassForNonGeneric({ isPromoted, level, characterIdea });

  // Generate stat boons based on character concept and class
  const statBoons = await genCharacterStatBoons({
    character: characterIdea,
    fe8Class: klass,
  });

  const { baseStats, growthRates } = decideStats({
    fe8Class: klass,
    // Give player units higher stats
    level,
    isPromoted,
    statBoons,
  });
  // Combine all starting items
  const startingItems = [
    ...decideUnitWeapons({
      fe8Class: klass,
      level,
      isPromoted,
      isBoss: characterIdea.firstSeenAs === "boss",
    }),
    ...decideStartingNonWeaponItems({
      isBoss: characterIdea.firstSeenAs === "boss",
      isPromoted,
      level,
      chapterNumber,
    }),
  ];

  // Post-processing to ensure player units never have droppable items
  // For enemy units, only the last item should be droppable
  const isPlayerUnit =
    characterIdea.firstSeenAs === "ally" ||
    characterIdea.firstSeenAs === "allied NPC";

  // For player units, make sure no items are droppable
  if (isPlayerUnit) {
    for (let i = 0; i < startingItems.length; i++) {
      startingItems[i] = [startingItems[i][0], false];
    }
  }
  // For enemy units, ensure only the last item is droppable
  else {
    // First, find if there's any droppable item
    const droppableIndex = startingItems.findIndex(item => item[1]);

    // If there's a droppable item
    if (droppableIndex !== -1) {
      // Make all items non-droppable
      for (let i = 0; i < startingItems.length; i++) {
        startingItems[i] = [startingItems[i][0], false];
      }

      // Make only the last item droppable
      if (startingItems.length > 0) {
        const lastIndex = startingItems.length - 1;
        startingItems[lastIndex] = [startingItems[lastIndex][0], true];
      }
    }
  }

  // Always give thieves, rogues, and assassins a lockpick if they don't have one
  if (
    (klass === "Thief" || klass === "Rogue" || klass === "Assassin") &&
    !hasLockpick(startingItems)
  ) {
    startingItems.push(["Lockpick", false]);
  }

  return {
    nid: characterIdea.firstName,
    name: characterIdea.firstName,
    desc: replaceBadCharacters(characterIdea.inGameDescription),
    variant: characterIdea.gender === "female" ? "Female" : null,
    level,
    klass: FE8ClassToLTNidMap[klass],
    tags: characterIdea.firstSeenAs === "boss" ? ["Boss"] : [],
    bases: baseStats,
    growths: growthRates,
    stat_cap_modifiers: {},
    starting_items: startingItems,
    learned_skills: [],
    unit_notes: [],
    wexp_gain: getWeaponExp({ className: klass, level, isPromoted }),
    alternate_classes: [],
    portrait_nid: characterIdea.firstName,
    affinity: characterIdea.affinity,
    fields: [],
  };
}

if (import.meta.main) {
  createUnitData({ characterIdea: testCharIdeaThorne, chapterNumber: 0 }).then(
    console.log
  );
}
