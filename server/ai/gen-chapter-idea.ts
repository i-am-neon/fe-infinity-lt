import { genAndCheck } from "@/ai/lib/generator-checker.ts";
import {
  testPrologueChapter,
  testTone,
  testWorldSummary,
} from "@/ai/test-data/prologueTestData.ts";
import { ChapterIdea, ChapterIdeaSchema } from "@/ai/types/chapter-idea.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { validateCharacterMentions } from "@/ai/validators/validate-character-mentions.ts";
import { DeadCharacterRecord } from "@/types/dead-character-record.ts";

export default function genChapterIdea({
  worldSummary,
  chapterNumber,
  tone,
  initialGameIdea,
  previousChapterIdeas = [],
  allDeadCharacters = [],
  newlyDeadThisChapter = [],
  choiceQuestion,
  playerChoice,
}: {
  worldSummary: WorldSummary;
  chapterNumber: number;
  tone: string;
  initialGameIdea?: InitialGameIdea;
  previousChapterIdeas?: ChapterIdea[];
  allDeadCharacters?: DeadCharacterRecord[];
  newlyDeadThisChapter?: DeadCharacterRecord[];
  choiceQuestion?: string;
  playerChoice?: string;
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
- For each newPlayableUnit or newNonBattleCharacter:
  * Integrate their backstory meaningfully into the narrative
  * Explain clearly WHY and HOW they join the player's group
  * Create natural connections between them and existing characters
  * Show personality traits from their character description in their dialogue/actions
  * MUST mention EACH CHARACTER BY NAME explicitly in intro, battle, or outro text
- Must not reuse or resurrect any dead characters
- The death of characters must significantly impact the story:
  * Living player characters should reference the deaths of dead player characters, highlighting the relationship between them and the deceased.
  * The death of characters central to the storyline must be referenced in the story, and will likely change the direction of the next chapter.
  * Minor unit deaths should be referenced in the story, but will likely only alter the next chapter slightly.
  * When referencing dead boss characters, make sure to never refer to them as part of the player party.
- Must not reuse a previous boss from earlier chapters
- Consider including monetary rewards or special items as part of the narrative.
  - Examples:
    - characters find treasure
    - thankful townspeople give special weapon/item as thanks after the battle
    - king gives party money to aid their adventure
  - Note that money should be given sparingly and definitely not every chapter or more than once in a chapter.
- Must produce a new Chapter Idea that strictly matches the ChapterIdea schema
- Return only JSON without any commentary

Additionally, the 'intro' and 'outro' fields must each be a single full paragraph summarizing all the events, dialogue, and interactions that happen in those scenes. Make sure new characters' introductions feel natural and their reasons for joining are compelling and tied to their backstories. Feel free to incorporate monetary rewards, treasure finds, or special items as part of the narrative to add depth and motivation to the storyline.`
    : `You are a Fire Emblem Fangame Chapter Idea Generator (generator).

We have:
- A World Summary
- Existing chapters
- Dead characters: ${JSON.stringify(allDeadCharacters)}
- Newly dead: ${JSON.stringify(newlyDeadThisChapter)}
- Player's choice from previous chapter: "${playerChoice}" (chosen from question: ${choiceQuestion})
We want chapter ${chapterNumber}. Return only valid JSON, no commentary.

CRITICAL REQUIREMENTS:
- The story of this chapter MUST be heavily influenced by the player's last choice "${playerChoice}"
- The narrative should clearly show the consequences of this choice
- Character interactions, plot development, and chapter setting should all reflect this decision
- Must include ALL required fields: title, intro, battle, outro, boss, enemyFaction
- enemyFaction MUST be included with nid, name, desc, and icon_nid
- For each newPlayableUnit or newNonBattleCharacter:
  * Integrate their backstory meaningfully into the narrative
  * Provide clear motivations and circumstances for WHY they join the player's group
  * Describe HOW they are encountered (e.g., rescued from enemies, found in a village, etc.)
  * Create connections with existing characters where appropriate
  * Ensure their introduction reflects their personality and background
  * MUST mention EACH CHARACTER BY NAME explicitly in intro, battle, or outro text
- Must not reuse or resurrect any dead characters
- The death of characters must significantly impact the story:
  * Living player characters should reference the deaths of dead player characters, highlighting the relationship between them and the deceased.
  * The death of characters central to the storyline must be referenced in the story, and will likely change the direction of the next chapter.
  * Minor unit deaths should be referenced in the story, but will likely only alter the next chapter slightly.
  * When referencing dead boss characters, make sure to never refer to them as part of the player party.
- Must not reuse a previous boss from earlier chapters
- Must produce a new Chapter Idea that strictly matches the ChapterIdea schema
  - When creating the endOfChapterChoice, ensure none of the options include attempting to recruit a certain character
- Return only JSON without any commentary

Additionally, the 'intro' and 'outro' fields must each be a single full paragraph summarizing all the events, dialogue, and interactions that happen in those scenes. Make sure new characters' introductions feel natural and their reasons for joining are compelling and tied to their backstories.`;

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
        choiceQuestion,
        playerChoice,
      });

  const checkerSystemMessage = `You are a Fire Emblem Fangame Chapter Idea Checker (checker).
Check that all required fields are present and that new characters are mentioned in the text.
Also check that the story appropriately acknowledges dead characters from previous chapters:
- The narrative should reference the impact of these deaths on the living characters and storyline
- Living characters should mention or react to the deaths of significant characters
- If major characters died, the plot should reflect this change in direction
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
2) ONLY check that dead characters from this list: ${JSON.stringify(
        allDeadCharacters
      )} don't appear as active characters in the new chapter.
  a) It is completely fine for the story to have themes of resurrection, zombies, undead, etc.
  b) Dramatic language in death quotes (like "I will rise again" or similar) is completely acceptable.
  c) New bosses and characters are always allowed even if they talk about resurrection themes.
3) Only check that boss characters from previous chapters aren't reused with the same name and role.
4) Verify that if there are dead characters (from allDeadCharacters or newlyDeadThisChapter), the chapter narrative acknowledges these deaths in some meaningful way - either through explicit mentions in dialogue, plot consequences, or character reactions.
If all good => fixText="None". Otherwise => fix instructions.`;
    },
    validators: [validateCharacterMentions],
  });
}
if (import.meta.main) {
  genChapterIdea({
    worldSummary: testWorldSummary,
    chapterNumber: 1,
    tone: testTone,
    previousChapterIdeas: [testPrologueChapter.idea],
    choiceQuestion: "What will you do with the captured enemy commander?",
    playerChoice: "Kill him.",
  }).then((res) => {
    console.log("Chapter Idea:", JSON.stringify(res, null, 2));
  });
}

