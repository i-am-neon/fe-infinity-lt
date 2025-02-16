import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { AIEvent, AIEventSchema } from "@/ai/types/ai-event.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";
import {
  testInitialGameIdea,
  testTone,
  testWorldSummary,
} from "@/ai/test-data/initial.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { testChapterIdea } from "@/ai/test-data/chapter-ideas.ts";

export default function genIntroEvent({
  worldSummary,
  chapterIdea,
  tone,
  initialGameIdea,
}: {
  worldSummary: WorldSummary;
  chapterIdea: ChapterIdea;
  tone: string;
  initialGameIdea?: InitialGameIdea; // only give if prologue
}): Promise<AIEvent> {
  const systemMessage = `You are a Fire Emblem Fangame Intro Event Writer! The user provides the information that you will use to create the event.

Write the event that will open this chapter of the game.

${
  initialGameIdea
    ? `This is the prologue intro event. This means you'll need to introduce the story and characters to the player for the first time.

Notes for the prologue intro:
- briefly introduce the setting and main characters with the "narrate" command. This should be incredibly brief.
- have the characters talk about something that sets up the main conflict`
    : ""
}

It should:
- use the Chapter Idea's intro as the basis for the event
- make characters speak with the "add_portrait" command for each character and then use the "speak" command for them to speak
- unless a character enters the scene later, all characters in the event should be added with "add_portrait" before anyone speaks
  - if a character appears in or enters the scene later, add them with "add_portrait" when they enter
- be sure to include the Chapter Idea's newNonBattleCharacters as characters in the event, as mentioned in the "intro" section of the Chapter Idea
- if a character is mentioned in the intro, it must be included in the event
- you may only give speaking roles to characters mentioned in the intro, not any other characters
- you must have characters speak to each other in the scene`;

  return generateStructuredData({
    fnName: "genPrologueIntroEvent",
    systemMessage,
    prompt: `World Summary: ${JSON.stringify(worldSummary, null, 2)}${
      initialGameIdea
        ? `\nGame Idea: ${JSON.stringify(initialGameIdea, null, 2)}`
        : ""
    }\nChapter Idea: ${JSON.stringify(chapterIdea)}\nTone: ${tone}`,
    schema: AIEventSchema,
    temperature: 0.7,
  });
}

if (import.meta.main) {
  genIntroEvent({
    worldSummary: testWorldSummary,
    initialGameIdea: testInitialGameIdea,
    chapterIdea: testChapterIdea,
    tone: testTone,
  }).then((res) => console.log(JSON.stringify(res, null, 2)));
}

