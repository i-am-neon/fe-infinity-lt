import { genAndCheck } from "@/ai/lib/generator-checker.ts";
import { ChapterIdea, ChapterIdeaSchema } from "@/ai/types/chapter-idea.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { Chapter } from "@/types/chapter.ts";
import { DeadCharacterRecord } from "@/types/dead-character-record.ts";
import { z } from "zod";
import {
  testPrologueChapter,
  testTone,
  testWorldSummary,
} from "./test-data/prologueTestData.ts";

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
  const isPrologue = chapterNumber === 0 && initialGameIdea;

  const generatorSystemMessage = isPrologue
    ? `You are a Fire Emblem Fangame Chapter Idea Generator (generator).

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
We want to generate a single new chapter that logically follows them for the Prologue (chapterNumber=0).

Requirements:
- Must not reuse or resurrect any dead characters
- Must not reuse a previous boss from earlier chapters
- If you add newPlayableUnits or newNonBattleCharacters, mention them in intro/battle/outro
- Must produce a new Chapter Idea that strictly matches the ChapterIdea schema.
- Return only JSON.`
    : `You are a Fire Emblem Fangame Chapter Idea Generator (generator).

We have:
- A World Summary
- Existing chapters
- Dead characters: ${JSON.stringify(allDeadCharacters)}
- Newly dead: ${JSON.stringify(newlyDeadThisChapter)}
We want chapter ${chapterNumber}. Return only valid JSON, no commentary.
Constraints: No resurrecting the dead, no reusing old bosses, mention new chars in intro/battle/outro, must match ChapterIdea schema.

Requirements:
- Must not reuse or resurrect any dead characters
- Must not reuse a previous boss from earlier chapters
- If you add newPlayableUnits or newNonBattleCharacters, mention them in intro/battle/outro
- Must produce a new Chapter Idea that strictly matches the ChapterIdea schema.
- Return only JSON.`;

  const basePrompt = isPrologue
    ? `World Summary: ${JSON.stringify(worldSummary, null, 2)}
Initial Game Idea: ${JSON.stringify(initialGameIdea, null, 2)}
Tone: ${tone}`
    : JSON.stringify({
        worldSummary,
        existingChapters,
        chapterNumber,
        tone,
        allDeadCharacters,
        newlyDeadThisChapter,
      });

  const checkerSystemMessage = `You are a Fire Emblem Fangame Chapter Idea Checker (checker).
Verify no mention or resurrection of the dead, no old bosses reused, new chars must appear.
Return { fixText: "None", fixObject: {} } if good; else fix instructions. Only JSON.`;

  return genAndCheck<ChapterIdea>({
    generatorSystemMessage,
    generatorPrompt: basePrompt,
    generatorSchema: ChapterIdeaSchema,

    checkerSystemMessage,
    checkerPrompt: (candidate) => {
      return `Candidate:\n${JSON.stringify(candidate, null, 2)}
Constraints:
1) No resurrecting these dead: ${JSON.stringify(allDeadCharacters)}
2) No old bosses from existingChapters
3) If there are newPlayableUnits or newNonBattleCharacters, they must appear in one of: intro, battle, or outro. For each new character's firstName, check if it is present in candidate.intro + candidate.battle + candidate.outro. If not found, fix.
If all good => fixText=None. Otherwise => fixObject.`;
    },
    checkerSchema: z.object({
      fixText: z.string(),
      fixObject: ChapterIdeaSchema.partial(),
    }),

    generatorModel: "gpt-4o",
    temperatureGenerator: 1,
    checkerModel: "gpt-4o",
    temperatureChecker: 0,
    maxAttempts: 3,
  });
}

if (import.meta.main) {
  genChapterIdea({
    worldSummary: testWorldSummary,
    chapterNumber: 1,
    tone: testTone,
    existingChapters: [testPrologueChapter],
  }).then((res) => {
    console.log("Chapter Idea:", JSON.stringify(res, null, 2));
  });
}

