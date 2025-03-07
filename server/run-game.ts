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
      // macOS/Linux - look for bundled Wine
      const { resolve } = await import("@std/path");

      // Try multiple possible Wine locations
      const possibleWinePaths = [
        resolve(ltMakerPath, "../electron/bin/wine/bin/wine"),
        resolve(
          ltMakerPath,
          "../electron/bin/wine/Wine Stable.app/Contents/MacOS/wine"
        ),
        resolve(
          ltMakerPath,
          "../electron/bin/wine/Wine Stable.app/Contents/Resources/wine/bin/wine"
        ),
      ];

      console.log("Checking for Wine in the following locations:");
      possibleWinePaths.forEach((path) => console.log(` - ${path}`));

      let bundledWinePath = null;

      // Try each path in order
      for (const winePath of possibleWinePaths) {
        try {
          await Deno.stat(winePath);
          console.log(`Found Wine at: ${winePath}`);
          bundledWinePath = winePath;
          break;
        } catch (e) {
          console.log(`Wine not found at: ${winePath}`);
        }
      }

      if (!bundledWinePath) {
        // Bundled Wine not found - throw error
        console.error(
          `Bundled Wine not found in any of the expected locations`
        );
        throw new Error(`Cannot run game: Bundled Wine not found`);
      }

      pythonCommand = bundledWinePath;
      pythonArgs = [
        "python",
        "run_engine_for_project.py",
        normalizedProjectPath,
      ];

      // Set up Wine prefix - prefer custom prefix, fall back to default
      const customWinePrefixPath = resolve(
        ltMakerPath,
        "../electron/bin/wine/prefix"
      );
      try {
        // Only set WINEPREFIX if the directory exists
        if (await Deno.stat(customWinePrefixPath).catch(() => null)) {
          winePrefix = customWinePrefixPath;
          console.log(`Using custom Wine prefix: ${winePrefix}`);
        } else {
          // Try Python wine prefix as fallback
          const pythonWinePrefixPath = resolve(
            ltMakerPath,
            "../electron/bin/python/prefix"
          );
          if (await Deno.stat(pythonWinePrefixPath).catch(() => null)) {
            winePrefix = pythonWinePrefixPath;
            console.log(`Using Python Wine prefix: ${winePrefix}`);
          } else {
            console.log("Custom Wine prefix not found, using default");
          }
        }
      } catch (error) {
        console.log(`Error checking Wine prefix: ${(error as Error).message}`);
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
