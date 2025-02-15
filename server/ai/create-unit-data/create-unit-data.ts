import { UnitData } from "@/types/character/unit-data.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";
import decideLevel from "@/ai/create-unit-data/decide-level.ts";
import decideClass from "@/ai/create-unit-data/decide-class.ts";
import decideStats from "@/ai/create-unit-data/decide-stats.ts";
import { testCharIdeaThorne } from "@/ai/test-data/character-ideas.ts";
import getWeaponExp from "@/ai/create-unit-data/get-weapon-exp.ts";
import { FE8ClassToLTNidMap } from "@/types/fe8-class.ts";
import decideUnitWeapons from "@/ai/create-unit-data/item-options/decide-unit-weapons.ts";

export default async function createUnitData({
  characterIdea,
  chapterNumber,
}: {
  characterIdea: CharacterIdea;
  chapterNumber: number;
}): Promise<UnitData> {
  const { isPromoted, level } = decideLevel(chapterNumber);
  const klass = await decideClass({ isPromoted, level, characterIdea });
  const { baseStats, growthRates } = decideStats({
    fe8Class: klass,
    level,
    isPromoted,
  });
  return {
    nid: characterIdea.firstName,
    name: characterIdea.firstName,
    desc: characterIdea.inGameDescription,
    variant: null,
    level,
    klass: FE8ClassToLTNidMap[klass],
    tags: characterIdea.firstSeenAs === "boss" ? ["Boss"] : [],
    bases: baseStats,
    growths: growthRates,
    stat_cap_modifiers: {},
    starting_items: decideUnitWeapons({ fe8Class: klass, level, isPromoted }),
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
