import { genAndCheck } from "@/ai/lib/generator-checker.ts";
import {
  InitialGameIdea,
  initialGameIdeaSchema,
} from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { Chapter } from "@/types/chapter.ts";
import { DeadCharacterRecord } from "@/types/dead-character-record.ts";
import { testTone, testWorldSummary } from "./test-data/prologueTestData.ts";

export default function genInitialGameIdea({
  worldSummary,
  tone,
  existingChapters = [],
  allDeadCharacters = [],
}: {
  worldSummary: WorldSummary;
  tone: string;
  existingChapters?: Chapter[];
  allDeadCharacters?: DeadCharacterRecord[];
}): Promise<InitialGameIdea> {
  const generatorSystemMessage = `You are a Fire Emblem Fangame Prologue Story Generator (generator).
We want an initialGameIdea with:
- at least 3 new playable characters
- short backstory
- 1+ potential plot directions
No resurrecting from dead array: ${JSON.stringify(allDeadCharacters)}
Return only JSON.`;

  const userPrompt = `World Summary: ${JSON.stringify(worldSummary, null, 2)}
Tone: ${tone}
existingChapters: ${JSON.stringify(existingChapters, null, 2)}
allDeadCharacters: ${JSON.stringify(allDeadCharacters, null, 2)}`;

  const checkerSystemMessage = `You are a Fire Emblem Fangame Prologue Checker (checker).
Check constraints:
1) 3+ char ideas
2) no resurrecting dead
If valid => fixText=None. Otherwise => fix instructions as fixObject.`;

  return genAndCheck<InitialGameIdea>({
    fnBaseName: "genInitialGameIdea",
    generatorSystemMessage,
    generatorPrompt: userPrompt,
    generatorSchema: initialGameIdeaSchema,
    checkerSystemMessage,
    checkerPrompt: (candidate) => {
      return `Candidate:\n${JSON.stringify(candidate, null, 2)}
Constraints:
- Must have >=3 char ideas
- No resurrecting: ${JSON.stringify(allDeadCharacters)}
If good => fixText=None. Else => fix instructions.`;
    },
  });
}

if (import.meta.main) {
  genInitialGameIdea({
    worldSummary: testWorldSummary,
    tone: testTone,
    existingChapters: [],
  })
    .then((idea) =>
      console.log("Initial Game Idea:", JSON.stringify(idea, null, 2))
    )
    .catch(console.error);
}

