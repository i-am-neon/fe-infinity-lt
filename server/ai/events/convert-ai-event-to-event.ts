import { AIEvent } from "@/ai/types/ai-event.ts";
import { Event } from "@/types/events/event.ts";
import { testAIEvent } from "@/ai/test-data/events.ts";

export default function convertAIEventToEvent({
  aiEvent,
  chapterNumber,
}: {
  aiEvent: AIEvent;
  chapterNumber: number;
}): Event {
  const condition =
    aiEvent.trigger === "level_start" || aiEvent.trigger === "level_end"
      ? "True"
      : aiEvent.condition;

  const _source = ["chapter_title", "transition;Open"];

  aiEvent.sourceObjects.forEach((sourceObj) => {
    const command =
      sourceObj.command === "narrate" ? "hint" : sourceObj.command;
    _source.push(`${command};${sourceObj.args.join(";")}`);
  });

  return {
    name: aiEvent.name,
    trigger: aiEvent.trigger,
    level_nid: chapterNumber.toString(),
    condition,
    commands: [],
    only_once: false,
    priority: 20,
    _source,
  };
}

if (import.meta.main) {
  console.log(
    convertAIEventToEvent({
      aiEvent: testAIEvent,
      chapterNumber: 0,
    })
  );
}

