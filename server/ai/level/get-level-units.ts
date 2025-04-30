import decideGenericUnitLevel from "@/ai/level/decide-generic-unit-level.ts";
import assembleUnitPlacement from "@/ai/level/unit-placement/assemble-unit-placement.ts";
import { isPromotedClass } from "@/ai/level/unit-placement/get-all-class-options.ts";
import getTerrainGridFromMapName from "@/ai/level/unit-placement/get-terrain-grid-from-tilemap.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import shortUuid from "@/lib/short-uuid.ts";
import { allMapOptions } from "@/map-processing/all-map-options.ts";
import { UnitData } from "@/types/character/unit-data.ts";
import { FE8ClassToLTNidMap } from "@/types/fe8-class.ts";
import { Level } from "@/types/level.ts";
import decideUnitWeapons from "../../item-options/decide-unit-weapons.ts";

export default async function getLevelUnits({
  chosenMapName,
  chapterIdea,
  chapterNumber,
  existingPlayerUnitDatas,
  bossUnitData,
}: {
  chosenMapName: string;
  chapterIdea: ChapterIdea;
  chapterNumber: number;
  existingPlayerUnitDatas: UnitData[];
  bossUnitData: UnitData;
}): Promise<{ units: Level["units"]; formationRegions: Level["regions"] }> {
  const logger = getCurrentLogger();
  const start = Date.now();
  logger.debug("getLevelUnits", {
    chapterNumber,
    existingPlayerUnitDatas,
    bossUnitData,
  });
  const mapMetadata = allMapOptions.find(
    (m) => m.originalName === chosenMapName
  );
  if (!mapMetadata) {
    throw new Error(`No metadata found for map ${chosenMapName}`);
  }
  const { bossCoords, genericEnemies, playerUnitCoords, recruitableUnits } =
    await assembleUnitPlacement({
      terrainGrid: getTerrainGridFromMapName(chosenMapName),
      chapterIdea,
      mapMetadata,
      chapterNumber,
    });
  const units: Level["units"] = [];

  // Add player units
  existingPlayerUnitDatas.forEach((ud, index) => {
    // don't add non battle characters to map
    if (chapterIdea.newNonBattleCharacters?.some(nc => nc.firstName === ud.nid)) {
      return;
    }
    if (chapterNumber === 0) {
      logger.debug("adding player unit data with discrete coords for prologue", { index, coords: playerUnitCoords[index] })
    }
    units.push({
      nid: ud.nid,
      team: "player",
      ai: "None",
      roam_ai: null,
      ai_group: null,
      // For prologue units must be discretely placed, otherwise null and the game will let you place the characters in the pre-battle
      starting_position: chapterNumber === 0 ? [playerUnitCoords[index].x, playerUnitCoords[index].y] : null,
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

  logger.info('adding recruitable units in get-level-units', { recruitableUnits })

  // add recruitable units
  recruitableUnits.forEach((ru) => {
    units.push({
      nid: ru.nid,
      team: ru.firstSeenAs === "allied NPC" ? "other" : ru.firstSeenAs === 'ally' ? 'player' : "enemy",
      ai: ru.firstSeenAs === 'ally' ? "None" : "Defend",
      roam_ai: null,
      ai_group: "",
      starting_position: [ru.coords.x, ru.coords.y],
      starting_traveler: null,
      generic: false,
    });
  });

  // Add generic enemies. Comment this out to skip generics for quick testing
  genericEnemies.forEach((ge) => {
    if (!ge.class) {
      throw new Error(`No class found for generic enemy ${ge}`);
    }
    const level = decideGenericUnitLevel({
      chapter: chapterNumber,
      fe8Class: ge.class,
    });
    // For now just hard code items
    ge.startingItems = ge.startingItems ?? [];
    // insert items at beginning of array before special items
    ge.startingItems.unshift(
      ...decideUnitWeapons({
        fe8Class: ge.class,
        level,
        isPromoted: isPromotedClass(ge.class),
        isBoss: false,
      })
    );
    units.push({
      nid: shortUuid(),
      team: "enemy",
      ai: ge.aiGroup,
      level,
      faction: chapterIdea.enemyFaction.nid,
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

  // Create formation regions for player units
  const formationRegions: Level["regions"] = playerUnitCoords.map(
    (pos, index) => ({
      nid: (index + 1).toString(),
      region_type: "formation",
      position: [pos.x, pos.y],
      size: [1, 1],
      sub_nid: "",
      condition: "True",
      time_left: null,
      only_once: false,
      interrupt_move: false,
    })
  );

  const duration = Date.now() - start;
  logger.info("getLevelUnits completed", {
    duration,
    unitCount: units.length,
    formationRegions: formationRegions.length,
  });
  return { units, formationRegions };
}

