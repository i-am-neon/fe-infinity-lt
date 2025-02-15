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

export default function genPrologueIntroEvent({
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
  const systemMessage = `You are a Fire Emblem Fangame Prologue Event Writer! The user provides a world summary and an initial game idea and tone that you will use to create the event.

Write the event that will introduce the prologue chapter of the game.

It should:
- use the Chapter Idea's intro as the basis for the event
- briefly introduce the setting and main characters with the "narrate" command. This should be incredibly brief.
- have the characters talk about something that sets up the main conflict with the "add_portrait" command for each character and then use the "speak" command for them to speak
- unless a character enters the scene later, all characters in the event should be added with "add_portrait" before anyone speaks
- be sure to include the Chapter Idea's newNonBattleCharacters as characters in the event, as mentioned in the "intro" section of the Chapter Idea
- if a character is mentioned in the intro, it must be included in the event
- you may only give speaking roles to characters mentioned in the intro, not any other characters`;

  return generateStructuredData({
    fnName: "genPrologueIntroEvent",
    systemMessage,
    prompt: `World Summary: ${JSON.stringify(
      worldSummary,
      null,
      2
    )}\nGame Idea: ${JSON.stringify(
      initialGameIdea,
      null,
      2
    )}\nChapter Idea: ${JSON.stringify(chapterIdea)}\nTone: ${tone}`,
    schema: AIEventSchema,
    temperature: 0.7,
  });
}

if (import.meta.main) {
  genPrologueIntroEvent({
    worldSummary: testWorldSummary,
    initialGameIdea: testInitialGameIdea,
    chapterIdea: testChapterIdea,
    tone: testTone,
  }).then((res) => console.log(JSON.stringify(res, null, 2)));
}

