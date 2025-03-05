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

    // Create table for maps vectors
    await client.query(`
      CREATE TABLE IF NOT EXISTS maps_vectors (
        id TEXT PRIMARY KEY,
        embedding vector(1536) NOT NULL,
        metadata JSONB
      );
    `);
    // Create table for male portraits vectors
    await client.query(`
      CREATE TABLE IF NOT EXISTS portraits_male_vectors (
        id TEXT PRIMARY KEY,
        embedding vector(1536) NOT NULL,
        metadata JSONB
      );
    `);

    // Create table for female portraits vectors
    await client.query(`
      CREATE TABLE IF NOT EXISTS portraits_female_vectors (
        id TEXT PRIMARY KEY,
        embedding vector(1536) NOT NULL,
        metadata JSONB
      );
    `);
    // Create table for music vectors
    await client.query(`
      CREATE TABLE IF NOT EXISTS music_vectors (
        id TEXT PRIMARY KEY,
        embedding vector(1536) NOT NULL,
        metadata JSONB
      );
    `);
    
    // Create table for item vectors
    await client.query(`
      CREATE TABLE IF NOT EXISTS items_vectors (
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