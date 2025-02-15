import { testChapterIdea } from "@/ai/test-data/chapter-ideas.ts";
import {
  testInitialGameIdea,
  testTone,
  testWorldSummary,
} from "@/ai/test-data/initial.ts";
import { AIEvent, AIEventSchema } from "@/ai/types/ai-event.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";

/**
 * Generates an AIEvent that serves as the prologue's outro scene, wrapping up the chapter.
 */
export default function genOutroEvent({
  worldSummary,
  initialGameIdea,
  chapterIdea,
  tone,
}: {
  worldSummary: WorldSummary;
  initialGameIdea: InitialGameIdea;
  chapterIdea: ChapterIdea;
  tone: string;
}): Promise<AIEvent> {
  const systemMessage = `You are a Fire Emblem Fangame Prologue Outro Event Writer!
The user provides a world summary, an initial game idea, a chapter idea, and a tone. You will create the event that wraps up the chapter.

The event should:
- use the Chapter Idea's outro as the basis for the event
- have the characters talk about something that closes out the chapter with the "add_portrait" command for each character and then use the "speak" command for them to speak
- unless a character enters the scene later, all characters in the event should be added with "add_portrait" before anyone speaks
- be sure to include the Chapter Idea's newNonBattleCharacters as characters in the event, as mentioned in the "intro" section of the Chapter Idea
- if a character is mentioned in the outro, it must be included in the event
- you may only give speaking roles to characters mentioned in the outro, not any other characters
`;

  const prompt = `World Summary: ${JSON.stringify(worldSummary, null, 2)}
Initial Game Idea: ${JSON.stringify(initialGameIdea, null, 2)}
Chapter Idea: ${JSON.stringify(chapterIdea)}
Tone: ${tone}`;

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

