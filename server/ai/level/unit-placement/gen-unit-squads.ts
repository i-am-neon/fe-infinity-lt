import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import { z } from "zod";
import generateStructuredData from "@/lib/generate-structured-data.ts";
import { ch1TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { EnemyComposition } from "@/ai/types/enemy-composition.ts";
import getEnemyComposition from "./get-enemy-composition.ts";
import getGenericEnemyNumberRange, {
  EnemyCountRange,
} from "./get-generic-enemy-number-range.ts";
import {
  RegionSquadInfo,
  RegionSquadInfoSchema,
} from "@/ai/types/region-squad-info.ts";
import { getTerrainGridSize } from "./get-terrain-grid-size.ts";
import { testMapMetadata } from "../../test-data/unit-placement.ts";
import { getAllClassOptions } from "./get-all-class-options.ts";
import { availableClasses } from "./shared-prompts/available-classes.ts";
import { UNIT_TERRAIN_PLACEMENT_CONSTRAINTS } from "./shared-prompts/unit-terrain-placement-constraints.ts";
import { unpromotedVsPromotedUnits } from "./shared-prompts/unpromoted-vs-promoted-units.ts";
import { testPrologueChapter } from "@/ai/test-data/prologueTestData.ts";
import { getHousesAndVillagesForMap } from "@/map-region-processing/get-houses-and-villages-for-map.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { getChestsForMap } from "@/map-region-processing/get-chests-for-map.ts";
import { getDoorsForMap } from "@/map-region-processing/get-doors-for-map.ts";

export async function genUnitSquads({
  terrainGrid,
  chapterIdea,
  mapMetadata,
  enemyComposition,
  enemyCountRange,
  mapName,
}: {
  terrainGrid: TerrainGrid;
  chapterIdea: ChapterIdea;
  mapMetadata: MapMetadata;
  enemyComposition: EnemyComposition;
  enemyCountRange: EnemyCountRange;
  mapName: string;
}): Promise<RegionSquadInfo[]> {
  // Check if the map has houses/villages
  const housesAndVillages = getHousesAndVillagesForMap(
    getPathWithinServer(`assets/maps/${mapName}.json`)
  );
  const chests = getChestsForMap(
    getPathWithinServer(`assets/maps/${mapName}.json`)
  );
  const doors = getDoorsForMap(
    getPathWithinServer(`assets/maps/${mapName}.json`)
  );
  const hasVillages = housesAndVillages.length > 0;
  const hasChests = chests.length > 0;
  const hasDoors = doors.length > 0;

  const allClassOptions = getAllClassOptions();
  const filteredClassOptions =
    enemyComposition.unpromoted === 100
      ? allClassOptions.filter((c) => c.promotionLevel === "unpromoted")
      : allClassOptions;

  let villagesGuidance = "";
  if (hasVillages) {
    villagesGuidance = `
## Villages and Houses
This map has ${housesAndVillages.length} village/house tiles that players can visit for rewards.

You should include some Brigands, Pirates, Berserkers, or Warriors in your squad composition, as these units will be assigned to pursue and destroy villages. This creates tension for the player who must race to visit villages before enemies destroy them.

When suggesting these units, mention that they will be targeting villages/houses for destruction.
`;
  }

  if (hasChests || hasDoors) {
    villagesGuidance += `
## Chests and Doors
This map has ${hasChests ? chests.length : 0} chests and ${
      hasDoors ? doors.length : 0
    } doors.
You should
 include some Thieves, Assassins, or Rogues in your squad composition, as these units will be assigned to pursue and open chests and doors.`;
  }

  const systemMessage = `
You are an elite Fire Emblem Tactician. Your task is to analyze the provided terrain grid, chapter idea, and map metadata to generate strategic recommendations for forming unit squads in each distinct region.

${availableClasses(filteredClassOptions)}

${unpromotedVsPromotedUnits(enemyComposition)}

${UNIT_TERRAIN_PLACEMENT_CONSTRAINTS}
${villagesGuidance}
## Number of Units

The recommended range for the number of generic enemies is from ${
    enemyCountRange.min
  } to ${
    enemyCountRange.max
  }. the sum of all regions' numberOfGenericEnemies must be within this range.

## Leaving Regions Empty

You may decide that a given region should not contain enemy units. If so, for "squadInfo", simply give an empty string and set numberOfGenericEnemies to 0.

Reasons why you might leave a region empty:
- The region is where the player starts
- The region is mostly impassable terrain (e.g., a cliff, mountain, or wall) and does not provide strategic value. Often you can place units on these regions, but it's not required.

## Final details

For every region identified in the map metadata, generate an array of objects, each with a "regionName" and a "squadInfo" string. The "regionName" must match one of the region names from the map metadata exactly. Provide a detailed description of the ideal squad composition, including recommended unit classes and their roles, terrain features, defensive positions, potential enemy threats, and tactical advantages.

Every region must have squadInfo. That means your output must follow:
{
  "regionSquadInfoArray": [
      ${mapMetadata.distinctRegions.map((region) => {
        return `{
        "regionName": "${region.name}",
        "squadInfo": "Your detailed text..."
        "numberOfGenericEnemies": <number>,
      }`;
      })}
  ]
}`.trim();

  const prompt = `Terrain Grid: ${terrainGrid}\nChapter Idea: ${JSON.stringify(
    chapterIdea
  )}\nMap Metadata: ${JSON.stringify(mapMetadata)}`;

  const { regionSquadInfoArray } = await generateStructuredData({
    fnName: "genUnitSquads",
    schema: z.object({
      regionSquadInfoArray: RegionSquadInfoSchema.omit({
        fromX: true,
        fromY: true,
        toX: true,
        toY: true,
      }).array(),
    }),
    systemMessage,
    prompt,
  });

  return regionSquadInfoArray.map((info) => {
    const matchingRegion = mapMetadata.distinctRegions.find(
      (r) => r.name === info.regionName
    );

    if (!matchingRegion) {
      throw new Error(
        `Region "${
          info.regionName
        }" does not match any regions in the map metadata. All map regions are: ${mapMetadata.distinctRegions
          .map((r) => r.name)
          .join(", ")}`
      );
    }

    return {
      regionName: info.regionName,
      fromX: matchingRegion?.fromX ?? 0,
      fromY: matchingRegion?.fromY ?? 0,
      toX: matchingRegion?.toX ?? 0,
      toY: matchingRegion?.toY ?? 0,
      squadInfo: info.squadInfo,
      numberOfGenericEnemies: info.numberOfGenericEnemies,
    };
  });
}

if (import.meta.main) {
  const composition = getEnemyComposition(1);
  const enemyCountRange = getGenericEnemyNumberRange({
    mapSize: getTerrainGridSize(ch1TerrainGrid),
    chapter: 0,
  });
  genUnitSquads({
    terrainGrid: ch1TerrainGrid,
    chapterIdea: testPrologueChapter.idea,
    mapMetadata: testMapMetadata,
    enemyComposition: composition,
    enemyCountRange,
    mapName: "Knights_Villagers_Bandits_3_(0E_00_72_10)__by_Aura_Wolf",
  })
    .then((result) => {
      console.log("Unit Squads Recommendations:", result);
      console.log(
        "Total number of units:",
        result.reduce((acc, r) => acc + r.numberOfGenericEnemies, 0)
      );
      console.log("enemyCountRange :>> ", enemyCountRange);
    })
    .catch((err) => {
      console.error(err);
    });
}

