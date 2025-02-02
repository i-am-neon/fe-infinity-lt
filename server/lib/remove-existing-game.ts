import { getGameByNid, removeGameByNid } from "@/db/games.ts";
import removeWithinLtMaker from "@/file-io/remove-within-lt-maker.ts";
import { sluggify } from "./sluggify.ts";

export default async function removeExistingGame(
  projectName: string
): Promise<void> {
  const slug = sluggify(projectName);
  const directory = `_${slug}.ltproj`;
  const existingGame = getGameByNid(`_${slug}`);

  if (existingGame) {
    removeGameByNid(`_${slug}`);
  }

  try {
    await removeWithinLtMaker({ relativePath: directory });
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      // ignore if directory doesn't exist
    } else {
      throw err;
    }
  }
}

if (import.meta.main) {
  removeExistingGame("My Project").then(() => {
    console.log("Removed any existing game named My Project if it existed.");
  });
}
