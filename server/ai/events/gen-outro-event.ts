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
export default function genOutroEvent({
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

The event should:
- use the Chapter Idea's outro as the basis for the event
- ensure that any character who speaks has an "add_portrait" command somewhere earlier in the event script
- be sure to include the Chapter Idea's newNonBattleCharacters as characters in the event, as mentioned in the "intro" section of the Chapter Idea
- if a character is mentioned in the outro, it must be included in the event
- you may only give speaking roles to characters mentioned in the outro, not any other characters
- you must have characters speak to each other in the scene

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
1) No resurrected or reintroduced dead characters.
2) The event must only use valid commands ("add_portrait", "speak", "narrate").
3) If the chapter idea's outro references a 'boss', 'newPlayableUnits', or 'newNonBattleCharacters', ensure they appear in the event.

DETAILED CHECK PROCEDURE:
- The fixObject should include the full fixed sourceObjects array if needed

If the candidate is valid, return { "fixText": "None", "passesCheck": true }. Otherwise, provide fix instructions in fixText and the fixed sourceObjects in fixObject if possible.`;

  return genAndCheck<AIEvent>({
    fnBaseName: "genOutroEvent",
    generatorSystemMessage,
    generatorPrompt,
    generatorSchema: AIEventSchema,
    checkerSystemMessage,
    checkerPrompt: (candidate) => {
      return `Candidate:\n${JSON.stringify(candidate, null, 2)}

Constraints:
1) Must not resurrect dead characters or mention them as living.
2) Must only use valid commands ("add_portrait", "speak", "narrate").
3) If the chapter idea's intro mentions a 'boss', 'newPlayableUnits', or 'newNonBattleCharacters', ensure they appear in the final event.

If all is correct => fixText="None" and passesCheck=true.
If there are issues => provide detailed fixText and set passesCheck=false.`;
    },
    validators: [validateAiEventPortraits],
  });
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

