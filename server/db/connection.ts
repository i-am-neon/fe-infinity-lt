import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

/**
 * Create (or open) a local SQLite database file named "sqlite.db"
 * located in the server/db/ folder.
 */
const dbPath = getPathWithinServer("/db/sqlite.db");
export const db = new DB(dbPath);
db.execute("PRAGMA journal_mode = WAL;");
