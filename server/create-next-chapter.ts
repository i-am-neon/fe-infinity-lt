import genChapter, { ChapterGenerationProgressEvent } from "./ai/gen-chapter.ts";

import { deleteSuspendSave } from "@/game-engine-io/delete-suspend-save.ts";
import getChapterResults from "@/game-engine-io/get-chapter-results.ts";
import { removeStubEvent } from "@/game-engine-io/write-chapter/remove-stub-event.ts";
import { removeStubLevel } from "@/game-engine-io/write-chapter/remove-stub-level.ts";
import writeChapter from "@/game-engine-io/write-chapter/write-chapter.ts";
import writeStubChapter from "@/game-engine-io/write-chapter/write-stub-chapter.ts";
import { getCurrentLogger, setCurrentLogger } from "@/lib/current-logger.ts";
import { determineRoleForDeadUnit } from "@/lib/determine-role-for-dead-unit.ts";
import { DeadCharacterRecord } from "@/types/dead-character-record.ts";
import { getGameByNid, insertGame } from "./db/games.ts";

// Step indexes for the initializing phase
const INITIALIZING_STEPS = {
  GAME_ENGINE: 0,     // Initializing game engine
  LOADING_DATA: 1,    // Loading game data
  ANALYZING: 2,       // Analyzing previous chapter
  PROCESSING: 3,      // Processing player choices
  GENERATION_START: 4 // Start of the actual AI generation
};

// Global store for chapter generation progress
const chapterGenerationProgress = new Map<string, ChapterGenerationProgressEvent>();
export { chapterGenerationProgress };

// Get the current progress for a specific game
export function getChapterGenerationProgress(gameNid: string): ChapterGenerationProgressEvent | undefined {
  return chapterGenerationProgress.get(gameNid);
}

export default async function createNextChapter({
  projectNameEndingInDotLtProj,
  gameNid,
}: {
  projectNameEndingInDotLtProj: string;
  gameNid: string;
}): Promise<void> {
  // Retrieve existing game from DB
  const existingGame = getGameByNid(gameNid);
  if (!existingGame) {
    throw new Error(`Game with nid ${gameNid} not found.`);
  }

  const nextChapterNumber = existingGame.chapters.length;

  setCurrentLogger({
    projectName: projectNameEndingInDotLtProj,
    chapterNumber: nextChapterNumber,
  });
  const logger = getCurrentLogger();

  logger.info("Creating next chapter", {
    projectNameEndingInDotLtProj,
    gameNid,
    nextChapterNumber,
  });

  // Set initial progress - Initializing game environment
  chapterGenerationProgress.set(gameNid, {
    step: INITIALIZING_STEPS.GAME_ENGINE,
    message: "Initializing game environment"
  });

  // Add 2-second timeouts for testing the progress updates
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Loading game data
  chapterGenerationProgress.set(gameNid, {
    step: INITIALIZING_STEPS.LOADING_DATA,
    message: "Loading your saved game data"
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  const { lastChoice, deadCharacters } = await getChapterResults({
    // Take out the leading underscore
    gameNid: gameNid.replace("_", ""),
    levelNid: nextChapterNumber.toString(),
  });
  logger.debug("chapter results", {
    lastChoice,
    deadCharacters,
    finishedChapterNumber: existingGame.chapters.length - 1, // we start at 0
  });

  // Reviewing previous chapter
  chapterGenerationProgress.set(gameNid, {
    step: INITIALIZING_STEPS.ANALYZING,
    message: "Reviewing last chapter details"
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate the new chapter idea using all context
  existingGame.deadCharacters = existingGame.deadCharacters || [];
  const lastChapterIndex = existingGame.chapters.length - 1;
  const lastChapter = existingGame.chapters[lastChapterIndex];

  // Extract previous chapter's choice options for context
  const lastChapterChoiceOptions = lastChapter?.idea?.endOfChapterChoice || [];
  logger.debug("previous choice context", {
    lastChoice,
    choiceOptions: lastChapterChoiceOptions,
  });

  // Applying player choices
  chapterGenerationProgress.set(gameNid, {
    step: INITIALIZING_STEPS.PROCESSING,
    message: "Incorporating your choices"
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

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

  // Remove the old stub
  await removeStubLevel(projectNameEndingInDotLtProj);
  await removeStubEvent(projectNameEndingInDotLtProj);
  deleteSuspendSave();

  // Beginning AI chapter creation
  chapterGenerationProgress.set(gameNid, {
    step: INITIALIZING_STEPS.GENERATION_START,
    message: "Beginning next chapter creation"
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  // Create the actual next chapter
  const { chapter, musicToCopy, usedPortraits } = await genChapter({
    worldSummary: existingGame.worldSummary!,
    initialGameIdea: existingGame.initialGameIdea!,
    tone: existingGame.tone,
    chapterNumber: nextChapterNumber,
    existingCharacters: existingGame.characters,
    existingChapters: existingGame.chapters,
    usedPortraitsSoFar: existingGame.usedPortraits,
    allDeadCharacters: existingGame.deadCharacters,
    newlyDeadThisChapter,
    choiceQuestion: lastChapterChoiceOptions.displayText,
    playerChoice: lastChoice,
    onProgress: (progress) => {
      // Update the global progress map - adjust step numbers to account for initializing steps
      const adjustedProgress = {
        ...progress,
        step: progress.step + INITIALIZING_STEPS.GENERATION_START
      };
      chapterGenerationProgress.set(gameNid, adjustedProgress);
      logger.info(`Chapter generation progress for ${gameNid}:`, adjustedProgress);
    },
    previousChapterMusic: existingGame.previousChapterMusic || [],
  });

  logger.debug("created chapter", { chapter });

  // Add the new chapter to the game
  existingGame.chapters.push(chapter);
  existingGame.usedPortraits.push(...usedPortraits);

  // Update the previousChapterMusic array with this chapter's music
  if (!existingGame.previousChapterMusic) {
    existingGame.previousChapterMusic = [];
  }
  existingGame.previousChapterMusic.push(musicToCopy);

  // Update the database with the newly appended chapters
  insertGame(existingGame);

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

  // Set final progress state
  chapterGenerationProgress.set(gameNid, {
    step: 16, // Final step including initialization steps
    message: "Chapter generation complete - ready to play!"
  });
}

if (import.meta.main) {
  await createNextChapter({
    projectNameEndingInDotLtProj: "_new.ltproj",
    gameNid: "new",
  });
}

