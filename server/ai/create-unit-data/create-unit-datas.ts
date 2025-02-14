import { CharacterIdea } from "@/ai/types/character-idea.ts";
import createUnitData from "@/ai/create-unit-data/create-unit-data.ts";
import { UnitData } from "@/types/character/unit-data.ts";
import {
  testCharIdeaAislin,
  testCharIdeaThorne,
} from "@/ai/test-data/character-ideas.ts";

export default function createUnitDatas({
  characterIdeas,
  chapterNumber,
}: {
  characterIdeas: CharacterIdea[];
  chapterNumber: number;
}): Promise<UnitData[]> {
  return Promise.all(
    characterIdeas.map((idea) =>
      createUnitData({ characterIdea: idea, chapterNumber })
    )
  );
}

if (import.meta.main) {
  createUnitDatas({
    characterIdeas: [testCharIdeaAislin, testCharIdeaThorne],
    chapterNumber: 5,
  }).then(console.log);
}

