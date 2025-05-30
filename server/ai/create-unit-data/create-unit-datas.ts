import createUnitData from "@/ai/create-unit-data/create-unit-data.ts";
import {
  testCharIdeaAislin,
  testCharIdeaThorne,
} from "@/ai/test-data/character-ideas.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import { UnitData } from "@/types/character/unit-data.ts";

export default async function createUnitDatas({
  characterIdeas,
  chapterNumber,
}: {
  characterIdeas: CharacterIdea[];
  chapterNumber: number;
}): Promise<UnitData[]> {
  const logger = getCurrentLogger();
  const start = Date.now();
  const datas = await Promise.all(
    characterIdeas.map((idea) =>
      // Don't create unit data for non-playable characters
      idea.firstSeenAs !== "non-playable character"
        ? createUnitData({ characterIdea: idea, chapterNumber })
        : null
    )
  );
  const duration = Date.now() - start;
  logger.info("createUnitDatas completed", { duration, count: datas.length });
  return datas.filter((data) => data !== null);
}

if (import.meta.main) {
  createUnitDatas({
    characterIdeas: [testCharIdeaAislin, testCharIdeaThorne],
    chapterNumber: 5,
  }).then(console.log);
}

