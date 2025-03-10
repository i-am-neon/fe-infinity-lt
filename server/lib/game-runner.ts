import { isElectronEnvironment } from "./env-detector.ts";

/**
 * Send a command to the Electron main process to run a game
 * @param projectPath The path to the project to run
 * @returns A promise that resolves when the game is running
 */
export async function sendToElectron(
  projectPath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Attempting to run game: ${projectPath}`);
    
    // In Electron, use HTTP to communicate with game launcher service
    const response = await fetch("http://localhost:8989/run-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectPath }),
    });

    // Parse the response
    const result = await response.json();
    
    return {
      success: result.success === true,
      error: result.error,
    };
  } catch (error) {
    console.error("Error in sendToElectron:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Determines the type of environment the code is running in
 */
export function getEnvironmentDescription(): string {
  if (isElectronEnvironment()) {
    return Deno.env.get("NODE_ENV") === "development"
      ? "Electron, Development"
      : "Electron, Production";
  }
  return "Standalone Deno";
}

if (import.meta.main) {
  const projectPath = "default.ltproj";
  console.log(`Testing sendToElectron with project: ${projectPath}`);
  const result = await sendToElectron(projectPath);
  console.log("Result:", result);
}