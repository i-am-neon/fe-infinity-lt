import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Game } from "@/types/game-engine/game.ts";

/**
 * This file sets up a local SQLite database in Deno and uses it to store Game objects.
 */

type GameRow = [string, string, string, string, string];

/**
 * Create (or open) a local SQLite database file named "my_local.db"
 * located in the server/db/ folder.
 */
const dbPath = "./db/my_local.db";
const db = new DB(dbPath);

/**
 * Initializes the database by ensuring the 'games' table exists.
 */
export function initializeDatabase() {
  db.execute(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nid TEXT UNIQUE,
      title TEXT,
      directory TEXT,
      description TEXT,
      chapters TEXT
    )
  `);
}

/**
 * Insert a Game into the database.
 * If a row with the same nid already exists, this query will REPLACE it.
 */
export function insertGame(game: Game): void {
  const chaptersJson = JSON.stringify(game.chapters);
  db.query(
    `
      INSERT OR REPLACE INTO games (nid, title, directory, description, chapters)
      VALUES (?, ?, ?, ?, ?)
    `,
    [game.nid, game.title, game.directory, game.description, chaptersJson]
  );
}

/**
 * Retrieve a Game by its nid.
 */
export function getGameByNid(nid: string): Game | null {
  const query = db.query(
    "SELECT nid, title, directory, description, chapters FROM games WHERE nid = ? LIMIT 1",
    [nid]
  );
  if (query.length === 0) {
    return null;
  }
  const [dbNid, dbTitle, dbDirectory, dbDescription, dbChaptersJson] =
    query[0] as GameRow;
  let chapters = [];
  try {
    chapters = JSON.parse(dbChaptersJson) || [];
  } catch {
    // If JSON parse fails, keep chapters as empty array
  }
  return {
    nid: dbNid,
    title: dbTitle,
    directory: dbDirectory,
    description: dbDescription,
    chapters,
  };
}

/**
 * Example usage: create or open DB, ensure the table exists, insert & retrieve a Game.
 * Run with: deno run --allow-read --allow-write server/db/local-db.ts
 */
if (import.meta.main) {
  initializeDatabase();

  const exampleGame: Game = {
    nid: "example-game",
    title: "Example Only Games Table",
    directory: "_example.ltproj",
    description: "Just an example to test storing games.",
    chapters: [],
  };
  insertGame(exampleGame);

  const retrieved = getGameByNid("example-game");
  console.log("Retrieved Game:", retrieved);
}

