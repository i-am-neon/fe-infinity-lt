import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";

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

  const command = new Deno.Command("python3", {
    args: [fullPath, ...args],
    stdout: "piped",
    stderr: "piped",
  });

  const { stdout, stderr } = await command.output();

  const output = new TextDecoder().decode(stdout);
  const error = new TextDecoder().decode(stderr);

  if (error) {
    logger.error("Error running Python script", { path: fullPath, error });
  }

  if (output) {
    logger.debug("Output for Python script", { path: fullPath, output });
  }

  return { output, error };
}

if (import.meta.main) {
  const [scriptPath, ...scriptArgs] = Deno.args;

  if (!scriptPath) {
    console.error("Please provide a path to a Python script");
    Deno.exit(1);
  }

  await runPythonScript({ pathToPythonScript: scriptPath, args: scriptArgs });
}

