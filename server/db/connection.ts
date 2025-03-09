import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";
import { isElectronEnvironment } from "@/lib/env-detector.ts";

// Determine the appropriate DB path based on environment
let dbPath: string;

// Check if we're running in Electron
if (isElectronEnvironment()) {
  // Use the path provided by Electron or default to userData directory
  dbPath = Deno.env.get("DB_PATH") || "./sqlite.db";
  console.log(`Running in Electron environment, using SQLite at: ${dbPath}`);
} else {
  // Use the normal server path
  dbPath = getPathWithinServer("/db/sqlite.db");
  console.log(`Running in standalone environment, using SQLite at: ${dbPath}`);
}

export const db = new DB(dbPath);
db.execute("PRAGMA journal_mode = WAL;");

if (import.meta.main) {
  console.log(`Database initialized at ${dbPath}`);
  db.close();
}