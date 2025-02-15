import { AIEvent } from "@/ai/types/ai-event.ts";
import { Event } from "@/types/events/event.ts";
import { testAIEvent } from "@/ai/test-data/events.ts";
import breakTextIntoGameLines from "../../lib/formatting/break-text-into-game-lines.ts";
import { BackgroundOption } from "@/ai/types/background-option.ts";
import { backgroundImageMap } from "@/ai/types/background-option.ts";
import { BackgroundOptions } from "@/ai/types/background-option.ts";
import cleanGameText from "../../lib/formatting/clean-game-text.ts";

export default function convertAIEventToEvent({
  aiEvent,
  backgroundChoice,
  musicChoice,
  chapterNumber,
}: {
  aiEvent: AIEvent;
  backgroundChoice: BackgroundOption;
  musicChoice: string;
  chapterNumber: number;
}): Event {
  const condition =
    aiEvent.trigger === "level_start" || aiEvent.trigger === "level_end"
      ? "True"
      : aiEvent.condition;

  const _source = [
    "chapter_title",
    `change_background;${backgroundImageMap[backgroundChoice]}`,
    `music;${musicChoice};1000`,
    "transition;Open",
  ];

  aiEvent.sourceObjects.forEach((sourceObj) => {
    if (sourceObj.command === "speak") {
      const speaker = sourceObj.args[0];
      const line = sourceObj.args.slice(1).join(" ");
      const formatted = cleanGameText(line);
      _source.push(`speak;${speaker};${formatted}`);
    } else if (sourceObj.command === "narrate") {
      const line = sourceObj.args.join(" ");
      const formatted = cleanGameText(line);
      _source.push(`speak;hint;${formatted}`);
    } else {
      const rawSource = `${sourceObj.command};${sourceObj.args.join(";")}`;
      _source.push(rawSource);
    }
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
      backgroundChoice: BackgroundOptions.Forest,
      musicChoice: "Distant Roads",
      chapterNumber: 0,
    })
  );
}

