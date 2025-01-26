import { appendEvents } from "@/game-engine-io/write-chapter/append-events.ts";
import { appendLevel } from "./append-level.ts";

export default async function writeStubChapter({
  projectNameEndingInDotLtProj,
  chapterNumber,
}: {
  projectNameEndingInDotLtProj: string;
  chapterNumber: number;
}): Promise<void> {
  await appendLevel({
    projectNameEndingInDotLtProj,
    newLevel: {
      nid: `${chapterNumber}`,
      title: `Chapter ${chapterNumber}`,
    },
  });
  await appendEvents({
    projectNameEndingInDotLtProj,
    newEvents: [
      {
        name: `Chapter ${chapterNumber} Start`,
        trigger: "level_start",
        level_nid: `${chapterNumber}`,
        _source: [
          "speak;hint;This chapter has not been created yet!|You must close the game, create the chapter, and then restart the game to play it.",
        ],
      },
    ],
  });
}

