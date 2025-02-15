import { ChapterIdea, ChapterIdeaSchema } from "@/ai/types/chapter-idea.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { Chapter } from "@/types/chapter.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";
import {
  testWorldSummary,
  testInitialGameIdea,
} from "@/ai/test-data/initial.ts";

export default function genSubsequentChapterIdea({
  worldSummary,
  initialGameIdea,
  chapters,
  nextChapterNumber,
  tone,
}: {
  worldSummary: WorldSummary;
  initialGameIdea: InitialGameIdea;
  chapters: Chapter[];
  nextChapterNumber: number;
  tone: string;
}): Promise<ChapterIdea> {
  const systemMessage = `You are a Fire Emblem Fangame Chapter Idea Generator!

We already have:
- A World Summary
- An Initial Game Idea for the Prologue
- A list of existing chapters
We are about to create chapter ${nextChapterNumber}, continuing from the prior chapters' story.

Use the entire context to maintain consistency. Provide a cohesive storyline that references prior events or details if needed.

Output is strictly a JSON object matching the ChapterIdea schema.`;

  const prompt = JSON.stringify({
    worldSummary,
    initialGameIdea,
    chapters,
    nextChapterNumber,
    tone,
  });

  return generateStructuredData<ChapterIdea>({
    fnName: "genSubsequentChapterIdea",
    systemMessage,
    prompt,
    schema: ChapterIdeaSchema,
    temperature: 0.8,
  });
}

if (import.meta.main) {
  genSubsequentChapterIdea({
    worldSummary: testWorldSummary,
    initialGameIdea: testInitialGameIdea,
    chapters: [], // TODO: Add test data
    nextChapterNumber: 1,
    tone: "dark and gritty",
  }).then((res) => console.log(JSON.stringify(res, null, 2)));
}
