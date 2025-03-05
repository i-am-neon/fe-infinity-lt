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

The event should:
- use the Chapter Idea's outro as the basis for the event
- ensure that any character who speaks has an "add_portrait" command somewhere earlier in the event script
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
  )}${
    initialGameIdea
      ? `\nInitial Game Idea: ${JSON.stringify(initialGameIdea, null, 2)}`
      : ""
  }
Chapter Idea: ${JSON.stringify(chapterIdea)}
Tone: ${tone}`;

  const checkerSystemMessage = `You are a Fire Emblem Fangame Outro Event Checker (checker).
We have an AIEvent candidate. We must ensure:
1) No resurrected or reintroduced actual dead characters from previous chapters.
2) The event must only use valid commands ("add_portrait", "speak", "narrate").
3) If the chapter idea's outro references a 'boss', 'newPlayableUnits', or 'newNonBattleCharacters', ensure they appear in the event.

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
    generatorSystemMessage,
    generatorPrompt,
    generatorSchema: AIEventSchema,
    checkerSystemMessage,
    checkerPrompt: (candidate) => {
      return `Candidate:\n${JSON.stringify(candidate, null, 2)}

Constraints (apply leniently):
1) Must not resurrect ACTUAL dead characters from previous chapters or mention them as living.
2) Must only use valid commands ("add_portrait", "speak", "narrate").
3) If the chapter idea's intro mentions a 'boss', 'newPlayableUnits', or 'newNonBattleCharacters', ensure they appear in the final event.

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
  return processEventItems(event);
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

