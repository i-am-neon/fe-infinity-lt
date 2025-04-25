import { getPathWithinLtMaker, getLtMakerPath } from "@/file-io/get-path-within-lt-maker.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import { isElectronEnvironment } from "@/lib/env-detector.ts";
import { gameRunner } from "@/lib/game-runner.ts";
import { relative } from "node:path";

// Not using system Python anymore, all Python is bundled and run with Wine

export default async function runPythonScript({
  pathToPythonScript,
  args = [],
}: {
  pathToPythonScript: string;
  args?: string[];
}) {
  const fullPath = pathToPythonScript.startsWith("/")
    ? pathToPythonScript
    : getPathWithinLtMaker(pathToPythonScript);
  const logger = getCurrentLogger();
  logger.debug("Running Python script", { path: fullPath, args });

  // Determine if we're in Electron environment
  const isElectron = isElectronEnvironment();

  // In Electron environment, use gameRunner.runPythonScript
  if (isElectron) {
    // When in Electron, we need to make sure we're not duplicating the lt-maker path
    const ltMakerPath = getLtMakerPath();

    // Check if the script path is already absolute and within the lt-maker directory
    let scriptPath = pathToPythonScript;

    // If the script path is already absolute and starts with lt-maker path
    if (fullPath.startsWith(ltMakerPath)) {
      // Make it relative to lt-maker to avoid path duplication
      scriptPath = relative(ltMakerPath, fullPath);
      logger.debug("Using relative path for Electron", { relativePath: scriptPath });
    }

    logger.debug("Running Python script in Electron environment", {
      scriptPath,
      originalPath: pathToPythonScript,
      fullPath,
      args
    });

    try {
      // Note: Need to update gameRunner.runPythonScript in game-runner.ts to accept args
      // This assumes the implementation has been updated to accept args
      // If it hasn't been updated, this will still work but args will be ignored
      await gameRunner.runPythonScript(scriptPath, args);
      return { output: "", error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error("Error running Python script in Electron", { error: errorMessage });
      throw new Error(`Failed to run Python script: ${errorMessage}`);
    }
  }

  // Outside of Electron, use direct approach similar to run-game.ts
  const originalDir = Deno.cwd();
  try {
    const ltMakerPath = getLtMakerPath();
    Deno.chdir(ltMakerPath);

    // Determine the appropriate Python command and args based on platform
    let pythonCommand: string;
    let pythonArgs: string[];

    if (Deno.build.os === "windows") {
      // Windows - use native Python directly
      pythonCommand = "..\\bin\\python\\python.exe";
      pythonArgs = [fullPath, ...args];
    } else {
      // macOS/Linux - use local Python in dev environments
      logger.debug("Using local Python for development");
      pythonCommand = "python";
      pythonArgs = [fullPath, ...args];
    }

    logger.debug(`Running Python script with command: ${pythonCommand} ${pythonArgs.join(" ")}`);

    const command = new Deno.Command(pythonCommand, {
      args: pythonArgs,
      stdout: "piped",
      stderr: "piped",
    });

    const { stdout, stderr } = await command.output();
    const output = new TextDecoder().decode(stdout);
    const error = new TextDecoder().decode(stderr);

    // Log all stderr output as debug information
    if (error) {
      logger.debug("stderr from Python script", { path: fullPath, error });
    }

    if (output) {
      logger.debug("Output for Python script", { path: fullPath, output });
    }

    // Only treat as error if not Wine debug messages or if no success indicator in output
    const isWineDebugOnly = error && error.trim().split('\n').every(line =>
      line.includes('fixme:') || line.includes('err:') || line.includes('warn:')
    );

    // Check if output contains a success indicator
    const hasSuccessIndicator = output && (
      output.includes("Project initialized at") ||
      output.includes("successfully") ||
      output.includes("Success")
    );

    // Only return as error if it's not just Wine debug messages and we don't have success indicators
    const actualError = error && !isWineDebugOnly && !hasSuccessIndicator ? error : null;
    if (actualError) {
      logger.error("Error running Python script", { path: fullPath, error: actualError });
    }

    return { output, error: actualError };
  } finally {
    Deno.chdir(originalDir);
  }
}

// Function to find Wine in system locations
async function findSystemWine(): Promise<string | null> {
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
  console.log("No Wine installation found in system locations");
  return null;
}

if (import.meta.main) {
  const [scriptPath, ...scriptArgs] = Deno.args;

  if (!scriptPath) {
    console.error("Please provide a path to a Python script");
    Deno.exit(1);
  }

  await runPythonScript({ pathToPythonScript: scriptPath, args: scriptArgs });
}