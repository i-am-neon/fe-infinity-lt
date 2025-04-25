import { getPathWithinLtMaker, getLtMakerPath, getRelativePathFromCwd } from "@/file-io/get-path-within-lt-maker.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import { isElectronEnvironment } from "@/lib/env-detector.ts";
import { gameRunner } from "@/lib/game-runner.ts";
import { relative, isAbsolute, join } from "node:path";

// Not using system Python anymore, all Python is bundled and run with Wine

export default async function runPythonScript({
  pathToPythonScript,
  args = [],
}: {
  pathToPythonScript: string;
  args?: string[];
}) {
  const fullPath = pathToPythonScript.startsWith("/") || (Deno.build.os === "windows" && isAbsolute(pathToPythonScript))
    ? pathToPythonScript
    : getPathWithinLtMaker(pathToPythonScript);
  const logger = getCurrentLogger();
  logger.debug("Running Python script", { path: fullPath, args });

  // Determine if we're in Electron environment
  const isElectron = isElectronEnvironment();
  const isWindows = Deno.build.os === "windows";
  const ltMakerPath = getLtMakerPath();

  // In Electron environment, use gameRunner.runPythonScript
  if (isElectron) {
    // Get script path for Electron
    let scriptPath = pathToPythonScript;

    // For Windows, check if path is already absolute, and make it relative to lt-maker if needed
    if (isWindows && isAbsolute(fullPath)) {
      // If script is within lt-maker, use relative path to prevent duplication
      // Use case-insensitive comparison for Windows paths
      if (fullPath.toLowerCase().startsWith(ltMakerPath.toLowerCase())) {
        // Get just the filename without any path for simplicity
        // For Windows, we want to run from the lt-maker directory directly
        const scriptFilename = fullPath.split("\\").pop() || scriptPath;
        logger.debug("Using script filename for Windows in Electron", { 
          originalPath: fullPath,
          scriptFilename,
          ltMakerPath
        });
        scriptPath = scriptFilename;
      } else {
        // Script is outside lt-maker, use as is
        scriptPath = fullPath;
      }
    } 
    // Non-Windows or non-absolute path case
    else if (fullPath.startsWith(ltMakerPath)) {
      // Make it relative to lt-maker to avoid path duplication
      scriptPath = relative(ltMakerPath, fullPath);
      logger.debug("Using relative path for Electron", { relativePath: scriptPath });
    }

    logger.debug("Running Python script in Electron environment", {
      scriptPath,
      originalPath: pathToPythonScript,
      fullPath,
      workingDir: ltMakerPath, // Log that we're using lt-maker as working dir
      args
    });

    try {
      // We set the working directory to lt-maker path to ensure imports work correctly
      await gameRunner.runPythonScript(scriptPath, args, ltMakerPath);
      return { output: "", error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error("Error running Python script in Electron", { error: errorMessage });
      throw new Error(`Failed to run Python script: ${errorMessage}`);
    }
  }

  // Outside of Electron, use direct approach
  const originalDir = Deno.cwd();
  try {
    // IMPORTANT: Change to lt-maker directory before executing Python
    // This ensures Python imports work correctly
    Deno.chdir(ltMakerPath);
    logger.debug(`Changed working directory to: ${ltMakerPath}`);

    // Get the relative path within lt-maker
    const relScriptPath = relative(ltMakerPath, fullPath);
    logger.debug(`Using relative script path: ${relScriptPath}`);

    // Determine the appropriate Python command and args based on platform
    let pythonCommand: string;
    let pythonArgs: string[];

    if (isWindows) {
      // Windows - use native Python directly
      pythonCommand = "python"; // Use system Python or bundled Python
      pythonArgs = [relScriptPath, ...args];
      
      // Try to find bundled Python if available
      const bundledPythonPath = join("..", "bin", "python", "python.exe");
      try {
        const stat = Deno.statSync(bundledPythonPath);
        if (stat.isFile) {
          pythonCommand = bundledPythonPath;
          logger.debug(`Using bundled Python: ${bundledPythonPath}`);
        }
      } catch (_) {
        logger.debug("Bundled Python not found, using system Python");
      }
    } else {
      // macOS/Linux - use local Python in dev environments
      logger.debug("Using local Python for development");
      pythonCommand = "python";
      pythonArgs = [relScriptPath, ...args];
    }

    logger.debug(`Running Python script with command: ${pythonCommand} ${pythonArgs.join(" ")}`);
    logger.debug(`Working directory: ${Deno.cwd()}`);

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
    // Change back to the original directory
    Deno.chdir(originalDir);
    logger.debug(`Changed back to original directory: ${originalDir}`);
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