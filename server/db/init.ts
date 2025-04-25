import { db } from "./connection.ts";

/**
 * Initializes the database by ensuring the 'games' table exists.
 * Returns a promise that resolves when the database is ready or rejects on error.
 */
export function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
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
          initial_game_idea TEXT,
          dead_characters TEXT,
          previous_chapter_music TEXT
        )
      `);
      console.log("Database initialized successfully");
      resolve();
    } catch (error) {
      console.error("Failed to initialize database:", error);
      reject(error);
    }
  });
}

if (import.meta.main) {
  initializeDatabase()
    .then(() => console.log("Database initialization completed"))
    .catch(err => console.error("Database initialization failed:", err));
}