import { isElectronEnvironment } from "./env-detector.ts";
import { dirname } from "node:path";

/**
 * A class with methods to interact with the game engine and LT Maker
 */
class GameRunner {
  /**
   * Send a command to the Electron main process to run a game
   * @param projectPath The path to the project to run
   * @returns A promise that resolves when the game is running
   */
  async sendToElectron(
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
   * Send a command to the Electron main process to run the editor
   * @param projectPath The path to the project to open, or undefined to open the editor without a project
   * @returns A promise that resolves when the editor is running
   */
  async sendEditorToElectron(
    projectPath?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`Attempting to open editor${projectPath ? ` with project: ${projectPath}` : ''}`);

      // In Electron, use HTTP to communicate with game launcher service
      const response = await fetch("http://localhost:8989/run-editor", {
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
      console.error("Error in sendEditorToElectron:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Run a Python script using the appropriate method based on environment
   * @param scriptPath The path to the Python script to run
   * @param args Optional arguments to pass to the Python script
   */
  async runPythonScript(scriptPath: string, args: string[] = []): Promise<void> {
    // In Electron environment, use HTTP to communicate with main process
    if (isElectronEnvironment()) {
      const response = await fetch("http://localhost:8989/run-python", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scriptPath, args }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to run Python script: ${error}`);
      }

      return;
    }

    // Direct execution for non-Electron environments
    // Save the current directory
    const originalDir = Deno.cwd();
    try {
      // Run the Python script directly with appropriate system command
      if (Deno.build.os === "windows") {
        // Windows
        const pythonCommand = "python";
        const runCommand = new Deno.Command(pythonCommand, {
          args: [scriptPath, ...args],
          stdout: "inherit",
          stderr: "inherit",
        });
        await runCommand.output();
      } else {
        // macOS/Linux - use local Python directly when in development mode
        console.log("Using local Python for development");
        const pythonCommand = "python";
        const runCommand = new Deno.Command(pythonCommand, {
          args: [scriptPath, ...args],
          stdout: "inherit",
          stderr: "inherit",
          cwd: dirname(scriptPath), // Run in the same directory as the script
        });
        await runCommand.output();
      }
    } finally {
      // Restore original directory
      Deno.chdir(originalDir);
    }
  }

  /**
   * Finds Wine in system locations
   */
  private async findSystemWine(): Promise<string | null> {
    try {
      // First try using 'which' to find Wine in PATH
      const whichCommand = new Deno.Command("which", {
        args: ["wine"],
        stdout: "piped",
        stderr: "piped",
      });
      const whichResult = await whichCommand.output();

      if (whichResult.code === 0) {
        const winePath = new TextDecoder().decode(whichResult.stdout).trim();
        console.log(`Found Wine in PATH: ${winePath}`);
        return winePath;
      }
    } catch (e) {
      console.log("Error using 'which wine':", e);
    }

    // If 'which' fails, check common system locations
    const commonLocations = [
      // macOS homebrew and standard locations
      "/opt/homebrew/bin/wine",
      "/usr/local/bin/wine",
      // Standard Linux locations
      "/usr/bin/wine",
      // macOS app bundles
      "/Applications/Wine Stable.app/Contents/Resources/wine/bin/wine",
      "/Applications/Wine Stable.app/Contents/MacOS/wine",
    ];

    for (const location of commonLocations) {
      try {
        const stat = await Deno.stat(location);
        if (stat.isFile) {
          console.log(`Found Wine at system location: ${location}`);
          return location;
        }
      } catch {
        // Location doesn't exist, continue to next
      }
    }

    // No Wine found
    console.error("No Wine installation found in system locations");
    return null;
  }

  /**
   * Determines the type of environment the code is running in
   */
  getEnvironmentDescription(): string {
    if (isElectronEnvironment()) {
      return Deno.env.get("NODE_ENV") === "development"
        ? "Electron, Development"
        : "Electron, Production";
    }
    return "Standalone Deno";
  }
}

// Create a singleton instance 
export const gameRunner = new GameRunner();

// Re-export the sendToElectron function for backward compatibility
export const sendToElectron = gameRunner.sendToElectron.bind(gameRunner);

// Export the new sendEditorToElectron function
export const sendEditorToElectron = gameRunner.sendEditorToElectron.bind(gameRunner);

if (import.meta.main) {
  const projectPath = "default.ltproj";
  console.log(`Testing sendToElectron with project: ${projectPath}`);
  const result = await sendToElectron(projectPath);
  console.log("Result:", result);
}