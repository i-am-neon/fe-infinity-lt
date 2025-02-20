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
import { DeadCharacterRecord } from "@/types/dead-character-record.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";

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
  allDeadCharacters = [],
  newlyDeadThisChapter = [],
}: {
  worldSummary: WorldSummary;
  chapterNumber: number;
  tone: string;
  initialGameIdea?: InitialGameIdea;
  existingChapters?: Chapter[];
  allDeadCharacters?: DeadCharacterRecord[];
  newlyDeadThisChapter?: DeadCharacterRecord[];
}): Promise<ChapterIdea> {
  if (chapterNumber === 0 && initialGameIdea) {
    // Prologue logic
    const systemMessage = `You are a Fire Emblem Fangame Chapter Idea Generator!

The user provides:
1) A World Summary
2) An Initial Game Idea
3) A tone
4) A list of all previously dead characters: ${JSON.stringify(
      allDeadCharacters
    )}
5) Characters who died specifically in the last chapter: ${JSON.stringify(
      newlyDeadThisChapter
    )}
They want you to generate a single new chapter that logically follows from them for the Prologue (chapterNumber=0).

## New Characters
- All new characters must be human.
- When adding Non Battle Characters, use them in the intro/outro as needed.

Your output must strictly match the ChapterIdea schema.`;

    const prompt = `World Summary: ${JSON.stringify(worldSummary, null, 2)}
Initial Game Idea: ${JSON.stringify(initialGameIdea, null, 2)}
Tone: ${tone}`;

    return generateStructuredData<ChapterIdea>({
      fnName: "genChapterIdea: Prologue",
      systemMessage,
      prompt,
      schema: ChapterIdeaSchema.omit({ newPlayableUnits: true }),
      temperature: 0.8,
    });
  } else {
    const logger = getCurrentLogger();
    logger.debug("Dead characters used in genChapterIdea", {
      allDeadCharacters,
      newlyDeadThisChapter,
    });
    // Subsequent chapter logic
    const systemMessage = `You are a Fire Emblem Fangame Chapter Idea Generator!

We already have:
- A World Summary
- A list of existing chapters
- A list of all previously dead characters (an array of { name, role }), each role is "boss", "player", or "green": ${JSON.stringify(
      allDeadCharacters
    )}. You must NOT give these characters speaking roles in the current chapter idea! They are dead and the story can reference and change because of that, but dead characters can never show up again in any scenes.
- Characters who died specifically in the last chapter (also { name, role } records): ${JSON.stringify(
      newlyDeadThisChapter
    )}. You must NOT give these characters speaking roles in the current chapter idea! They are dead and the story can reference and change because of that, but dead characters can never show up again in any scenes.
- Characters who died specifically in the last chapter: ${JSON.stringify(
      newlyDeadThisChapter
    )}. You must NOT give these characters speaking roles in the current chapter idea! They are dead and the story can reference and change because of that, but dead characters can never show up again in any scenes.
We are about to create chapter ${chapterNumber}, continuing from the prior chapters' story.

Important continuity rules for dead characters:
- Any dead characters must remain dead and not reappear in any dialogue.
- Living player characters might reference the deaths of dead player characters, highlighting the relationship between them and the deceased.
- The death of characters central to the storyline must be referenced in the story, and will likely change the direction of the next chapter.
- Minor unit deaths should be referenced in the story, but will likely only alter the next chapter slightly.
- When referencing dead boss characters, make sure to never refer to them as part of the player party.


## New Characters
- All new characters must be human.
- When adding Non Battle Characters, use them in the intro/outro as needed.
- When creating a boss character, you must not use any bosses from past chapters. You must create a new boss character.

Output must strictly match the ChapterIdea schema.`;

    const prompt = JSON.stringify({
      worldSummary,
      existingChapters,
      chapterNumber,
      tone,
    });

    return generateStructuredData<ChapterIdea>({
      fnName: `genChapterIdea: Ch ${chapterNumber}`,
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

