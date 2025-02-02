import { insertGame } from "@/db/games.ts";
import initializeProject from "@/game-engine-io/initialize-project.ts";
import writeChapter from "@/game-engine-io/write-chapter/write-chapter.ts";
import writeStubChapter from "@/game-engine-io/write-chapter/write-stub-chapter.ts";
import removeExistingGame from "@/lib/remove-existing-game.ts";
import { stubPrologue } from "@/test-data/stub-prologue.ts";
import { Game } from "@/types/game.ts";
import {
  stubCharacterBozla,
  stubCharacterBroNeill,
} from "@/test-data/stub-characters.ts";
import { Chapter } from "@/types/chapter.ts";
import { stubTilemapPrologue } from "@/test-data/stub-tilemap.ts";

export default async function genAndWritePrologue(projectName: string) {
  await removeExistingGame(projectName);

  // Create new project
  const { projectNameEndingInDotLtProj, gameNid } = await initializeProject(
    projectName
  );

  // Generate data for initial chapter
  const newCharacters = [stubCharacterBozla, stubCharacterBroNeill];

  const newChapter: Chapter = {
    ...stubPrologue,
    newCharacters,
    tilemap: stubTilemapPrologue,
  };

  // Modify project files
  await writeChapter({
    projectNameEndingInDotLtProj,
    chapter: newChapter,
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
    chapters: [newChapter],
    characters: newCharacters,
  };

  insertGame(newGame);

  return { projectNameEndingInDotLtProj, gameNid };
}

