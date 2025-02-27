import { Event } from "@/types/events/event.ts";
import { getBreakableWallsForMap } from "@/map-region-processing/get-breakable-walls-for-map.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { Unit } from "@/types/level.ts";

interface BreakableWallResult {
  events: Event[];
  units: Unit[];
}

export default function getBreakableWallEventsAndUnits({
  mapName,
  chapterNumber,
}: {
  mapName: string;
  chapterNumber: number;
}): BreakableWallResult[] {
  const mapBreakableWalls = getBreakableWallsForMap(
    getPathWithinServer(`assets/maps/${mapName}.json`)
  );

  return mapBreakableWalls.map((wall, wallIndex) => {
    // Create all the units for this wall
    const units: Unit[] = [];
    const unitNids: string[] = [];

    wall.positions.forEach((position, posIndex) => {
      const wallUnitNid = `Wall${wallIndex + 1}_${posIndex + 1}`;
      unitNids.push(wallUnitNid);

      units.push({
        nid: wallUnitNid,
        variant: null,
        level: 1,
        klass: "Wall25", // Standard wall class
        faction: "Wall",
        starting_items: [],
        starting_skills: [],
        team: "enemy",
        ai: "None",
        roam_ai: null,
        ai_group: null,
        starting_position: [position.x, position.y],
        starting_traveler: null,
        generic: true,
      });
    });
    
    // Create events for each unit in this wall
    const events: Event[] = units.map((unit) => {
      const thisUnitNid = unit.nid;
      
      // Create the kill commands for all OTHER units in the group
      const killCommands = unitNids
        .filter(nid => nid !== thisUnitNid)
        .map(nid => `kill_unit;${nid}`);
      
      // Create source array with standard commands
      const sourceCommands = [
        `map_anim;Snag;{position}`,
        `show_layer;${wall.layerNid}`,
        ...killCommands
      ];
      
      return {
        // Make the event name unique by adding the unit's ID
        name: `${wall.layerNid}_${thisUnitNid}`,
        trigger: "unit_death",
        level_nid: chapterNumber.toString(),
        condition: `unit.nid == '${thisUnitNid}'`,
        commands: [],
        only_once: true,
        priority: 20,
        _source: sourceCommands,
      };
    });

    return { events, units };
  });
}

if (import.meta.main) {
  console.log(
    getBreakableWallEventsAndUnits({
      mapName: "Nobles_Evil_Doers_5_(6C_00_A3_6E)__by_Aura_Wolf",
      chapterNumber: 5,
    })
  );
}