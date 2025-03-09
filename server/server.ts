import { initializeDatabase } from "@/db/init.ts";
import { getEnvironmentDescription } from "@/lib/env-detector.ts";
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { handleRequest } from "./routes/index.ts";

// Log environment information
console.log(`Starting server - ${getEnvironmentDescription()}`);

// Initialize databases
initializeDatabase();

console.log("Server initialized, starting HTTP server...");

// Start HTTP server
serve(handleRequest);

