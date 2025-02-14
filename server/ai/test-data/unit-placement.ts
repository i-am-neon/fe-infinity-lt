import getTerrainGridFromMapName from "@/ai/level/unit-placement/get-terrain-grid-from-tilemap.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";

export const testMapMetadata: MapMetadata = {
  distinctRegions: [
    {
      name: "Western Village",
      description:
        "A small village located near a body of water, providing a strategic point for resources and defense.",
      terrainTypes: ["Plain", "Wall", "Village", "Road", "Lake"],
      fromX: 0,
      fromY: 0,
      toX: 3,
      toY: 6,
    },
    {
      name: "Central Crossroads",
      description:
        "The main intersection of roads, offering multiple paths for movement and strategy.",
      terrainTypes: ["Road", "Plain", "Forest"],
      fromX: 4,
      fromY: 0,
      toX: 9,
      toY: 9,
    },
    {
      name: "Eastern Castle",
      description:
        "A fortified structure providing a defensive stronghold and strategic advantage.",
      terrainTypes: ["Wall", "Road", "Ruins", "Floor", "Barrel"],
      fromX: 10,
      fromY: 0,
      toX: 14,
      toY: 4,
    },
    {
      name: "Southern Outpost",
      description:
        "A small outpost near the water, serving as a defensive position and lookout point.",
      terrainTypes: ["Plain", "Road", "Wall", "Armory", "Cliff"],
      fromX: 10,
      fromY: 5,
      toX: 14,
      toY: 9,
    },
  ],
  keyPointsOfInterest: [
    "Village at (2,2) and (3,6)",
    "Armory at (13,7)",
    "Ruins at (11,1) to (13,2)",
  ],
  chokePoints: [
    "Narrow road between walls at (5,0) and (6,0)",
    "Road through walls at (7,3)",
    "Road through walls at (7,6)",
  ],
  strategicConsiderations: [
    "The Western Village provides a resource point and is defensible due to its proximity to the lake.",
    "The Central Crossroads is crucial for movement and offers multiple strategic paths.",
    "The Eastern Castle is a strong defensive position with limited access points.",
    "The Southern Outpost serves as a lookout and defensive position, with the armory providing additional resources.",
  ],
  givenName: "Crossroads of Commerce",
  originalName: "(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19",
  description:
    "An outdoor map featuring a network of roads connecting various key locations, including villages and a castle. The terrain is a mix of open plains and strategic choke points formed by walls and water.",
  setting: "outdoor",
};

export const testTerrainGrid = getTerrainGridFromMapName(
  "(7)Ch01_Diff_Tileset__by_Shin19"
);

