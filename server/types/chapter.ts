import { Level } from "@/types/level.ts";
import { Event } from "@/types/event.ts";
import { Character } from "@/types/character.ts";

export interface Chapter {
  number: number;
  title: string;
  level: Level;
  newCharacters: Character[];
  events: Event[];
}

