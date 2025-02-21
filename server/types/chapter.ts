import { Level } from "@/types/level.ts";
import { Event } from "./events/event.ts";
import { Character } from "./character/character.ts";
import { Tilemap } from "./maps/tilemap.ts";
import { EnemyFaction } from "@/ai/types/enemy-faction.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";

export interface Chapter {
  number: number;
  title: string;
  level: Level;
  newCharacters: Character[];
  events: Event[];
  tilemap: Tilemap;
  enemyFaction?: EnemyFaction;
  idea: ChapterIdea;
}
