import initializeProject from "@/game-engine-io/initialize-project.ts";
import writeChapter from "@/game-engine-io/write-chapter/write-chapter.ts";
import writeStubChapter from "@/game-engine-io/write-chapter/write-stub-chapter.ts";
import runGame from "@/run-game.ts";
import { stubPrologue } from "@/test-data/stubPrologue.ts";
import { Game } from "@/types/game-engine/game.ts";
import { insertGame } from "@/db/games.ts";

export default async function createTestGame(projectName: string) {
  // Create new project
  const { projectNameEndingInDotLtProj, gameNid } = await initializeProject(
    projectName
  );

  // Generate data for initial chapter

  // Modify project files
  await writeChapter({
    projectNameEndingInDotLtProj,
    chapter: stubPrologue,
  });

  await writeStubChapter({
    projectNameEndingInDotLtProj,
    chapterNumber: 1,
  });

  const newGame: Game = {
    nid: gameNid,
    title: projectName,
    directory: projectNameEndingInDotLtProj,
    description: `Project ${projectName} description here...`,
    chapters: [],
  };

  insertGame(newGame);

  console.log("✅ Project created successfully! Running game...");

  // Run game
  await runGame(projectNameEndingInDotLtProj);

  return { projectNameEndingInDotLtProj, gameNid };
}

