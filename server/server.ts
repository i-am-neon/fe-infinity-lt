import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { handleRequest } from "./routes/index.ts";
import { initializeDatabase } from "./db/init.ts";
import { initializeVectorDb } from "./vector-db/adapter.ts";
import { getEnvironmentDescription } from "@/lib/env-detector.ts";

// Log environment information
console.log(`Starting server - ${getEnvironmentDescription()}`);

// Initialize databases
initializeDatabase();

// Initialize vector database (will use appropriate implementation)
await initializeVectorDb();

console.log("Server initialized, starting HTTP server...");

// Start HTTP server
serve(handleRequest);

