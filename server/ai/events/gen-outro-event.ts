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
- have the characters talk about something that closes out the chapter with the "add_portrait" command for each character and then use the "speak" command for them to speak
- unless a character enters the scene later, all characters in the event should be added with "add_portrait" before anyone speaks
  - if a character appears in or enters the scene later, add them with "add_portrait" when they enter
- be sure to include the Chapter Idea's newNonBattleCharacters as characters in the event, as mentioned in the "intro" section of the Chapter Idea
- if a character is mentioned in the outro, it must be included in the event
- you may only give speaking roles to characters mentioned in the outro, not any other characters
- you must have characters speak to each other in the scene

We want to produce a single AIEvent object. It must match the AIEvent schema. Return only JSON, no extra commentary.`;

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
2) If a character speaks, ensure an add_portrait command is used first unless they appear mid-scene intentionally.
3) The event must only use valid commands from SourceAsObject ("add_portrait", "speak", "narrate").
If valid, fixText=None, else propose fix instructions.`;

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
2) Must use only valid commands from the SourceAsObject schema.
3) Must provide "add_portrait" before "speak" if they appear at the start, or intentionally show they enter mid-scene.
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

