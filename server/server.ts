import { initializeDatabase } from "@/db/init.ts";
import { getEnvironmentDescription } from "@/lib/env-detector.ts";
import { initializeVectorDb } from "@/vector-db/adapter.ts";
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { handleRequest } from "./routes/index.ts";

// Log environment information
console.log(`Starting server - ${getEnvironmentDescription()}`);

// Initialize databases
initializeDatabase();

// Try to initialize vector database, but continue if it fails
try {
  await initializeVectorDb();
  console.log("Vector database initialized successfully");
} catch (error) {
  console.warn(
    "Failed to initialize vector database, continuing without it:",
    error
  );
}

console.log("Server initialized, starting HTTP server...");

// Start HTTP server
serve(handleRequest);
