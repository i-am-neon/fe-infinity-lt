import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { Event } from "@/types/events/event.ts";

export async function removeStubEvent(
  projectNameEndingInDotLtProj: string
): Promise<void> {
  try {
    const filePath = getPathWithinLtMaker(
      `${projectNameEndingInDotLtProj}/game_data/events.json`
    );
    const content = await Deno.readTextFile(filePath);
    const events: Event[] = JSON.parse(content);

    if (events.length === 0) {
      throw new Error("No events to remove");
    }

    // Only remove the last event if it's a stub
    if (events[events.length - 1].name === "stub") {
      events.pop();
      await Deno.writeTextFile(filePath, JSON.stringify(events, null, 2));
    }
    events.pop();
    await Deno.writeTextFile(filePath, JSON.stringify(events, null, 2));
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(`File not found: ${projectNameEndingInDotLtProj}`);
    }
    throw error;
  }
}

if (import.meta.main) {
  await removeStubEvent("_new.ltproj");
}

