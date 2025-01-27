import { db } from "./connection.ts";
import { Game } from "@/types/game-engine/game.ts";

/**
 * This file sets up a local SQLite database in Deno and uses it to store Game objects.
 */
type GameRow = [
  nid: string,
  title: string,
  directory: string,
  description: string,
  chaptersJson: string
];

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
  const query = db.query<GameRow>(
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
 * Retrieve all Games.
 */
export function getAllGames(): Game[] {
  const query = db.query<GameRow>("SELECT nid, title, directory, description, chapters FROM games");
  const games: Game[] = [];
  for (const row of query) {
    const [dbNid, dbTitle, dbDirectory, dbDescription, dbChaptersJson] = row as [string, string, string, string, string];
    let chapters = [];
    try {
      chapters = JSON.parse(dbChaptersJson) || [];
    } catch {
      // If JSON parse fails, keep chapters as empty array
    }
    games.push({
      nid: dbNid,
      title: dbTitle,
      directory: dbDirectory,
      description: dbDescription,
      chapters,
    });
  }
  return games;
}

/**
 * Example usage: create or open DB, ensure the table exists, insert & retrieve a Game.
 * Run with: deno run --allow-read --allow-write server/db/games.ts
 */
if (import.meta.main) {
  import("./init.ts").then(async (init) => {
    init.initializeDatabase();

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
  });
}