import { appendEvent } from "./append-event.ts";
import { appendLevel } from "./append-level.ts";

export default async function writeChapter({
  projectNameEndingInDotLtProj,
  chapterNumber,
}: {
  projectNameEndingInDotLtProj: string;
  chapterNumber: number;
}): Promise<void> {
  await appendLevel({
    projectNameEndingInDotLtProj,
    newLevel: {
      nid: `chapter_${chapterNumber}`,
      name: `Chapter ${chapterNumber}`,
    },
  });
  await appendEvent({
    projectNameEndingInDotLtProj,
    newEvent: {
      name: `Chapter ${chapterNumber} Start`,
      trigger: "level_start",
      level_nid: `chapter_${chapterNumber}`,
    },
  });
}

