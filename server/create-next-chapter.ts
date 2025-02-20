import genChapter from "./ai/gen-chapter.ts";

import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { getGameByNid, insertGame } from "@/db/games.ts";
import { deleteSuspendSave } from "@/game-engine-io/delete-suspend-save.ts";
import writeChapter from "@/game-engine-io/write-chapter/write-chapter.ts";
import writeStubChapter from "@/game-engine-io/write-chapter/write-stub-chapter.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import { removeStubEvent } from "./game-engine-io/write-chapter/remove-stub-event.ts";
import { removeStubLevel } from "./game-engine-io/write-chapter/remove-stub-level.ts";
import genChapterIdea from "@/ai/gen-chapter-idea.ts";

export default async function createNextChapter({
  projectNameEndingInDotLtProj,
  gameNid,
}: {
  projectNameEndingInDotLtProj: string;
  gameNid: string;
}): Promise<void> {
  const logger = getCurrentLogger();
  // Retrieve existing game from DB
  const existingGame = getGameByNid(gameNid);
  if (!existingGame) {
    throw new Error(`Game with nid ${gameNid} not found.`);
  }

  const nextChapterNumber = existingGame.chapters.length;

  // Generate the new chapter idea using all context
  const newChapterIdea: ChapterIdea = await genChapterIdea({
    worldSummary: existingGame.worldSummary!,
    chapterNumber: nextChapterNumber,
    tone: existingGame.tone,
    existingChapters: existingGame.chapters,
  });

  // Remove the old stub
  await removeStubLevel(projectNameEndingInDotLtProj);
  await removeStubEvent(projectNameEndingInDotLtProj);
  deleteSuspendSave();

  // Create the actual next chapter
  const { chapter, musicToCopy, usedPortraits } = await genChapter({
    worldSummary: existingGame.worldSummary!,
    initialGameIdea: existingGame.initialGameIdea!,
    tone: existingGame.tone,
    chapterNumber: nextChapterNumber,
    chapterIdea: newChapterIdea,
    existingCharacterIdeas: existingGame.characters.map((c) => c.characterIdea),
    existingChapters: existingGame.chapters,
  });

  logger.debug("created chapter", { chapter });

  // Add the new chapter to the game
  existingGame.chapters.push(chapter);
  existingGame.usedPortraits.push(...usedPortraits);

  // Write the next chapter to the project
  await writeChapter({
    projectNameEndingInDotLtProj,
    chapter,
    music: musicToCopy,
  });

  // Write a new stub
  await writeStubChapter({
    projectNameEndingInDotLtProj,
    chapterNumber: nextChapterNumber + 1,
    previousTilemapNid: chapter.tilemap.nid,
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

