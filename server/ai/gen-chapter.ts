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
import genIntroEvent from "@/ai/events/gen-intro-event.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";
import chooseMap from "@/ai/choose-map.ts";
import getLevelUnits from "@/ai/level/get-level-units.ts";
import { Unit } from "@/types/level.ts";
import { DeadCharacterRecord } from "@/types/dead-character-record.ts";

/**
 * Creates the next chapter based on the given data.
 * If chapterNumber === 0, it includes special prologue intro logic.
 *
 * Returns { chapter, usedPortraits, music } so the caller can proceed
 * to writing it out (with writeChapter) and do any additional steps (like stub next chapter).
 */
export default async function genChapter({
  worldSummary,
  initialGameIdea,
  tone,
  chapterNumber,
  usedPortraitsSoFar,
  chapterIdea,
  existingCharacterIdeas = [],
  existingChapters = [],
  allDeadCharacters = [],
  newlyDeadThisChapter = [],
}: {
  worldSummary: WorldSummary;
  initialGameIdea: InitialGameIdea;
  tone: string;
  chapterNumber: number;
  usedPortraitsSoFar?: string[];
  chapterIdea?: ChapterIdea;
  existingCharacterIdeas?: CharacterIdea[];
  existingChapters?: Chapter[];
  allDeadCharacters?: DeadCharacterRecord[];
  newlyDeadThisChapter?: DeadCharacterRecord[];
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
  const newCharacterIdeas: CharacterIdea[] = [
    ...(initialGameIdea && chapterNumber === 0
      ? initialGameIdea.characterIdeas
      : []),
    chapterIdea.boss,
    ...(chapterIdea.newPlayableUnits ?? []),
    ...(chapterIdea.newNonBattleCharacters ?? []),
  ];

  // Decide which portraits are already used, if any
  const usedSoFar = usedPortraitsSoFar ?? [];
  logger.debug("Used portraits so far", { usedSoFar });

  // Choose new portraits for these new characters
  const portraitMap = await choosePortraits({
    characterIdeas: newCharacterIdeas,
    usedPortraits: usedSoFar,
  });

  // Create the unit data for the new characters
  const unitDatas = await createUnitDatas({
    characterIdeas: newCharacterIdeas,
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
    existingChapters,
    existingCharacterIdeas,
    allDeadCharacters,
    newlyDeadThisChapter,
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

  const introBackgroundChoice = await chooseBackground(introAIEvent);
  const introEvent = convertAIEventToEvent({
    aiEvent: introAIEvent,
    backgroundChoice: introBackgroundChoice,
    musicChoice: introMusic,
    chapterNumber,
    showChapterTitle: true,
  });

  const outroBackgroundChoice = await chooseBackground(outroAIEvent);
  const outroEvent = convertAIEventToEvent({
    aiEvent: outroAIEvent,
    backgroundChoice: outroBackgroundChoice,
    musicChoice: outroMusic,
    chapterNumber,
    showChapterTitle: false,
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
      characterIdea: newCharacterIdeas.find((c) => c.firstName === ud.nid)!, // We know this will exist
      unitData: {
        ...ud,
        portrait_nid: ud.nid,
      },
      portraitMetadata: pm,
    };
  });

  const allLivingPlayerCharacterIdeas = [
    ...(initialGameIdea?.characterIdeas ?? []),
    ...existingCharacterIdeas,
    ...newCharacterIdeas,
  ]
    // Remove duplicates
    .filter(
      (idea, index, self) =>
        index === self.findIndex((i) => i.firstName === idea.firstName)
    )
    // Remove dead characters
    .filter(
      (idea) =>
        ![...allDeadCharacters, ...newlyDeadThisChapter].some(
          (dc) => dc.name === idea.firstName
        )
    )
    // Remove characters who are not playable
    .filter((idea) => idea.firstSeenAs !== "boss");

  logger.debug("allLivingPlayerCharacterIdeas", {
    allLivingPlayerCharacterIdeas,
    existingCharacterIdeas,
    initialGameIdeaCharacterIdeas: initialGameIdea?.characterIdeas,
    newCharacterIdeas,
  });

  // Separate the player's initial unit data if it belongs to the initialGameIdea
  const playerUnitDatas = unitDatas.filter((c) =>
    allLivingPlayerCharacterIdeas.some((idea) => idea.firstName === c.nid)
  );

  // Find boss
  const bossUnitData = unitDatas.find(
    (c) => c.nid === chapterIdea.boss.firstName
  );
  if (!bossUnitData) {
    throw new Error("Could not find boss in unitDatas");
  }

  const usedMapNames = existingChapters.map((c) => c.tilemap.nid);
  const chosenMapName = await chooseMap(chapterIdea, usedMapNames);

  // use the empty array for quick testing by skipping enemy generics
  const units = await getLevelUnits({
    chosenMapName,
    chapterIdea,
    chapterNumber,
    playerUnitDatas,
    bossUnitData,
  });

  // Construct the level with all the units
  const level = assembleLevel({
    chapterIdea,
    chapterNumber,
    chosenMapName,
    units,
    playerPhaseMusic,
    enemyPhaseMusic,
  });

  // Grab tilemap from local assets
  const tilemapRaw = Deno.readTextFileSync(
    getPathWithinServer(`assets/maps/${level.tilemap}.json`)
  );
  const tilemap: Tilemap = JSON.parse(tilemapRaw);

  // Construct the final Chapter object
  const newChapter: Chapter = {
    title: chapterIdea.title,
    number: chapterNumber,
    level,
    events: [introEvent, outroEvent, defeatBossEvent],
    newCharacters,
    tilemap,
    enemyFaction: chapterIdea.enemyFaction,
  };

  // Collect new used portraits
  const newlyUsedPortraits = Object.values(portraitMap);
  const updatedUsedPortraits = [...usedSoFar, ...newlyUsedPortraits];

  // Return all info
  const musicToCopy = [
    playerPhaseMusic,
    enemyPhaseMusic,
    outroMusic,
    introMusic,
  ];

  return {
    chapter: newChapter,
    usedPortraits: updatedUsedPortraits,
    musicToCopy,
  };
}

if (import.meta.main) {
  genChapter({
    worldSummary: testWorldSummary,
    initialGameIdea: testInitialGameIdea,
    chapterNumber: 0,
    tone: testTone,
  }).then(console.log);
}

