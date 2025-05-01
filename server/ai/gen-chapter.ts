import chooseMap from "@/ai/choose-map.ts";
import chooseMusic from "@/ai/choose-music.ts";
import { choosePortraits } from "@/ai/choose-portraits.ts";
import createUnitDatas from "@/ai/create-unit-data/create-unit-datas.ts";
import chooseBackground from "@/ai/events/choose-background.ts";
import convertAIEventToEvent from "@/ai/events/convert-ai-event-to-event.ts";
import genIntroEvent from "@/ai/events/gen-intro-event.ts";
import genOutroEvent from "@/ai/events/gen-outro-event.ts";
import genBossFightEvents from "@/ai/level/gen-boss-fight-events.ts";
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
import genRecruitmentEvents from "@/ai/level/gen-recruitment-events.ts";

/**
 * Creates the next chapter based on the given data.
 * If chapterNumber === 0, it includes special prologue intro logic.
 *
 * Returns { chapter, usedPortraits, music } so the caller can proceed
 * to writing it out (with writeChapter) and do any additional steps (like stub next chapter).
 */

// Event type for progress tracking
export type ChapterGenerationProgressEvent = {
  step: number;
  message: string;
  error?: boolean;
};

// Progress callback type
export type ProgressCallback = (progress: ChapterGenerationProgressEvent) => void;

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
  onProgress,
  previousChapterMusic = [],
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
  onProgress?: ProgressCallback;
  previousChapterMusic?: string[][];
}): Promise<{
  chapter: Chapter;
  usedPortraits: string[];
  musicToCopy: string[];
}> {
  const logger = getCurrentLogger();

  // Helper function to report progress
  const reportProgress = (step: number, message: string) => {
    if (onProgress) {
      onProgress({ step, message });
    }
    logger.info(`Chapter generation progress: ${message}`, { step });
  };

  // Get disallowed songs from previous chapters (last three chapters' music)
  const disallowedSongs: string[] = previousChapterMusic
    .slice(-3)  // Get last three chapters' music
    .flat();    // Flatten the array

  logger.debug("Disallowed songs from previous chapters", { disallowedSongs });

  // Step 1: Draft chapter storyline
  reportProgress(0, "Drafting chapter storyline");
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

  // Step 2: Craft new character profiles
  reportProgress(1, "Crafting new character profiles");
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

  // Step 3: Assign portraits to characters
  reportProgress(2, "Assigning portraits to characters");
  const [portraitMap, newCharacterUnitDatas] = await Promise.all([
    choosePortraits({
      characterIdeas: newCharacterIdeas,
      usedPortraits: usedSoFar,
    }),
    createUnitDatas({
      characterIdeas: newCharacterIdeas,
      chapterNumber,
    }),
  ]);

  // Step 4: Compose battle theme music
  reportProgress(3, "Composing battle theme music");
  const [playerPhaseMusic, enemyPhaseMusic] = await Promise.all([
    chooseMusic({
      scenario: `Player phase music for battle. Should be fast-paced and exciting and uplifting. Battle: ${chapterIdea.battle}`,
      disallowedSongIds: disallowedSongs
    }),
    chooseMusic({
      scenario: `Enemy phase music for battle. Battle: ${chapterIdea.battle}`,
      disallowedSongIds: disallowedSongs
    }),
  ]);

  // Step 5: Write introduction cutscene dialogue
  reportProgress(4, "Writing introduction cutscene dialogue");
  const introAIEvent = await genIntroEvent({
    worldSummary,
    chapterIdea,
    tone,
    initialGameIdea: chapterNumber === 0 ? initialGameIdea : undefined,
    existingChapters,
    existingCharacterIdeas: existingCharacters.map((c) => c.characterIdea),
    allDeadCharacters,
    newlyDeadThisChapter,
  });
  // Step 6: Write conclusion cutscene dialogue
  reportProgress(5, "Writing conclusion cutscene dialogue");
  const outroAIEvent = await genOutroEvent({
    worldSummary,
    initialGameIdea,
    chapterIdea,
    tone,
  });

  // Step 7: Choose event backgrounds
  reportProgress(6, "Choosing event backgrounds");
  const [introBackgroundChoice, outroBackgroundChoice] = await Promise.all([
    chooseBackground(chapterIdea.intro),
    chooseBackground(chapterIdea.outro),
  ]);
  // Step 8: Choose event music
  reportProgress(7, "Selecting event music");
  const [introMusic, outroMusic] = await Promise.all([
    chooseMusic({
      scenario: `Music for intro scene. Title: ${chapterIdea.title}. Description: ${chapterIdea.intro}`,
      disallowedSongIds: disallowedSongs
    }),
    chooseMusic({
      scenario: `Music for conclusion scene. Title: ${chapterIdea.title}. Description: ${chapterIdea.outro}`,
      disallowedSongIds: disallowedSongs
    }),
  ]);

  const introEvent = convertAIEventToEvent({
    aiEvent: introAIEvent,
    backgroundChoice: introBackgroundChoice.fileName,
    musicChoice: introMusic,
    chapterNumber,
    showChapterTitle: true,
  });

  const outroEvent = convertAIEventToEvent({
    aiEvent: outroAIEvent,
    backgroundChoice: outroBackgroundChoice.fileName,
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
    ...existingCharacters.map((c) => c.characterIdea.firstSeenAs !== "non-playable character" ? c.characterIdea : null).filter((c) => c !== null),
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

  // Step 8: Build the map layout
  reportProgress(7, "Building the map layout");
  const usedMapNames = existingChapters.map((c) => c.tilemap.nid);
  const chosenMapName = await chooseMap({ chapterIdea, usedMapNames, forceSmallMap: chapterNumber === 0 });

  const existingPlayerUnitDatas = existingCharacters
    .map((c) => c.unitData)
    .filter((c) =>
      allLivingPlayerCharacterIdeas.some((idea) => idea.firstName === c.nid)
    )
    .filter((c) => newCharacterIdeas.every((n) => n.firstName !== c.nid));
  // All characters are new in prologue (but only get the ones that start as allies)
  if (chapterNumber === 0) {
    existingPlayerUnitDatas.push(
      ...newCharacterUnitDatas.filter(
        (c) =>
          newCharacterIdeas.find((idea) => idea.firstName === c.nid)
            ?.firstSeenAs === "ally"
      )
    );
  }

  // Step 9: Position units on the battlefield
  reportProgress(8, "Positioning units on the battlefield");
  const { units: levelUnits, formationRegions } = await getLevelUnits({
    chosenMapName,
    chapterIdea,
    chapterNumber,
    existingPlayerUnitDatas,
    bossUnitData: newCharacterUnitDatas.find(
      (c) => c.nid === chapterIdea.boss.firstName
    )!,
  });

  // Step 10: Configure map interactables
  reportProgress(9, "Configuring map interactables");
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
  // If prologue
  if (chapterNumber === 0) {
    // set convoy game var
    introEvent._source.push("game_var;_convoy;True");
    // add some shop items
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
  // if map is the one where players usually start in a room behind a locked door, give them a door key
  if (chosenMapName === 'Alusq_FE8_0A009B0C_in_the_dark__by_FEU' || chosenMapName === 'Underground') {
    const firstLivingPlayerUnit = allLivingPlayerCharacterIdeas[0].firstName;
    introEvent._source.push(`give_item;${firstLivingPlayerUnit};Door_Key`);
    logger.info("Giving door key to first living player unit", { firstLivingPlayerUnit });
  }

  // Step 11: Write recruitment conversation scenes
  reportProgress(10, "Writing recruitment conversation scenes");
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

  // Initialize recruitment events container
  let talkSetupCommands: string[] = [];
  let recruitmentEvents: Event[] = [];

  // Start recruitment event generation asynchronously
  const recPromise = (async () => {
    if (recruitableIdeas.length > 0 && livingRecruiters.length > 0) {
      return await genRecruitmentEvents({
        recruitables: recruitableIdeas,
        recruiters: livingRecruiters,
        chapterNumber,
        chapterIdea,
      });
    }
    return { talkSetupCommands: [], recruitmentEvents: [] };
  })();

  // Step 12: Generate boss battle sequences
  reportProgress(11, "Generating boss battle sequences");
  const bossFightPromise = genBossFightEvents({
    boss: chapterIdea.boss,
    playerUnits: allLivingPlayerCharacterIdeas.filter(
      (idea) => idea.firstName !== chapterIdea.boss.firstName
    ),
    chapterNumber,
    chapterIdea,
    recruitedThisChapter: (chapterIdea.newPlayableUnits || []).filter(
      (unit) =>
        unit.firstSeenAs === "enemy non-boss" ||
        unit.firstSeenAs === "allied NPC"
    ),
  });

  // Await both recruitment and boss fight event generation
  const [recResults, bossFightEvents] = await Promise.all([recPromise, bossFightPromise]);
  talkSetupCommands = recResults.talkSetupCommands;
  recruitmentEvents = recResults.recruitmentEvents;

  // Step 13: Finalize and review the chapter
  reportProgress(12, "Finalizing and reviewing the chapter");
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
    sceneBackgrounds: [
      introBackgroundChoice.fileName,
      outroBackgroundChoice.fileName,
    ],
  };

  // add mid-battle recruitment events
  newChapter.events.push(...recruitmentEvents);

  // Add boss fight events to chapter
  newChapter.events.push(...bossFightEvents);

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

  const loseConditionEvent: Event = {
    name: "Lose Game",
    trigger: "combat_end",
    level_nid: chapterNumber.toString(),
    condition: "len(game.get_player_units()) == 0",
    commands: [],
    only_once: false,
    priority: 20,
    _source: ["lose_game"],
  };
  newChapter.events.push(loseConditionEvent);

  const updatedUsedPortraits = [...usedSoFar, ...Object.values(portraitMap)];

  // music
  const musicToCopy = [
    playerPhaseMusic,
    enemyPhaseMusic,
    outroMusic,
    introMusic,
  ];

  // Chapter generation complete!
  reportProgress(12, "Chapter generation complete!");

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
      onProgress: (progress) => {
        console.log(`Progress: Step ${progress.step} - ${progress.message}`);
      },
    });
    console.log(JSON.stringify(result, null, 2));
  })();
}

