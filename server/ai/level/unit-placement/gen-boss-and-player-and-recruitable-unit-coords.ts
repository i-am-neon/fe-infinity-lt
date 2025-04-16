import correctUnitPlacement from "@/ai/level/unit-placement/correct-unit-placement.ts";
import { testPrologueChapter } from "@/ai/test-data/prologueTestData.ts";
import { testMapMetadata } from "@/ai/test-data/unit-placement.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import {
  RecruitableUnit,
  RecruitableUnitSchema,
  UnitCoords,
  UnitCoordsSchema,
} from "@/ai/types/unit-placement.ts";
import { ch4TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import { z } from "zod";
import generateStructuredData from "../../lib/generate-structured-data.ts";
import getTerrainGridFromMapName from "@/ai/level/unit-placement/get-terrain-grid-from-tilemap.ts";
import { allMapOptions } from "@/map-processing/all-map-options.ts";

export type NonGenericUnitPlacementResult = {
  boss: {
    region: string;
    coords: UnitCoords;
  };
  playerUnits: {
    regions: string[];
  };
  recruitableUnits: Array<{
    nid: string;
    firstSeenAs: string;
    region: string;
    coords: UnitCoords;
  }>;
};

export default async function genBossAndPlayerAndRecruitableUnitCoords({
  terrainGrid,
  chapterIdea,
  mapMetadata,
}: {
  terrainGrid: TerrainGrid;
  chapterIdea: ChapterIdea;
  mapMetadata: MapMetadata;
}): Promise<NonGenericUnitPlacementResult> {
  const systemMessage = `
You are a Fire Emblem Tactician. Choose exactly one region from mapMetadata.distinctRegions for the boss, and one or more regions for the player units to start. Base your choice on the sceneOverview:

*** MOST IMPORTANT RULE: THE PLAYER AND BOSS REGIONS MUST BE AS FAR AWAY FROM EACH OTHER AS POSSIBLE. YOU MUST PLACE THEM ON OPPOSITE EDGES/CORNERS OF THE MAP. ***

For region selection:
- If there's a throne or gate and the story implies a castle boss, place the boss on that region that contains a throne or gate.
- Otherwise, you can choose a fort, gate, or a forest region to place the boss.
- If it's a defense map, place the player units in a strategic location related to the defense objective.
- For player units, typically all start in one region, but if the story says they're split, choose multiple.
- Player units typically start on the edge or corner of a map.

Recruitable Units (green and red):
- If chapterIdea.newPlayableUnits is present and not empty, also choose one or more regions for them.
- Characters with 'firstSeenAs'='allied NPC' are allied but not directly controlled by the player.
  - They typically start in a region that thematically aligns with the story, or near the player's region, but not in the exact same tiles.
  - They might be near or adjacent to the player if the story suggests it, or somewhere else if the story calls for it.
- Characters with 'firstSeenAs'='enemy non-boss' are enemies that can be recruited.
  - They typically start in a region that thematically aligns with the story, in similar regions as other enemies.

Structure your choice in JSON as:
{
  "bossRegion": "Exact name from distinctRegions",
  "playerRegions": ["Exact name from distinctRegions"],
  "recruitableUnitRegions": ["Exact name from distinctRegions"]  // Omit or empty array if no recruitable units (from chapterIdea.newPlayableUnits)
}

Ensure region names match exactly.
`;

  const regionChoiceSchema = z.object({
    bossRegion: z.string(),
    playerRegions: z.array(z.string()),
    recruitableUnitRegions: z.array(z.string()).optional(),
  });

  const prompt = `Chapter Idea: ${JSON.stringify(
    chapterIdea
  )}\nmapMetadata: ${JSON.stringify(
    mapMetadata
  )}\nterrainGrid: ${JSON.stringify(terrainGrid)}`;

  const {
    bossRegion,
    playerRegions,
    recruitableUnitRegions = [],
  } = await generateStructuredData({
    fnName: "genBossAndPlayerAndRecruitableUnitCoords call 1",
    schema: regionChoiceSchema,
    systemMessage,
    prompt,
  });

  // Step 2: generate boss, player, and recruitable unit coords
  const systemMessage2 = `
Now, given the chosen boss region, player regions, and possibly recruitable unit regions (if any), generate coordinates.

IMPORTANT: Ensure the boss and player units are as far away from each other as possible. They should be on opposite sides of the map.

Only include recruitableUnits if chapterIdea.newPlayableUnits is provided.
Coordinates must lie within their chosen region(s). The sceneOverview might indicate splitting players or green units among multiple spots. Distribute them as appropriate. If you place the boss on a tile that is typically used for a throne, fort, or gate, keep that in mind if relevant.
`;

  const coordsSchema = z.object({
    boss: UnitCoordsSchema,
    playerUnits: z.array(UnitCoordsSchema),
    recruitableUnits: z.array(RecruitableUnitSchema),
  });

  // For prologue, do this. Figure out how to bring this in
  const playerUnitsNumber = 5;

  const prompt2 = `Chosen boss region: ${bossRegion}\nChosen player region(s): ${JSON.stringify(
    playerRegions
  )}\nNumber of Player Units: ${playerUnitsNumber}\nChosen green unit region(s): ${JSON.stringify(
    recruitableUnitRegions
  )}\nRecruitable Units to Place: ${JSON.stringify(
    chapterIdea.newPlayableUnits
  )}\nMap Metadata: ${JSON.stringify(
    mapMetadata
  )}\nTerrain Grid: ${JSON.stringify(terrainGrid)}`;

  const {
    boss,
    playerUnits,
    recruitableUnits = [],
  } = await generateStructuredData({
    fnName: "genBossAndPlayerAndRecruitableUnitCoords call 2",
    schema: coordsSchema,
    systemMessage: systemMessage2,
    prompt: prompt2,
  });

  const correctedBoss = correctUnitPlacement({
    terrainGrid,
    units: [{ x: boss.x, y: boss.y }],
  })[0];

  const correctedPlayers = correctUnitPlacement({
    terrainGrid,
    units: playerUnits,
    existingPositions: [correctedBoss],
  });

  const correctedRecruitableUnits: Array<{
    nid: string;
    firstSeenAs: string;
    region: string;
    coords: UnitCoords;
  }> = [];

  if (recruitableUnits.length > 0) {
    recruitableUnits.forEach((ru, index) => {
      if (
        !chapterIdea.newPlayableUnits?.some((unit) => unit.firstName === ru.nid)
      ) {
        throw new Error(
          `Recruitable unit with NID "${ru.nid}" does not match any unit's firstName in chapterIdea.newPlayableUnits`
        );
      }
      const correctedRecruitable = correctUnitPlacement({
        terrainGrid,
        units: [{ x: ru.coords.x, y: ru.coords.y }],
        existingPositions: correctedPlayers,
      })[0];

      correctedRecruitableUnits.push({
        nid: ru.nid,
        firstSeenAs: ru.firstSeenAs,
        region: recruitableUnitRegions[index % recruitableUnitRegions.length], // Use mod to handle if there are more units than regions
        coords: { x: correctedRecruitable.x, y: correctedRecruitable.y },
      });
    });
  }

  return {
    boss: {
      region: bossRegion,
      coords: {
        x: correctedBoss.x,
        y: correctedBoss.y,
      },
    },
    playerUnits: {
      regions: playerRegions,
    },
    recruitableUnits: correctedRecruitableUnits,
  };
}

if (import.meta.main) {
  (async () => {
    const result = await genBossAndPlayerAndRecruitableUnitCoords({
      terrainGrid: getTerrainGridFromMapName("Nobles_Evil_Doers_6_(6C_00_A3_6E)__by_Aura_Wolf"),
      chapterIdea: testPrologueChapter.idea,
      mapMetadata: allMapOptions.find(
        (map) => map.originalName === "Nobles_Evil_Doers_6_(6C_00_A3_6E)__by_Aura_Wolf"
      ) as MapMetadata,
    });
    console.log("Boss and Player coords:", result);
  })();
}

