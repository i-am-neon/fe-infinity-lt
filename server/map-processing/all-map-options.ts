import { MapMetadata } from "@/types/maps/map-metadata.ts";

  export const allMapOptions: MapMetadata[] = [
  {
    "distinctRegions": [
      {
        "name": "Western Village",
        "description": "A small village located near a body of water, providing a strategic point for resources.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Village",
          "Lake"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 3,
        "toY": 5
      },
      {
        "name": "Central Crossroads",
        "description": "The main intersection of roads, offering multiple paths to different regions.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 3,
        "fromY": 0,
        "toX": 9,
        "toY": 9
      },
      {
        "name": "Eastern Castle",
        "description": "A fortified structure with defensive walls, serving as a stronghold.",
        "terrainTypes": [
          "Wall",
          "Road",
          "Ruins",
          "Floor"
        ],
        "fromX": 9,
        "fromY": 0,
        "toX": 14,
        "toY": 3
      },
      {
        "name": "Southern Pathway",
        "description": "A narrow road leading south, bordered by trees and natural terrain.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 5,
        "fromY": 5,
        "toX": 14,
        "toY": 9
      },
      {
        "name": "Northern Outpost",
        "description": "A small building located at the northern edge, possibly serving as a lookout or supply point.",
        "terrainTypes": [
          "Wall",
          "Road",
          "Armory"
        ],
        "fromX": 13,
        "fromY": 6,
        "toX": 14,
        "toY": 7
      }
    ],
    "keyPointsOfInterest": [
      "Village at (2,2) and (3,6)",
      "Armory at (13,7)"
    ],
    "chokePoints": [
      "Narrow road at (5,0)",
      "Wall at (5,5)"
    ],
    "strategicConsiderations": [
      "Control the Central Crossroads to dominate movement across the map.",
      "Defend the Eastern Castle to maintain a stronghold.",
      "Utilize the Western Village for resource gathering.",
      "Secure the Northern Outpost for a strategic vantage point."
    ],
    "givenName": "Crossroads of Commerce",
    "originalName": "(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19",
    "description": "An outdoor map featuring a network of roads connecting various key locations, including villages and a castle, surrounded by natural terrain.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Castle Entrance",
        "description": "The fortified entrance to a grand castle, surrounded by walls and providing a strategic defensive position.",
        "terrainTypes": [
          "Wall",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 1,
        "toY": 1
      },
      {
        "name": "Central Forest",
        "description": "A dense forest area providing cover and strategic movement options, ideal for ambushes and flanking maneuvers.",
        "terrainTypes": [
          "Forest",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 2,
        "toX": 6,
        "toY": 9
      },
      {
        "name": "River Crossing",
        "description": "A river with two wooden bridges allowing passage, serving as a critical chokepoint for controlling movement across the map.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain"
        ],
        "fromX": 11,
        "fromY": 2,
        "toX": 13,
        "toY": 9
      },
      {
        "name": "Mountain Edge",
        "description": "A small mountain range providing a natural barrier, limiting movement and offering high ground advantage.",
        "terrainTypes": [
          "Mountain",
          "Plain"
        ],
        "fromX": 12,
        "fromY": 0,
        "toX": 14,
        "toY": 2
      },
      {
        "name": "Southern Forest",
        "description": "A continuation of the forest with more open spaces, offering both cover and mobility for units.",
        "terrainTypes": [
          "Forest",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 6,
        "toX": 10,
        "toY": 9
      }
    ],
    "keyPointsOfInterest": [
      "Castle at (0,0)",
      "Bridge at (11,2)",
      "Bridge at (12,5)"
    ],
    "chokePoints": [
      "Bridge at (11,2)",
      "Bridge at (12,5)"
    ],
    "strategicConsiderations": [
      "The Castle Entrance provides a strong defensive position with limited access points.",
      "The Central Forest allows for ambushes and flanking due to its dense cover.",
      "Controlling the River Crossing is crucial for movement across the map, as the bridges are key chokepoints.",
      "The Mountain Edge offers high ground advantage but is difficult to traverse.",
      "The Southern Forest provides a balance of cover and mobility, useful for repositioning."
    ],
    "givenName": "Forest Crossing",
    "originalName": "(7)Ch01_Diff_Tileset__by_Shin19",
    "description": "A lush outdoor map featuring a castle, dense forests, and a river with bridges.",
    "setting": "outdoor"
  }
];