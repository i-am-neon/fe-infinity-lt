import assembleUnitPlacement from "@/ai/level/unit-placement/assemble-unit-placement.ts";
import getTerrainGridFromMapName from "@/ai/level/unit-placement/get-terrain-grid-from-tilemap.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import shortUuid from "@/lib/short-uuid.ts";
import { allMapOptions } from "@/map-processing/all-map-options.ts";
import { UnitData } from "@/types/character/unit-data.ts";
import { Level } from "@/types/level.ts";
import { FE8ClassToLTNidMap } from "@/types/fe8-class.ts";

export default async function getLevelUnits({
  chosenMap,
  chapterIdea,
  chapterNumber,
  playerUnitDatas,
  bossUnitData,
}: {
  chosenMap: string;
  chapterIdea: ChapterIdea;
  chapterNumber: number;
  playerUnitDatas: UnitData[];
  bossUnitData: UnitData;
}): Promise<Level["units"]> {
  const mapMetadata = allMapOptions.find((m) => m.originalName === chosenMap);
  if (!mapMetadata) {
    throw new Error(`No metadata found for map ${chosenMap}`);
  }
  const {
    boss: bossCoords,
    genericEnemies,
    playerUnits,
    greenUnits,
  } = await assembleUnitPlacement({
    terrainGrid: getTerrainGridFromMapName(chosenMap),
    chapterIdea,
    mapMetadata,
    chapterNumber,
  });
  const units: Level["units"] = [];

  // Add player units
  playerUnitDatas.forEach((ud, index) => {
    const { x, y } = playerUnits[index];
    units.push({
      nid: ud.nid,
      team: "player",
      ai: "None",
      roam_ai: null,
      ai_group: null,
      starting_position: [x, y],
      starting_traveler: null,
      generic: false,
    });
  });

  // Add boss
  units.push({
    nid: bossUnitData.nid,
    team: "enemy",
    ai: "Attack",
    roam_ai: null,
    ai_group: "",
    starting_position: [bossCoords.x, bossCoords.y],
    starting_traveler: null,
    generic: false,
  });

  // Add generic enemies
  genericEnemies.forEach((ge) => {
    if (!ge.class) {
      throw new Error(`No class found for generic enemy ${ge}`);
    }
    units.push({
      nid: shortUuid(),
      team: "enemy",
      ai: ge.aiGroup,
      // TODO: figure out generic levels
      level: 1,
      // TODO: factions
      faction: "Soldier",
      klass: FE8ClassToLTNidMap[ge.class],
      roam_ai: null,
      ai_group: "",
      starting_position: [ge.x, ge.y],
      starting_items: ge.startingItems,
      starting_traveler: null,
      generic: true,
    });
  });

  // TODO: green units

  return units;
}

