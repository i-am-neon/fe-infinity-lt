import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";

export async function removeLastEvent(
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
  await removeLastEvent("_new.ltproj");
}
