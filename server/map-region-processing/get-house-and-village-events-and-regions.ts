import { Event } from "@/types/events/event.ts";
import { LevelRegion } from "@/types/level.ts";
import { getHousesAndVillagesForMap } from "@/map-region-processing/get-houses-and-villages-for-map.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import getLoot from "@/ai/create-unit-data/item-options/get-loot.ts";
import genVillagerDialogue from "@/ai/gen-villager-dialogue.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { testPrologueChapter } from "@/ai/test-data/prologueTestData.ts";
import cleanGameText from "@/lib/formatting/clean-game-text.ts";

export default function getHouseAndVillageEventsAndRegions({
  mapName,
  chapterNumber,
  chapterIdea,
}: {
  mapName: string;
  chapterNumber: number;
  chapterIdea: ChapterIdea;
}): Promise<{ region: LevelRegion; event: Event }[]> {
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

  // Create events for each house/village
  const eventsAndRegionsPromises = housesAndVillages.map(async (house, i) => {
    const regionNid = `House-${i + 1}`;

    // Randomly select a portrait
    const randomPortrait =
      portraitOptions[Math.floor(Math.random() * portraitOptions.length)];

    const item = getLoot(chapterNumber);

    // Generate contextual dialogue for this villager
    const villagerDialogue = await genVillagerDialogue({
      chapterIdea,
      item,
    });

    return {
      region: {
        nid: regionNid,
        region_type: "event",
        position: [house.position.x, house.position.y],
        size: [1, 1],
        sub_nid: "Visit",
        condition: "True",
        time_left: null,
        only_once: true,
        interrupt_move: false,
      } satisfies LevelRegion,
      event: {
        name: `House-${i + 1}`,
        trigger: "Visit",
        level_nid: chapterNumber.toString(),
        condition: `region.nid == '${regionNid}'`,
        commands: [],
        only_once: false,
        priority: 20,
        _source: [
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
          `show_layer;${house.normalLayerNid}`,
          "has_traded;{unit}",
        ],
      } satisfies Event,
    };
  });

  return Promise.all(eventsAndRegionsPromises);
}

if (import.meta.main) {
  getHouseAndVillageEventsAndRegions({
    mapName: "Chapter7OstiasRebellion_Diff_Tileset__by_Shin19",
    chapterNumber: 1,
    chapterIdea: testPrologueChapter.idea,
  }).then((eventsAndRegions) => {
    console.log("Generated events and regions:", eventsAndRegions);
  });
}

