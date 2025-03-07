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
    Deno.chdir(getLtMakerPath());

    // Determine the appropriate Python path based on platform
    const pythonCommand =
      Deno.build.os === "windows" ? "..\\bin\\python\\python.exe" : "wine";
    const pythonArgs =
      Deno.build.os === "windows"
        ? ["run_engine_for_project.py", normalizedProjectPath]
        : [
            "../electron/python/prefix/drive_c/users/crossover/Application Data/Python/Python311/python.exe",
            "run_engine_for_project.py",
            normalizedProjectPath,
          ];

    console.log(
      `Running game with command: ${pythonCommand} ${pythonArgs.join(" ")}`
    );

    const runCommand = new Deno.Command(pythonCommand, {
      args: pythonArgs,
      stdout: "inherit",
      stderr: "inherit",
      env: {
        ...Deno.env.toObject(),
        WINEPREFIX: "../bin/python/prefix",
      },
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