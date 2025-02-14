import { Chapter } from "@/types/chapter.ts";
import { Character } from "./character/character.ts";

export interface Game {
  nid: string;
  title: string;
  directory: string;
  description: string;
  tone: string;
  chapters: Chapter[];
  characters: Character[];
  usedPortraits?: string[];
}
