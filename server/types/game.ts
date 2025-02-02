import { Chapter } from "@/types/chapter.ts";
import { Character } from "@/types/character.ts";

export interface Game {
  nid: string;
  title: string;
  directory: string; // relative to the root of lt-maker, ex "_new.ltproj"
  description: string;
  chapters: Chapter[];
  characters: Character[];
}

