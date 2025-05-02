import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { Event } from "../../types/events/event.ts";
import readOrCreateJSON from "@/game-engine-io/read-or-create-json.ts";

export async function appendEvents({
  projectNameEndingInDotLtProj,
  newEvents,
}: {
  projectNameEndingInDotLtProj: string;
  newEvents: Partial<Event>[];
}): Promise<void> {
  const filePath = getPathWithinLtMaker(
    `${projectNameEndingInDotLtProj}/game_data/events.json`
  );

  const defaultEvent: Omit<Event, "name" | "trigger" | "level_nid"> = {
    condition: "True",
    commands: [],
    only_once: false,
    priority: 20,
    _source: [],
  };

  const validatedEvents = newEvents.map((event) => {
    if (!event.name || !event.trigger) {
      throw new Error("Each event requires name, trigger, and level_nid");
    }
    return {
      ...defaultEvent,
      name: event.name,
      trigger: event.trigger,
      level_nid: event.level_nid ?? null,
      ...event,
    } satisfies Event;
  });

  const [events, wasFallback] = await readOrCreateJSON<Event[]>(
    filePath,
    validatedEvents,
    projectNameEndingInDotLtProj
  );

  if (wasFallback) {
    return;
  }

  events.push(...validatedEvents);
  await Deno.writeTextFile(filePath, JSON.stringify(events, null, 2));
}

if (import.meta.main) {
  appendEvents({
    projectNameEndingInDotLtProj: "_test.ltproj",
    newEvents: [
      { name: "Test Event", trigger: "level_start", level_nid: "test" },
    ],
  }).then(() => {
    console.log("Appended events successfully.");
  });
}

