import { Event } from "@/types/events/event.ts";
import { getDoorsForMap } from "@/map-region-processing/get-doors-for-map.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { LevelRegion } from "@/types/level.ts";

export default function getDoorEventsAndRegions({
  mapName,
  chapterNumber,
}: {
  mapName: string;
  chapterNumber: number;
}): { region: LevelRegion; event: Event }[] {
  const mapDoors = getDoorsForMap(
    getPathWithinServer(`assets/maps/${mapName}.json`)
  );

  return mapDoors.map((door) => {
    // Get the bounds of the door area (min/max x/y)
    const minX = Math.min(...door.tiles.map((tile) => tile.x));
    const maxX = Math.max(...door.tiles.map((tile) => tile.x));
    const minY = Math.min(...door.tiles.map((tile) => tile.y));
    const maxY = Math.max(...door.tiles.map((tile) => tile.y));

    // Calculate the position (top-left corner) and size of the region
    const position = [minX, minY];
    const size = [maxX - minX + 1, maxY - minY + 1];

    const regionNid = `Door-${door.layerNid}`;

    return {
      region: {
        nid: regionNid,
        region_type: "event",
        position,
        size,
        sub_nid: "Door",
        condition: "unit.can_unlock(region)",
        time_left: null,
        only_once: true,
        interrupt_move: false,
      } satisfies LevelRegion,
      event: {
        name: door.layerNid,
        trigger: "Door",
        level_nid: chapterNumber.toString(),
        condition: `region.nid == '${regionNid}'`,
        commands: [],
        only_once: false,
        priority: 20,
        _source: ["unlock;{unit}", `show_layer;${door.layerNid}`],
      } satisfies Event,
    };
  });
}

if (import.meta.main) {
  console.log(
    getDoorEventsAndRegions({
      mapName: "Nobles_Evil_Doers_5_(6C_00_A3_6E)__by_Aura_Wolf",
      chapterNumber: 5,
    })
  );
}

