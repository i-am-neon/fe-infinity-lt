import chooseMusic from "@/ai/choose-music.ts";
import { choosePortraits } from "@/ai/choose-portraits.ts";
import createUnitDatas from "@/ai/create-unit-data/create-unit-datas.ts";
import chooseBackground from "@/ai/events/choose-background.ts";
import convertAIEventToEvent from "@/ai/events/convert-ai-event-to-event.ts";
import genOutroEvent from "@/ai/events/gen-outro-event.ts";
import genChapterIdea from "@/ai/gen-chapter-idea.ts";
import assembleLevel from "@/ai/level/assemble-level.ts";
import {
  testInitialGameIdea,
  testTone,
  testWorldSummary,
} from "@/ai/test-data/initial.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import { allPortraitOptions } from "@/portrait-processing/all-portrait-options.ts";
import { Chapter } from "@/types/chapter.ts";
import { Character } from "@/types/character/character.ts";
import { Event } from "@/types/events/event.ts";
import { Tilemap } from "@/types/maps/tilemap.ts";
import genIntroEvent from "./events/gen-intro-event.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";

/**
 * Creates the next chapter based on the given data.
 * If chapterNumber === 0, it includes special prologue intro logic.
 *
 * Returns { chapter, usedPortraits, music } so the caller can proceed
 * to writing it out (with writeChapter) and do any additional steps (like stub next chapter).
 */
