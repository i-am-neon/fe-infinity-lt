import { ChapterIdea, ChapterIdeaSchema } from "@/ai/types/chapter-idea.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { Chapter } from "@/types/chapter.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";
import {
  testWorldSummary,
  testTone,
  testInitialGameIdea,
} from "@/ai/test-data/initial.ts";

/**
 * Generates a chapter idea for either the prologue (chapterNumber=0) if initialGameIdea is provided,
 * or a subsequent chapter if initialGameIdea is not provided.
 *
 * If chapterNumber=0 and initialGameIdea is defined:
 *   - We generate a prologue chapter idea referencing the initialGameIdea.
 *
 * If chapterNumber>0 or no initialGameIdea is given:
 *   - We generate a subsequent chapter idea referencing existingChapters to ensure continuity.
 */
export default function genChapterIdea({
  worldSummary,
  chapterNumber,
  tone,
  initialGameIdea,
  existingChapters = [],
}: {
  worldSummary: WorldSummary;
  chapterNumber: number;
  tone: string;
  initialGameIdea?: InitialGameIdea;
  existingChapters?: Chapter[];
}): Promise<ChapterIdea> {
  if (chapterNumber === 0 && initialGameIdea) {
    // Prologue logic
    const systemMessage = `You are a Fire Emblem Fangame Chapter Idea Generator!

The user provides:
1) A World Summary
2) An Initial Game Idea
3) A tone

They want you to generate a single new chapter that logically follows from them for the Prologue (chapterNumber=0).

## New Characters
- All new characters must be human.
- When adding Non Battle Characters, use them in the intro/outro as needed.

Your output must strictly match the ChapterIdea schema.`;

    const prompt = `World Summary: ${JSON.stringify(worldSummary, null, 2)}
Initial Game Idea: ${JSON.stringify(initialGameIdea, null, 2)}
Tone: ${tone}`;

    return generateStructuredData<ChapterIdea>({
      fnName: "genChapterIdeaPrologue",
      systemMessage,
      prompt,
      schema: ChapterIdeaSchema.omit({ newPlayableUnits: true }),
      temperature: 0.8,
    });
  } else {
    // Subsequent chapter logic
    const systemMessage = `You are a Fire Emblem Fangame Chapter Idea Generator!

We already have:
- A World Summary
- A list of existing chapters
We are about to create chapter ${chapterNumber}, continuing from the prior chapters' story.

Use the entire context to maintain consistency. Provide a cohesive storyline that references prior events or details if needed.

## New Characters
- All new characters must be human.
- When adding Non Battle Characters, use them in the intro/outro as needed.

Output must strictly match the ChapterIdea schema.`;

    const prompt = JSON.stringify({
      worldSummary,
      existingChapters,
      chapterNumber,
      tone,
    });

    return generateStructuredData<ChapterIdea>({
      fnName: "genChapterIdeaSubsequent",
      systemMessage,
      prompt,
      schema: ChapterIdeaSchema,
      temperature: 0.8,
    });
  }
}

if (import.meta.main) {
  // Prologue example
  genChapterIdea({
    worldSummary: testWorldSummary,
    chapterNumber: 0,
    tone: testTone,
    initialGameIdea: testInitialGameIdea,
  }).then((res) => {
    console.log("Prologue Chapter Idea:", JSON.stringify(res, null, 2));
  });

  // Subsequent chapter example
  genChapterIdea({
    worldSummary: testWorldSummary,
    chapterNumber: 2,
    tone: testTone,
    existingChapters: [],
  }).then((res) => {
    console.log("Subsequent Chapter Idea:", JSON.stringify(res, null, 2));
  });
}

