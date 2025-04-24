import { Chapter } from "@/types/chapter.ts";
import { Character } from "./character/character.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { DeadCharacterRecord } from "@/types/dead-character-record.ts";

export interface Game {
  nid: string;
  title: string;
  directory: string;
  description: string;
  tone: string;
  chapters: Chapter[];
  characters: Character[];
  usedPortraits: string[];
  deadCharacters?: DeadCharacterRecord[];
  worldSummary?: WorldSummary;
  initialGameIdea?: InitialGameIdea;
  previousChapterMusic?: string[][];
}
