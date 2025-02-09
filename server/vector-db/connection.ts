import pkg from "npm:pg";

const { Pool } = pkg;

/**
 * Creates a connection pool to a PostgreSQL database that supports pgvector.
 */
const pool = new Pool(
  {
    hostname: Deno.env.get("PGHOST") || "localhost",
    port: Number(Deno.env.get("PGPORT") || "5432"),
    user: Deno.env.get("PGUSER") || "postgres",
    password: Deno.env.get("PGPASSWORD") || "",
    database: Deno.env.get("PGDATABASE") || "postgres",
  },
  3
); // up to 3 connections

export default pool;

if (import.meta.main) {
  console.log("Testing PG connection...");
  const client = await pool.connect();
  try {
    await client.queryObject("SELECT 1;");
    console.log("PG connection success.");
  } finally {
    client.release();
  }
}

