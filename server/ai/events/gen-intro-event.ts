import processEventItems from "@/ai/events/process-event-items.ts";
import { validateAiEventPortraits } from "@/ai/events/validate-ai-event.ts";
import { genAndCheck } from "@/ai/lib/generator-checker.ts";
import {
  testInitialGameIdea,
  testPrologueChapter,
  testTone,
  testWorldSummary,
} from "@/ai/test-data/prologueTestData.ts";
import { AIEvent, AIEventSchema } from "@/ai/types/ai-event.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { Chapter } from "@/types/chapter.ts";
import { DeadCharacterRecord } from "@/types/dead-character-record.ts";

/**
 * Generates an AIEvent that serves as the intro scene for the chapter, introducing the story.
 */
export default async function genIntroEvent({
  worldSummary,
  chapterIdea,
  tone,
  initialGameIdea,
  existingCharacterIdeas = [],
  existingChapters = [],
  allDeadCharacters = [],
  newlyDeadThisChapter = [],
}: {
  worldSummary: WorldSummary;
  chapterIdea: ChapterIdea;
  tone: string;
  initialGameIdea?: InitialGameIdea; // only give if prologue
  existingCharacterIdeas?: CharacterIdea[];
  existingChapters?: Chapter[];
  allDeadCharacters?: DeadCharacterRecord[];
  newlyDeadThisChapter?: DeadCharacterRecord[];
}): Promise<AIEvent> {
  const prologueNote = initialGameIdea
    ? `This is the prologue intro event. This means you'll need to introduce the story and characters to the player for the first time.

Notes for the prologue intro:
- briefly introduce the setting and main characters with the "narrate" command. This should be incredibly brief.
- have the characters talk about something that sets up the main conflict`
    : "";

  const generatorSystemMessage = `You are a Fire Emblem Fangame Intro Event Writer! The user provides the information that you will use to create the event.

Write the event that will open this chapter of the game.

${prologueNote}

CRITICAL REQUIREMENT - ITEMS AND MONEY:
When the intro text mentions characters finding, receiving, or obtaining items or money, you MUST add the appropriate command in your event:

Examples:
- If intro says: "...stumbles upon a Silver Blade" → add command: "give_item;Silver_Blade"
- If intro says: "...finds a pouch containing 500 gold" → add command: "give_money;500"
- If intro says: "...the king presents them with an ancient tome" → add command: "give_item;Ancient_Tome"
- If intro says: "...discovers a healing staff in the ruins" → add command: "give_item;Heal"

The command should come immediately after the dialogue or narration where the item is mentioned.
Always use underscores instead of spaces in item names.
This is CRITICAL for gameplay mechanics - if an item is mentioned, the "give_item" command MUST be included.
   - IMPORTANT: Only include give_item commands for items that exist in the vanilla Fire Emblem: The Sacred Stones game. Do not invent or give non-vanilla items; fictional quest items should only be referenced in dialogue without a give_item command.
   - IMPORTANT: Items awarded (give_item/give_money) should be level-appropriate: provide basic vanilla items in early chapters and reserve more advanced or rare vanilla items for later chapters. Assume a 30-chapter game.

The event must also:
- use the Chapter Idea's intro as the basis for the event
- make characters speak with the "add_portrait" command for each character and then use the "speak" command for them to speak
- CRITICAL: EVERY character MUST have an "add_portrait" command BEFORE they speak for the first time
- CRITICAL: Characters CANNOT speak after "remove_portrait" has been called on them, unless an "add_portrait" command is used again
- IMPORTANT FOR CHARACTER ENTRY TIMING:
  - ONLY use "add_portrait" at the beginning of the scene for characters who are present from the start
  - For characters who enter the scene later, place the "add_portrait" command EXACTLY at the moment they enter
  - NEVER add all character portraits at the beginning if some characters are meant to enter later
  - This timing is critical for proper scene flow - incorrectly timed portraits break immersion
- CRITICAL - PORTRAIT MANAGEMENT:
  - Never have more than 6 character portraits visible at once in a scene
  - If more than 6 characters are in a conversation, use "remove_portrait" for less important characters before adding new ones
  - Not every player character needs to appear in the intro scene
  - Prioritize newly introduced characters and those most important to the scene
  - When a character exits a scene or is no longer actively participating in the conversation, use "remove_portrait"
  - Balance the scene with appropriate add/remove commands to maintain clarity and focus
- be sure to include the Chapter Idea's newNonBattleCharacters as characters in the event, as mentioned in the "intro" section of the Chapter Idea
- if a character is mentioned in the intro, it must be included in the event
- you may only give speaking roles to characters mentioned in the intro, not any other characters
- you must have characters speak to each other in the scene

WRITING STYLE - AVOIDING CLICHÉS:
- Avoid overused mystery phrases like "The X holds more than just Y..." or "There's more to this than meets the eye"
- Instead, try these more creative approaches for building tension and mystery

Important continuity rules for dead characters:
- Any dead characters must remain dead and not reappear in any dialogue.
- Living player characters might reference the deaths of dead player characters, highlighting the relationship between them and the deceased.
- The death of characters central to the storyline must be referenced in the story, and will likely change the direction of the next chapter.
- Minor unit deaths should be referenced in the story, but will likely only alter the next chapter slightly.
- When referencing dead boss characters, make sure to never refer to them as part of the player party.

We want a single AIEvent that strictly matches the AIEvent schema. Return only JSON, no extra commentary.
If the chapter idea's intro references a 'boss', 'newPlayableUnits', or 'newNonBattleCharacters', ensure they appear. They can speak or cameo if it makes sense.`;

  const generatorPrompt = `World Summary: ${JSON.stringify(
    worldSummary,
    null,
    2
  )}${initialGameIdea
    ? `\nGame Idea: ${JSON.stringify(initialGameIdea, null, 2)}`
    : ""
    }
Chapter Idea: ${JSON.stringify(chapterIdea)}
Tone: ${tone}
Existing Character Ideas: ${JSON.stringify(existingCharacterIdeas, null, 2)}
Existing Chapters: ${JSON.stringify(existingChapters, null, 2)}
All Dead Characters: ${JSON.stringify(
      allDeadCharacters,
      null,
      2
    )}. You must NOT give these characters speaking roles in the current chapter idea! They are dead and the story can reference and change because of that, but dead characters can never show up again in any scenes.
Newly Dead This Chapter: ${JSON.stringify(
      newlyDeadThisChapter,
      null,
      2
    )}. You must NOT give these characters speaking roles in the current chapter idea! They are dead and the story can reference and change because of that, but dead characters can never show up again in any scenes.`;

  const checkerSystemMessage = `You are a Fire Emblem Fangame Intro Event Checker (checker).
We must ensure:
1) It does not resurrect or give speaking roles to actually dead characters from previous chapters (those in allDeadCharacters list).
2) The event uses required commands correctly ("add_portrait", "speak", "narrate", "give_item", "give_money", "remove_portrait").
3) The event must not mention or speak for newlyDeadThisChapter.
4) Characters can be introduced naturally in the narrative, including:
   - Narrative references to historical/lore figures being "thought dead" or returning
   - Characters speaking from "OffscreenLeft" or "OffscreenRight" positions
   - Bosses and antagonists mentioned in the chapter intro
5) CRITICAL: Every character must have an "add_portrait" command BEFORE any "speak" command for that character.
   A character can't speak unless they already have a portrait displayed on screen.
6) CRITICAL: A character CANNOT speak after "remove_portrait" has been called on them, unless they have a new "add_portrait" command after the removal.
   You must track the current state of each character's portrait throughout the event sequence.

7) SPECIAL ITEM CHECKING - CRITICALLY IMPORTANT:
   - Read the original intro text in the Chapter Idea carefully
   - If the intro mentions characters finding, receiving, or obtaining ANY items (weapons, artifacts, etc.)
     or money, the event MUST include the appropriate "give_item" or "give_money" command
   - Example: If intro says "...stumbles upon a Silver Blade" but no command with "give_item" and the item name exists,
     that's an error that MUST be fixed by adding the command
   - The format can be either "give_item;item_name" or "give_item;convoy;item_name" - both are valid

IMPORTANT NOTES:
- Allow narrative devices like "thought dead" or "has returned" for storytelling
- Allow characters to speak from offscreen positions
- Allow boss characters to be introduced in whatever way makes sense for the story
- Distinguish between actual dead characters (from allDeadCharacters) and narrative elements

If the candidate is valid, return { "fixText": "None", "passesCheck": true }. Otherwise, provide fix instructions in fixText and the fixed sourceObjects in fixObject if possible.`;

  const checkerPrompt = (candidate: AIEvent) => {
    // Let's use our algorithmic validation for portrait checking
    const portraitValidation = validateAiEventPortraits(candidate);

    return `Candidate:\n${JSON.stringify(candidate, null, 2)}
Portrait Validation Result: ${JSON.stringify(portraitValidation)}

Chapter Idea: ${JSON.stringify(chapterIdea, null, 2)}

Check the following constraints carefully but leniently:
1) Must not include or resurrect ACTUAL dead characters from: ${JSON.stringify(
      allDeadCharacters,
      null,
      2
    )} or newlyDeadThisChapter: ${JSON.stringify(
      newlyDeadThisChapter,
      null,
      2
    )}.
2) Portrait validation is now handled by the algorithm and the result is shown above.
3) Must follow the AIEvent schema exactly and only use valid commands ("add_portrait", "speak", "narrate", "give_item", "give_money", "remove_portrait").
4) SPECIAL ITEM CHECK: If the intro text mentions items or money being found (e.g., "stumbles upon a Silver Blade"),
   there MUST be a corresponding "give_item" or "give_money" command in the sourceObjects.
5) PORTRAIT LIMIT CHECK: Never have more than 6 character portraits visible at once. The validation now checks this automatically, 
   but ensure the narrative flow makes sense with characters being added and removed at appropriate moments.
6) CRITICAL SPEAKING CHECK: Verify that EVERY character has an "add_portrait" command BEFORE their first "speak" command.
   Characters should never speak if they don't have a portrait on screen yet.
   - For each character that speaks, check if they had an "add_portrait" command earlier
   - If a character speaks before they're added, that's an error that must be fixed
7) CRITICAL PORTRAIT STATE CHECK: Verify that characters do not speak after "remove_portrait" has been called on them,
   unless they have been re-added with "add_portrait".
   - Track when portraits are added and removed for each character
   - If a character speaks after being removed without being re-added, that's an error

IMPORTANT:
- Allow storytelling with references to characters being "thought dead" or returned
- Allow boss characters and antagonists to speak from offscreen positions
- Allow narrative introduction of new characters
- Only flag actual resurrections of characters in the dead lists

If all is correct => fixText="None" and passesCheck=true.
If there are issues => provide detailed fixText and set passesCheck=false.

For portrait validation issues, the algorithm has already checked this for you. Only raise portrait-related issues if the algorithm detected problems (isValid=false).`;
  };

  const event = await genAndCheck<AIEvent>({
    fnBaseName: "genIntroEvent",
    generatorModel: "strong",
    generatorSystemMessage,
    generatorPrompt,
    generatorSchema: AIEventSchema,
    checkerSystemMessage,
    checkerPrompt,
    validators: [validateAiEventPortraits],
  });

  // Process any item commands to use valid game item NIDs
  return processEventItems(event);
}

if (import.meta.main) {
  genIntroEvent({
    worldSummary: testWorldSummary,
    initialGameIdea: testInitialGameIdea,
    chapterIdea: testPrologueChapter.idea,
    tone: testTone,
  })
    .then((res) => {
      console.log(JSON.stringify(res, null, 2));
    })
    .catch(console.error);
}
