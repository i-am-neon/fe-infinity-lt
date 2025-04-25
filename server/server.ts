import { initializeDatabase } from "@/db/init.ts";
import { getEnvironmentDescription, isElectronEnvironment } from "@/lib/env-detector.ts";
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { handleRequest } from "./routes/index.ts";
import { initVectorDbForElectron } from "@/vector-db/init-electron.ts";

// Log environment information
console.log(`Starting server - ${getEnvironmentDescription()}`);

// Initialize databases
initializeDatabase();

// Initialize vector database for Electron environment
if (isElectronEnvironment()) {
  console.log("Initializing vector database for Electron environment...");
  initVectorDbForElectron()
    .then(() => console.log("Vector database initialized for Electron"))
    .catch(err => console.error("Failed to initialize vector database:", err));
}

console.log("Server initialized, starting HTTP server...");

// Start HTTP server
serve(handleRequest);
