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

CRITICAL REQUIREMENTS:
- Must include ALL required fields: title, intro, battle, outro, boss, enemyFaction
- enemyFaction MUST be included with nid, name, desc, and icon_nid
- If you add newPlayableUnits or newNonBattleCharacters, you MUST mention EACH CHARACTER BY NAME explicitly in intro, battle, or outro text
- Must not reuse or resurrect any dead characters
- Must not reuse a previous boss from earlier chapters
- Must produce a new Chapter Idea that strictly matches the ChapterIdea schema
- Return only JSON without any commentary

Additionally, the 'intro' must be a thorough single paragraph explaining the reason for the battle, who the boss is, etc. The 'battle' should be brief, focusing primarily on the scenario's setting or map. The 'outro' must be a single paragraph that resolves the chapter's events.`
    : `You are a Fire Emblem Fangame Chapter Idea Generator (generator).

We have:
- A World Summary
- Existing chapters
- Dead characters: ${JSON.stringify(allDeadCharacters)}
- Newly dead: ${JSON.stringify(newlyDeadThisChapter)}
We want chapter ${chapterNumber}. Return only valid JSON, no commentary.

CRITICAL REQUIREMENTS:
- Must include ALL required fields: title, intro, battle, outro, boss, enemyFaction
- enemyFaction MUST be included with nid, name, desc, and icon_nid
- If you add newPlayableUnits or newNonBattleCharacters, you MUST mention EACH CHARACTER BY NAME explicitly in intro, battle, or outro text
- Must not reuse or resurrect any dead characters
- Must not reuse a previous boss from earlier chapters
- Must produce a new Chapter Idea that strictly matches the ChapterIdea schema
- Return only JSON without any commentary

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
Check that all required fields are present and that new characters are mentioned in the text.
Themes of resurrection, undead, etc. are perfectly fine in the story - only check that actual dead characters from previous chapters aren't brought back as active characters.
Dramatic language in death quotes (like "I'll rise again") is completely acceptable.
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
1) MUST have all required fields: title, intro, battle, outro, boss, enemyFaction. Verify each is present and properly formatted.
2) ONLY check that dead characters from this list: ${JSON.stringify(allDeadCharacters)} don't appear as active characters in the new chapter.
  a) It is completely fine for the story to have themes of resurrection, zombies, undead, etc.
  b) Dramatic language in death quotes (like "I will rise again" or similar) is completely acceptable.
  c) New bosses and characters are always allowed even if they talk about resurrection themes.
3) Only check that boss characters from previous chapters aren't reused with the same name and role.
4) If there are newPlayableUnits or newNonBattleCharacters arrays present, ensure each character in these arrays is explicitly mentioned BY NAME (their exact firstName) in the intro, battle, or outro text. The boss character is already a required field and doesn't need this validation.
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