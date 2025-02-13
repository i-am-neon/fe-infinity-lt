import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";

export default async function runPythonScript({
  pathToPythonScript,
  args = [],
}: {
  pathToPythonScript: string;
  args?: string[];
}) {
const fullPath = pathToPythonScript.startsWith("/") ? pathToPythonScript : getPathWithinLtMaker(pathToPythonScript);
  console.log("Running Python script:", fullPath, "with args:", args);

  const command = new Deno.Command("python3", {
    args: [fullPath, ...args],
    stdout: "piped",
    stderr: "piped",
  });

  const { stdout, stderr } = await command.output();

  const output = new TextDecoder().decode(stdout);
  const error = new TextDecoder().decode(stderr);

  if (error) {
    console.error("Error:", error);
  }

  if (output) {
    console.log("Begin output for Python script:", fullPath);
    console.log(output);
    console.log("End output for Python script:", fullPath);
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
