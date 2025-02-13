import { db } from "@/db/connection.ts";
import { Game } from "@/types/game.ts";
import { initializeDatabase } from "@/db/init.ts";

/**
 * This file sets up a local SQLite database in Deno and uses it to store Game objects.
 */
type GameRow = [
  nid: string,
  title: string,
  directory: string,
  description: string,
  tone: string,
  chaptersJson: string,
  charactersJson: string,
  usedPortraitsJson: string
];

/**
 * Insert a Game into the database.
 * If a row with the same nid already exists, this query will REPLACE it.
 */
export function insertGame(game: Game): void {
  const chaptersJson = JSON.stringify(game.chapters);
  const charactersJson = JSON.stringify(game.characters);
  db.query(
    `
      INSERT OR REPLACE INTO games (nid, title, directory, description, tone, chapters, characters, used_portraits)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      game.nid,
      game.title,
      game.directory,
      game.description,
      game.tone,
      chaptersJson,
      charactersJson,
      JSON.stringify(game.usedPortraits || []),
    ]
  );
}

/**
 * Retrieve a Game by its nid.
 */
export function getGameByNid(nid: string): Game | null {
  const query = db.query<GameRow>(
    "SELECT nid, title, directory, description, tone, chapters, characters, used_portraits FROM games WHERE nid = ? LIMIT 1",
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
  ] = query[0] as GameRow;
  let chapters = [];
  let characters = [];
  try {
    chapters = JSON.parse(dbChaptersJson) || [];
  } catch {
    // If JSON parse fails, keep chapters as empty array
  }
  try {
    characters = JSON.parse(dbCharactersJson) || [];
  } catch {
    // If JSON parse fails, keep characters as empty array
  }
  let usedPortraits: string[] = [];
  try {
    const parsed = JSON.parse(dbUsedPortraitsJson) || [];
    usedPortraits = Array.isArray(parsed) ? parsed : [];
  } catch {
    usedPortraits = [];
  }

  return {
    nid: dbNid,
    title: dbTitle,
    directory: dbDirectory,
    description: dbDescription,
    tone: dbTone,
    chapters,
    characters,
    usedPortraits,
  };
}

/**
 * Retrieve all Games.
 */
export function getAllGames(): Game[] {
  const query = db.query<GameRow>(
    "SELECT nid, title, directory, description, tone, chapters, characters, used_portraits FROM games"
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
    ] = row as [string, string, string, string, string, string, string, string];
    let chapters = [];
    let characters = [];
    try {
      chapters = JSON.parse(dbChaptersJson) || [];
    } catch {
      // If JSON parse fails, keep chapters as empty array
    }
    try {
      characters = JSON.parse(dbCharactersJson) || [];
    } catch {
      // If JSON parse fails, keep characters as empty array
    }
    let usedPortraits: string[] = [];
    try {
      const parsed = JSON.parse(dbUsedPortraitsJson) || [];
      usedPortraits = Array.isArray(parsed) ? parsed : [];
    } catch {
      usedPortraits = [];
    }

    games.push({
      nid: dbNid,
      title: dbTitle,
      directory: dbDirectory,
      description: dbDescription,
      tone: dbTone,
      chapters,
      characters,
      usedPortraits,
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

