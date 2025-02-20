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
import getChapterResults from "@/game-engine-io/get-chapter-results.ts";
import { determineRoleForDeadUnit } from "@/lib/determine-role-for-dead-unit.ts";
import { DeadCharacterRecord } from "@/types/dead-character-record.ts";

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

  const { lastChoice, deadCharacters } = await getChapterResults({
    // Take out the leading underscore
    gameNid: gameNid.replace("_", ""),
    levelNid: nextChapterNumber.toString(),
  });
  logger.debug("chapter results", {
    lastChoice,
    deadCharacters,
    finishedChapterNumber: existingGame.chapters.length,
  });

  // Generate the new chapter idea using all context
  existingGame.deadCharacters = existingGame.deadCharacters || [];
  const lastChapterIndex = existingGame.chapters.length - 1;
  const lastChapter = existingGame.chapters[lastChapterIndex];

  const newlyDeadThisChapter: DeadCharacterRecord[] = [];
  for (const newlyDead of deadCharacters) {
    const existingRecord = existingGame.deadCharacters?.find(
      (dc) => dc.name === newlyDead
    );
    if (!existingRecord) {
      const role = determineRoleForDeadUnit({
        deadName: newlyDead,
        lastChapter,
      });
      if (role) {
        existingGame.deadCharacters?.push({ name: newlyDead, role });
        newlyDeadThisChapter.push({ name: newlyDead, role });
      }
    }
  }
  logger.debug("updated dead characters", {
    deadCharacters: existingGame.deadCharacters,
  });

  const newChapterIdea: ChapterIdea = await genChapterIdea({
    worldSummary: existingGame.worldSummary!,
    chapterNumber: nextChapterNumber,
    tone: existingGame.tone,
    existingChapters: existingGame.chapters,
    allDeadCharacters: existingGame.deadCharacters,
    newlyDeadThisChapter,
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

