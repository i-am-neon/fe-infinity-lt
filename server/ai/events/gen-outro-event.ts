import { testChapterIdea } from "@/ai/test-data/chapter-ideas.ts";
import {
  testInitialGameIdea,
  testTone,
  testWorldSummary,
} from "../test-data/prologue.ts";
import { AIEvent, AIEventSchema } from "@/ai/types/ai-event.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";

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
  const systemMessage = `You are a Fire Emblem Fangame Outro Event Writer!
${
  initialGameIdea
    ? `This is the prologue outro event. You can include concluding remarks that wrap up the initial story setup as it's the first chapter.`
    : `This is a subsequent chapter's outro event. Summarize and wrap up the chapter's conflict.`
}

The event should:
- use the Chapter Idea's outro as the basis for the event
- have the characters talk about something that closes out the chapter with the "add_portrait" command for each character and then use the "speak" command for them to speak
- unless a character enters the scene later, all characters in the event should be added with "add_portrait" before anyone speaks
  - if a character appears in or enters the scene later, add them with "add_portrait" when they enter
- be sure to include the Chapter Idea's newNonBattleCharacters as characters in the event, as mentioned in the "intro" section of the Chapter Idea
- if a character is mentioned in the outro, it must be included in the event
- you may only give speaking roles to characters mentioned in the outro, not any other characters
- you must have characters speak to each other in the scene
`;

  const prompt = `World Summary: ${JSON.stringify(worldSummary, null, 2)}${
    initialGameIdea
      ? `\nInitial Game Idea: ${JSON.stringify(initialGameIdea, null, 2)}`
      : ""
  }\nChapter Idea: ${JSON.stringify(chapterIdea)}\nTone: ${tone}`;

  return generateStructuredData<AIEvent>({
    fnName: "genOutroEvent",
    systemMessage,
    prompt,
    schema: AIEventSchema,
    temperature: 0.7,
  });
}

if (import.meta.main) {
  genOutroEvent({
    worldSummary: testWorldSummary,
    initialGameIdea: testInitialGameIdea,
    chapterIdea: testChapterIdea,
    tone: testTone,
  })
    .then((event) => console.log(JSON.stringify(event, null, 2)))
    .catch(console.error);
}
