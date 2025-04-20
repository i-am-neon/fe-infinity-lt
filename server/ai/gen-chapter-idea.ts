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
import { validateDistinctNewCharacters } from "@/ai/validators/validate-distinct-new-characters.ts";
import { validateNoReintroducedCharacters } from "@/ai/validators/validate-no-reintroduced-characters.ts";
import { validatePlayerInIntro } from "@/ai/validators/validate-player-in-intro.ts";
import { DeadCharacterRecord } from "@/types/dead-character-record.ts";
import replaceBadCharacters from "@/lib/formatting/replace-bad-characters.ts";

export default async function genChapterIdea({
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

  // Common critical requirements shared by both prologue and regular chapters
  const commonRequirements = `
CRITICAL REQUIREMENTS:
- Must include ALL required fields: title, intro, battle, outro, boss, enemyFaction
- enemyFaction MUST be included with nid, name, desc, and icon_nid
- For each newPlayableUnit or newNonBattleCharacter:
  * Integrate their backstory meaningfully into the narrative
  * Explain clearly WHY and HOW they join the player's group
  * Create natural connections between them and existing characters
  * Show personality traits from their character description in their dialogue/actions
  * MUST mention EACH CHARACTER BY NAME explicitly in intro, battle, or outro text
- IMPORTANT: Characters with firstSeenAs = "ally" MUST be mentioned in the intro section
- IMPORTANT: ONLY USE newPlayableUnits and newNonBattleCharacters arrays for COMPLETELY NEW characters who have NEVER been introduced in any previous chapter
- IMPORTANT: ANY supporting character who appears in the narrative (e.g., a messenger, villager, or temporary character) MUST be added to the newNonBattleCharacters array with a complete character profile
- Must not reuse or resurrect any dead characters
- The death of characters must significantly impact the story:
  * Living player characters should reference the deaths of dead player characters, highlighting the relationship between them and the deceased.
  * The death of characters central to the storyline must be referenced in the story, and will likely change the direction of the next chapter.
  * Minor unit deaths should be referenced in the story, but will likely only alter the next chapter slightly.
  * When referencing dead boss characters, make sure to never refer to them as part of the player party.
- Must not reuse a previous boss from earlier chapters
${newlyDeadThisChapter.length > 0 ? `- MUST introduce at least ${newlyDeadThisChapter.length} new playable unit(s) to replace those lost in the previous chapter
  * If ${newlyDeadThisChapter.length > 1 ? 'multiple units' : 'a unit'} died in the previous chapter, provide a mix of new player units that start as: player units, allied NPCs, and/or recruitable enemy units` : ''}
- Must produce a new Chapter Idea that strictly matches the ChapterIdea schema
- Return only JSON without any commentary

OUTRO AND CHOICE INTEGRATION:
- The 'outro' MUST directly lead into and set up the endOfChapterChoice
- End the outro with dialogue or a situation that naturally creates the decision point reflected in endOfChapterChoice
- Make the final lines of the outro create the context for why this specific choice is being presented
- Ensure there's a clear narrative connection between the concluding events and the choice options

	Additionally, the 'intro' and 'outro' fields must each be a single full paragraph summarizing all the events, dialogue, and interactions that happen in those scenes. Make sure new characters' introductions feel natural and their reasons for joining are compelling and tied to their backstories.
	- IMPORTANT: Any items mentioned as rewards or special weapons in the narrative must be items from the vanilla Fire Emblem: The Sacred Stones game. Do not invent fictional items as physical rewards; quest-specific or custom items can be referenced in dialogue but should not correspond to actual game items.
	- IMPORTANT: Items awarded in the narrative should be level-appropriate: use basic vanilla items in early chapters and progressively more advanced or rare vanilla items in later chapters. Assume a 30-chapter game.
	`;

  // Prologue-specific part of the system message
  const prologueSpecific = `You are a Fire Emblem Fangame Chapter Idea Generator (generator).

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

${commonRequirements}

${newlyDeadThisChapter.length > 0 ? `- Since ${newlyDeadThisChapter.length} character(s) died previously, this chapter MUST introduce at least ${newlyDeadThisChapter.length} new playable unit(s)
  * If multiple characters died, provide a mixture of units that start as: player units, allied NPCs that can be saved, and/or enemy non-boss units that can be recruited
  * Each new unit should have a compelling reason to join the party that ties into the main story
  * Make sure to clearly explain how these new characters are integrated into the narrative` : ''}
- Consider including monetary rewards or special items as part of the narrative.
  - Examples:
    - characters find treasure
    - thankful townspeople give special weapon/item as thanks after the battle
    - king gives party money to aid their adventure
  - Note that money should be given sparingly and definitely not every chapter or more than once in a chapter.
- CRITICAL: ALL characters in newPlayableUnits and newNonBattleCharacters MUST be completely new characters that have never appeared in any previous chapter
  * Do not reintroduce characters with the same names as existing characters
  * Every character in these arrays must be making their first appearance in the story`;

  // Regular chapter-specific part of the system message
  const regularChapterSpecific = `You are a Fire Emblem Fangame Chapter Idea Generator (generator).

We have:
- A World Summary
- Existing chapters
- Dead characters: ${JSON.stringify(allDeadCharacters)}
- Newly dead: ${JSON.stringify(newlyDeadThisChapter)}
- Player's choice from previous chapter: "${playerChoice}" (chosen from question: ${choiceQuestion})
We want chapter ${chapterNumber}. Return only valid JSON, no commentary.

${commonRequirements}

- The story of this chapter MUST be heavily influenced by the player's last choice "${playerChoice}"
- The narrative should clearly show the consequences of this choice
- Character interactions, plot development, and chapter setting should all reflect this decision
${newlyDeadThisChapter.length > 0 ? `- Since ${newlyDeadThisChapter.length} character(s) died in the previous chapter, this chapter MUST introduce at least ${newlyDeadThisChapter.length} new playable unit(s)
  * If multiple characters died, provide a mixture of units that start as: player units, allied NPCs that can be saved, and/or enemy non-boss units that can be recruited
  * Each new unit should have a compelling reason to join the party that ties into the main story
  * Make sure to clearly explain how these new characters are integrated into the narrative` : ''}
- When creating the endOfChapterChoice, ensure none of the options include attempting to recruit a certain character
- CRITICAL: ALL characters in newPlayableUnits and newNonBattleCharacters MUST be completely new characters that have never appeared in any previous chapter
  * Previous character list (DO NOT include any of these characters in newPlayableUnits or newNonBattleCharacters): ${previousChapterIdeas.flatMap(chapter => [
    ...(chapter.newPlayableUnits || []).map(char => char.firstName),
    ...(chapter.newNonBattleCharacters || []).map(char => char.firstName),
    chapter.boss.firstName
  ]).join(', ')}
  * Every character in these arrays must be making their first appearance in the story`;

  const generatorSystemMessage = isPrologue
    ? prologueSpecific
    : regularChapterSpecific;

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
Dramatically, language in death quotes (like "I'll rise again") is completely acceptable.
Return { fixText: "None", fixObject: {} } if good; else fix instructions. Only JSON.`;

  const chIdea = await genAndCheck<ChapterIdea>({
    fnBaseName: "genChapterIdea",
    generatorModel: "strong",
    generatorSystemMessage,
    generatorPrompt: basePrompt,
    generatorSchema: ChapterIdeaSchema,
    checkerSystemMessage,
    checkerPrompt: (candidate) => {
      return `Candidate:\n${JSON.stringify(candidate, null, 2)}
Constraints:
1) MUST have all required fields: title, intro, battle, outro, boss, enemyFaction. Verify each is present and properly formatted.
2) ANY character mentioned in intro, battle, or outro must be defined in either newPlayableUnits or newNonBattleCharacters.
3) EVERY supporting character (messenger, guide, villager, etc.) must be fully defined in newNonBattleCharacters.
4) ONLY check that dead characters from this list: ${JSON.stringify(
        allDeadCharacters
      )} don't appear as active characters in the new chapter.
  a) It is completely fine for the story to have themes of resurrection, zombies, undead, etc.
  b) Dramatic language in death quotes (like "I will rise again" or similar) is completely acceptable.
  c) New bosses and characters are always allowed even if they talk about resurrection themes.
