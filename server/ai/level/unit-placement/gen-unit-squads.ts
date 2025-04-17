import { NonGenericUnitPlacementResult } from "@/ai/level/unit-placement/gen-boss-and-player-and-recruitable-unit-coords.ts";
import getTerrainGridFromMapName from "@/ai/level/unit-placement/get-terrain-grid-from-tilemap.ts";
import { testPrologueChapter } from "@/ai/test-data/prologueTestData.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { EnemyComposition } from "@/ai/types/enemy-composition.ts";
import {
  RegionSquadInfo,
  RegionSquadInfoSchema,
} from "@/ai/types/region-squad-info.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { allMapOptions } from "@/map-processing/all-map-options.ts";
import { getChestsForMap } from "@/map-region-processing/get-chests-for-map.ts";
import { getDoorsForMap } from "@/map-region-processing/get-doors-for-map.ts";
import { getHousesAndVillagesForMap } from "@/map-region-processing/get-houses-and-villages-for-map.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import { z } from "zod";
import generateStructuredData from "../../lib/generate-structured-data.ts";
import { getAllClassOptions } from "./get-all-class-options.ts";
import getEnemyComposition from "./get-enemy-composition.ts";
import getGenericEnemyNumberRange, {
  EnemyCountRange,
} from "./get-generic-enemy-number-range.ts";
import { availableClasses } from "./shared-prompts/available-classes.ts";
import { UNIT_TERRAIN_PLACEMENT_CONSTRAINTS } from "./shared-prompts/unit-terrain-placement-constraints.ts";
import { unpromotedVsPromotedUnits } from "./shared-prompts/unpromoted-vs-promoted-units.ts";
import { getTerrainGridSize } from "@/ai/level/unit-placement/get-terrain-grid-size.ts";

