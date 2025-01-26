import { Chapter } from "@/types/game-engine/chapter.ts";

export interface Game {
  nid: string;
  title: string;
  directory: string; // relative to the root of lt-maker, ex "_new.ltproj"
  description: string;
  chapters: Chapter[];
}
