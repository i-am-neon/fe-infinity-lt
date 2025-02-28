import { Event } from "@/types/events/event.ts";
import { getChestsForMap } from "@/map-region-processing/get-chests-for-map.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import getLoot from "../item-options/get-loot.ts";
import { LevelRegion } from "@/types/level.ts";

export default function getChestEventsAndRegions({
  mapName,
  chapterNumber,
}: {
  mapName: string;
  chapterNumber: number;
}): { region: LevelRegion; event: Event }[] {
  const mapChests = getChestsForMap(
    getPathWithinServer(`assets/maps/${mapName}.json`)
  );
  return mapChests.map((chest) => {
    const regionNid = `Chest-${chest.layerNid}`;
    return {
      region: {
        nid: regionNid,
        region_type: "event",
        position: [chest.coordinates.x, chest.coordinates.y],
        size: [1, 1],
        sub_nid: "Chest",
        condition: "unit.can_unlock(region)",
        time_left: null,
        only_once: true,
        interrupt_move: false,
      } satisfies LevelRegion,
      event: {
        name: chest.layerNid,
        trigger: "Chest",
        level_nid: chapterNumber.toString(),
        condition: `region.nid == '${regionNid}'`,
        commands: [],
        only_once: false,
        priority: 20,
        _source: [
          "unlock;{unit}",
          `show_layer;${chest.layerNid}`,
          `give_item;{unit};${getLoot(chapterNumber)}`,
        ],
      } satisfies Event,
    };
  });
}

if (import.meta.main) {
  console.log(
    getChestEventsAndRegions({
      mapName: "Nobles_Evil_Doers_5_(6C_00_A3_6E)__by_Aura_Wolf",
      chapterNumber: 5,
    })
  );
}

