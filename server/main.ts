import createNewProject from "./create-new-project/create-new-project.ts";
import runGame from "./run-game.ts";

export default async function run() {
  const projectName = "_new";

  // Create new project
  await createNewProject(projectName);

  // Modify project files

  console.log("✅ Project created successfully! Running game...");

  // Run game
  await runGame(projectName);
}

if (import.meta.main) {
  await run();
}

