import { Chapter } from "@/types/chapter.ts";
import { Character } from "./character/character.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";

export interface Game {
  nid: string;
  title: string;
  directory: string;
  description: string;
  tone: string;
  chapters: Chapter[];
  characters: Character[];
  usedPortraits: string[];
  worldSummary?: WorldSummary;
  initialGameIdea?: InitialGameIdea;
}

