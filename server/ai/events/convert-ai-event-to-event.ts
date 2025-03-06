import { testAIEventPrologueIntro } from "@/ai/test-data/events.ts";
import { AIEvent } from "@/ai/types/ai-event.ts";
import {
  backgroundImageMap,
  BackgroundOption,
  BackgroundOptions,
} from "@/ai/types/background-option.ts";
import { Event } from "@/types/events/event.ts";
import cleanGameText from "../../lib/formatting/clean-game-text.ts";

export default function convertAIEventToEvent({
  aiEvent,
  backgroundChoice,
  musicChoice,
  chapterNumber,
  showChapterTitle,
}: {
  aiEvent: AIEvent;
  backgroundChoice: BackgroundOption;
  musicChoice: string;
  chapterNumber: number;
  showChapterTitle?: boolean;
}): Event {
  const condition =
    aiEvent.trigger === "level_start" || aiEvent.trigger === "level_end"
      ? "True"
      : aiEvent.condition;

  const _source = [
    showChapterTitle ? "chapter_title" : "",
    `change_background;${backgroundImageMap[backgroundChoice]}`,
    `music;${musicChoice};1000`,
    "transition;Open",
  ].filter(Boolean);

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
      _source.push("end_skip");
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
      aiEvent: testAIEventPrologueIntro,
      backgroundChoice: BackgroundOptions.Forest,
      musicChoice: "Distant Roads",
      chapterNumber: 0,
    })
  );
}

