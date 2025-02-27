import { Event } from "@/types/events/event.ts";
import { getBreakableWallsForMap } from "@/map-region-processing/get-breakable-walls-for-map.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { Unit } from "@/types/level.ts";

interface WallEventAndUnit {
  event: Event;
  units: Unit[];
}

export default function getBreakableWallEventsAndUnits({
  mapName,
  chapterNumber,
}: {
  mapName: string;
  chapterNumber: number;
}): WallEventAndUnit[] {
  const mapBreakableWalls = getBreakableWallsForMap(
    getPathWithinServer(`assets/maps/${mapName}.json`)
  );

  return mapBreakableWalls.map((wall, wallIndex) => {
    // Generate wall units for each position in the wall group
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
    
    // Create a condition that checks if any of the wall units is dead
    const condition = unitNids.map(nid => `unit.nid == '${nid}'`).join(' or ');
    
    // Create source array with standard commands
    const sourceCommands = [
      `map_anim;Snag;{position}`,
      `show_layer;${wall.layerNid}`,
    ];
    
    // Add kill_unit commands for all OTHER units in this wall group
    // We need conditional kill commands that only kill the units that weren't the trigger
    unitNids.forEach(nid => {
      // For each unit in the group, add a command that checks if this WASN'T the unit that died
      // and kills it if it wasn't
      sourceCommands.push(`if;unit.nid != '${nid}';kill_unit;${nid}`);
    });
    
    return {
      event: {
        name: wall.layerNid,
        trigger: "unit_death",
        level_nid: chapterNumber.toString(),
        condition,
        commands: [],
        only_once: false,
        priority: 20,
        _source: sourceCommands,
      },
      units,
    };
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