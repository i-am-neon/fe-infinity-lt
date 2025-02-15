import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { Level } from "@/types/level.ts";

export async function removeStubLevel(
  projectNameEndingInDotLtProj: string
): Promise<void> {
  try {
    const filePath = getPathWithinLtMaker(
      `${projectNameEndingInDotLtProj}/game_data/levels.json`
    );
    const content = await Deno.readTextFile(filePath);
    const levels: Level[] = JSON.parse(content);

    if (levels.length === 0) {
      throw new Error("No levels to remove");
    }
    // Only remove the last level if it's a stub
    if (levels[levels.length - 1].tags?.includes("stub")) {
      levels.pop();
      await Deno.writeTextFile(filePath, JSON.stringify(levels, null, 2));
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(`File not found: ${projectNameEndingInDotLtProj}`);
    }
    throw error;
  }
}

if (import.meta.main) {
  await removeStubLevel("_new.ltproj");
}

