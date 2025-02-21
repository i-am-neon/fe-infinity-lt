import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { AIEvent, AIEventSchema } from "@/ai/types/ai-event.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";
import {
  testInitialGameIdea,
  testTone,
  testWorldSummary,
} from "../test-data/prologue.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { testChapterIdea } from "@/ai/test-data/chapter-ideas.ts";
import { Chapter } from "@/types/chapter.ts";
import { DeadCharacterRecord } from "@/types/dead-character-record.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";

export default function genIntroEvent({
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
- you must have characters speak to each other in the scene

Important continuity rules for dead characters:
- Any dead characters must remain dead and not reappear in any dialogue.
- Living player characters might reference the deaths of dead player characters, highlighting the relationship between them and the deceased.
- The death of characters central to the storyline must be referenced in the story, and will likely change the direction of the next chapter.
- Minor unit deaths should be referenced in the story, but will likely only alter the next chapter slightly.
- When referencing dead boss characters, make sure to never refer to them as part of the player party.
`;

  return generateStructuredData({
    fnName: "genIntroEvent",
    systemMessage,
    prompt: `World Summary: ${JSON.stringify(worldSummary, null, 2)}${
      initialGameIdea
        ? `\nGame Idea: ${JSON.stringify(initialGameIdea, null, 2)}`
        : ""
    }
Chapter Idea: ${JSON.stringify(chapterIdea)}\nTone: ${tone}
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
    )}. You must NOT give these characters speaking roles in the current chapter idea! They are dead and the story can reference and change because of that, but dead characters can never show up again in any scenes.`,
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

