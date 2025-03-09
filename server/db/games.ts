import { Game } from "@/types/game.ts";
import { db } from "./connection.ts";
import { initializeDatabase } from "./init.ts";

/**
 * Insert a Game into the database.
 * If a row with the same nid already exists, this query will REPLACE it.
 */
export function insertGame(game: Game): void {
  const chaptersJson = JSON.stringify(game.chapters);
  const charactersJson = JSON.stringify(game.characters);
  const usedPortraitsJson = JSON.stringify(game.usedPortraits);
  const worldSummaryJson = game.worldSummary
    ? JSON.stringify(game.worldSummary)
    : "";
  const initialGameIdeaJson = game.initialGameIdea
    ? JSON.stringify(game.initialGameIdea)
    : "";
  db.query(
    `
      INSERT OR REPLACE INTO games (
        nid,
        title,
        directory,
        description,
        tone,
        chapters,
        characters,
        used_portraits,
        world_summary,
        initial_game_idea,
        dead_characters
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      game.nid,
      game.title,
      game.directory,
      game.description,
      game.tone,
      chaptersJson,
      charactersJson,
      usedPortraitsJson,
      worldSummaryJson,
      initialGameIdeaJson,
      JSON.stringify(game.deadCharacters ?? []),
    ]
  );
}

/**
 * Retrieve a Game by its nid.
 */
export function getGameByNid(nid: string): Game | null {
  const query = db.query<
    [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string?,
      string?,
      string?
    ]
  >(
    "SELECT nid, title, directory, description, tone, chapters, characters, used_portraits, world_summary, initial_game_idea, dead_characters FROM games WHERE nid = ? LIMIT 1",
    [nid]
  );
  if (query.length === 0) {
    return null;
  }
  const [
    dbNid,
    dbTitle,
    dbDirectory,
    dbDescription,
    dbTone,
    dbChaptersJson,
    dbCharactersJson,
    dbUsedPortraitsJson,
    dbWorldSummaryJson,
    dbInitialGameIdeaJson,
    dbDeadCharactersJson,
  ] = query[0];

  let chapters = [];
  let characters = [];
  try {
    chapters = JSON.parse(dbChaptersJson) || [];
  } catch {
    chapters = [];
  }
  try {
    characters = JSON.parse(dbCharactersJson) || [];
  } catch {
    characters = [];
  }

  let usedPortraits: string[] = [];
  try {
    const parsed = JSON.parse(dbUsedPortraitsJson) || [];
    usedPortraits = Array.isArray(parsed) ? parsed : [];
  } catch {
    usedPortraits = [];
  }

  let worldSummary = undefined;
  try {
    if (dbWorldSummaryJson) {
      worldSummary = JSON.parse(dbWorldSummaryJson);
    }
  } catch (_) {}

  let initialGameIdea = undefined;
  try {
    if (dbInitialGameIdeaJson) {
      initialGameIdea = JSON.parse(dbInitialGameIdeaJson);
    }
  } catch (_) {}

  let deadCharacters = [];
  try {
    if (dbDeadCharactersJson) {
      const parsedDc = JSON.parse(dbDeadCharactersJson);
      if (Array.isArray(parsedDc)) {
        deadCharacters = parsedDc;
      }
    }
  } catch (_) {}

  return {
    nid: dbNid,
    title: dbTitle,
    directory: dbDirectory,
    description: dbDescription,
    tone: dbTone,
    chapters,
    characters,
    usedPortraits,
    deadCharacters,
    worldSummary,
    initialGameIdea,
  };
}

/**
 * Retrieve all Games.
 */
export function getAllGames(): Game[] {
  const query = db.query<
    [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string?,
      string?
    ]
  >(
    "SELECT nid, title, directory, description, tone, chapters, characters, used_portraits, world_summary, initial_game_idea FROM games"
  );

  const games: Game[] = [];
  for (const row of query) {
    const [
      dbNid,
      dbTitle,
      dbDirectory,
      dbDescription,
      dbTone,
      dbChaptersJson,
      dbCharactersJson,
      dbUsedPortraitsJson,
      dbWorldSummaryJson,
      dbInitialGameIdeaJson,
    ] = row;

    let chapters = [];
    let characters = [];
    try {
      chapters = JSON.parse(dbChaptersJson) || [];
    } catch {
      chapters = [];
    }
    try {
      characters = JSON.parse(dbCharactersJson) || [];
    } catch {
      characters = [];
    }

    let usedPortraits: string[] = [];
    try {
      const parsed = JSON.parse(dbUsedPortraitsJson) || [];
      usedPortraits = Array.isArray(parsed) ? parsed : [];
    } catch {
      usedPortraits = [];
    }

    let worldSummary = undefined;
    try {
      if (dbWorldSummaryJson) {
        worldSummary = JSON.parse(dbWorldSummaryJson);
      }
    } catch (_) {}

    let initialGameIdea = undefined;
    try {
      if (dbInitialGameIdeaJson) {
        initialGameIdea = JSON.parse(dbInitialGameIdeaJson);
      }
    } catch (_) {}

    games.push({
      nid: dbNid,
      title: dbTitle,
      directory: dbDirectory,
      description: dbDescription,
      tone: dbTone,
      chapters,
      characters,
      usedPortraits,
      worldSummary,
      initialGameIdea,
    });
  }
  return games;
}

/**
 * Remove a game by its nid.
 */
export function removeGameByNid(nid: string): void {
  db.query("DELETE FROM games WHERE nid = ?", [nid]);
}

/**
 * Example usage: create or open DB, ensure the table exists, insert & retrieve a Game.
 * Run with: deno run --allow-read --allow-write server/db/games.ts
 */
if (import.meta.main) {
  initializeDatabase();

  const exampleGame: Game = {
    nid: "example-game",
    title: "Example Only Games Table",
    tone: "example",
    directory: "_example.ltproj",
    description: "Just an example to test storing games.",
    chapters: [],
    characters: [],
    usedPortraits: [],
  };
  insertGame(exampleGame);

  const retrieved = getGameByNid("example-game");
  console.log("Retrieved Game:", retrieved);
}

