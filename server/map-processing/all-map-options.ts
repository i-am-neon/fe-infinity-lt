import { MapMetadata } from "@/types/maps/map-metadata.ts";

  export const allMapOptions: MapMetadata[] = [
  {
    "distinctRegions": [
      {
        "name": "Western Village",
        "description": "A small village located near a body of water, providing a peaceful retreat. The village is surrounded by walls, making it a defensible position.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Village",
          "Lake"
        ],
        "fromX": 0,
        "fromY": 2,
        "toX": 3,
        "toY": 6
      },
      {
        "name": "Central Crossroads",
        "description": "The main intersection of roads, offering strategic movement options. It connects various parts of the map and is crucial for controlling movement.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 3,
        "fromY": 0,
        "toX": 11,
        "toY": 9
      },
      {
        "name": "Northern Armory",
        "description": "A fortified building where weapons and armor are stored. It is surrounded by walls, providing a strong defensive position.",
        "terrainTypes": [
          "Wall",
          "Armory",
          "Road"
        ],
        "fromX": 13,
        "fromY": 6,
        "toX": 14,
        "toY": 7
      },
      {
        "name": "Eastern Vendor",
        "description": "A marketplace for buying and selling goods, located near the water. It is accessible via roads and provides economic opportunities.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Lake",
          "Cliff"
        ],
        "fromX": 11,
        "fromY": 0,
        "toX": 14,
        "toY": 9
      },
      {
        "name": "Southern Pathway",
        "description": "A narrow road leading south, bordered by trees and water. It provides a route for movement while offering some cover from the surrounding terrain.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest",
          "Lake"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 10,
        "toY": 9
      }
    ],
    "keyPointsOfInterest": [
      "Village at (2,2) and (3,6)",
      "Armory at (13,7)",
      "Ruins at (11,1) to (13,2)"
    ],
    "chokePoints": [
      "Narrow road at (3,3) to (4,4)",
      "Wall surrounding the armory at (13,6) to (14,7)"
    ],
    "strategicConsiderations": [
      "Control the Central Crossroads to dominate movement across the map.",
      "Defend the Western Village to secure a safe retreat and resource point.",
      "Utilize the Northern Armory for defensive advantages and resupply.",
      "The Eastern Vendor can be a target for economic disruption.",
      "The Southern Pathway offers a route for flanking maneuvers."
    ],
    "givenName": "Crossroads of Commerce",
    "originalName": "(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19",
    "description": "An outdoor map featuring a network of roads connecting various buildings, including a village, an armory, and a vendor. The map is characterized by its strategic pathways and surrounding natural terrain.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Castle Entrance",
        "description": "A fortified structure with walls surrounding the entrance, providing a defensive position.",
        "terrainTypes": [
          "Wall",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 2,
        "toY": 1
      },
      {
        "name": "Central Forest",
        "description": "A dense cluster of trees providing cover and strategic movement options, ideal for ambushes and defensive maneuvers.",
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
        "name": "River Bridges",
        "description": "Two wooden bridges crossing a flowing river, crucial for movement across the map and controlling access between the northern and southern parts.",
        "terrainTypes": [
          "Bridge",
          "River",
          "Plain"
        ],
        "fromX": 11,
        "fromY": 2,
        "toX": 12,
        "toY": 5
      },
      {
        "name": "Eastern Riverbank",
        "description": "A grassy area along the river, offering open space for maneuvering and potential flanking routes.",
        "terrainTypes": [
          "Plain",
          "River"
        ],
        "fromX": 11,
        "fromY": 6,
        "toX": 14,
        "toY": 9
      }
    ],
    "keyPointsOfInterest": [
      "Castle Entrance at (0,0)",
      "Bridge at (11,2)",
      "Bridge at (12,5)"
    ],
    "chokePoints": [
      "Bridge at (11,2)",
      "Bridge at (12,5)"
    ],
    "strategicConsiderations": [
      "Control the bridges to manage movement across the river.",
      "Use the Central Forest for cover and ambush opportunities.",
      "Defend the Castle Entrance to prevent enemy access."
    ],
    "givenName": "Forest Crossing",
    "originalName": "(7)Ch01_Diff_Tileset__by_Shin19",
    "description": "A lush outdoor map featuring a castle, dense forests, and a river with bridges.",
    "setting": "outdoor"
  }
];