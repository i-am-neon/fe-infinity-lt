import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import genPrologueIntroEvent from "@/ai/events/gen-prologue-intro-event.ts";
import chooseBackground from "@/ai/events/choose-background.ts";
import convertAIEventToEvent from "@/ai/events/convert-ai-event-to-event.ts";
import { Event } from "@/types/events/event.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import chooseMusic from "@/ai/choose-music.ts";
import { AIEvent } from "@/ai/types/ai-event.ts";

export default async function assembleEvent({
  worldSummary,
  initialGameIdea,
  chapterIdea,
  tone,
  chapterNumber,
}: {
  worldSummary: WorldSummary;
  initialGameIdea: InitialGameIdea;
  chapterIdea: ChapterIdea;
  tone: string;
  chapterNumber: number;
}): Promise<{ event: Event; aiEvent: AIEvent; music: string }> {
  const prologueIntroAIEvent = await genPrologueIntroEvent({
    worldSummary,
    initialGameIdea,
    chapterIdea,
    tone,
  });
  const [backgroundChoice, musicChoice] = await Promise.all([
    chooseBackground(prologueIntroAIEvent),
    chooseMusic(chapterIdea.intro),
  ]);
  const event = convertAIEventToEvent({
    aiEvent: prologueIntroAIEvent,
    backgroundChoice,
    musicChoice,
    chapterNumber,
    showChapterTitle: true,
  });
  return { event, aiEvent: prologueIntroAIEvent, music: musicChoice };
}

