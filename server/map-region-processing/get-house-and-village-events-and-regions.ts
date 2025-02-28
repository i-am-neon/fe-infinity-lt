import getLoot from "@/ai/create-unit-data/item-options/get-loot.ts";
import genVillagerDialogue from "@/ai/gen-villager-dialogue.ts";
import { testPrologueChapter } from "@/ai/test-data/prologueTestData.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import cleanGameText from "@/lib/formatting/clean-game-text.ts";
import { getHousesAndVillagesForMap } from "@/map-region-processing/get-houses-and-villages-for-map.ts";
import { Event } from "@/types/events/event.ts";
import { LevelRegion } from "@/types/level.ts";

interface HouseVillageResult {
  region: LevelRegion;
  event: Event;
}

export default async function getHouseAndVillageEventsAndRegions({
  mapName,
  chapterNumber,
  chapterIdea,
}: {
  mapName: string;
  chapterNumber: number;
  chapterIdea: ChapterIdea;
}): Promise<HouseVillageResult[]> {
  const housesAndVillages = getHousesAndVillagesForMap(
    getPathWithinServer(`assets/maps/${mapName}.json`)
  );

  // Array of generic portrait options
  const portraitOptions = [
    "Man1",
    "Man2",
    "Man3",
    "Woman1",
    "Woman2",
    "OldMan1",
  ];

  // Create events and regions for each house/village
  const allResults: HouseVillageResult[] = [];

  // Process each house/village
  for (let i = 0; i < housesAndVillages.length; i++) {
    const house = housesAndVillages[i];
    const visitRegionNid = `House${i + 1}`;
    const destroyRegionNid = `DestroyHouse${i + 1}`;

    // Randomly select a portrait
    const randomPortrait =
      portraitOptions[Math.floor(Math.random() * portraitOptions.length)];

    const item = getLoot(chapterNumber);

    // Generate contextual dialogue for this villager
    const villagerDialogue = await genVillagerDialogue({
      chapterIdea,
      item,
    });

    // Prepare source commands for visit event
    const visitSourceCommands = [
      "transition;Close",
      "change_background;House",
      "transition;Open",
      "add_portrait;{unit};Right;no_block",
      `add_portrait;${randomPortrait};Left`,
      `speak;${randomPortrait};${cleanGameText(villagerDialogue)}`,
      "transition;Close",
      "change_background",
      "transition;Open",
      `give_item;{unit};${item}`,
    ];

    // Add show_layer command if normalLayerNid exists
    if (house.normalLayerNid) {
      visitSourceCommands.push(`show_layer;${house.normalLayerNid}`);
    }

    visitSourceCommands.push("has_traded;{unit}");

    // Create visit event
    const visitEvent: Event = {
      name: visitRegionNid,
      trigger: "Visit",
      level_nid: chapterNumber.toString(),
      condition: `region.nid == '${visitRegionNid}'`,
      commands: [],
      only_once: false,
      priority: 20,
      _source: visitSourceCommands,
    };

    // Create visit region
    const visitRegion: LevelRegion = {
      nid: visitRegionNid,
      region_type: "event",
      position: [house.position.x, house.position.y],
      size: [1, 1],
      sub_nid: "Visit",
      condition: "True",
      time_left: null,
      only_once: true,
      interrupt_move: false,
    };

    // Add the visit event and region to results
    allResults.push({
      region: visitRegion,
      event: visitEvent,
    });

    // If we have a ruins layer, add a destruction event and region
    if (house.ruinsLayerNid) {
      // Create destroy event
      const destroyEvent: Event = {
        name: destroyRegionNid,
        trigger: "Destructible",
        level_nid: chapterNumber.toString(),
        condition: `region.nid == '${visitRegionNid}'`,
        commands: [],
        only_once: true,
        priority: 20,
        _source: [
          "flicker_cursor;{position}",
          `show_layer;${house.ruinsLayerNid}`,
          "wait;500",
        ],
      };

      // Create destroy region
      const destroyRegion: LevelRegion = {
        nid: destroyRegionNid,
        region_type: "event",
        position: [house.position.x, house.position.y],
        size: [1, 1],
        sub_nid: "Destructible",
        condition: "unit.team == 'enemy'",
        time_left: null,
        only_once: true,
        interrupt_move: false,
      };

      // Add the destroy event and region to results
      allResults.push({
        region: destroyRegion,
        event: destroyEvent,
      });
    }
  }

  return allResults;
}

if (import.meta.main) {
  getHouseAndVillageEventsAndRegions({
    mapName: "Chapter7OstiasRebellion_Diff_Tileset__by_Shin19",
    chapterNumber: 1,
    chapterIdea: testPrologueChapter.idea,
  }).then((results) => {
    console.log("Generated results:", results);
    console.log("Total regions:", results.length);
    console.log("Total events:", results.length);
  });
}

