import chooseMap from "@/ai/choose-map.ts";
import chooseMusic from "@/ai/choose-music.ts";
import { choosePortraits } from "@/ai/choose-portraits.ts";
import createUnitDatas from "@/ai/create-unit-data/create-unit-datas.ts";
import chooseBackground from "@/ai/events/choose-background.ts";
import convertAIEventToEvent from "@/ai/events/convert-ai-event-to-event.ts";
import genIntroEvent from "@/ai/events/gen-intro-event.ts";
import genOutroEvent from "@/ai/events/gen-outro-event.ts";
import genChapterIdea from "@/ai/gen-chapter-idea.ts";
import assembleLevel from "@/ai/level/assemble-level.ts";
import getLevelUnits from "@/ai/level/get-level-units.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import { allPortraitOptions } from "@/portrait-processing/all-portrait-options.ts";
import { Chapter } from "@/types/chapter.ts";
import { Character } from "@/types/character/character.ts";
import { DeadCharacterRecord } from "@/types/dead-character-record.ts";
import { Event } from "@/types/events/event.ts";
import { Tilemap } from "@/types/maps/tilemap.ts";
import {
  testInitialGameIdea,
  testTone,
  testWorldSummary,
} from "@/ai/test-data/prologueTestData.ts";
import getChestEventsAndRegions from "../map-region-processing/get-chest-events-and-regions.ts";
import getDoorEventsAndRegions from "@/map-region-processing/get-door-events-and-regions.ts";
import getBreakableWallEventsAndUnits from "@/map-region-processing/get-breakable-wall-events.ts";
import { LevelRegion } from "@/types/level.ts";

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
  existingCharacters = [],
  existingChapters = [],
  allDeadCharacters = [],
  newlyDeadThisChapter = [],
}: {
  worldSummary: WorldSummary;
  initialGameIdea: InitialGameIdea;
  tone: string;
  chapterNumber: number;
  usedPortraitsSoFar?: string[];
  existingCharacters?: Character[];
  existingChapters?: Chapter[];
  allDeadCharacters?: DeadCharacterRecord[];
  newlyDeadThisChapter?: DeadCharacterRecord[];
}): Promise<{
  chapter: Chapter;
  usedPortraits: string[];
  musicToCopy: string[];
}> {
  const logger = getCurrentLogger();

  const chapterIdea = await genChapterIdea({
    worldSummary,
    initialGameIdea,
    tone,
    chapterNumber,
    previousChapterIdeas: existingChapters.map((c) => c.idea),
    allDeadCharacters,
    newlyDeadThisChapter,
  });

  // Build array of new characters from initialGameIdea (if prologue) plus boss + new units
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

  // Run these in parallel for performance
  const [
    portraitMap,
    newCharacterUnitDatas,
    [playerPhaseMusic, enemyPhaseMusic],
    introAIEvent,
    outroAIEvent,
    introMusic,
    outroMusic,
  ] = await Promise.all([
    choosePortraits({
      characterIdeas: newCharacterIdeas,
      usedPortraits: usedSoFar,
    }),
    createUnitDatas({
      characterIdeas: newCharacterIdeas,
      chapterNumber,
    }),
    Promise.all([
      chooseMusic(`exciting, intense, heroic ${chapterIdea.battle}`),
      chooseMusic(`ominous, menacing, villainous ${chapterIdea.battle}`),
    ]),
    genIntroEvent({
      worldSummary,
      chapterIdea,
      tone,
      initialGameIdea: chapterNumber === 0 ? initialGameIdea : undefined,
      existingChapters,
      existingCharacterIdeas: existingCharacters.map((c) => c.characterIdea),
      allDeadCharacters,
      newlyDeadThisChapter,
    }),
    genOutroEvent({
      worldSummary,
      initialGameIdea,
      chapterIdea,
      tone,
    }),
    chooseMusic(chapterIdea.intro),
    chooseMusic(`Reflective conclusion for chapter: ${chapterIdea.outro}`),
  ]);

  const [introBackgroundChoice, outroBackgroundChoice] = await Promise.all([
    chooseBackground(introAIEvent),
    chooseBackground(outroAIEvent),
  ]);

  const introEvent = convertAIEventToEvent({
    aiEvent: introAIEvent,
    backgroundChoice: introBackgroundChoice,
    musicChoice: introMusic,
    chapterNumber,
    showChapterTitle: true,
  });

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
  const newCharacters: Character[] = newCharacterUnitDatas.map((ud) => {
    const portraitNid = portraitMap[ud.nid];
    const pm = allPortraitOptions.find((p) => p.originalName === portraitNid);
    if (!pm) {
      logger.error("Could not find portrait metadata", { portraitNid });
      throw new Error(`No portrait metadata found for ${portraitNid}`);
    }
    return {
      characterIdea: newCharacterIdeas.find((c) => c.firstName === ud.nid)!,
      unitData: {
        ...ud,
        portrait_nid: ud.nid,
      },
      portraitMetadata: pm,
    };
  });

  // For living player characters, filter out the dead
  const allLivingPlayerCharacterIdeas = [
    ...(initialGameIdea?.characterIdeas ?? []),
    ...existingCharacters.map((c) => c.characterIdea),
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
    existingCharacters,
    initialGameIdeaCharacterIdeas: initialGameIdea?.characterIdeas,
    newCharacterIdeas,
    allDeadCharacters,
    newlyDeadThisChapter,
  });

  // Gather the player's current unit datas
  const playerUnitDatas = [
    ...newCharacterUnitDatas,
    ...existingCharacters.map((c) => c.unitData),
  ].filter((c) =>
    allLivingPlayerCharacterIdeas.some((idea) => idea.firstName === c.nid)
  );

  // Finally pick map
  const usedMapNames = existingChapters.map((c) => c.tilemap.nid);
  const chosenMapName = await chooseMap(chapterIdea, usedMapNames);

  // Place units
  const units = await getLevelUnits({
    chosenMapName,
    chapterIdea,
    chapterNumber,
    playerUnitDatas,
    bossUnitData: newCharacterUnitDatas.find(
      (c) => c.nid === chapterIdea.boss.firstName
    )!,
  });

  const chestEventsAndRegions = getChestEventsAndRegions({
    mapName: chosenMapName,
    chapterNumber,
  });

  const doorEventsAndRegions = getDoorEventsAndRegions({
    mapName: chosenMapName,
    chapterNumber,
  });

  const breakableWallEventsAndUnits = getBreakableWallEventsAndUnits({
    mapName: chosenMapName,
    chapterNumber,
  });

  const interactableRegions: LevelRegion[] = [
    ...chestEventsAndRegions.map(({ region }) => region),
    ...doorEventsAndRegions.map(({ region }) => region),
  ];
  const interactableEvents: Event[] = [
    ...chestEventsAndRegions.map(({ event }) => event),
    ...doorEventsAndRegions.map(({ event }) => event),
    ...breakableWallEventsAndUnits.map(({ event }) => event),
  ];

  // Construct the level
  const level = assembleLevel({
    chapterIdea,
    chapterNumber,
    chosenMapName,
    units,
    playerPhaseMusic,
    enemyPhaseMusic,
    regions: interactableRegions,
  });

  // Grab tilemap from local assets
  const tilemapRaw = Deno.readTextFileSync(
    getPathWithinServer(`assets/maps/${level.tilemap}.json`)
  );
  const tilemap: Tilemap = JSON.parse(tilemapRaw);

  // Add breakable wall units to level units
  const wallUnits = breakableWallEventsAndUnits.flatMap(({ units }) => units);
  level.units = [...level.units, ...wallUnits];

  // Build final Chapter object
  const newChapter: Chapter = {
    title: chapterIdea.title,
    number: chapterNumber,
    level,
    events: [introEvent, outroEvent, defeatBossEvent, ...interactableEvents],
    newCharacters,
    tilemap,
    enemyFaction: chapterIdea.enemyFaction,
    idea: chapterIdea,
  };

  // Update used portraits
  const newlyUsedPortraits = Object.values(portraitMap);
  const updatedUsedPortraits = [...usedSoFar, ...newlyUsedPortraits];

  // Collect any new music to copy
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