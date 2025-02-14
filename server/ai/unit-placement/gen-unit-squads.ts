import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import { z } from "zod";
import generateStructuredData from "@/lib/generate-structured-data.ts";
import { ch1TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { EnemyComposition } from "@/ai/types/enemy-composition.ts";
import getEnemyComposition from "@/ai/unit-placement/get-enemy-composition.ts";
import getGenericEnemyNumberRange, {
  EnemyCountRange,
} from "@/ai/unit-placement/get-generic-enemy-number-range.ts";
import {
  RegionSquadInfo,
  RegionSquadInfoSchema,
} from "@/ai/types/region-squad-info.ts";
import { getTerrainGridSize } from "@/ai/unit-placement/get-terrain-grid-size.ts";
import { testChapterIdea } from "@/ai/test-data/chapter-ideas.ts";
import { testMapMetadata } from "../test-data/unit-placement.ts";
import { getAllClassOptions } from "@/ai/unit-placement/get-all-class-options.ts";
import { availableClasses } from "@/ai/unit-placement/shared-prompts/available-classes.ts";
import { UNIT_TERRAIN_PLACEMENT_CONSTRAINTS } from "@/ai/unit-placement/shared-prompts/unit-terrain-placement-constraints.ts";
import { unpromotedVsPromotedUnits } from "@/ai/unit-placement/shared-prompts/unpromoted-vs-promoted-units.ts";

export default async function genUnitSquads({
  terrainGrid,
  chapterIdea,
  mapMetadata,
  enemyComposition,
  enemyCountRange,
}: {
  terrainGrid: TerrainGrid;
  chapterIdea: ChapterIdea;
  mapMetadata: MapMetadata;
  enemyComposition: EnemyComposition;
  enemyCountRange: EnemyCountRange;
}): Promise<RegionSquadInfo[]> {
  const allClassOptions = getAllClassOptions();
  const filteredClassOptions =
    enemyComposition.unpromoted === 100
      ? allClassOptions.filter((c) => c.promotionLevel === "unpromoted")
      : allClassOptions;
  const systemMessage = `
You are an elite Fire Emblem Tactician. Your task is to analyze the provided terrain grid, chapter idea, and map metadata to generate strategic recommendations for forming unit squads in each distinct region.

${availableClasses(filteredClassOptions)}

${unpromotedVsPromotedUnits(enemyComposition)}

${UNIT_TERRAIN_PLACEMENT_CONSTRAINTS}

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
  const enemyCountRange = getGenericEnemyNumberRange(
    getTerrainGridSize(ch1TerrainGrid)
  );
  genUnitSquads({
    terrainGrid: ch1TerrainGrid,
    chapterIdea: testChapterIdea,
    mapMetadata: testMapMetadata,
    enemyComposition: composition,
    enemyCountRange,
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

