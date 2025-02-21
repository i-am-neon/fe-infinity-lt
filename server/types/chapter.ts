import { Level } from "@/types/level.ts";
import { Event } from "@/types/events/event.ts";
import { Character } from "@/types/character/character.ts";
import { Tilemap } from "@/types/maps/tilemap.ts";
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

