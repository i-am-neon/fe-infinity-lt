import { Chapter } from "@/types/game-engine/chapter.ts";
import { appendEvents } from "./append-events.ts";
import { appendLevel } from "./append-level.ts";

export default async function writeChapter({
  projectNameEndingInDotLtProj,
  chapter,
}: {
  projectNameEndingInDotLtProj: string;
  chapter: Chapter;
}): Promise<void> {
  await appendLevel({
    projectNameEndingInDotLtProj,
    newLevel: chapter.level,
  });
  await appendEvents({
    projectNameEndingInDotLtProj,
    newEvents: chapter.events,
  });
}

