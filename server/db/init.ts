import { db } from "./connection.ts";

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
      tone TEXT,
      chapters TEXT,
      characters TEXT,
      used_portraits TEXT,
      world_summary TEXT,
      initial_game_idea TEXT
    )
  `);
}

if (import.meta.main) {
  initializeDatabase();
}