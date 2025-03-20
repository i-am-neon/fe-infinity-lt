import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import { isElectronEnvironment } from "@/lib/env-detector.ts";

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

  // Get the appropriate Python command based on environment
  let pythonCommand;
  
  if (isElectron) {
    // In Electron, always use bundled Python
    if (Deno.build.os === "windows") {
      pythonCommand = "..\\bin\\python\\python.exe";
    } else {
      // For macOS/Linux, use the Python wrapper script
      const bundledPythonPath = "../bin/python/python";
      try {
        const stat = await Deno.stat(bundledPythonPath);
        if (stat.isFile) {
          pythonCommand = bundledPythonPath;
          logger.debug("Using bundled Python wrapper script", { pythonCommand });
        } else {
          throw new Error("Bundled Python wrapper script not found");
        }
      } catch (e) {
        logger.error("Bundled Python wrapper script not found", { error: e.message });
        throw new Error("Bundled Python wrapper script not found. Please run the download-binaries.js script first.");
      }
    }
  } else {
    // When running standalone (not in Electron)
    pythonCommand = Deno.build.os === "windows" ? "python" : "python3";
    logger.debug("Using system Python (not in Electron environment)", { pythonCommand });
  }
      
  if (!pythonCommand) {
    throw new Error("Wine not found on your system. Please install Wine to run Python scripts.");
  }

  // For Wine on macOS/Linux, we need to use different args
  // Only use ["python"] extra arg if we're using Wine
  const isWinePath = pythonCommand.includes("wine");
  const extraArgs = isElectron && Deno.build.os !== "windows" && isWinePath
    ? ["python"]
    : [];

  logger.debug("Using Python command", { pythonCommand, extraArgs, isElectron });

  const command = new Deno.Command(pythonCommand, {
    args: [...extraArgs, fullPath, ...args],
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
}

// Function to find Wine in system locations
async function findSystemWine(): Promise<string> {
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

  // No Wine found - return python3 as fallback for non-Electron environments
  console.error("No Wine installation found in system locations");
  return "python3";
}

if (import.meta.main) {
  const [scriptPath, ...scriptArgs] = Deno.args;

  if (!scriptPath) {
    console.error("Please provide a path to a Python script");
    Deno.exit(1);
  }

  await runPythonScript({ pathToPythonScript: scriptPath, args: scriptArgs });
}