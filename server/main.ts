import createNewProject from "./create-new-project/create-new-project.ts";
import writeChapter from "./game-engine-io/write-chapter/write-chapter.ts";
import shortUuid from "./lib/short-uuid.ts";
import runGame from "./run-game.ts";

export default async function run() {
  const projectName = shortUuid();

  // Create new project
  const newProjectNameEndingInDotLtProj = await createNewProject(projectName);

  // Modify project files
  await writeChapter({ newProjectNameEndingInDotLtProj, chapterNumber: 0 });

  console.log("✅ Project created successfully! Running game...");

  // Run game
  await runGame(projectName);
}

if (import.meta.main) {
  await run();
}

