import writeStubChapter from "@/game-engine-io/write-chapter/write-stub-chapter.ts";
import { stubPrologue } from "@/test-data/stubPrologue.ts";
import createNewProject from "./game-engine-io/create-new-project.ts";
import writeChapter from "./game-engine-io/write-chapter/write-chapter.ts";
import shortUuid from "./lib/short-uuid.ts";
import runGame from "./run-game.ts";

export default async function run() {
  const projectName = shortUuid();

  // Create new project
  const { projectNameEndingInDotLtProj, gameNid } = await createNewProject(
    projectName
  );

  // Generate data for initial chapter

  // Modify project files
  await writeChapter({ projectNameEndingInDotLtProj, chapter: stubPrologue });

  await writeStubChapter({
    projectNameEndingInDotLtProj,
    chapterNumber: 1,
  });

  console.log("✅ Project created successfully! Running game...");

  // Run game
  await runGame(projectNameEndingInDotLtProj);
}

if (import.meta.main) {
  await run();
}

