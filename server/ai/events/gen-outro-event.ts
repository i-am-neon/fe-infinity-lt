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
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { sluggify } from "@/lib/sluggify.ts";
import replaceBadCharacters from "@/lib/formatting/replace-bad-characters.ts";

/**
 * Generates an AIEvent that serves as the outro scene for the chapter, wrapping up the chapter's story.
 */
export default async function genOutroEvent({
  worldSummary,
  initialGameIdea,
  chapterIdea,
  tone,
}: {
  worldSummary: WorldSummary;
  initialGameIdea?: InitialGameIdea;
  chapterIdea: ChapterIdea;
  tone: string;
}): Promise<AIEvent> {
  const prologueNote = initialGameIdea
    ? `This is the prologue outro event. You can include concluding remarks that wrap up the initial story setup as it's the first chapter.`
    : `This is a subsequent chapter's outro event. Summarize and wrap up the chapter's conflict.`;

  const generatorSystemMessage = `You are a Fire Emblem Fangame Outro Event Writer!
${prologueNote}

CRITICAL REQUIREMENT - ITEMS AND MONEY:
When the outro text mentions characters finding, receiving, or obtaining items or money, you MUST add the appropriate command in your event:

Examples:
- If outro says: "...stumbles upon a Silver Blade" → add command: "give_item;Silver_Blade"
- If outro says: "...finds a pouch containing 500 gold" → add command: "give_money;500"
- If outro says: "...the king presents them with an ancient tome" → add command: "give_item;Ancient_Tome"
- If outro says: "...discovers a healing staff in the ruins" → add command: "give_item;Heal"

The command should come immediately after the dialogue or narration where the item is mentioned.
Always use underscores instead of spaces in item names.
This is CRITICAL for gameplay mechanics - if an item is mentioned, the "give_item" command MUST be included.
   - IMPORTANT: Only include give_item commands for items that exist in the vanilla Fire Emblem: The Sacred Stones game. Do not invent or give non-vanilla items; fictional quest items should only be referenced in dialogue without a give_item command.
   - IMPORTANT: Items awarded (give_item/give_money) should be level-appropriate: provide basic vanilla items in early chapters and reserve more advanced or rare vanilla items for later chapters. Assume a 30-chapter game.

The event should:
- use the Chapter Idea's outro as the basis for the event
- ensure that any character who speaks has an "add_portrait" command somewhere earlier in the event script
- CRITICAL: EVERY character MUST have an "add_portrait" command BEFORE they speak for the first time
- CRITICAL: Characters CANNOT speak after "remove_portrait" has been called on them, unless an "add_portrait" command is used again
- CRITICAL - PORTRAIT MANAGEMENT:
  - Never have more than 6 character portraits visible at once in a scene
  - If more than 6 characters are in a conversation, use "remove_portrait" for less important characters before adding new ones
  - Not every player character needs to appear in the outro scene
  - Prioritize newly introduced characters and those most important to the scene
  - When a character exits a scene or is no longer actively participating in the conversation, use "remove_portrait"
  - Balance the scene with appropriate add/remove commands to maintain clarity and focus
- be sure to include the Chapter Idea's newNonBattleCharacters as characters in the event, as mentioned in the "intro" section of the Chapter Idea
- if a character is mentioned in the outro, it must be included in the event
- you may only give speaking roles to characters mentioned in the outro, not any other characters
- you must have characters speak to each other in the scene
- you can use "give_money" to have characters receive or find money as part of the story resolution (e.g., "give_money;1000")
- you can use "give_item" to have characters receive, find, or obtain items as rewards or plot elements (e.g., "give_item;Iron_Sword")

We want one AIEvent object strictly matching the AIEvent schema. Return only JSON, no commentary.
If the outro references a 'boss', 'newPlayableUnits', or 'newNonBattleCharacters', ensure they appear if it makes sense.`;

  const generatorPrompt = `World Summary: ${JSON.stringify(
    worldSummary,
    null,
    2
  )}${initialGameIdea
    ? `\nInitial Game Idea: ${JSON.stringify(initialGameIdea, null, 2)}`
    : ""
    }
Chapter Idea: ${JSON.stringify(chapterIdea)}
Tone: ${tone}`;

  const checkerSystemMessage = `You are a Fire Emblem Fangame Outro Event Checker (checker).
We have an AIEvent candidate. We must ensure:
1) No resurrected or reintroduced actual dead characters from previous chapters.
2) The event must only use valid commands ("add_portrait", "speak", "narrate", "give_item", "give_money", "remove_portrait").
3) If the chapter idea's outro references a 'boss', 'newPlayableUnits', or 'newNonBattleCharacters', ensure they appear in the event.
4) CRITICAL: Every character must have an "add_portrait" command BEFORE any "speak" command for that character.
   A character can't speak unless they already have a portrait displayed on screen.
5) CRITICAL: A character CANNOT speak after "remove_portrait" has been called on them, unless they have a new "add_portrait" command after the removal.
   You must track the current state of each character's portrait throughout the event sequence.

SPECIAL ITEM CHECKING - CRITICALLY IMPORTANT:
- Read the original outro text in the Chapter Idea carefully
- If the outro mentions characters finding, receiving, or obtaining ANY items (weapons, artifacts, etc.)
  or money, the event MUST include the appropriate "give_item" or "give_money" command
- Example: If outro says "...stumbles upon a Silver Blade" but no command with "give_item" and the item name exists,
  that's an error that MUST be fixed by adding the command
- The format can be either "give_item;item_name" or "give_item;convoy;item_name" - both are valid

IMPORTANT NOTES:
- Allow narrative devices like "thought dead" or "has returned" for storytelling
- Allow characters to speak from offscreen positions
- Allow boss characters to be introduced in whatever way makes sense for the story
- Distinguish between actual dead characters and narrative elements

DETAILED CHECK PROCEDURE:
- The fixObject should include the full fixed sourceObjects array if needed

If the candidate is valid, return { "fixText": "None", "passesCheck": true }. Otherwise, provide fix instructions in fixText and the fixed sourceObjects in fixObject if possible.`;

  const event = await genAndCheck<AIEvent>({
    fnBaseName: "genOutroEvent",
    generatorModel: "strong",
    generatorSystemMessage,
    generatorPrompt,
    generatorSchema: AIEventSchema,
    checkerSystemMessage,
    checkerPrompt: (candidate) => {
      return `Candidate:\n${JSON.stringify(candidate, null, 2)}

Constraints (apply leniently):
1) Must not resurrect ACTUAL dead characters from previous chapters or mention them as living.
2) Must only use valid commands ("add_portrait", "speak", "narrate", "remove_portrait").
3) If the chapter idea's intro mentions a 'boss', 'newPlayableUnits', or 'newNonBattleCharacters', ensure they appear in the final event.
4) PORTRAIT LIMIT CHECK: Never have more than 6 character portraits visible at once. Use remove_portrait 
   when needed and ensure the narrative flow makes sense with characters entering and exiting at appropriate times.
5) CRITICAL SPEAKING CHECK: Verify that EVERY character has an "add_portrait" command BEFORE their first "speak" command.
   Characters should never speak if they don't have a portrait on screen yet.
   - For each character that speaks, check if they had an "add_portrait" command earlier
   - If a character speaks before they're added, that's an error that must be fixed
6) CRITICAL PORTRAIT STATE CHECK: Verify that characters do not speak after "remove_portrait" has been called on them,
   unless they have been re-added with "add_portrait".
   - Track when portraits are added and removed for each character
   - If a character speaks after being removed without being re-added, that's an error
7) SPECIAL ITEM CHECK: If the outro text mentions items or money being found or received,
   there MUST be a corresponding "give_item" or "give_money" command in the sourceObjects.

IMPORTANT:
- Allow storytelling with references to characters being "thought dead" or returned
- Allow boss characters and antagonists to speak from offscreen positions
- Allow narrative introduction of new characters
- Only flag actual resurrections of characters in previously established dead lists

If all is correct => fixText="None" and passesCheck=true.
If there are issues => provide detailed fixText and set passesCheck=false.`;
    },
    validators: [validateAiEventPortraits],
  });

  // Process any item commands to use valid game item NIDs
  const eventWithProcessedItems: AIEvent = await processEventItems(event);
  // Add the choice event at the end. Example: `"choice;fates;Who do you side with?;Hoshido,Nohr,Smash",`
  eventWithProcessedItems.sourceObjects.push({
    command: "choice",
    args: [
      sluggify(chapterIdea.endOfChapterChoice.displayText),
      "Which will you choose?", // Hard code so it doesn't go over char limit - can't break into new lines
      // replaceBadCharacters(chapterIdea.endOfChapterChoice.displayText),
      chapterIdea.endOfChapterChoice.options.join(","),
    ],
  });
  return eventWithProcessedItems;
}

if (import.meta.main) {
  genOutroEvent({
    worldSummary: testWorldSummary,
    initialGameIdea: testInitialGameIdea,
    chapterIdea: testPrologueChapter.idea,
    tone: testTone,
  })
    .then((event) => console.log(JSON.stringify(event, null, 2)))
    .catch(console.error);
}
