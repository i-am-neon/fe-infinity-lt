import { initVectorStore } from "@/vector-db/vector-store.ts";
import { ensureDir } from "@std/fs";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

export default async function initVectorDb(): Promise<void> {
  // Ensure data directories exist
  await ensureDir(getPathWithinServer("vector-db/data"));
  await ensureDir(getPathWithinServer("vector-db/seed-data"));
  
  // Initialize the vector store
  await initVectorStore();
  
  console.log("Vector database initialized");
}

if (import.meta.main) {
  await initVectorDb();
}