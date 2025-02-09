import pool from "@/vector-db/connection.ts";

/**
 * Ensures the 'vector' extension is enabled and a table named 'vectors'
 * with id, embedding, and metadata columns is created if it doesn't already exist.
 */
export default async function initVectorDb(): Promise<void> {
  const client = await pool.connect();
  try {
    // Enable pgvector extension
    await client.query(`CREATE EXTENSION IF NOT EXISTS vector;`);

    // Create table if not exists
    // We assume dimension=1536 for embeddings, but adjust as needed
    await client.query(`
      CREATE TABLE IF NOT EXISTS vectors (
        id TEXT PRIMARY KEY,
        embedding vector(1536) NOT NULL,
        metadata JSONB
      );
    `);
  } finally {
    client.release();
  }
}

if (import.meta.main) {
  await initVectorDb();
  console.log("Vector DB initialized (extension + table).");
}
