import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import { isElectronEnvironment } from "@/lib/env-detector.ts";

// Function to find Python 3.11 on macOS/Linux
async function findSystemPython311(): Promise<string | null> {
  try {
    // First try python3.11 directly
    try {
      const whichCommand = new Deno.Command("which", {
        args: ["python3.11"],
        stdout: "piped",
        stderr: "piped",
      });
      const whichResult = await whichCommand.output();
      
      if (whichResult.code === 0) {
        const pythonPath = new TextDecoder().decode(whichResult.stdout).trim();
        console.log(`Found Python 3.11 in PATH: ${pythonPath}`);
        return pythonPath;
      }
    } catch (e) {
      console.log("Error finding python3.11:", e);
    }

    // Check common locations for Python 3.11
    const commonLocations = [
      // Homebrew paths
      "/opt/homebrew/bin/python3.11",
      "/usr/local/bin/python3.11",
      // System paths
      "/usr/bin/python3.11",
      "/usr/local/Cellar/python@3.11/3.11.*/bin/python3.11"
    ];

    for (const location of commonLocations) {
      try {
        // If location has a wildcard, try to find matching paths
        if (location.includes("*")) {
          const basePath = location.substring(0, location.indexOf("*"));
          try {
            if (await Deno.stat(basePath.substring(0, basePath.lastIndexOf("/")))) {
              // List the directory
              const entries = Deno.readDirSync(basePath.substring(0, basePath.lastIndexOf("/")));
              for (const entry of Array.from(entries)) {
                if (entry.isDirectory && entry.name.startsWith(basePath.substring(basePath.lastIndexOf("/") + 1))) {
                  const potentialPath = location.replace("*", entry.name.substring(entry.name.lastIndexOf("/") + 1));
                  try {
                    const stat = await Deno.stat(potentialPath);
                    if (stat.isFile) {
                      console.log(`Found Python 3.11 at expanded path: ${potentialPath}`);
                      return potentialPath;
                    }
                  } catch {
                    // Path doesn't exist
                  }
                }
              }
            }
          } catch {
            // Base path doesn't exist
          }
          continue;
        }

        const stat = await Deno.stat(location);
        if (stat.isFile) {
          console.log(`Found Python 3.11 at known location: ${location}`);
          return location;
        }
      } catch {
        // Location doesn't exist, continue to next
      }
    }

    // Verify python3 version as last resort
    try {
      const versionCmd = new Deno.Command("python3", {
        args: ["--version"],
        stdout: "piped",
        stderr: "piped",
      });
      const versionResult = await versionCmd.output();
      const versionOutput = new TextDecoder().decode(versionResult.stdout || versionResult.stderr).trim();
      
      if (versionOutput.includes("Python 3.11") || versionOutput.includes("Python 3.12")) {
        console.log(`System python3 is version 3.11+: ${versionOutput}`);
        return "python3";
      } else {
        console.log(`System python3 version is not 3.11+: ${versionOutput}`);
      }
    } catch (e) {
      console.log("Error checking python3 version:", e);
    }

    // No suitable Python found
    return null;
  } catch (error) {
    console.error("Error finding Python 3.11:", error);
    return null;
  }
}

export default async function runPythonScript({
  pathToPythonScript,
  args = [],
  useSystemPython = false,
}: {
  pathToPythonScript: string;
  args?: string[];
  useSystemPython?: boolean;
}) {
  const fullPath = pathToPythonScript.startsWith("/")
    ? pathToPythonScript
    : getPathWithinLtMaker(pathToPythonScript);
  const logger = getCurrentLogger();
  logger.debug("Running Python script", { path: fullPath, args, useSystemPython });

  // Determine if we're in Electron environment
  const isElectron = isElectronEnvironment();

  // Get the appropriate Python command based on environment and useSystemPython flag
  let pythonCommand;
  if (useSystemPython && (Deno.build.os === "darwin" || Deno.build.os === "linux")) {
    // Force use of system Python 3.11 on macOS/Linux when requested
    const python311Path = await findSystemPython311();
    if (python311Path) {
      pythonCommand = python311Path;
      logger.debug("Forcing use of system Python 3.11", { pythonCommand });
    } else {
      pythonCommand = "python3";
      logger.debug("Python 3.11 not found, defaulting to python3", { pythonCommand });
    }
  } else {
    pythonCommand = isElectron
      ? Deno.build.os === "windows"
        ? "..\\bin\\python\\python.exe"
        : await findSystemWine()
      : Deno.build.os === "windows"
        ? "python"
        : "python3";
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