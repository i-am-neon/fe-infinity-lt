import createChapter from "@/ai/create-chapter.ts";
import genSubsequentChapterIdea from "@/ai/gen-subsequent-chapter.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { getGameByNid, insertGame } from "@/db/games.ts";
import { deleteSuspendSave } from "@/game-engine-io/delete-suspend-save.ts";
import { removeStubEvent } from "./game-engine-io/write-chapter/remove-stub-event.ts";
import { removeStubLevel } from "./game-engine-io/write-chapter/remove-stub-level.ts";
import writeChapter from "@/game-engine-io/write-chapter/write-chapter.ts";
import writeStubChapter from "@/game-engine-io/write-chapter/write-stub-chapter.ts";
import {
  getCurrentLogger,
  setCurrentLoggerProject,
} from "@/lib/current-logger.ts";

export default async function createNextChapter({
  projectNameEndingInDotLtProj,
  gameNid,
}: {
  projectNameEndingInDotLtProj: string;
  gameNid: string;
}): Promise<void> {
  const logger = getCurrentLogger();
  logger.debug("createNextChapter", { projectNameEndingInDotLtProj, gameNid });
  // Retrieve existing game from DB
  const existingGame = getGameByNid(gameNid);
  if (!existingGame) {
    throw new Error(`Game with nid ${gameNid} not found.`);
  }

  const nextChapterNumber = existingGame.chapters.length;

  // Generate the new chapter idea using all context
  const newChapterIdea: ChapterIdea = await genSubsequentChapterIdea({
    worldSummary: existingGame.worldSummary!,
    initialGameIdea: existingGame.initialGameIdea!,
    chapters: existingGame.chapters,
    nextChapterNumber,
    tone: existingGame.tone,
  });

  logger.debug("newChapterIdeas", { newChapterIdea });

  // Remove the old stub
  await removeStubLevel(projectNameEndingInDotLtProj);
  await removeStubEvent(projectNameEndingInDotLtProj);
  deleteSuspendSave();

  logger.debug("existingGame", { existingGame });

  // Create the actual next chapter
  const { chapter } = await createChapter({
    worldSummary: existingGame.worldSummary!,
    initialGameIdea: existingGame.initialGameIdea!,
    tone: existingGame.tone,
    chapterNumber: nextChapterNumber,
    chapterIdea: newChapterIdea,
    existingCharacterIdeas: existingGame.characters.map((c) => c.characterIdea),
  });

  // Add the new chapter to the game
  existingGame.chapters.push(chapter);

  // Write the next chapter to the project
  await writeChapter({ projectNameEndingInDotLtProj, chapter, music: [] });

  // Write a new stub
  await writeStubChapter({
    projectNameEndingInDotLtProj,
    chapterNumber: nextChapterNumber + 1,
  });

  // Update the DB with the newly appended chapters
  insertGame(existingGame);
}

if (import.meta.main) {
  await createNextChapter({
    projectNameEndingInDotLtProj: "_new.ltproj",
    gameNid: "new",
  });
}

