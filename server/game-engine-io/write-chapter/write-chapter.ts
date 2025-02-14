import appendTilemap from "@/game-engine-io/write-chapter/append-tilemap.ts";
import appendTilesetData from "@/game-engine-io/write-chapter/append-tileset-data.ts";
import { Chapter } from "../../types/chapter.ts";
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
  await appendTilemap({
    projectNameEndingInDotLtProj,
    chapterNumber: chapter.number,
    tilemap: chapter.tilemap,
  });
  await appendTilesetData({
    projectNameEndingInDotLtProj,
    mapNid: chapter.tilemap.nid,
  });
}

