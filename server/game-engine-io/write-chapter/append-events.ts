import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { Event } from "@/types/game-engine/event.ts";

export async function appendEvents({
  projectNameEndingInDotLtProj,
  newEvents,
}: {
  projectNameEndingInDotLtProj: string;
  newEvents: Partial<Event>[];
}): Promise<void> {
  try {
    const filePath = getPathWithinLtMaker(
      `${projectNameEndingInDotLtProj}/game_data/events.json`
    );
    const content = await Deno.readTextFile(filePath);
    const events: Event[] = JSON.parse(content);

    const defaultEvent: Omit<Event, "name" | "trigger" | "level_nid"> = {
      condition: "True",
      commands: [],
      only_once: false,
      priority: 20,
      _source: [],
    };

    const validatedEvents = newEvents.map((event) => {
      if (!event.name || !event.trigger || !event.level_nid) {
        throw new Error("Each event requires name, trigger, and level_nid");
      }
      return {
        ...defaultEvent,
        name: event.name,
        trigger: event.trigger,
        level_nid: event.level_nid,
        ...event,
      } satisfies Event;
    });

    events.push(...validatedEvents);
    await Deno.writeTextFile(filePath, JSON.stringify(events, null, 2));
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await Deno.writeTextFile(
        projectNameEndingInDotLtProj,
        JSON.stringify(newEvents, null, 2)
      );
      return;
    }
    throw error;
  }
}

if (import.meta.main) {
  await appendEvents({
    projectNameEndingInDotLtProj: "_new.ltproj",
    newEvents: [
      {
        name: "Test Event",
        trigger: "level_start",
        level_nid: "test",
      },
    ],
  });
}
