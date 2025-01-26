export default async function runPythonScript({
  pathToPythonScript,
  args = [],
}: {
  pathToPythonScript: string;
  args?: string[];
}) {
  console.log("Running Python script:", pathToPythonScript, "with args:", args);

  const command = new Deno.Command("python3", {
    args: [pathToPythonScript, ...args],
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
    console.log("Output:", output);
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

