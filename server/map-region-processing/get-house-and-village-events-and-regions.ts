import { Event } from "@/types/events/event.ts";
import { LevelRegion } from "@/types/level.ts";
import { getHousesAndVillagesForMap } from "@/map-region-processing/get-houses-and-villages-for-map.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import getLoot from "@/ai/create-unit-data/item-options/get-loot.ts";

export default function getHouseAndVillageEventsAndRegions({
  mapName,
  chapterNumber,
}: {
  mapName: string;
  chapterNumber: number;
}): { region: LevelRegion; event: Event }[] {
  const housesAndVillages = getHousesAndVillagesForMap(
    getPathWithinServer(`assets/maps/${mapName}.json`)
  );

  // Filter for houses only that have a normal layer
  return housesAndVillages.map((house, index) => {
    const regionNid = `House-${index + 1}`;
    // Array of generic portrait options
    const portraitOptions = [
      "Man1",
      "Man2",
      "Man3",
      "Woman1",
      "Woman2",
      "OldMan1",
    ];
    // Randomly select a portrait
    const randomPortrait =
      portraitOptions[Math.floor(Math.random() * portraitOptions.length)];

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
        name: `House-${index + 1}`,
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
          `speak;${randomPortrait};Welcome to our home. Please, take this. It may help you on your journey.`,
          "transition;Close",
          "change_background",
          "transition;Open",
          `give_item;{unit};${getLoot(chapterNumber)}`,
          `show_layer;${house.normalLayerNid}`,
          "has_traded;{unit}",
        ],
      } satisfies Event,
    };
  });
}

if (import.meta.main) {
  console.log(
    getHouseAndVillageEventsAndRegions({
      mapName: "Chapter7OstiasRebellion_Diff_Tileset__by_Shin19",
      chapterNumber: 1,
    })
  );
}

