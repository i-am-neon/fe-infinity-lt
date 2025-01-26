import { Level } from "@/types/game-engine/level.ts";
import { Event } from "@/types/game-engine/event.ts";

export interface Chapter {
  number: number;
  title: string;
  level: Level;
  events: Event[];
}