export default async function createChapter({
  worldSummary,
  initialGameIdea,
  tone,
  chapterNumber,
  usedPortraitsSoFar,
  chapterIdea,
  existingCharacterIdeas = [],
}: {
  worldSummary: WorldSummary;
  initialGameIdea: InitialGameIdea;
  tone: string;
  chapterNumber: number;
  usedPortraitsSoFar?: string[];
  chapterIdea?: ChapterIdea;
  existingCharacterIdeas?: CharacterIdea[];
}): Promise<{
  chapter: Chapter;
  usedPortraits: string[];
  musicToCopy: string[];
}> {
  const logger = getCurrentLogger();

  if (!chapterIdea) {
    chapterIdea = await genChapterIdea({
      worldSummary,
      initialGameIdea,
      tone,
      chapterNumber,
    });
  }
  logger.debug("initialGameIdea", initialGameIdea);
  // Gather all character ideas from existing chapters plus new ones
  const allChapterCharacterIdeas = [
    ...existingCharacterIdeas,
    ...initialGameIdea.characterIdeas,
    chapterIdea.boss,
    ...(chapterIdea.newPlayableUnits ?? []),
    ...(chapterIdea.newNonBattleCharacters ?? []),
  ];
  const uniqueSet = new Map<string, boolean>();
  const finalCharacterIdeas = allChapterCharacterIdeas.filter((c) => {
    if (uniqueSet.has(c.firstName)) return false;
    uniqueSet.set(c.firstName, true);
    return true;
  });

  // Decide which portraits are already used, if any
  const usedSoFar = usedPortraitsSoFar ?? [];

  // Choose new portraits for these new characters
  const portraitMap = await choosePortraits(finalCharacterIdeas);

  // Create the unit data for the new characters
  const unitDatas = await createUnitDatas({
    characterIdeas: finalCharacterIdeas,
    chapterNumber,
  });

  // We get the music for this chapter's start. Typically "player phase" and "enemy phase".
  const [playerPhaseMusic, enemyPhaseMusic] = await Promise.all([
    chooseMusic(`exciting, intense, heroic ${chapterIdea.battle}`),
    chooseMusic(`ominous, menacing, villainous ${chapterIdea.battle}`),
  ]);

  const introAIEvent = await genIntroEvent({
    worldSummary,
    chapterIdea,
    tone,
    initialGameIdea: chapterNumber === 0 ? initialGameIdea : undefined,
  });
  const introMusic = await chooseMusic(chapterIdea.intro);

  // Generate the outro event
  const outroAIEvent = await genOutroEvent({
    worldSummary,
    initialGameIdea,
    chapterIdea,
    tone,
  });
  const outroMusic = await chooseMusic(
    `Reflective conclusion for chapter: ${chapterIdea.outro}`
  );

  // Convert intro event to our internal Event type
  let finalIntroEvent: Event | null = null;
  if (introAIEvent && introMusic) {
    const introBackgroundChoice = await chooseBackground(introAIEvent);
    finalIntroEvent = convertAIEventToEvent({
      aiEvent: introAIEvent,
      backgroundChoice: introBackgroundChoice,
      musicChoice: introMusic,
      chapterNumber,
      showChapterTitle: true,
    });
  }

  // Convert outro
  const outroBackgroundChoice = await chooseBackground(outroAIEvent);
  const finalOutroEvent = convertAIEventToEvent({
    aiEvent: outroAIEvent,
    backgroundChoice: outroBackgroundChoice,
    musicChoice: outroMusic,
    chapterNumber,
  });

  // Also a defeat boss event
  const bossNid = chapterIdea.boss.firstName;
  const defeatBossEvent: Event = {
    name: "Defeat Boss",
    trigger: "combat_end",
    level_nid: chapterNumber.toString(),
    condition: `game.check_dead("${bossNid}")`,
    commands: [],
    only_once: false,
    priority: 20,
    _source: ["win_game"],
  };

  // Build newCharacters array
  const newCharacters: Character[] = unitDatas.map((ud) => {
    const portraitNid = portraitMap[ud.nid];
    const pm = allPortraitOptions.find((p) => p.originalName === portraitNid);
    if (!pm) {
      logger.error("Could not find portrait metadata", { portraitNid });
      throw new Error(`No portrait metadata found for ${portraitNid}`);
    }
    return {
      characterIdea: finalCharacterIdeas.find((c) => c.firstName === ud.nid)!, // We know this will exist
      unitData: {
        ...ud,
        portrait_nid: ud.nid,
      },
      portraitMetadata: pm,
    };
  });

  // Separate the player's initial unit data if it belongs to the initialGameIdea
  const playerUnitDatas = unitDatas.filter((c) =>
    initialGameIdea.characterIdeas.some((idea) => idea.firstName === c.nid)
  );

  // Find boss
  const bossUnitData = unitDatas.find(
    (c) => c.nid === chapterIdea.boss.firstName
  );
  if (!bossUnitData) {
    throw new Error("Could not find boss in unitDatas");
  }

  // Construct the level with all the units
  const level = await assembleLevel({
    chapterIdea,
    chapterNumber,
    playerUnitDatas,
    bossUnitData,
    playerPhaseMusic,
    enemyPhaseMusic,
  });

  // Grab tilemap from local assets
  const tilemapRaw = Deno.readTextFileSync(
    getPathWithinServer(`assets/maps/${level.tilemap}.json`)
  );
  const tilemap: Tilemap = JSON.parse(tilemapRaw);

  const eventsArray: Event[] = [];
  if (finalIntroEvent) eventsArray.push(finalIntroEvent);
  eventsArray.push(finalOutroEvent, defeatBossEvent);

  // Construct the final Chapter object
  const newChapter: Chapter = {
    title: chapterIdea.title,
    number: chapterNumber,
    level,
    events: eventsArray,
    newCharacters,
    tilemap,
    enemyFaction: chapterIdea.enemyFaction,
  };

  // Collect new used portraits
  const newlyUsedPortraits = Object.values(portraitMap);
  const updatedUsedPortraits = [...usedSoFar, ...newlyUsedPortraits];

  // Return all info
  const musicToCopy = [playerPhaseMusic, enemyPhaseMusic, outroMusic];
  if (introMusic) musicToCopy.push(introMusic);

  return {
    chapter: newChapter,
    usedPortraits: updatedUsedPortraits,
    musicToCopy,
  };
}

if (import.meta.main) {
  createChapter({
    worldSummary: testWorldSummary,
    initialGameIdea: testInitialGameIdea,
    chapterNumber: 0,
    tone: testTone,
  }).then(console.log);
}

