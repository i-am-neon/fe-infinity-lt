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
import cleanGameText from "@/lib/formatting/clean-game-text.ts";
import getArmoryAndVendorEventsAndRegions from "@/map-region-processing/get-armory-and-vendor-events-and-regions.ts";
import getBreakableWallEventsAndUnits from "@/map-region-processing/get-breakable-wall-events.ts";
import getChestEventsAndRegions from "@/map-region-processing/get-chest-events-and-regions.ts";
import getDoorEventsAndRegions from "@/map-region-processing/get-door-events-and-regions.ts";
import getHouseAndVillageEventsAndRegions from "@/map-region-processing/get-house-and-village-events-and-regions.ts";
import getSnagEventsAndUnits from "@/map-region-processing/get-snag-events-and-units.ts";
import { allPortraitOptions } from "@/portrait-processing/all-portrait-options.ts";
import { Chapter } from "@/types/chapter.ts";
import { Character } from "@/types/character/character.ts";
import { DeadCharacterRecord } from "@/types/dead-character-record.ts";
import { Event } from "@/types/events/event.ts";
import { LevelRegion } from "@/types/level.ts";
import { Tilemap } from "@/types/maps/tilemap.ts";

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
  choiceQuestion,
  playerChoice,
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
  choiceQuestion?: string;
  playerChoice?: string;
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
    choiceQuestion,
    playerChoice,
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

  // Create the new unit datas
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

  // Choose backgrounds for intro/outro
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

  // Boss defeat event
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
    .filter(
      (idea, index, self) =>
        index === self.findIndex((i) => i.firstName === idea.firstName)
    )
    .filter(
      (idea) =>
        ![...allDeadCharacters, ...newlyDeadThisChapter].some(
          (dc) => dc.name === idea.firstName
        )
    )
    .filter((idea) => idea.firstSeenAs !== "boss");

  logger.debug("allLivingPlayerCharacterIdeas", {
    allLivingPlayerCharacterIdeas,
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
  const { units: levelUnits, formationRegions } = await getLevelUnits({
    chosenMapName,
    chapterIdea,
    chapterNumber,
    playerUnitDatas,
    bossUnitData: newCharacterUnitDatas.find(
      (c) => c.nid === chapterIdea.boss.firstName
    )!,
  });

  // Collect region and event info from environment
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
  const snagEventsAndUnits = getSnagEventsAndUnits({
    mapName: chosenMapName,
    chapterNumber,
  });
  const houseAndVillageEventsAndRegions =
    await getHouseAndVillageEventsAndRegions({
      mapName: chosenMapName,
      chapterNumber,
      chapterIdea,
    });
  const armoryAndVendorEventsAndRegions = getArmoryAndVendorEventsAndRegions({
    mapName: chosenMapName,
    chapterNumber,
  });

  const interactableRegions: LevelRegion[] = [
    ...chestEventsAndRegions.map(({ region }) => region),
    ...doorEventsAndRegions.map(({ region }) => region),
    ...houseAndVillageEventsAndRegions.map(({ region }) => region),
    ...armoryAndVendorEventsAndRegions.map(({ region }) => region),
  ];

  const interactableEvents: Event[] = [
    ...chestEventsAndRegions.map(({ event }) => event),
    ...doorEventsAndRegions.map(({ event }) => event),
    ...houseAndVillageEventsAndRegions.map(({ event }) => event),
    ...breakableWallEventsAndUnits.map(({ events }) => events).flat(),
    ...snagEventsAndUnits.map(({ event }) => event),
    ...armoryAndVendorEventsAndRegions.map(({ event }) => event),
  ];

  // Add breakable wall units and snag units
  const wallUnits = breakableWallEventsAndUnits.flatMap(({ units }) => units);
  const snagUnits = snagEventsAndUnits.map(({ unit }) => unit);

  // Construct the level
  const level = assembleLevel({
    chapterIdea,
    chapterNumber,
    chosenMapName,
    units: [...levelUnits, ...wallUnits, ...snagUnits],
    playerPhaseMusic,
    enemyPhaseMusic,
    regions: [...interactableRegions, ...formationRegions],
  });

  // read tilemap from local assets
  const tilemapRaw = Deno.readTextFileSync(
    getPathWithinServer(`assets/maps/${level.tilemap}.json`)
  );
  const tilemap: Tilemap = JSON.parse(tilemapRaw);

  // Insert level vars for houses
  houseAndVillageEventsAndRegions.forEach(({ region }) => {
    introEvent._source.push(`level_var;${region.nid}_visited;False`);
    introEvent._source.push(`level_var;${region.nid}_destroyed;False`);
  });
  // place the player units on formation tiles
  introEvent._source.push("arrange_formation");
  // if not prologue, add prep screen
  if (chapterNumber > 0) {
    introEvent._source.push("prep;true");
  }
  // if prologue add some shop items
  if (chapterNumber === 0) {
    introEvent._source.push("add_market_item;Iron_Sword");
    introEvent._source.push("add_market_item;Iron_Axe");
    introEvent._source.push("add_market_item;Iron_Lance");
    introEvent._source.push("add_market_item;Iron_Bow");
    introEvent._source.push("add_market_item;Fire");
    introEvent._source.push("add_market_item;Lightning");
    introEvent._source.push("add_market_item;Flux");
    introEvent._source.push("add_market_item;Vulnerary");
    introEvent._source.push("add_market_item;Chest_Key");
    introEvent._source.push("add_market_item;Door_Key");
    introEvent._source.push("give_money;1000;no_banner");
  }

  // Mid-battle recruitment logic
  const allPreviousNonBattleChars = new Set<string>();
  for (const ch of existingChapters) {
    for (const nb of ch.idea.newNonBattleCharacters ?? []) {
      allPreviousNonBattleChars.add(nb.firstName);
    }
  }
  for (const nb of chapterIdea.newNonBattleCharacters ?? []) {
    allPreviousNonBattleChars.add(nb.firstName);
  }
  const recruitableIdeas = (chapterIdea.newPlayableUnits ?? []).filter((u) => {
    const cat = u.firstSeenAs;
    if (cat !== "enemy non-boss" && cat !== "allied NPC") return false;
    if (allPreviousNonBattleChars.has(u.firstName)) return false;
    return true;
  });

  // gather living recruiters as CharacterIdea
  const livingRecruiters = allLivingPlayerCharacterIdeas;

  let talkSetupCommands: string[] = [];
  let recruitmentEvents: Event[] = [];
  if (recruitableIdeas.length > 0 && livingRecruiters.length > 0) {
    const { default: genRecruitmentEvents } = await import(
      "@/ai/level/gen-recruitment-events.ts"
    );
    const recResults = await genRecruitmentEvents({
      recruitables: recruitableIdeas,
      recruiters: livingRecruiters,
      chapterNumber,
      chapterIdea,
    });
    talkSetupCommands = recResults.talkSetupCommands;
    recruitmentEvents = recResults.recruitmentEvents;
  }

  // Build level events
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

  // add mid-battle recruitment events
  newChapter.events.push(...recruitmentEvents);

  // inject talkSetupCommands into intro
  const introEvtIndex = newChapter.events.findIndex(
    (e) => e.trigger === "level_start"
  );
  if (introEvtIndex >= 0 && talkSetupCommands.length > 0) {
    const arrFormIndex = newChapter.events[introEvtIndex]._source.findIndex(
      (line) => line.startsWith("arrange_formation")
    );
    const insertionIndex =
      arrFormIndex >= 0
        ? arrFormIndex
        : newChapter.events[introEvtIndex]._source.length;
    newChapter.events[introEvtIndex]._source.splice(
      insertionIndex,
      0,
      ...talkSetupCommands
    );
  }

  // create death events for new characters
  const newCharacterDeathEvents: Event[] = newCharacters.map((ch) => ({
    name: `Death${ch.unitData.nid}`,
    trigger: "unit_death",
    level_nid: chapterNumber.toString(),
    condition: `unit.nid == '${ch.unitData.nid}'`,
    commands: [],
    only_once: false,
    priority: 20,
    _source: [
      `add_portrait;${ch.unitData.nid};FarRight`,
      `speak;${ch.unitData.nid};${cleanGameText(ch.characterIdea.deathQuote)}`,
      `expression;${ch.unitData.nid};CloseEyes`,
      `remove_portrait;${ch.unitData.nid}`,
    ],
  }));

  newChapter.events.push(...newCharacterDeathEvents);

  const updatedUsedPortraits = [...usedSoFar, ...Object.values(portraitMap)];

  // music
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
  // Example usage
  (async () => {
    const mockWorldSummary: WorldSummary = {
      worldName: "Testland",
      description: "A test realm",
      geography: {
        regions: [],
      },
      history: "Lots of testing",
      mythology: "",
      factions: [],
    };
    const mockInitialGameIdea: InitialGameIdea = {
      backstory: "We are testing",
      characterIdeas: [],
      plotDirections: [],
    };
    const result = await genChapter({
      worldSummary: mockWorldSummary,
      initialGameIdea: mockInitialGameIdea,
      tone: "Neutral",
      chapterNumber: 0,
    });
    console.log(JSON.stringify(result, null, 2));
  })();
}
