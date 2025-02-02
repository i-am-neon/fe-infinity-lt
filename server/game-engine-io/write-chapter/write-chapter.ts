import { Chapter } from "../../types/chapter.ts";
import { appendEvents } from "./append-events.ts";
import { appendLevel } from "./append-level.ts";
import appendUnits from "@/game-engine-io/write-chapter/append-units.ts";

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
  await appendUnits({
    projectNameEndingInDotLtProj,
    newUnits: chapter.newCharacters.map((c) => c.unitData),
  });
}

