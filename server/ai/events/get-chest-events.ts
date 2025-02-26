import { Event } from "@/types/events/event.ts";
import { getChestsForMap } from "@/map-region-processing/get-chests-for-map.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import getChestLoot from "@/ai/create-unit-data/item-options/chest-loot.ts";

export default function getChestEvents({
  mapName,
  chapterNumber,
}: {
  mapName: string;
  chapterNumber: number;
}): Event[] {
  const mapChests = getChestsForMap(
    getPathWithinServer(`assets/maps/${mapName}.json`)
  );
  return mapChests.map(
    (chest) =>
      ({
        name: chest.layerNid,
        trigger: "Chest",
        level_nid: "3",
        condition: `region.nid == '${chest.layerNid}'`,
        commands: [],
        only_once: false,
        priority: 20,
        _source: [
          "unlock;{unit}",
          `show_layer;${chest.layerNid}`,
          `give_item;{unit};${getChestLoot(chapterNumber)}`,
        ],
      } as Event)
  );
}

if (import.meta.main) {
  console.log(
    getChestEvents({
      mapName: "Nobles_Evil_Doers_5_(6C_00_A3_6E)__by_Aura_Wolf",
      chapterNumber: 5,
    })
  );
}

