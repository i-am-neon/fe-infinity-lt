import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";

export default async function getCurrentChapterNumber(
  projectNameEndingInDotLtProj: string
): Promise<number> {
  const levelsPath = getPathWithinLtMaker(
    `${projectNameEndingInDotLtProj}/game_data/levels.json`
  );

  const levels = await Deno.readTextFile(levelsPath).then(JSON.parse);

  return levels.length - 2; // get the index, so -1, ignore the stub chapter, so subtract another 1
}

if (import.meta.main) {
  getCurrentChapterNumber("_new.ltproj").then(console.log);
}

