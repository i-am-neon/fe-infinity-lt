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
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import initializeProject from "@/game-engine-io/initialize-project.ts";
import writeChapter from "@/game-engine-io/write-chapter/write-chapter.ts";
import writeStubChapter from "@/game-engine-io/write-chapter/write-stub-chapter.ts";
import {
  getCurrentLogger,
  setCurrentLoggerProject,
} from "@/lib/current-logger.ts";
import removeExistingGame from "@/lib/remove-existing-game.ts";
import { allPortraitOptions } from "@/portrait-processing/all-portrait-options.ts";
import { Chapter } from "@/types/chapter.ts";
import { Character } from "@/types/character/character.ts";
import { Game } from "@/types/game.ts";
import { Tilemap } from "@/types/maps/tilemap.ts";
import genChapterIdea from "./ai/gen-chapter-idea.ts";
import assembleLevel from "./ai/level/assemble-level.ts";
import chooseMusic from "@/ai/choose-music.ts";
import chooseTopLevelMusic from "@/ai/choose-top-level-music.ts";

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
  const [worldSummary, topLevelMusics] = await Promise.all([
    genWorldSummary({
      gameName: projectName,
      gameDescription: description,
      tone,
    }),
    chooseTopLevelMusic({
      projectNameEndingInDotLtProj,
      gameDescription: description,
      tone,
    }),
  ]);
  const initialGameIdea = await genInitialGameIdea({ worldSummary, tone });

  // Generate prologue chapter
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

  const [
    portraitMap,
    unitDatas,
    { event: prologueIntroEvent, music: introMusic },
    playerPhaseMusic,
    enemyPhaseMusic,
  ] = await Promise.all([
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
    chooseMusic("Exciting uplifting fast-paced bold " + chapterIdea.battle),
    chooseMusic("Scary, ominous, menacing " + chapterIdea.battle),
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

  const playerUnitDatas = unitDatas.filter((c) => {
    return initialGameIdea.characterIdeas.some(
      (idea) => idea.firstName === c.nid
    );
  });

  const bossUnitData = unitDatas.find(
    (c) => c.nid === chapterIdea.boss.firstName
  );
  if (!bossUnitData) {
    throw new Error(`Could not find boss unit data`);
  }

  const level = await assembleLevel({
    chapterIdea,
    chapterNumber,
    playerUnitDatas,
    bossUnitData,
    playerPhaseMusic,
    enemyPhaseMusic,
  });
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
    music: [...topLevelMusics, introMusic, playerPhaseMusic, enemyPhaseMusic],
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

