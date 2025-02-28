import assembleUnitPlacement from "@/ai/level/unit-placement/assemble-unit-placement.ts";
import getTerrainGridFromMapName from "@/ai/level/unit-placement/get-terrain-grid-from-tilemap.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import shortUuid from "@/lib/short-uuid.ts";
import { allMapOptions } from "@/map-processing/all-map-options.ts";
import { UnitData } from "@/types/character/unit-data.ts";
import { Level } from "@/types/level.ts";
import { FE8ClassToLTNidMap } from "@/types/fe8-class.ts";
import decideGenericUnitLevel from "@/ai/level/decide-generic-unit-level.ts";
import decideUnitWeapons from "../../item-options/decide-unit-weapons.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";

export default async function getLevelUnits({
  chosenMapName,
  chapterIdea,
  chapterNumber,
  playerUnitDatas,
  bossUnitData,
}: {
  chosenMapName: string;
  chapterIdea: ChapterIdea;
  chapterNumber: number;
  playerUnitDatas: UnitData[];
  bossUnitData: UnitData;
}): Promise<Level["units"]> {
  const logger = getCurrentLogger();
  const start = Date.now();
  logger.debug("getLevelUnits", {
    chapterNumber,
    playerUnitDatas,
    bossUnitData,
  });
  const mapMetadata = allMapOptions.find(
    (m) => m.originalName === chosenMapName
  );
  if (!mapMetadata) {
    throw new Error(`No metadata found for map ${chosenMapName}`);
  }
  const {
    boss: bossCoords,
    genericEnemies,
    playerUnits,
    greenUnits,
  } = await assembleUnitPlacement({
    terrainGrid: getTerrainGridFromMapName(chosenMapName),
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
    ai: "Guard",
    roam_ai: null,
    ai_group: "",
    starting_position: [bossCoords.x, bossCoords.y],
    starting_traveler: null,
    generic: false,
  });

  // Add generic enemies. Comment this out to skip generics for quick testing
  // genericEnemies.forEach((ge) => {
  //   if (!ge.class) {
  //     throw new Error(`No class found for generic enemy ${ge}`);
  //   }
  //   // For now just hard code items
  //   ge.startingItems = ge.startingItems ?? [];
  //   // insert items at beginning of array before special items
  //   ge.startingItems.unshift(
  //     ...decideUnitWeapons({ fe8Class: ge.class, level: 1, isPromoted: false })
  //   );
  //   units.push({
  //     nid: shortUuid(),
  //     team: "enemy",
  //     ai: ge.aiGroup,
  //     // TODO: figure out generic levels
  //     level: decideGenericUnitLevel({
  //       chapter: chapterNumber,
  //       fe8Class: ge.class,
  //     }),
  //     // TODO: factions
  //     faction: chapterIdea.enemyFaction.nid,
  //     klass: FE8ClassToLTNidMap[ge.class],
  //     roam_ai: null,
  //     ai_group: "",
  //     starting_position: [ge.x, ge.y],
  //     starting_items: ge.startingItems,
  //     starting_traveler: null,
  //     generic: true,
  //   });
  // });

  // TODO: green units

  const duration = Date.now() - start;
  logger.info("getLevelUnits completed", { duration, unitCount: units.length });
  return units;
}

