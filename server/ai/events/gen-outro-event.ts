import { AIEvent, AIEventSchema } from "@/ai/types/ai-event.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { genAndCheck } from "@/ai/lib/generator-checker.ts";
import {
  testTone,
  testWorldSummary,
  testInitialGameIdea,
  testPrologueChapter,
} from "@/ai/test-data/prologueTestData.ts";

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

We want to produce a single AIEvent object. It must match the AIEvent schema. Return only JSON, no additional commentary.
Additionally, if the chapter idea's outro references a 'boss' or 'newPlayableUnits' or 'newNonBattleCharacters', ensure they appear in the event. They can speak or appear in a cameo. The boss may have a line or be introduced if it makes sense.`;

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
2) Each speaking character has an "add_portrait" command at some point before their first "speak" command.
3) The event must only use valid commands ("add_portrait", "speak", "narrate").
4) If the chapter idea's outro references a 'boss' or 'newPlayableUnits' or 'newNonBattleCharacters', ensure they appear in the final event.
If valid => fixText=None, else fix instructions.`;

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
3) Must provide "add_portrait" for each speaking character prior to their first line.
If all good => fixText=None, else fix instructions.`;
    },
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
