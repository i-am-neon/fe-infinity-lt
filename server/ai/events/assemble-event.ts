import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import genPrologueIntroEvent from "@/ai/events/gen-prologue-intro-event.ts";
import chooseBackground from "@/ai/events/choose-background.ts";
import convertAIEventToEvent from "@/ai/events/convert-ai-event-to-event.ts";
import { Event } from "@/types/events/event.ts";

export default async function assembleEvent({
  worldSummary,
  initialGameIdea,
  tone,
  chapterNumber,
}: {
  worldSummary: WorldSummary;
  initialGameIdea: InitialGameIdea;
  tone: string;
  chapterNumber: number;
}): Promise<Event> {
  const prologueIntroAIEvent = await genPrologueIntroEvent({
    worldSummary,
    initialGameIdea,
    tone,
  });
  const backgroundChoice = await chooseBackground(prologueIntroAIEvent);
  return convertAIEventToEvent({
    aiEvent: prologueIntroAIEvent,
    backgroundChoice,
    chapterNumber,
  });
}
