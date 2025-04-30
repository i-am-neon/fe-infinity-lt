import {
    getLtMakerPath,
    getPathWithinLtMaker,
} from "./file-io/get-path-within-lt-maker.ts";
import { isElectronEnvironment } from "./lib/env-detector.ts";
import { sendToElectron, gameRunner } from "./lib/game-runner.ts";
import { join } from "node:path";

export default async function runEditor(
    projectNameEndingInDotLtProj?: string
): Promise<void> {
    let normalizedProjectPath: string | undefined;

    if (projectNameEndingInDotLtProj) {
        // Ensure forward slashes for Wine compatibility
        normalizedProjectPath = projectNameEndingInDotLtProj.replace(/\\/g, "/");

        // If the project name doesn't end with .ltproj, add it
        if (!normalizedProjectPath.endsWith(".ltproj")) {
            normalizedProjectPath += ".ltproj";
        }

        // Verify project directory exists before trying to run the editor
        try {
            const projectDir = getPathWithinLtMaker(normalizedProjectPath);
            await Deno.stat(projectDir);
            console.log(`Found project directory at ${projectDir}`);
        } catch (err) {
            console.error(
                `Project directory not found for ${normalizedProjectPath}. Editor cannot open this project.`,
                err
            );
            throw new Error(
                `Editor cannot open project: directory not found for ${normalizedProjectPath}`
            );
        }
    }

    // In Electron environment, use sendToElectron to communicate with the main process
    if (isElectronEnvironment()) {
        console.log(`Running editor in Electron environment${normalizedProjectPath ? `: ${normalizedProjectPath}` : ''}`);

        // For now, we use the same sendToElectron function as running a game
        // Ideally, we might want to modify the Electron part to handle editor specifically
        const result = await sendToElectron(normalizedProjectPath || "editor");

        if (!result.success) {
            throw new Error(`Failed to run editor: ${result.error || 'Unknown error'}`);
        }
        return;
    }

    // Outside of Electron, use direct approach
    const originalDir = Deno.cwd();
    try {
        const ltMakerPath = getLtMakerPath();
        Deno.chdir(ltMakerPath);

        // Determine the appropriate Python command and args based on platform
        let pythonCommand: string;
        let pythonArgs: string[];

        // Choose which Python script to run based on whether a project was specified
        const pythonScript = normalizedProjectPath
            ? "run_editor_for_project.py"
            : "run_editor.py";

        if (Deno.build.os === "windows") {
            // Windows - use embedded Python with our wrapper script
            pythonCommand = "..\\electron\\bin\\python\\python_embed\\python.exe";
            pythonArgs = [pythonScript];
            if (normalizedProjectPath) {
                pythonArgs.push(normalizedProjectPath);
            }
        } else {
            // macOS/Linux - use local Python in dev environments
            console.log("Using local Python for development");
            pythonCommand = "python";
            pythonArgs = [pythonScript];
            if (normalizedProjectPath) {
                pythonArgs.push(normalizedProjectPath);
            }
        }

        console.log(
            `Running editor with command: ${pythonCommand} ${pythonArgs.join(" ")}`
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

if (import.meta.main) {
    // Example usage with optional project name
    const args = Deno.args;
    const projectName = args[0] || undefined;
    await runEditor(projectName);
} 