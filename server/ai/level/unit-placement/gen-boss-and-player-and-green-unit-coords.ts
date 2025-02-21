import correctUnitPlacement from "@/ai/level/unit-placement/correct-unit-placement.ts";
import { testPrologueChapter } from "@/ai/test-data/prologueTestData.ts";
import { testMapMetadata } from "@/ai/test-data/unit-placement.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import {
  BossCoords,
  GreenUnit,
  PlayerUnitStartCoords,
} from "@/ai/types/unit-placement.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";
import { ch4TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";
import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import { z } from "zod";

export default async function genBossAndPlayerAndGreenUnitCoords({
  terrainGrid,
  chapterIdea,
  mapMetadata,
}: {
  terrainGrid: TerrainGrid;
  chapterIdea: ChapterIdea;
  mapMetadata: MapMetadata;
}): Promise<{
  boss: BossCoords;
  playerUnits: PlayerUnitStartCoords;
  greenUnits: GreenUnit[];
}> {
  const systemMessage = `
You are a Fire Emblem Tactician. Choose exactly one region from mapMetadata.distinctRegions for the boss, and one or more regions for the player units to start. Base your choice on the sceneOverview:
- If there's a throne or gate and the story implies a castle boss, place the boss on that region that contains a throne or gate.
- Otherwise, you can choose a fort, gate, or a forest region to place the boss.
- If it's a defense map, place the player units in a strategic location related to the defense objective.
- For player units, typically all start in one region, but if the story says they're split, choose multiple.
- Player units typically start on the edge or corner of a map.
- The player and boss regions must be on opposite edge/corner of the map, as far away from each other as possible.

If sceneOverview.greenUnits is present and not empty, also choose one or more regions for them. They are allied but not directly controlled by the player. They typically start in a region that thematically aligns with the story, or near the player's region, but not in the exact same tiles. They might be near or adjacent to the player if the story suggests it, or somewhere else if the story calls for it.

Structure your choice in JSON as:
{
  "bossRegion": "Exact name from distinctRegions",
  "playerRegions": ["Exact name from distinctRegions"],
  "greenUnitRegions": ["Exact name from distinctRegions"]  // Omit or empty array if no greenUnits
}

Ensure region names match exactly.
`;

  const regionChoiceSchema = z.object({
    bossRegion: z.string(),
    playerRegions: z.array(z.string()),
    greenUnitRegions: z.array(z.string()).optional(),
  });

  const prompt = `Chapter Idea: ${JSON.stringify(
    chapterIdea
  )}\nmapMetadata: ${JSON.stringify(
    mapMetadata
  )}\nterrainGrid: ${JSON.stringify(terrainGrid)}`;

  const {
    bossRegion,
    playerRegions,
    greenUnitRegions = [],
  } = await generateStructuredData({
    fnName: "genBossAndPlayerAndGreenUnitCoords call 1",
    schema: regionChoiceSchema,
    systemMessage,
    prompt,
  });

  // Step 2: generate boss and player coords
  const systemMessage2 = `
Now, given the chosen boss region, player regions, and possibly green unit regions (if any), generate coordinates:
{
  "boss": {
    "x": number,
    "y": number
  },
  "playerUnits": [
    { "x": number, "y": number }
  ],
  "greenUnits": [
    { "x": number, "y": number },
    ...
  ]
}

Only include greenUnits if sceneOverview.greenUnits is provided.
Coordinates must lie within their chosen region(s). The sceneOverview might indicate splitting players or green units among multiple spots. Distribute them as appropriate. If you place the boss on a tile that is typically used for a throne, fort, or gate, keep that in mind if relevant.
`;

  const coordsSchema = z.object({
    boss: z.object({
      x: z.number().int().min(0),
      y: z.number().int().min(0),
    }),
    playerUnits: z.array(
      z.object({
        x: z.number().int().min(0),
        y: z.number().int().min(0),
      })
    ),
    greenUnits: z
      .array(
        z.object({
          x: z.number().int().min(0),
          y: z.number().int().min(0),
        })
      )
      .optional(),
  });

  // For prologue, do this. Figure out how to bring this in
  const playerUnitsNumber = 5;
  const chIdeaGreenUnits = chapterIdea.newPlayableUnits?.filter(
    (unit) => unit.firstSeenAs === "allied NPC"
  );

  const prompt2 = `Chosen boss region: ${bossRegion}\nChosen player region(s): ${JSON.stringify(
    playerRegions
  )}\nNumber of Player Units: ${playerUnitsNumber}\nChosen green unit region(s): ${JSON.stringify(
    greenUnitRegions
  )}\nGreen Units to Place: ${JSON.stringify(
    chIdeaGreenUnits
  )}\nMap Metadata: ${JSON.stringify(
    mapMetadata
  )}\nTerrain Grid: ${JSON.stringify(terrainGrid)}`;

  const {
    boss,
    playerUnits,
    greenUnits = [],
  } = await generateStructuredData({
    fnName: "genBossAndPlayerAndGreenUnitCoords call 2",
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
  });

  let correctedGreens: GreenUnit[] = [];
  // TODO: green units
  // if (chIdeaGreenUnits?.length && greenUnits.length) {
  //   correctedGreens = correctUnitPlacement({
  //     terrainGrid,
  //     units: greenUnits.map((g, idx) => {
  //       return {
  //         x: g.x,
  //         y: g.y,
  //         class: chapterIdea.greenUnits![idx].class,
  //         name: chapterIdea.greenUnits![idx].name,
  //         desc: chapterIdea.greenUnits![idx].description,
  //       };
  //     }),
  //   });
  // }

  return {
    boss: {
      x: correctedBoss.x,
      y: correctedBoss.y,
    },
    playerUnits: correctedPlayers.map((u) => ({ x: u.x, y: u.y })),
    greenUnits: correctedGreens.map((g) => ({
      x: g.x,
      y: g.y,
      class: g.class!,
      name: g.name!,
      desc: g.desc!,
    })),
  };
}

if (import.meta.main) {
  (async () => {
    // ch4 has green units
    const result = await genBossAndPlayerAndGreenUnitCoords({
      terrainGrid: ch4TerrainGrid,
      chapterIdea: testPrologueChapter.idea,
      mapMetadata: testMapMetadata,
    });
    console.log("Boss and Player coords:", result);
  })();
}

