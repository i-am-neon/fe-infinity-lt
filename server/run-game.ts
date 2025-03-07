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

  // In Electron environment, use IPC to run the game
  if (isElectronEnvironment()) {
    await sendToElectron(normalizedProjectPath);
    return;
  }

  // Outside of Electron, use direct approach with Wine
  const originalDir = Deno.cwd();
  try {
    const ltMakerPath = getLtMakerPath();
    Deno.chdir(ltMakerPath);

    // Determine the appropriate Python command and args based on platform and environment
    let pythonCommand: string;
    let pythonArgs: string[];
    let winePrefix: string | undefined;

    if (Deno.build.os === "windows") {
      // Windows - use native Python directly
      pythonCommand = "..\\bin\\python\\python.exe";
      pythonArgs = ["run_engine_for_project.py", normalizedProjectPath];
    } else {
      // macOS/Linux - look for bundled Wine in electron/bin
      const { resolve } = await import("@std/path");
      const bundledWinePath = resolve(ltMakerPath, "../electron/bin/wine/bin/wine");
      
      try {
        // Check if bundled Wine exists
        await Deno.stat(bundledWinePath);
        console.log(`Using bundled Wine at: ${bundledWinePath}`);
        pythonCommand = bundledWinePath;
      } catch (error) {
        // Bundled Wine not found - throw error
        console.error(`Bundled Wine not found at ${bundledWinePath}`);
        throw new Error(`Cannot run game: Bundled Wine not found at ${bundledWinePath}`);
      }
      
      pythonArgs = ["python", "run_engine_for_project.py", normalizedProjectPath];
      
      // Get absolute path for WINEPREFIX if it exists
      try {
        const winePrefixPath = "../electron/python/prefix";
        const winePrefixAbsolute = resolve(ltMakerPath, winePrefixPath);
        
        // Only set WINEPREFIX if the directory exists
        if (await Deno.stat(winePrefixAbsolute).catch(() => null)) {
          winePrefix = winePrefixAbsolute;
          console.log(`Using Wine prefix: ${winePrefix}`);
        }
      } catch (error) {
        console.log("Wine prefix not found, using default");
      }
    }

    console.log(
      `Running game with command: ${pythonCommand} ${pythonArgs.join(" ")}`
    );

    const env = {
      ...Deno.env.toObject(),
    };
    
    // Only add WINEPREFIX to env if it's defined
    if (winePrefix) {
      env.WINEPREFIX = winePrefix;
    }

    const runCommand = new Deno.Command(pythonCommand, {
      args: pythonArgs,
      stdout: "inherit",
      stderr: "inherit",
      env,
    });
    await runCommand.output();
  } finally {
    Deno.chdir(originalDir);
  }
}

if (import.meta.main) {
  const projectName = "_new.ltproj";
  await runGame(projectName);
}