export async function genUnitSquads({
  terrainGrid,
  chapterIdea,
  mapMetadata,
  enemyComposition,
  enemyCountRange,
  mapName,
  nonGenericUnitPlacementResult,
}: {
  terrainGrid: TerrainGrid;
  chapterIdea: ChapterIdea;
  mapMetadata: MapMetadata;
  enemyComposition: EnemyComposition;
  enemyCountRange: EnemyCountRange;
  mapName: string;
  nonGenericUnitPlacementResult: NonGenericUnitPlacementResult;
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

You should include some Brigands, Pirates, Berserkers, or Warriors in your squad composition, as only these unit types can pursue and raze villages. This creates tension for the player who must race to visit villages before enemies destroy them.

When suggesting these village units, assign at least some of them the village-raiding AI (targeting villages/houses for destruction), but not all—they can also perform other roles like patrolling or guarding to add variety. Ensure that none of these village-raiding units are placed in the same region as any village; they should start in a different region to give players advance warning and time to respond.
`;
  }

  if (hasChests || hasDoors) {
    villagesGuidance += `
## Chests and Doors
This map has ${hasChests ? chests.length : 0} chests and ${hasDoors ? doors.length : 0} doors.

You should include some Thieves, Assassins, or Rogues in your squad composition, as only these unit types can pursue and open chests and doors. Ensure that none of these chest-raiding units are placed in the same region as any chest or door; they should start in a different region so players have a chance to intercept and defend.
`;
  }

  const systemMessage = `
You are an elite Fire Emblem Tactician. Your task is to analyze the provided terrain grid, chapter idea, map metadata, and non-generic unit placements (boss, player start, recruitable units) to generate strategic recommendations for forming unit squads in each distinct region, including specific placement coordinates for each generic enemy.

${availableClasses(filteredClassOptions)}

${unpromotedVsPromotedUnits(enemyComposition)}

${UNIT_TERRAIN_PLACEMENT_CONSTRAINTS}
${villagesGuidance}

## Non-Generic Unit Placement Context
- Boss Region: ${nonGenericUnitPlacementResult.boss.region} at (${nonGenericUnitPlacementResult.boss.coords.x}, ${nonGenericUnitPlacementResult.boss.coords.y})
- Player Start Region(s): ${nonGenericUnitPlacementResult.playerUnits.regions.join(', ')}
- Recruitable Units: ${nonGenericUnitPlacementResult.recruitableUnits.map(u => `${u.nid} (${u.firstSeenAs}) in ${u.region} at (${u.coords.x}, ${u.coords.y})`).join('; ') || 'None'}

**CRITICAL**: DO NOT place any generic enemy units within the Player Start Region(s): ${nonGenericUnitPlacementResult.playerUnits.regions.join(', ')}.
Use the locations of the boss and recruitable units to inform your placement strategy for generic enemies in their respective regions.

## Number of Units

The recommended range for the number of generic enemies is from ${enemyCountRange.min} to ${enemyCountRange.max}. The sum of all regions' numberOfGenericEnemies must be within this range.

## Leaving Regions Empty

You may decide that a given region should not contain enemy units. If so, for "squadInfo", simply give an empty string, set numberOfGenericEnemies to 0, and provide an empty "placement" array.

Reasons why you might leave a region empty:
- The region is one of the Player Start Region(s).
- The region is mostly impassable terrain (e.g., a cliff, mountain, or wall) and does not provide strategic value. Often you can place units on these regions, but it's not required.

## Final details

For every region identified in the map metadata, generate an array of objects. Each object must include:
- "regionName": Must match one of the region names from the map metadata exactly.
- "squadInfo": A detailed description of the ideal squad composition and strategy for this region, considering terrain, potential threats, and tactical advantages.
- "numberOfGenericEnemies": The total number of generic enemies placed *in this specific region*.
- "placement": An array of objects, one for each generic enemy placed in this region. Each object must have:
    - "unitType": A brief description of the unit's general type AND their intended action/behavior. Examples: "Archer defending bridge", "Brigand pursuing village", "Stationary Mage", "Knight guarding gate", "Thief targeting chest", "Fighter patrolling area".
    - "x": The x-coordinate for the unit.
    - "y": The y-coordinate for the unit.
    Coordinates MUST be within the bounds of the specified regionName.

Ensure the total count of units across all "placement" arrays matches the sum of "numberOfGenericEnemies" for all regions and falls within the range [${enemyCountRange.min}, ${enemyCountRange.max}].

The output structure must follow:
{
  "regionSquadInfoArray": [
      ${mapMetadata.distinctRegions.map((region) => {
    return `{ // Example for region ${region.name}
          "regionName": "${region.name}",
          "squadInfo": "Your detailed text...",
          "numberOfGenericEnemies": <number>,
          "placement": [
            { "unitType": "<Unit Type and Action>", "x": <number>, "y": <number> },
            // ... more units if numberOfGenericEnemies > 0
          ]
        }`;
  }).join(',\n')}
  ]
}`.trim();

  const prompt = `Terrain Grid: ${terrainGrid}
Chapter Idea: ${JSON.stringify(
    chapterIdea
  )}
Map Metadata: ${JSON.stringify(mapMetadata)}
Non-Generic Placement: ${JSON.stringify(nonGenericUnitPlacementResult)}`;

  const resultSchema = z.object({
    regionSquadInfoArray: RegionSquadInfoSchema.omit({
      fromX: true,
      fromY: true,
      toX: true,
      toY: true,
    }).array(),
  });

  const { regionSquadInfoArray } = await generateStructuredData({
    fnName: "genUnitSquadsWithPlacement", // Updated function name for clarity
    schema: resultSchema,
    systemMessage,
    prompt,
  });

  return regionSquadInfoArray.map((info) => {
    const matchingRegion = mapMetadata.distinctRegions.find(
      (r) => r.name === info.regionName
    );

    if (!matchingRegion) {
      throw new Error(
        `Region "${info.regionName
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
      placement: info.placement,
    };
  });
}

if (import.meta.main) {
  const composition = getEnemyComposition(1);
  const testTerrainGrid = getTerrainGridFromMapName("(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19")
  const enemyCountRange = getGenericEnemyNumberRange({
    mapSize: getTerrainGridSize(testTerrainGrid),
    chapter: 0,
  });
  genUnitSquads({
    terrainGrid: testTerrainGrid,
    chapterIdea: testPrologueChapter.idea,
    mapMetadata: allMapOptions.find(
      (map) => map.originalName === "(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19"
    ) as MapMetadata,
    enemyComposition: composition,
    enemyCountRange,
    mapName: "(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19",
    nonGenericUnitPlacementResult: {
      boss: { region: "Eastern Ruins", coords: { x: 12, y: 0 } },
      playerUnits: { regions: ["Western Lakeside Village"] },
      recruitableUnits: [
        {
          nid: "Evelyn",
          firstSeenAs: "allied NPC",
          region: "Central Crossroads",
          coords: { x: 6, y: 4 }
        }
      ]
    }
  })
    .then((result) => {
      console.log("Unit Squads Recommendations:", JSON.stringify(result, null, 2));
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

