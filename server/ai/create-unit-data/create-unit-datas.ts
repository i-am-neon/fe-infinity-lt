import { CharacterIdea } from "@/ai/types/character-idea.ts";
import createUnitData from "@/ai/create-unit-data/create-unit-data.ts";
import { UnitData } from "@/types/character/unit-data.ts";
import {
  testCharIdeaAislin,
  testCharIdeaThorne,
} from "@/ai/test-data/character-ideas.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";

export default function createUnitDatas({
  characterIdeas,
  chapterNumber,
}: {
  characterIdeas: CharacterIdea[];
  chapterNumber: number;
}): Promise<UnitData[]> {
  const logger = getCurrentLogger();
  const start = Date.now();
  return Promise.all(
    characterIdeas.map((idea) =>
      createUnitData({ characterIdea: idea, chapterNumber })
    )
  ).then((datas) => {
    const duration = Date.now() - start;
    logger.info("createUnitDatas completed", { duration, count: datas.length });
    return datas;
  });
}

if (import.meta.main) {
  createUnitDatas({
    characterIdeas: [testCharIdeaAislin, testCharIdeaThorne],
    chapterNumber: 5,
  }).then(console.log);
}

