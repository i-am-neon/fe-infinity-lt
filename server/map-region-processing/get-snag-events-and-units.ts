import { Event } from "@/types/events/event.ts";
import { getSnagForMap } from "@/map-region-processing/get-snags-for-map.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { Unit } from "@/types/level.ts";

interface SnagResult {
  event: Event;
  unit: Unit;
}

export default function getSnagEventsAndUnits({
  mapName,
  chapterNumber,
}: {
  mapName: string;
  chapterNumber: number;
}): SnagResult[] {
  const mapSnags = getSnagForMap(
    getPathWithinServer(`assets/maps/${mapName}.json`)
  );

  return mapSnags.map((snag, index) => {
    const snagUnitNid = `Snag${index + 1}`;

    // Create a unit for this snag
    const unit: Unit = {
      nid: snagUnitNid,
      variant: null,
      level: 1,
      klass: "Snag20", // Standard snag class
      faction: "Wall",
      starting_items: [],
      starting_skills: [],
      team: "enemy",
      ai: "None",
      roam_ai: null,
      ai_group: null,
      starting_position: [snag.position.x, snag.position.y],
      starting_traveler: null,
      generic: true,
    };

    // Create event for this unit
    const event: Event = {
      name: `${snag.layerNid}_${snagUnitNid}`,
      trigger: "unit_death",
      level_nid: chapterNumber.toString(),
      condition: `unit.nid == '${snagUnitNid}'`,
      commands: [],
      only_once: true,
      priority: 20,
      _source: [`map_anim;Snag;{position}`, `show_layer;${snag.layerNid}`],
    };

    return { event, unit };
  });
}

if (import.meta.main) {
  console.log(
    getSnagEventsAndUnits({
      mapName: "Nobles_Evil_Doers_2_(01_00_4C_03)__by_Aura_Wolf",
      chapterNumber: 5,
    })
  );
}

