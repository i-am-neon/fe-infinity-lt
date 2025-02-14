import { UnitData } from "../../types/character/unit-data.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";
import decideLevel from "@/ai/create-unit-data/decide-level.ts";
import decideClass from "@/ai/create-unit-data/decide-class.ts";
import decideStats from "@/ai/create-unit-data/decide-stats.ts";
import { testCharIdeaThorne } from "@/ai/test-data/character-ideas.ts";

export default async function createUnitData({
  characterIdea,
  chapterNumber,
}: {
  characterIdea: CharacterIdea;
  chapterNumber: number;
}): Promise<UnitData> {
  const { isPromoted, level } = decideLevel(chapterNumber);
  const klass = await decideClass({ isPromoted, level, characterIdea });
  const { baseStats, growthRates } = decideStats(klass);
  return {
    nid: characterIdea.firstName,
    name: characterIdea.firstName,
    desc: characterIdea.inGameDescription,
    variant: null,
    level,
    klass,
    tags: [],
    bases: baseStats,
    growths: growthRates,
    stat_cap_modifiers: {},
    starting_items: [],
    learned_skills: [],
    unit_notes: [],
    wexp_gain: {
      Sword: [false, 0, 251],
      Lance: [false, 0, 251],
      Axe: [false, 0, 251],
      Bow: [false, 0, 251],
      Staff: [false, 0, 251],
      Light: [false, 0, 251],
      Anima: [false, 0, 251],
      Dark: [false, 0, 251],
      Default: [false, 0, 251],
    },
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

