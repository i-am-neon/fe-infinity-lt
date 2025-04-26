import { initializeDatabase } from "./db/init.ts";
import { getEnvironmentDescription, isElectronEnvironment } from "./lib/env-detector.ts";
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { handleRequest } from "./routes/index.ts";
import { initVectorDbForElectron } from "./vector-db/init-electron.ts";

// Log environment information
console.log(`Starting server - ${getEnvironmentDescription()}`);

// Flag to track initialization status
let databaseInitialized = false;

// Initialize server components
async function initializeServer() {
  try {
    // Initialize SQL database
    console.log("Initializing database...");
    await initializeDatabase();
    databaseInitialized = true;
    console.log("Database initialized successfully");

    // Initialize vector database for Electron environment
    if (isElectronEnvironment()) {
      console.log("Initializing vector database for Electron environment...");
      await initVectorDbForElectron();
      console.log("Vector database initialized for Electron");
    }

    console.log("Server initialization completed, starting HTTP server...");
    
    // Create an enhanced request handler that checks initialization status
    const enhancedRequestHandler = async (req: Request): Promise<Response> => {
      // If the database isn't initialized yet, return a friendly 503 Service Unavailable
      if (!databaseInitialized) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Server is still initializing. Please try again in a moment."
          }),
          {
            status: 503,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": "2" // Suggest client retry after 2 seconds
            }
          }
        );
      }
      
      // If initialized, process the request normally
      return handleRequest(req);
    };

    // Start HTTP server with enhanced request handler
    serve(enhancedRequestHandler);
  } catch (error) {
    console.error("Server initialization failed:", error);
    // Allow server to start anyway, but requests will receive 503 until fixed
    serve(async (req: Request): Promise<Response> => {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Server initialization failed. Please restart the application."
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" }
        }
      );
    });
  }
}

// Start initialization process
initializeServer().catch(err => {
  console.error("Fatal error during server initialization:", err);
});
