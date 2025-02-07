import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

/**
 * Create (or open) a local SQLite database file named "my_local.db"
 * located in the server/db/ folder.
 */
const dbPath = getPathWithinServer("/db/local.db");
export const db = new DB(dbPath);
db.execute("PRAGMA journal_mode = WAL;");
