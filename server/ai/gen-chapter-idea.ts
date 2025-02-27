import { genAndCheck } from "@/ai/lib/generator-checker.ts";
import { ChapterIdea, ChapterIdeaSchema } from "@/ai/types/chapter-idea.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { DeadCharacterRecord } from "@/types/dead-character-record.ts";
import {
  testPrologueChapter,
  testTone,
  testWorldSummary,
} from "@/ai/test-data/prologueTestData.ts";

export default function genChapterIdea({
  worldSummary,
  chapterNumber,
  tone,
  initialGameIdea,
  previousChapterIdeas = [],
  allDeadCharacters = [],
  newlyDeadThisChapter = [],
}: {
  worldSummary: WorldSummary;
  chapterNumber: number;
  tone: string;
  initialGameIdea?: InitialGameIdea;
  previousChapterIdeas?: ChapterIdea[];
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
- Return only JSON.
Additionally, the 'intro' must be a thorough single paragraph explaining the reason for the battle, who the boss is, etc. The 'battle' should be brief, focusing primarily on the scenario's setting or map. The 'outro' must be a single paragraph that resolves the chapter's events.`
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
- Return only JSON.
Additionally, the 'intro' and 'outro' fields must each be a single full paragraph summarizing all the events, dialogue, and interactions that happen in those scenes.`;

  const basePrompt = isPrologue
    ? `World Summary: ${JSON.stringify(worldSummary, null, 2)}
Initial Game Idea: ${JSON.stringify(initialGameIdea, null, 2)}
Tone: ${tone}`
    : JSON.stringify({
        worldSummary,
        previousChapterIdeas,
        chapterNumber,
        tone,
        allDeadCharacters,
        newlyDeadThisChapter,
      });

  const checkerSystemMessage = `You are a Fire Emblem Fangame Chapter Idea Checker (checker).
Verify no mention or resurrection of the dead, no old bosses reused, new chars must appear.
Return { fixText: "None", fixObject: {} } if good; else fix instructions. Only JSON.`;

  return genAndCheck<ChapterIdea>({
    fnBaseName: "genChapterIdea",
    generatorSystemMessage,
    generatorPrompt: basePrompt,
    generatorSchema: ChapterIdeaSchema,
    checkerSystemMessage,
    checkerPrompt: (candidate) => {
      return `Candidate:\n${JSON.stringify(candidate, null, 2)}
Constraints:
1) No resurrecting these dead: ${JSON.stringify(allDeadCharacters)}
  a) Note it is allowed for there to be themes of resurrection, zombies, undead, etc within the story line.
2) No old bosses from existingChapters
3) If there are newPlayableUnits or newNonBattleCharacters, ensure they are actually mentioned by name in the intro, battle, or outro text. Look for their exact firstName in the text.
If all good => fixText="None". Otherwise => fix instructions.`;
    },
  });
}
if (import.meta.main) {
  genChapterIdea({
    worldSummary: testWorldSummary,
    chapterNumber: 1,
    tone: testTone,
    previousChapterIdeas: [testPrologueChapter.idea],
  }).then((res) => {
    console.log("Chapter Idea:", JSON.stringify(res, null, 2));
  });
}

