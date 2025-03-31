import {
  getLtMakerPath,
  getPathWithinLtMaker,
} from "./file-io/get-path-within-lt-maker.ts";
import { isElectronEnvironment } from "./lib/env-detector.ts";
import { sendToElectron } from "./lib/game-runner.ts";

export default async function runGame(
  projectNameEndingInDotLtProj: string
): Promise<void> {
  // Ensure forward slashes for Wine compatibility
  const normalizedProjectPath = projectNameEndingInDotLtProj.replace(
    /\\/g,
    "/"
  );

  // Verify metadata.json exists before trying to run the game
  const metadataPath = getPathWithinLtMaker(
    `${normalizedProjectPath}/metadata.json`
  );
  try {
    await Deno.stat(metadataPath);
    console.log(`Found metadata.json at ${metadataPath}`);
  } catch (err) {
    console.error(
      `No metadata.json found for ${normalizedProjectPath}. Game cannot run.`,
      err
    );
    throw new Error(
      `Game cannot run: metadata.json not found for ${normalizedProjectPath}`
    );
  }

  // In Electron environment, use sendToElectron to communicate with the main process
  if (isElectronEnvironment()) {
    console.log(`Running game in Electron environment: ${normalizedProjectPath}`);
    const result = await sendToElectron(normalizedProjectPath);
    
    if (!result.success) {
      throw new Error(`Failed to run game: ${result.error || 'Unknown error'}`);
    }
    return;
  }

  // Outside of Electron, use direct approach with Wine
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
      pythonArgs = ["run_engine_for_project.py", normalizedProjectPath];
    } else {
      // macOS/Linux - use local Python in dev environments
      // Using local Python directly when in development
      console.log("Using local Python for development");
      pythonCommand = "python";
      pythonArgs = ["run_engine.py", normalizedProjectPath];
    }

    console.log(
      `Running game with command: ${pythonCommand} ${pythonArgs.join(" ")}`
    );

    const runCommand = new Deno.Command(pythonCommand, {
      args: pythonArgs,
      stdout: "inherit",
      stderr: "inherit",
    });
    await runCommand.output();
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
  console.error("No Wine installation found in system locations");
  return null;
}

if (import.meta.main) {
  const projectName = "_new.ltproj";
  await runGame(projectName);
}