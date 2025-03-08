import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

let dbPath: string;

// Check if we're running in Electron
const isElectron =
  Deno.env.get("ELECTRON_RUN_AS_NODE") === "1" ||
  Deno.env.get("DB_PATH") !== undefined;

if (isElectron) {
  // Use the path provided by Electron
  dbPath = Deno.env.get("DB_PATH") || "./sqlite.db";
} else {
  // Use the normal server path
  dbPath = getPathWithinServer("/db-sqlite/sqlite.db");
}

console.log(`Using database at: ${dbPath}`);

export const db = new DB(dbPath);
db.execute("PRAGMA journal_mode = WAL;");

if (import.meta.main) {
  console.log(`Database initialized at ${dbPath}`);
  db.close();
}