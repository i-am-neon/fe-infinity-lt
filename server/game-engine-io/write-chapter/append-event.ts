import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { Event } from "@/types/game-engine/event.ts";

export async function appendEvent({
  projectNameEndingInDotLtProj,
  newEvent,
}: {
  projectNameEndingInDotLtProj: string;
  newEvent: Partial<Event>;
}): Promise<void> {
  try {
    const filePath = getPathWithinLtMaker(
      `${projectNameEndingInDotLtProj}/game_data/events.json`
    );
    const content = await Deno.readTextFile(filePath);
    const events: Event[] = JSON.parse(content);

    if (!newEvent.name || !newEvent.trigger || !newEvent.level_nid) {
      throw new Error("New event requires name, trigger, and level_nid");
    }

    const defaultEvent: Event = {
      name: newEvent.name,
      trigger: newEvent.trigger,
      level_nid: newEvent.level_nid,
      condition: "True",
      commands: [],
      only_once: false,
      priority: 20,
      _source: [],
    };

    events.push({ ...defaultEvent, ...newEvent });
    await Deno.writeTextFile(filePath, JSON.stringify(events, null, 2));
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await Deno.writeTextFile(
        projectNameEndingInDotLtProj,
        JSON.stringify([newEvent], null, 2)
      );
      return;
    }
    throw error;
  }
}

if (import.meta.main) {
  await appendEvent({
    projectNameEndingInDotLtProj: "_new.ltproj",
    newEvent: {
      name: "Test Event",
      trigger: "level_start",
      level_nid: "test",
    },
  });
}

