import genChapterIdea from "@/ai/chapter/gen-chapter-idea.ts";
import { choosePortraits } from "@/ai/choose-portraits.ts";
import createUnitDatas from "@/ai/create-unit-data/create-unit-datas.ts";
import assembleEvent from "@/ai/events/assemble-event.ts";
import genInitialGameIdea from "@/ai/gen-initial-game-idea.ts";
import genWorldSummary from "@/ai/gen-world-summary.ts";
import {
  testGameDescription,
  testGameName,
  testTone,
} from "@/ai/test-data/initial.ts";
import initializeProject from "@/game-engine-io/initialize-project.ts";
import writeChapter from "@/game-engine-io/write-chapter/write-chapter.ts";
import writeStubChapter from "@/game-engine-io/write-chapter/write-stub-chapter.ts";
import {
  getCurrentLogger,
  setCurrentLoggerProject,
} from "@/lib/current-logger.ts";
import removeExistingGame from "@/lib/remove-existing-game.ts";
import { allPortraitOptions } from "@/portrait-processing/all-portrait-options.ts";
import { stubTilemapImportedTmx } from "@/test-data/stub-tilemap.ts";
import { Chapter } from "@/types/chapter.ts";
import { Character } from "@/types/character/character.ts";
import { Game } from "@/types/game.ts";
import assembleLevel from "@/ai/level/assemble-level.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { Tilemap } from "@/types/maps/tilemap.ts";

export default async function genAndWritePrologue({
  projectName,
  description,
  tone,
}: {
  projectName: string;
  description: string;
  tone: string;
}) {
  setCurrentLoggerProject(projectName);
  const logger = getCurrentLogger();
  const chapterNumber = 0;

  await removeExistingGame(projectName);

  const startTime = Date.now();

  // Create new project
  const { projectNameEndingInDotLtProj, gameNid } = await initializeProject(
    projectName
  );

  // Generate data for initial chapter
  const worldSummary = await genWorldSummary({
    gameName: projectName,
    gameDescription: description,
    tone,
  });
  const initialGameIdea = await genInitialGameIdea({ worldSummary, tone });
  const chapterIdea = await genChapterIdea({
    worldSummary,
    initialGameIdea,
    tone,
    chapterNumber,
  });

  const newCharacterIdeas = [
    ...initialGameIdea.characterIdeas,
    chapterIdea.boss,
    ...(chapterIdea.newPlayableUnits ?? []),
    ...(chapterIdea.newNonBattleCharacters ?? []),
  ];

  const [portraitMap, unitDatas, prologueIntroEvent] = await Promise.all([
    choosePortraits(newCharacterIdeas),
    createUnitDatas({
      characterIdeas: newCharacterIdeas,
      chapterNumber,
    }),
    assembleEvent({
      worldSummary,
      initialGameIdea,
      chapterIdea,
      tone,
      chapterNumber,
    }),
  ]);
  const usedPortraits = Object.values(portraitMap);

  const newCharacters: Character[] = unitDatas.map((ud) => {
    const originalName = portraitMap[ud.nid];
    const portraitMetadata = allPortraitOptions.find(
      (p) => p.originalName === originalName
    );
    if (!portraitMetadata) {
      logger.error("Could not find portrait metadata", { originalName });
      throw new Error(`Could not find portrait metadata for ${originalName}`);
    }
    return {
      unitData: {
        ...ud,
        portrait_nid: ud.nid,
      },
      portraitMetadata,
    };
  });

  const level = await assembleLevel({ chapterIdea, chapterNumber });
  const tilemap: Tilemap = JSON.parse(
    Deno.readTextFileSync(
      getPathWithinServer(`assets/maps/${level.tilemap}.json`)
    )
  );

  const newChapter: Chapter = {
    title: chapterIdea.title,
    number: chapterNumber,
    level,
    events: [prologueIntroEvent],
    newCharacters,
    tilemap,
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
    description,
    chapters: [newChapter],
    characters: newCharacters,
    tone: testTone,
    usedPortraits,
  };

  logger.info("Generated prologue", {
    elapsedTimeMs: Date.now() - startTime,
    game: newGame,
  });

  return { projectNameEndingInDotLtProj, gameNid, newGame };
}

if (import.meta.main) {
  await genAndWritePrologue({
    projectName: testGameName,
    description: testGameDescription,
    tone: testTone,
  });
}

