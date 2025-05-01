import { isElectronEnvironment } from "@/lib/env-detector.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { db } from "@/db/connection.ts";
import { getVectorStore } from "@/vector-db/init.ts";
import { initVectorDbForElectron } from "@/vector-db/init-electron.ts";
import { handleGenerateNextChapter } from "@/routes/generate-next-chapter.ts";
import { handleGetChapterGenerationProgress, handleGetGameCreationProgress } from "@/routes/generation-progress.ts";
import { handleTestChapterGeneration } from "@/routes/test-chapter-generation.ts";
import { join } from "node:path";

async function checkEnvironment() {
  console.log("=== Environment Verification ===");
  console.log(`Running in Electron: ${isElectronEnvironment()}`);

  // Initialize vector database for Electron if needed
  if (isElectronEnvironment()) {
    console.log("Initializing vector database for Electron environment...");
    try {
      await initVectorDbForElectron();
      console.log("Vector database initialization for Electron complete");
    } catch (error) {
      console.error("Failed to initialize vector database for Electron:", error);
    }
  }

  // Check environment variables
  console.log("\n=== Environment Variables ===");
  const envVars = [
    "ELECTRON_RUN_AS_NODE",
    "ELECTRON_APP_ROOT",
    "DB_PATH",
    "SERVER_DIR",
    "USER_DATA_PATH",
    "APP_PATH",
    "RESOURCES_PATH",
    "OPENAI_API_KEY"
  ];

  for (const varName of envVars) {
    const value = Deno.env.get(varName);
    console.log(`${varName}: ${value || "not set"}`);
  }

  // Check SQLite connection
  console.log("\n=== SQLite Connection ===");
  try {
    const result = db.query("SELECT 1 AS test");
    console.log("SQLite connection test:", result);
    console.log("SQLite connection successful");
  } catch (error) {
    console.error("SQLite connection failed:", error);
  }

  // Check vector store
  console.log("\n=== Vector Store ===");
  try {
    const vectorStore = await getVectorStore();
    const counts = {
      maps: vectorStore.getVectors("maps").length,
      portraits_male: vectorStore.getVectors("portraits-male").length,
      portraits_female: vectorStore.getVectors("portraits-female").length,
      music: vectorStore.getVectors("music").length,
      items: vectorStore.getVectors("items").length,
      scene_backgrounds: vectorStore.getVectors("scene-backgrounds").length,
    };
    console.log("Vector counts:", counts);
    console.log("Vector store initialization successful");
  } catch (error) {
    console.error("Vector store initialization failed:", error);
  }

  console.log("\n=== Path Resolution ===");
  try {
    const serverPath = getPathWithinServer("");
    console.log("Server path:", serverPath);
  } catch (error) {
    console.error("Path resolution failed:", error);
  }
}

// Set user data directory in development mode
if (!Deno.env.get("USER_DATA_DIR")) {
  const cwd = Deno.cwd();
  Deno.env.set("USER_DATA_DIR", join(cwd, "dev-user-data"));
  console.log(`Set USER_DATA_DIR to ${Deno.env.get("USER_DATA_DIR")}`);
}

if (import.meta.main) {
  checkEnvironment();
}