5) Only check that boss characters from previous chapters aren't reused with the same name and role.
6) Verify that if there are dead characters (from allDeadCharacters or newlyDeadThisChapter), the chapter narrative acknowledges these deaths in some meaningful way - either through explicit mentions in dialogue, plot consequences, or character reactions.
${newlyDeadThisChapter.length > 0 ? `7) Since ${newlyDeadThisChapter.length} character(s) died in the previous chapter, verify that at least ${newlyDeadThisChapter.length} new playable unit(s) are introduced in this chapter (through newPlayableUnits array).
  a) If multiple characters died (${newlyDeadThisChapter.length > 1 ? 'true in this case' : 'not applicable here'}), check that there's a mix of units starting as player units, allied NPCs, and/or recruitable enemy units.
  b) Verify that each new character has a clear narrative reason for joining the party.` : ''}
If all good => fixText="None". Otherwise => fix instructions.`;
    },
    validators: [
      validateCharacterMentions,
      validateDistinctNewCharacters,
      validatePlayerInIntro,
      (chapterIdea) => validateNoReintroducedCharacters(chapterIdea, previousChapterIdeas)
    ],
  });
  return {
    ...chIdea,
    enemyFaction: {
      ...chIdea.enemyFaction,
      name: replaceBadCharacters(chIdea.enemyFaction.name),
      desc: replaceBadCharacters(chIdea.enemyFaction.desc),
    }
  }
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
