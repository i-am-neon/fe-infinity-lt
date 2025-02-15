import { ChapterIdea, ChapterIdeaSchema } from "@/ai/types/chapter-idea.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";
import {
  testWorldSummary,
  testInitialGameIdea,
  testTone,
} from "@/ai/test-data/initial.ts";

export default function genChapterIdea({
  worldSummary,
  initialGameIdea,
  tone,
  chapterNumber,
}: {
  worldSummary: WorldSummary;
  initialGameIdea: InitialGameIdea;
  tone: string;
  chapterNumber: number;
}): Promise<ChapterIdea> {
  const systemMessage = `You are a Fire Emblem Fangame Chapter Idea Generator!

The user provides:
1) A World Summary
2) An Initial Game Idea
3) A tone

Your job:
Generate a single new chapter that logically follows from them.

## New Characters
- All new characters must be human.
- When adding Non Battle Characters, make sure to use them in the intro and/or outro.
`;

  const prompt = `World Summary: ${JSON.stringify(worldSummary, null, 2)}
Initial Game Idea: ${JSON.stringify(initialGameIdea, null, 2)}
Tone: ${tone}`;

  return generateStructuredData<ChapterIdea>({
    fnName: "genChapterIdea",
    systemMessage,
    prompt,
    schema:
      chapterNumber === 0
        ? ChapterIdeaSchema.omit({ newPlayableUnits: true })
        : ChapterIdeaSchema,
    temperature: 0.8,
  });
}

if (import.meta.main) {
  genChapterIdea({
    worldSummary: testWorldSummary,
    initialGameIdea: testInitialGameIdea,
    tone: testTone,
    chapterNumber: 0,
  }).then((chapterIdea) => {
    console.log(JSON.stringify(chapterIdea, null, 2));
  });
}

