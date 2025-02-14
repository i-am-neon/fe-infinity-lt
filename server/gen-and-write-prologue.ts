import { choosePortraits } from "@/ai/choose-portraits.ts";
import genInitialGameIdea from "@/ai/gen-initial-game-idea.ts";
import genPrologueScript from "@/ai/gen-prologue-script.ts";
import genWorldSummary from "@/ai/gen-world-summary.ts";
import {
  testGameDescription,
  testGameName,
  testTone,
} from "@/ai/test-data/initial.ts";
import { insertGame } from "@/db/games.ts";
import initializeProject from "@/game-engine-io/initialize-project.ts";
import writeChapter from "@/game-engine-io/write-chapter/write-chapter.ts";
import writeStubChapter from "@/game-engine-io/write-chapter/write-stub-chapter.ts";
import breakTextIntoGameLines from "@/lib/break-text-into-game-lines.ts";
import removeExistingGame from "@/lib/remove-existing-game.ts";
import {
  stubCharacterBozla,
  stubCharacterBroNeill,
} from "@/test-data/stub-characters.ts";
import { stubPrologue } from "@/test-data/stub-prologue.ts";
import { stubTilemapImportedTmx } from "@/test-data/stub-tilemap.ts";
import { Chapter } from "@/types/chapter.ts";
import { Game } from "@/types/game.ts";

export default async function genAndWritePrologue({
  projectName,
  description,
  tone,
}: {
  projectName: string;
  description: string;
  tone: string;
}) {
  await removeExistingGame(projectName);

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

  const [usedPortraits] = await Promise.all([
    choosePortraits(initialGameIdea.characterIdeas),
  ]);

  const prologueScript = await genPrologueScript({
    worldSummary,
    initialGameIdea,
    tone,
  });

  // Break the prologue script into multiple lines separated by "|"
  const splittedPrologueScript = breakTextIntoGameLines(prologueScript);

  const prologueEvents: Chapter["events"] = [
    {
      name: "Intro",
      trigger: "level_start",
      level_nid: "0",
      condition: "True",
      commands: [],
      only_once: false,
      priority: 20,
      _source: [`speak;hint;${splittedPrologueScript}`],
    },
    ...stubPrologue.events,
  ];

  const newCharacters = [stubCharacterBozla, stubCharacterBroNeill];

  const newChapter: Chapter = {
    ...stubPrologue,
    events: prologueEvents,
    newCharacters,
    tilemap: stubTilemapImportedTmx,
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
    tone: testTone,
    usedPortraits,
  };

  insertGame(newGame);

  return { projectNameEndingInDotLtProj, gameNid };
}

if (import.meta.main) {
  await genAndWritePrologue({
    projectName: testGameName,
    description: testGameDescription,
    tone: testTone,
  });
}

