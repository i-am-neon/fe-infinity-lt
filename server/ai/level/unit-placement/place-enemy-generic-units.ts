import { testChapterIdea } from "@/ai/test-data/chapter-ideas.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { EnemyComposition } from "@/ai/types/enemy-composition.ts";
import { RegionSquadInfo } from "@/ai/types/region-squad-info.ts";
import {
  EnemyGenericUnit,
  EnemyGenericUnitSchema,
} from "@/ai/types/unit-placement.ts";
import { getAllClassOptions } from "./get-all-class-options.ts";
import getEnemyComposition from "./get-enemy-composition.ts";
import getSubTerrainGrid from "./get-sub-terrain-grid.ts";
import { availableClasses } from "./shared-prompts/available-classes.ts";
import { UNIT_TERRAIN_PLACEMENT_CONSTRAINTS } from "./shared-prompts/unit-terrain-placement-constraints.ts";
import { unpromotedVsPromotedUnits } from "./shared-prompts/unpromoted-vs-promoted-units.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";
import { ch1TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import { z } from "zod";
import { testMapMetadata } from "../../test-data/unit-placement.ts";

export default async function placeEnemyGenericUnits({
  terrainGrid,
  chapterIdea,
  mapMetadata,
  regionSquadInfo,
  enemyComposition,
}: {
  terrainGrid: TerrainGrid;
  chapterIdea: ChapterIdea;
  mapMetadata: MapMetadata;
  regionSquadInfo: RegionSquadInfo[];
  enemyComposition: EnemyComposition;
}): Promise<EnemyGenericUnit[]> {
  const allClassOptions = getAllClassOptions();
  const filteredClassOptions =
    enemyComposition.unpromoted === 100
      ? allClassOptions.filter((c) => c.promotionLevel === "unpromoted")
      : allClassOptions;

  const systemMessage = `
      You are an advanced Fire Emblem Tactician. Based on the sub terrain grid, the region's squad info, the chapter idea, and the map metadata, generate generic enemy unit placements for ONLY this region.
You must ensure these units reflect the "squadInfo" concept and remain within the region's bounding box.

Place the same number of units as specified in the "numberOfGenericEnemies" field of the region squad info.
      
      ${availableClasses(filteredClassOptions)}
      ${unpromotedVsPromotedUnits(enemyComposition)}
      ${UNIT_TERRAIN_PLACEMENT_CONSTRAINTS}
            `.trim();

  const allUnitsArrays = await Promise.all(
    regionSquadInfo
      .filter((region) => region.numberOfGenericEnemies > 0)
      .map(async (region) => {
        const regionTerrainGrid = getSubTerrainGrid({
          terrainGrid,
          fromX: region.fromX,
          fromY: region.fromY,
          toX: region.toX,
          toY: region.toY,
        });

        const prompt = `Chapter Idea: ${JSON.stringify(
          chapterIdea
        )}\nMap Metadata: ${JSON.stringify(
          mapMetadata
        )}\nSub Terrain Grid: ${JSON.stringify(
          regionTerrainGrid
        )}\nRegion Squad Info: ${JSON.stringify(region, null, 2)}`;

        const rawResult = await generateStructuredData({
          fnName: "placeEnemyGenericUnits",
          systemMessage,
          prompt,
          schema: z.object({
            units: z.array(
              EnemyGenericUnitSchema.extend({ class: z.string() })
            ),
          }),
        });

        const regionUnits = rawResult.units.map((u) => {
          const corrected = {
            ...u,
            class: u.class,
          };
          return EnemyGenericUnitSchema.parse(corrected);
        });

        console.log(
          `Placed units for region ${region.regionName}:`,
          regionUnits
        );

        return regionUnits;
      })
  );

  // Flatten all region units into one array
  return allUnitsArrays.flat();
}

if (import.meta.main) {
  const res = await placeEnemyGenericUnits({
    terrainGrid: ch1TerrainGrid,
    chapterIdea: testChapterIdea,
    mapMetadata: testMapMetadata,
    regionSquadInfo: [
      {
        regionName: "Northwest Forest and Hill Area",
        fromX: 0,
        fromY: 0,
        toX: 6,
        toY: 7,
        squadInfo:
          "This region is ideal for ambushes and defensive positioning due to its dense forest and hills. Deploy Myrmidons and Mercenaries here to take advantage of their speed and skill in the forest terrain. Their ability to dodge attacks will be crucial in this area. Additionally, place Archers on the hills to provide ranged support and take advantage of the elevation for increased attack range. The forest cover will also help protect them from enemy attacks.",
        numberOfGenericEnemies: 3,
      },
      {
        regionName: "Central Village and Road",
        fromX: 7,
        fromY: 0,
        toX: 9,
        toY: 6,
        squadInfo:
          "The village and road area is a strategic point for supply and movement. Deploy Cavaliers and Soldiers here to quickly move between the village and the road, ensuring control over this area. Their superior movement will allow them to respond to threats quickly. Additionally, place a Cleric or Troubadour to provide healing support to units holding this strategic point.",
        numberOfGenericEnemies: 3,
      },
      {
        regionName: "Northeast Cliff and Forest",
        fromX: 10,
        fromY: 0,
        toX: 14,
        toY: 4,
        squadInfo: "",
        numberOfGenericEnemies: 0,
      },
      {
        regionName: "Central River and Bridge",
        fromX: 3,
        fromY: 8,
        toX: 10,
        toY: 10,
        squadInfo:
          "This river crossing is a critical chokepoint. Deploy Knights and Great Knights to hold the bridge and prevent enemy advancement. Their high defense will be crucial in maintaining control over this chokepoint. Additionally, place a Thief to scout and provide vision across the river, ensuring no enemy surprises. Consider having a Monk or Cleric nearby to heal the frontline units.",
        numberOfGenericEnemies: 3,
      },
      {
        regionName: "Southwest Village and Road",
        fromX: 0,
        fromY: 9,
        toX: 4,
        toY: 14,
        squadInfo:
          "This village area is important for control and movement. Deploy Fighters and Pirates to take advantage of their strength and ability to move through the forest and road. Their offensive capabilities will be crucial in maintaining control over this area. Additionally, place a Dancer to refresh units and allow them to act again, providing flexibility in responding to threats.",
        numberOfGenericEnemies: 3,
      },
      {
        regionName: "Southeast Forest and Plain",
        fromX: 5,
        fromY: 11,
        toX: 14,
        toY: 14,
        squadInfo:
          "This open area with forest patches is suitable for maneuvering and flanking. Deploy Mercenaries and Myrmidons to take advantage of their speed and skill in the forest terrain. Their ability to dodge attacks will be crucial in this area. Additionally, place an Archer to provide ranged support and take advantage of the open plains for increased attack range. Consider having a Mage to provide magical support and deal with any heavily armored enemies.",
        numberOfGenericEnemies: 3,
      },
    ],
    enemyComposition: getEnemyComposition(4),
  });
  console.log("Result of placing enemy units region-by-region:", res);
}

