import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import { isElectronEnvironment } from "@/lib/env-detector.ts";

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
  const pythonCommand = isElectron
    ? Deno.build.os === "windows"
      ? "..\\bin\\python\\python.exe"
      : "wine"
    : "python3";

  // For Wine on macOS/Linux, we need to use different args
  const extraArgs = isElectron && Deno.build.os !== "windows"
    ? ["python"]
    : [];

  logger.debug("Using Python command", { pythonCommand, extraArgs, isElectron });

  logger.debug("Using Python command", { pythonCommand, isElectron });

  // Create absolute path for WINEPREFIX
  const winePrefixRelative = "../electron/python/prefix";
  const winePrefixAbsolute = isElectron && Deno.build.os !== "windows"
    ? new URL(winePrefixRelative, `file://${Deno.cwd()}/`).pathname
    : undefined;

  logger.debug("Wine prefix path", { winePrefixAbsolute });

  const command = new Deno.Command(pythonCommand, {
    args: [...extraArgs, fullPath, ...args],
    stdout: "piped",
    stderr: "piped",
    env: isElectron && Deno.build.os !== "windows"
      ? { ...Deno.env.toObject(), "WINEPREFIX": winePrefixAbsolute }
      : undefined,
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

if (import.meta.main) {
  const [scriptPath, ...scriptArgs] = Deno.args;

  if (!scriptPath) {
    console.error("Please provide a path to a Python script");
    Deno.exit(1);
  }

  await runPythonScript({ pathToPythonScript: scriptPath, args: scriptArgs });
}