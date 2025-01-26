import { getLtMakerPath } from "./file-io/get-path-within-lt-maker.ts";

export default async function runGame(
  projectNameEndingInDotLtProj: string
): Promise<void> {
  const originalDir = Deno.cwd();
  try {
    Deno.chdir(getLtMakerPath());

    const runCommand = new Deno.Command("wine", {
      args: [
        "python",
        "run_engine_for_project.py",
        projectNameEndingInDotLtProj,
      ],
      stdout: "inherit",
      stderr: "inherit",
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

