import { MapMetadata } from "@/types/maps/map-metadata.ts";

  export const allMapOptions: MapMetadata[] = [
  {
    "distinctRegions": [
      {
        "name": "Fortress Gate",
        "description": "The main entrance to the fortress, heavily fortified and guarded. It serves as a critical chokepoint for controlling access to the fortress.",
        "terrainTypes": [
          "Wall",
          "Floor",
          "Throne",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 8,
        "toY": 4
      },
      {
        "name": "Village Square",
        "description": "A cluster of houses forming the village's central area, providing cover and strategic positioning. It is surrounded by roads and forests, making it a key area for control.",
        "terrainTypes": [
          "Village",
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 15,
        "toX": 20,
        "toY": 21
      },
      {
        "name": "Arena Grounds",
        "description": "An open area with an arena, surrounded by trees, ideal for skirmishes. It provides a mix of open space and cover, suitable for tactical maneuvers.",
        "terrainTypes": [
          "Arena",
          "Road",
          "Forest",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 20,
        "toY": 19
      },
      {
        "name": "Merchant Row",
        "description": "A line of shops and vendors, offering supplies and trade opportunities. It is a bustling area with roads and vendors, crucial for resource management.",
        "terrainTypes": [
          "Vendor",
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 12,
        "toX": 20,
        "toY": 14
      },
      {
        "name": "Forest Path",
        "description": "A narrow path through dense trees, providing stealth and ambush opportunities. It is a strategic route for flanking maneuvers.",
        "terrainTypes": [
          "Forest",
          "Road",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 8,
        "toX": 20,
        "toY": 11
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (5,1)",
      "Vendor at (2,12)",
      "Armory at (14,10)",
      "Arena at (6,16)"
    ],
    "chokePoints": [
      "Fortress Gate at (4,8) and (5,8)",
      "Door at (5,8) and (6,8)"
    ],
    "strategicConsiderations": [
      "Control the Fortress Gate to prevent enemy access.",
      "Utilize the Village Square for defensive positioning.",
      "Leverage the Arena Grounds for open skirmishes.",
      "Secure Merchant Row for resource advantages.",
      "Use the Forest Path for stealthy flanking attacks."
    ],
    "givenName": "Fortress Approach",
    "originalName": "Chapter7OstiasRebellion_Diff_Tileset__by_Shin19",
    "description": "A strategic outdoor map featuring a fortress entrance, surrounded by a village and open fields. The map is designed for tactical maneuvers with various terrains and structures.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Treasure Chamber",
        "description": "A secluded room containing a valuable chest, located in the top left corner of the map. It is isolated by walls and a door, making it a secure location for storing treasures.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 1,
        "fromY": 1,
        "toX": 3,
        "toY": 3
      },
      {
        "name": "Central Corridor",
        "description": "A long hallway lined with pillars, providing a strategic path through the center of the map. It connects various rooms and is crucial for movement across the map.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 5,
        "fromY": 4,
        "toX": 13,
        "toY": 6
      },
      {
        "name": "Entrance Hall",
        "description": "The main entrance with a large, ornate door, located at the bottom right of the map. It serves as the primary entry and exit point, making it a key strategic location.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 15,
        "fromY": 10,
        "toX": 17,
        "toY": 13
      },
      {
        "name": "Overgrown Pathway",
        "description": "A narrow path with dense vegetation creeping through the stone tiles, located at the top center of the map. It provides a hidden route for movement and ambushes.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 5,
        "fromY": 0,
        "toX": 8,
        "toY": 3
      },
      {
        "name": "Hidden Alcove",
        "description": "A small, concealed area accessible from the main corridor, located at the center left of the map. It offers a strategic position for ambushes or hiding.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 4,
        "toY": 7
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (2,2)",
      "Ornate Door at (2,0)"
    ],
    "chokePoints": [
      "Door at (2,0)",
      "Narrow path at (5,0) to (8,3)"
    ],
    "strategicConsiderations": [
      "The Treasure Chamber is well-protected and can be used to store valuable items.",
      "The Central Corridor is crucial for movement and control of the map.",
      "The Entrance Hall is a key point for defense and entry.",
      "The Overgrown Pathway can be used for stealthy movement and ambushes.",
      "The Hidden Alcove provides a strategic position for surprise attacks."
    ],
    "givenName": "Ancient Ruins",
    "originalName": "Nobles_Evil_Doers_9_(5F_00_60_61)__by_Aura_Wolf",
    "description": "A mysterious indoor map featuring stone pathways, overgrown vegetation, and hidden treasures.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central Chamber",
        "description": "A large, open area with a prominent stone structure in the center, featuring multiple pillars and stairs for strategic movement.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 19,
        "toY": 11
      },
      {
        "name": "Left Wing",
        "description": "A series of narrow pathways and small rooms on the left side of the map, providing strategic cover and movement options.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 11
      },
      {
        "name": "Right Wing",
        "description": "A complex of rooms and corridors on the right side, featuring water patches and strategic points for defense.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Plain"
        ],
        "fromX": 20,
        "fromY": 0,
        "toX": 26,
        "toY": 11
      },
      {
        "name": "Lower Passage",
        "description": "A narrow corridor leading to smaller chambers at the bottom of the map, offering strategic choke points.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 3,
        "toX": 26,
        "toY": 11
      },
      {
        "name": "Upper Corridor",
        "description": "A straight path with access to the central chamber from the top, providing a direct route for movement.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 26,
        "toY": 2
      }
    ],
    "keyPointsOfInterest": [
      "Central Pillar in Central Chamber",
      "Multiple Stairs for strategic movement"
    ],
    "chokePoints": [
      "Narrow pathways in Left Wing",
      "Corridors in Right Wing",
      "Lower Passage"
    ],
    "strategicConsiderations": [
      "Control the Central Chamber for strategic advantage",
      "Utilize the narrow pathways in the Left Wing for ambushes",
      "Defend the Right Wing corridors to prevent flanking",
      "Use the Lower Passage as a defensive retreat path",
      "The Upper Corridor provides a quick access route to the Central Chamber"
    ],
    "givenName": "Ancient Ruins",
    "originalName": "Nobles_Evil_Doers_6_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "A labyrinthine indoor map featuring stone structures and narrow pathways, surrounded by moss and water patches.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Village",
        "description": "A small village with several houses, providing resources and shelter. It is surrounded by walls and mountains, making it a defensible position.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Wall",
          "Village",
          "House"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 3,
        "toY": 11
      },
      {
        "name": "Central Mountain Range",
        "description": "A large impassable mountain range dominating the center of the map, acting as a natural barrier between the eastern and western regions.",
        "terrainTypes": [
          "Mountain",
          "Hill"
        ],
        "fromX": 6,
        "fromY": 0,
        "toX": 12,
        "toY": 9
      },
      {
        "name": "Eastern Castle",
        "description": "A fortified castle, likely the main objective or stronghold. It is protected by walls and a gate, with a fort inside for additional defense.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Gate",
          "Fort"
        ],
        "fromX": 15,
        "fromY": 4,
        "toX": 18,
        "toY": 11
      },
      {
        "name": "Northern Fort",
        "description": "A small fort providing strategic advantage and defense, located near the top left of the map.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 5,
        "fromY": 0,
        "toX": 6,
        "toY": 1
      },
      {
        "name": "Southern Pathway",
        "description": "A winding path connecting the village to other regions, passing through plains and hills.",
        "terrainTypes": [
          "Plain",
          "Hill"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 13,
        "toY": 11
      },
      {
        "name": "Eastern Village",
        "description": "A small village near the castle, offering additional resources. It is surrounded by plains and forests, providing some cover.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House"
        ],
        "fromX": 16,
        "fromY": 9,
        "toX": 18,
        "toY": 11
      }
    ],
    "keyPointsOfInterest": [
      "Fort at (5,1)",
      "Village at (2,7)",
      "Vendor at (4,9)",
      "Armory at (1,10)",
      "House at (5,11)",
      "Gate at (16,6)"
    ],
    "chokePoints": [
      "Gate at (16,6)",
      "Walls surrounding the Western Village",
      "Mountain range dividing the map"
    ],
    "strategicConsiderations": [
      "The Central Mountain Range acts as a natural barrier, forcing units to take longer paths around it.",
      "The Western Village is well-defended with walls and mountains, making it a strong defensive position.",
      "The Eastern Castle is a key objective, protected by a gate and walls, requiring a strategic approach to breach.",
      "The Northern Fort provides a strategic vantage point for controlling the northern part of the map.",
      "The Southern Pathway offers a route for quick movement between regions, but is exposed to attacks from the hills."
    ],
    "givenName": "Mountain Pass Siege",
    "originalName": "Knights_Villagers_Bandits_4_(01_00_38_03)__by_Aura_Wolf",
    "description": "A strategic map featuring a central mountain range dividing key locations, including a castle, villages, and a fort.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Temple",
        "description": "A large temple structure with a treasure chest inside, located in the northern part of the map. It is surrounded by walls and has stairs leading to it, making it a defensible position.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Chest"
        ],
        "fromX": 10,
        "fromY": 1,
        "toX": 13,
        "toY": 4
      },
      {
        "name": "Southern Temple",
        "description": "Another temple structure with a treasure chest, mirroring the northern one. It is also surrounded by walls and has stairs leading to it, providing a strategic defensive position.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Chest"
        ],
        "fromX": 5,
        "fromY": 8,
        "toX": 7,
        "toY": 10
      },
      {
        "name": "Grassy Clearing",
        "description": "An open area with grass and sparse trees, connecting the two temples. It provides open movement for units but lacks cover, making it vulnerable to ranged attacks.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 17,
        "toY": 17
      }
    ],
    "keyPointsOfInterest": [
      "Treasure Chest in Northern Temple",
      "Treasure Chest in Southern Temple"
    ],
    "chokePoints": [
      "Stairs leading to Northern Temple",
      "Stairs leading to Southern Temple"
    ],
    "strategicConsiderations": [
      "The temples provide strong defensive positions due to their elevation and limited access points via stairs.",
      "The open grassy clearing allows for fast movement but offers little cover, making it risky for units to linger.",
      "Control of the temples is crucial for maintaining a defensive advantage and securing the treasure chests."
    ],
    "givenName": "Twin Temple Grounds",
    "originalName": "Blyvern_FE8_3C003D3E_dlitzbicks__by_FEU",
    "description": "An outdoor map featuring two prominent temple structures with treasure chests, surrounded by grassy terrain and sparse trees.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Throne Room",
        "description": "A grand room with a throne, indicating the seat of power. It is located at the top center of the fortress and is heavily guarded by walls and cliffs.",
        "terrainTypes": [
          "Floor",
          "Throne"
        ],
        "fromX": 8,
        "fromY": 1,
        "toX": 10,
        "toY": 2
      },
      {
        "name": "Dining Hall",
        "description": "A room with several tables, likely used for dining or meetings. It is located at the top right of the fortress, providing a strategic position for gatherings.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 15,
        "fromY": 2,
        "toX": 21,
        "toY": 6
      },
      {
        "name": "Central Maze",
        "description": "A series of winding corridors forming a complex maze. This area is the heart of the fortress, designed to confuse and delay intruders.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 5,
        "fromY": 3,
        "toX": 21,
        "toY": 7
      },
      {
        "name": "Treasure Vault",
        "description": "A secure room containing multiple treasure chests. It is located at the center right of the fortress, heavily protected by walls and doors.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 25,
        "fromY": 4,
        "toX": 28,
        "toY": 8
      },
      {
        "name": "Lower Treasure Room",
        "description": "A small room with treasure chests, accessible from the maze. It is located at the bottom left of the fortress, providing a hidden stash of valuables.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 5,
        "fromY": 20,
        "toX": 7,
        "toY": 23
      },
      {
        "name": "Entrance Hall",
        "description": "The main entrance to the fortress, leading into the maze. It is located at the bottom center, serving as the primary access point for intruders.",
        "terrainTypes": [
          "Floor",
          "Door"
        ],
        "fromX": 8,
        "fromY": 17,
        "toX": 21,
        "toY": 21
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (9,1)",
      "Multiple chests in Treasure Vault and Lower Treasure Room",
      "Stairs at various locations for vertical movement"
    ],
    "chokePoints": [
      "Doors at (8,7) and (24,5)",
      "Narrow corridors in the Central Maze"
    ],
    "strategicConsiderations": [
      "Defend the Throne Room as it is the seat of power.",
      "Control the Dining Hall for strategic meetings.",
      "Use the Central Maze to delay and confuse intruders.",
      "Secure the Treasure Vault to protect valuable assets.",
      "Utilize the Entrance Hall to control access to the fortress."
    ],
    "givenName": "Labyrinthine Fortress",
    "originalName": "Chapter12TheTrueEnemy_Fire_tileset_Minor_Changes__by_Shin19",
    "description": "A complex indoor fortress with winding corridors and multiple treasure rooms, designed to challenge intruders with its maze-like structure.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central Courtyard",
        "description": "An open grassy area with scattered trees and pathways, providing a central area for movement and engagement.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Road"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 19,
        "toY": 17
      },
      {
        "name": "Northern Fortress",
        "description": "A large stone building with a red carpet, likely a throne room or main hall, featuring pillars and stairs for strategic positioning.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 16,
        "toY": 4
      },
      {
        "name": "Eastern Barracks",
        "description": "A stone building with a treasure chest, possibly used for storage or housing troops, with stairs for access.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Chest"
        ],
        "fromX": 17,
        "fromY": 8,
        "toX": 19,
        "toY": 13
      },
      {
        "name": "Western Barracks",
        "description": "A stone building with multiple entrances, likely used for troop housing, featuring pillars and stairs for strategic positioning.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 11,
        "toX": 3,
        "toY": 17
      }
    ],
    "keyPointsOfInterest": [
      "Treasure Chest at (19,10)",
      "Stairs at multiple locations for strategic movement"
    ],
    "chokePoints": [
      "Narrow pathways between buildings",
      "Stairs leading to different levels"
    ],
    "strategicConsiderations": [
      "The Central Courtyard offers open space for maneuvering but limited cover.",
      "The Northern Fortress provides a defensible position with limited access points.",
      "The Eastern Barracks contains valuable items and is a target for looting.",
      "The Western Barracks offers multiple entry points, making it vulnerable to attacks."
    ],
    "givenName": "Fortress Courtyard",
    "originalName": "Knights_Villagers_Bandits_10_(3C_00_CE_3E)__by_Aura_Wolf",
    "description": "A fortified courtyard surrounded by stone buildings, featuring a central open area with scattered trees and pathways.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Castle",
        "description": "A fortified castle located at the top of the map, serving as a strategic stronghold.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Gate",
          "Mountain",
          "Hill"
        ],
        "fromX": 4,
        "fromY": 0,
        "toX": 9,
        "toY": 3
      },
      {
        "name": "Central River",
        "description": "A winding river that flows through the center of the map, with several bridges for crossing.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 3,
        "toX": 16,
        "toY": 11
      },
      {
        "name": "Western Village",
        "description": "A small village located to the left of the map, providing resources and shelter.",
        "terrainTypes": [
          "Plain",
          "House",
          "Fort",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 4,
        "toY": 2
      },
      {
        "name": "Eastern Village",
        "description": "A small village located to the right of the map, offering supplies and refuge.",
        "terrainTypes": [
          "Plain",
          "House",
          "Fort",
          "Forest"
        ],
        "fromX": 13,
        "fromY": 13,
        "toX": 16,
        "toY": 16
      },
      {
        "name": "Southern Lake",
        "description": "A large body of water at the bottom of the map, surrounded by open terrain.",
        "terrainTypes": [
          "Sea",
          "Plain",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 16,
        "toY": 16
      },
      {
        "name": "Southwestern Town",
        "description": "A bustling town located at the bottom left, featuring multiple buildings and roads.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Village",
          "Armory",
          "Vendor",
          "Bridge"
        ],
        "fromX": 0,
        "fromY": 18,
        "toX": 12,
        "toY": 22
      },
      {
        "name": "Southeastern Town",
        "description": "A lively town located at the bottom right, with various structures and pathways.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Village",
          "Armory",
          "Vendor",
          "Bridge"
        ],
        "fromX": 4,
        "fromY": 18,
        "toX": 16,
        "toY": 22
      },
      {
        "name": "Mountain Range",
        "description": "A rugged mountain area providing natural defense, located near the top right.",
        "terrainTypes": [
          "Mountain",
          "Cliff",
          "Plain"
        ],
        "fromX": 10,
        "fromY": 0,
        "toX": 16,
        "toY": 5
      }
    ],
    "keyPointsOfInterest": [
      "Northern Castle",
      "Western Village",
      "Eastern Village",
      "Southwestern Town",
      "Southeastern Town"
    ],
    "chokePoints": [
      "Central River Bridges",
      "Northern Castle Gate"
    ],
    "strategicConsiderations": [
      "Control the bridges over the Central River to manage troop movements.",
      "Utilize the Northern Castle for a defensive stronghold.",
      "Secure the villages for resources and reinforcements.",
      "The Mountain Range provides a natural barrier and vantage point."
    ],
    "givenName": "River Crossing",
    "originalName": "Knights_Villagers_Bandits_13_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic map featuring a central river with multiple bridges, surrounded by villages and a castle.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central Courtyard",
        "description": "An open area with grass and pathways, surrounded by walls. It serves as the main area for movement and engagement.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Road"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 20,
        "toY": 21
      },
      {
        "name": "Northern Gate",
        "description": "A fortified entrance with a red door, leading into the courtyard. It serves as a strategic entry point into the fortress.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 20,
        "toY": 9
      },
      {
        "name": "Western Chambers",
        "description": "Indoor rooms with stone walls, located to the west of the courtyard. These chambers provide defensive positions and house important items.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Pillar",
          "Stairs",
          "Chest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 4,
        "toY": 16
      },
      {
        "name": "Eastern Chambers",
        "description": "Indoor rooms with stone walls, located to the east of the courtyard. These chambers provide defensive positions and house important items.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Pillar",
          "Stairs"
        ],
        "fromX": 16,
        "fromY": 0,
        "toX": 20,
        "toY": 16
      },
      {
        "name": "Southern Hallway",
        "description": "A long indoor hallway with multiple rooms, located at the bottom of the map. It connects various parts of the fortress and provides strategic movement options.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Pillar",
          "Stairs",
          "Chest"
        ],
        "fromX": 0,
        "fromY": 17,
        "toX": 20,
        "toY": 21
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (10,5)",
      "Chests at (0,14), (0,16), (0,18)"
    ],
    "chokePoints": [
      "Door at (2,16)",
      "Narrow passages in the Northern Gate region"
    ],
    "strategicConsiderations": [
      "The Central Courtyard is a key area for movement and engagement, providing open space for battles.",
      "The Northern Gate serves as a strategic entry point into the fortress, making it crucial to control.",
      "Western and Eastern Chambers offer defensive positions and house important items, making them valuable for control.",
      "The Southern Hallway connects various parts of the fortress, providing strategic movement options and potential ambush points."
    ],
    "givenName": "Fortress Courtyard",
    "originalName": "Nobles_Evil_Doers_11_(3C_00_68_3E)__by_Aura_Wolf",
    "description": "A mixed indoor and outdoor map featuring a central courtyard surrounded by fortified walls and structures.",
    "setting": "mixed indoor and outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Village",
        "description": "A small village with a house and a burning building, indicating distress. It is surrounded by walls and roads, making it a strategic point for defense and control.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "Village"
        ],
        "fromX": 5,
        "fromY": 0,
        "toX": 8,
        "toY": 3
      },
      {
        "name": "Western Outpost",
        "description": "A fortified building at the top left, possibly a defensive structure. It is surrounded by walls and roads, providing a strong defensive position.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "House"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 3,
        "toY": 3
      },
      {
        "name": "Central Bridges",
        "description": "Two parallel stone bridges crossing a wide river, crucial for movement across the map. These bridges serve as chokepoints and are vital for controlling movement between the northern and southern parts of the map.",
        "terrainTypes": [
          "Road",
          "Sea",
          "Wall"
        ],
        "fromX": 7,
        "fromY": 7,
        "toX": 13,
        "toY": 12
      },
      {
        "name": "Southern Riverbank",
        "description": "The southern edge of the river, providing a natural boundary. It is a mix of plains and roads, with walls providing some defensive cover.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "Sea"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 18,
        "toY": 15
      },
      {
        "name": "Eastern Pathway",
        "description": "A path leading from the northern village towards the bridges, facilitating movement. It is primarily composed of roads and plains, allowing for quick movement across the map.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall"
        ],
        "fromX": 14,
        "fromY": 0,
        "toX": 18,
        "toY": 4
      }
    ],
    "keyPointsOfInterest": [
      "Village at (7,1)",
      "House at (1,3)",
      "Bridges at (7,7) and (8,7)"
    ],
    "chokePoints": [
      "Bridges at (7,7) and (8,7)",
      "Narrow path at (14,0) leading to the Eastern Pathway"
    ],
    "strategicConsiderations": [
      "Control the bridges to manage movement between the north and south.",
      "Defend the Northern Village to maintain control over the top right of the map.",
      "Utilize the Western Outpost for a strong defensive position.",
      "The Southern Riverbank provides a natural boundary, useful for defense."
    ],
    "givenName": "Twin Bridges of Renais",
    "originalName": "Knights_Villagers_Bandits_11_(0E_00_72_10)__by_Aura_Wolf",
    "description": "A strategic outdoor map featuring two parallel bridges over a wide river, with key structures on either side.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Fortress Entrance",
        "description": "A fortified entrance with walls and gates, providing access to the desert. It is a strategic point for controlling access to the central desert area.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Cliff",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 7,
        "toY": 4
      },
      {
        "name": "Central Desert",
        "description": "An expansive sandy area with scattered ruins and palm trees. It is the main battlefield with open spaces and some cover.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Wall",
          "Cliff",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 18,
        "toY": 14
      },
      {
        "name": "River Oasis",
        "description": "A lush area with a river and greenery, offering a stark contrast to the surrounding desert. It provides a natural barrier and a strategic point for defense.",
        "terrainTypes": [
          "Plain",
          "Lake",
          "Bridge"
        ],
        "fromX": 0,
        "fromY": 15,
        "toX": 4,
        "toY": 19
      },
      {
        "name": "Eastern Ruins",
        "description": "Ancient ruins scattered across the desert sands, providing cover and strategic points. It is a key area for ambushes and controlling the eastern side of the map.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Cliff",
          "Fort"
        ],
        "fromX": 5,
        "fromY": 0,
        "toX": 18,
        "toY": 8
      },
      {
        "name": "Southern Outpost",
        "description": "A small outpost near the bottom of the map, offering a strategic vantage point. It is crucial for controlling the southern approach to the central desert.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Cliff",
          "Forest",
          "Village"
        ],
        "fromX": 5,
        "fromY": 9,
        "toX": 18,
        "toY": 19
      }
    ],
    "keyPointsOfInterest": [
      "Fortress at (11,1) and (11,3)",
      "Armory at (0,10)",
      "Vendor at (6,11)",
      "Village at (1,18)"
    ],
    "chokePoints": [
      "Bridge at (3,15) and (4,15)",
      "Narrow passage between cliffs at (7,0) and (7,1)"
    ],
    "strategicConsiderations": [
      "Control the Fortress Entrance to limit enemy access to the central desert.",
      "Use the River Oasis as a defensive position to protect the southern flank.",
      "The Eastern Ruins provide cover for ambushes and control of the eastern side.",
      "The Southern Outpost is key for monitoring and controlling southern movements."
    ],
    "givenName": "Desert Fortress",
    "originalName": "Mages_Mercenaries_3_(42_00_43_44)__by_Aura_Wolf",
    "description": "A vast desert map featuring a fortress, scattered ruins, and a river oasis.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Homestead",
        "description": "A small building surrounded by open space, providing a strategic vantage point.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 10,
        "toY": 2
      },
      {
        "name": "Central Pathway",
        "description": "A wide open path leading through the center of the map, connecting various regions.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 3,
        "toX": 14,
        "toY": 6
      },
      {
        "name": "Eastern Village",
        "description": "A cluster of houses surrounded by trees, offering cover and strategic positioning.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "House",
          "Forest"
        ],
        "fromX": 11,
        "fromY": 0,
        "toX": 14,
        "toY": 9
      },
      {
        "name": "Southern Fortifications",
        "description": "A series of fortified structures providing defensive advantages.",
        "terrainTypes": [
          "Wall",
          "Road",
          "Plain",
          "Forest",
          "Village"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 10,
        "toY": 12
      },
      {
        "name": "Western Outpost",
        "description": "A lone building on the western edge, serving as a strategic outpost.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "House"
        ],
        "fromX": 0,
        "fromY": 8,
        "toX": 10,
        "toY": 11
      }
    ],
    "keyPointsOfInterest": [
      "Village at (3,2) and (11,1)",
      "House at (8,8)",
      "Vendor at (14,5)",
      "Armory at (14,11)"
    ],
    "chokePoints": [
      "Narrow roads between walls at (2,1) and (6,1)",
      "Roads surrounded by walls at (6,4) and (6,5)"
    ],
    "strategicConsiderations": [
      "The Northern Homestead provides a vantage point for archers.",
      "The Central Pathway allows for quick movement across the map.",
      "The Eastern Village offers cover and strategic positioning for ambushes.",
      "Southern Fortifications are ideal for defensive setups.",
      "The Western Outpost can be used to monitor enemy movements."
    ],
    "givenName": "Village Outskirts",
    "originalName": "Knights_Villagers_Bandits_6_(0E_00_72_10)__by_Aura_Wolf",
    "description": "A rural map featuring scattered buildings, open fields, and patches of forest, ideal for strategic maneuvers.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Grand Entrance",
        "description": "The main entryway with wide stairs and ornate columns, providing access to various parts of the fortress.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 12,
        "toY": 9
      },
      {
        "name": "Central Corridor",
        "description": "A long corridor connecting different parts of the fortress, with pillars providing cover.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 12,
        "toY": 6
      },
      {
        "name": "Left Chamber",
        "description": "A small room with a treasure chest, accessible from the corridor.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 2,
        "toY": 1
      },
      {
        "name": "Right Stairway",
        "description": "A stairway leading to upper levels or other sections, with multiple staircases and pillars.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar"
        ],
        "fromX": 4,
        "fromY": 0,
        "toX": 14,
        "toY": 9
      },
      {
        "name": "Southern Plains",
        "description": "Open plains with some forested areas, providing a natural boundary to the fortress.",
        "terrainTypes": [
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 16,
        "toY": 14
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (1,1)",
      "Stairs at (7,1)",
      "Stairs at (5,7)",
      "Stairs at (14,4)"
    ],
    "chokePoints": [
      "Doors at (0,7) and (1,7)",
      "Narrow passage at (7,3)"
    ],
    "strategicConsiderations": [
      "The Grand Entrance is a key defensive position with wide stairs and pillars for cover.",
      "The Central Corridor allows for quick movement between different parts of the fortress.",
      "The Left Chamber contains a treasure chest, making it a valuable target.",
      "The Right Stairway provides access to upper levels, making it a strategic point for controlling movement.",
      "The Southern Plains offer open terrain for maneuvering, but are exposed to attacks."
    ],
    "givenName": "Fortress Entrance",
    "originalName": "Knights_Villagers_Bandits_7_(18_00_48_1A)__by_Aura_Wolf",
    "description": "A fortified indoor area with a grand entrance leading to various chambers and corridors.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Village",
        "description": "A small village located in the top left, providing resources and shelter. It includes a house and is surrounded by plains and forests.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 2,
        "toY": 9
      },
      {
        "name": "Central Forest",
        "description": "Dense forest area offering cover and strategic movement options. It is surrounded by plains and hills, providing a natural barrier.",
        "terrainTypes": [
          "Forest",
          "Thicket",
          "Plain",
          "Hill"
        ],
        "fromX": 3,
        "fromY": 0,
        "toX": 18,
        "toY": 6
      },
      {
        "name": "Mountain Range",
        "description": "Imposing mountains creating a natural barrier and high ground advantage. It separates the map into distinct regions and provides a strategic vantage point.",
        "terrainTypes": [
          "Mountain",
          "Hill"
        ],
        "fromX": 6,
        "fromY": 7,
        "toX": 18,
        "toY": 12
      },
      {
        "name": "Eastern Fort",
        "description": "A fortified structure in the bottom right, serving as a defensive stronghold. It includes a gate and walls, providing a secure position.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Gate",
          "Forest"
        ],
        "fromX": 19,
        "fromY": 7,
        "toX": 23,
        "toY": 12
      },
      {
        "name": "Southern Plains",
        "description": "Open grassy area allowing for fast movement and flanking opportunities. It is located at the bottom center, providing a clear path for units to move through.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Ruins"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 18,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "House at (2,2)",
      "House at (0,9)",
      "Gate at (21,8)",
      "Ruins at (16,10)"
    ],
    "chokePoints": [
      "Mountain pass between (6,7) and (18,12)",
      "Gate at (21,8)"
    ],
    "strategicConsiderations": [
      "The Western Village provides resources and a defensive position.",
      "The Central Forest offers cover and ambush opportunities.",
      "The Mountain Range serves as a natural barrier and high ground advantage.",
      "The Eastern Fort is a strong defensive position with limited access through the gate.",
      "The Southern Plains allow for fast movement and potential flanking maneuvers."
    ],
    "givenName": "Mountain Pass Ambush",
    "originalName": "Mages_Mercenaries_2_(01_00_38_03)__by_Aura_Wolf",
    "description": "A rugged outdoor map featuring a mix of forests, mountains, and a fortified structure, ideal for strategic ambushes and defensive maneuvers.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Entrance Hall",
        "description": "The main entryway with wide steps leading into the temple. It is a large open area with multiple entrances and exits, providing access to various parts of the temple.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 8,
        "toY": 4
      },
      {
        "name": "Central Chamber",
        "description": "A large open area with decorative pillars and intricate floor patterns. It serves as the main hub of the temple, connecting to various corridors and rooms.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 17,
        "toY": 15
      },
      {
        "name": "Left Wing Corridor",
        "description": "A narrow passage leading to smaller rooms, partially collapsed. It provides access to the western parts of the temple.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 4,
        "toY": 20
      },
      {
        "name": "Right Wing Corridor",
        "description": "A mirrored passage to the left wing, leading to additional chambers. It provides access to the eastern parts of the temple.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Stairs"
        ],
        "fromX": 5,
        "fromY": 16,
        "toX": 17,
        "toY": 20
      },
      {
        "name": "Lower Sanctuary",
        "description": "A secluded area with ancient altars and relics, partially submerged. It is located at the bottom center of the temple, accessible through the central chamber.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 21,
        "toX": 17,
        "toY": 20
      }
    ],
    "keyPointsOfInterest": [
      "Chests at (12,12) and (17,2)",
      "Stairs at multiple locations for vertical movement",
      "Pillars for cover in the central chamber"
    ],
    "chokePoints": [
      "Narrow corridors in the left and right wings",
      "Stairs leading to the lower sanctuary"
    ],
    "strategicConsiderations": [
      "The central chamber is a key area for controlling movement within the temple.",
      "The narrow corridors can be used to funnel enemies and create defensive positions.",
      "The lower sanctuary is a potential ambush site due to its secluded nature."
    ],
    "givenName": "Ruined Temple",
    "originalName": "Nobles_Evil_Doers_5_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "An ancient, crumbling temple with multiple chambers and corridors, surrounded by overgrown vegetation and water channels.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Village Square",
        "description": "A small village with a few houses, providing a safe haven for travelers.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Village"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 3,
        "toY": 2
      },
      {
        "name": "Central Crossroads",
        "description": "A network of roads forming a cross, serving as the main junction for movement.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 3,
        "fromY": 0,
        "toX": 11,
        "toY": 4
      },
      {
        "name": "Fortified Outpost",
        "description": "A fortified structure offering strategic defense and control over the area.",
        "terrainTypes": [
          "Wall",
          "Ruins",
          "Floor"
        ],
        "fromX": 11,
        "fromY": 1,
        "toX": 14,
        "toY": 2
      },
      {
        "name": "Armory",
        "description": "A building stocked with weapons and supplies for warriors.",
        "terrainTypes": [
          "Wall",
          "Armory"
        ],
        "fromX": 13,
        "fromY": 6,
        "toX": 14,
        "toY": 7
      },
      {
        "name": "Riverside Path",
        "description": "A scenic path running alongside a river, offering a peaceful route.",
        "terrainTypes": [
          "Plain",
          "Lake"
        ],
        "fromX": 0,
        "fromY": 4,
        "toX": 1,
        "toY": 5
      }
    ],
    "keyPointsOfInterest": [
      "Village at (2,2)",
      "Armory at (13,7)"
    ],
    "chokePoints": [
      "Narrow road at (6,0)",
      "Wall-enclosed area at (5,5)"
    ],
    "strategicConsiderations": [
      "The Central Crossroads is crucial for movement and control.",
      "The Fortified Outpost provides a strong defensive position.",
      "The Armory is a key resource point for resupplying troops."
    ],
    "givenName": "Crossroads of Commerce",
    "originalName": "(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19",
    "description": "An outdoor map featuring a network of roads connecting various buildings, including a village, an armory, and a fort. The terrain is a mix of open plains and scattered forests, with a river running through the bottom left.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Mountain Range",
        "description": "A large impassable mountain area dominating the top center of the map, providing a natural barrier and limiting movement.",
        "terrainTypes": [
          "Mountain"
        ],
        "fromX": 5,
        "fromY": 0,
        "toX": 12,
        "toY": 5
      },
      {
        "name": "Western Fort",
        "description": "A fortified structure providing strategic defense, located near the top left. It includes ruins and walls, offering cover and a defensive position.",
        "terrainTypes": [
          "Ruins",
          "Wall",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 2,
        "toX": 4,
        "toY": 9
      },
      {
        "name": "Central Pathway",
        "description": "A winding road that cuts through the center of the map, connecting various regions. It includes plains, hills, and forests, providing both mobility and cover.",
        "terrainTypes": [
          "Plain",
          "Hill",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 6,
        "toX": 15,
        "toY": 15
      },
      {
        "name": "Eastern Village",
        "description": "A small village offering resources and shelter, situated at the top right. It is surrounded by plains and forests, providing a strategic location for gathering resources.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Village"
        ],
        "fromX": 16,
        "fromY": 0,
        "toX": 19,
        "toY": 5
      },
      {
        "name": "Southern Bridge",
        "description": "A critical bridge crossing a river, located at the bottom left. It serves as a chokepoint and a strategic crossing point over the river.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 12,
        "toX": 3,
        "toY": 15
      },
      {
        "name": "Southwestern Castle",
        "description": "A large castle providing strong defense, located at the bottom left corner. It includes walls and ruins, offering a fortified position.",
        "terrainTypes": [
          "Ruins",
          "Wall",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 3,
        "toY": 19
      },
      {
        "name": "Southeastern Fort",
        "description": "A defensive fortification near the bottom right, guarding the approach to the castle. It includes a gate and walls, providing a strong defensive position.",
        "terrainTypes": [
          "Fort",
          "Wall",
          "Plain"
        ],
        "fromX": 16,
        "fromY": 16,
        "toX": 19,
        "toY": 19
      },
      {
        "name": "Eastern Desert",
        "description": "A sandy, barren area providing a natural barrier, located at the center right. It includes cliffs and plains, limiting movement and providing a natural defense.",
        "terrainTypes": [
          "Cliff",
          "Plain"
        ],
        "fromX": 16,
        "fromY": 6,
        "toX": 19,
        "toY": 15
      }
    ],
    "keyPointsOfInterest": [
      "Western Fort",
      "Eastern Village",
      "Southern Bridge",
      "Southwestern Castle",
      "Southeastern Fort"
    ],
    "chokePoints": [
      "Southern Bridge",
      "Southeastern Fort Gate"
    ],
    "strategicConsiderations": [
      "The Northern Mountain Range provides a natural barrier, limiting movement and creating a defensive advantage.",
      "The Western Fort and Southwestern Castle offer strong defensive positions with cover and fortifications.",
      "The Central Pathway allows for mobility and quick movement between regions, but is exposed to attacks from the surrounding terrain.",
      "The Eastern Village provides resources and a strategic location for gathering and regrouping.",
      "The Southern Bridge and Southeastern Fort Gate serve as critical chokepoints, controlling access to key areas."
    ],
    "givenName": "Mountain Pass Clash",
    "originalName": "Nobles_Evil_Doers_2_(01_00_4C_03)__by_Aura_Wolf",
    "description": "A rugged outdoor map featuring a winding path through mountainous terrain, with strategic forts and villages scattered throughout.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Grand Throne Room",
        "description": "A grand room with a throne at the top, central to the map, providing a strategic defensive position.",
        "terrainTypes": [
          "Floor",
          "Throne"
        ],
        "fromX": 8,
        "fromY": 1,
        "toX": 16,
        "toY": 4
      },
      {
        "name": "Main Corridor",
        "description": "A wide corridor leading to the throne room, lined with red carpet, providing a direct path to the throne.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 8,
        "fromY": 5,
        "toX": 16,
        "toY": 18
      },
      {
        "name": "Left Chambers",
        "description": "A series of rooms on the left side, accessible from the main corridor, offering flanking opportunities.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 7,
        "toY": 18
      },
      {
        "name": "Right Chambers",
        "description": "A series of rooms on the right side, accessible from the main corridor, offering flanking opportunities.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 17,
        "fromY": 5,
        "toX": 25,
        "toY": 18
      },
      {
        "name": "Entrance Hall",
        "description": "The entrance area at the bottom, leading into the main corridor, serving as the initial entry point.",
        "terrainTypes": [
          "Floor",
          "Road"
        ],
        "fromX": 0,
        "fromY": 19,
        "toX": 25,
        "toY": 23
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (12,1)",
      "Stairs at various locations for vertical movement"
    ],
    "chokePoints": [
      "Doors at (8,4) and (16,4) leading to the throne room",
      "Doors at (6,6) and (19,6) leading to the main corridor"
    ],
    "strategicConsiderations": [
      "Defend the throne room as it is the central strategic point.",
      "Use the main corridor for direct assaults or retreats.",
      "Utilize the left and right chambers for flanking maneuvers.",
      "Control the entrance hall to manage reinforcements."
    ],
    "givenName": "Grand Throne Hall",
    "originalName": "Chapter6TheTrapIsSprung_More_Carpet__by_Shin19",
    "description": "A symmetrical indoor map featuring a central throne room surrounded by multiple chambers and corridors.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Treasure Room",
        "description": "A small, enclosed room containing a treasure chest, located in the top left corner of the map.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 2,
        "fromY": 3,
        "toX": 3,
        "toY": 3
      },
      {
        "name": "Main Corridor",
        "description": "A winding corridor connecting various parts of the fortress, running through the center of the map.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 16,
        "toY": 8
      },
      {
        "name": "Staircase Hall",
        "description": "An area with multiple staircases leading to different levels, located in the top right corner of the map.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 11,
        "fromY": 0,
        "toX": 16,
        "toY": 4
      },
      {
        "name": "Entrance Hall",
        "description": "The main entrance area with access to the outside, located in the bottom left corner of the map.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 4,
        "toX": 12,
        "toY": 8
      },
      {
        "name": "Golden Chamber",
        "description": "A distinct room with a golden floor, possibly a throne room or important meeting area, located in the center right of the map.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 4,
        "fromY": 4,
        "toX": 16,
        "toY": 8
      }
    ],
    "keyPointsOfInterest": [
      "Treasure Chest at (3,3)",
      "Multiple Staircases throughout the map"
    ],
    "chokePoints": [
      "Narrow corridors in the Main Corridor",
      "Doors at (3,1) and (3,5)"
    ],
    "strategicConsiderations": [
      "Defend the Treasure Room to protect the chest.",
      "Control the Staircase Hall to manage access to different levels.",
      "Use the narrow corridors as choke points to control enemy movement."
    ],
    "givenName": "Fortress Interior",
    "originalName": "Knights_Villagers_Bandits_9_(18_00_48_1A)__by_Aura_Wolf",
    "description": "A complex indoor map featuring narrow corridors, a central chamber, and multiple staircases leading to different levels.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Grand Throne Room",
        "description": "A large, ornate room with a central throne, symbolizing power and authority. It is a key defensive position and a primary objective for control.",
        "terrainTypes": [
          "Floor",
          "Throne"
        ],
        "fromX": 13,
        "fromY": 5,
        "toX": 15,
        "toY": 5
      },
      {
        "name": "Waterway Chambers",
        "description": "A series of chambers with water channels and treasure chests, adding strategic movement challenges. These chambers provide access to valuable resources and are crucial for controlling the map's flow.",
        "terrainTypes": [
          "Floor",
          "Lake",
          "Chest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 9,
        "toY": 8
      },
      {
        "name": "Central Passage",
        "description": "A narrow corridor connecting the main areas, crucial for movement and strategy. This passage allows for quick movement between the northern and southern parts of the map.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 10,
        "fromY": 0,
        "toX": 12,
        "toY": 19
      },
      {
        "name": "Lower Waterway",
        "description": "An intricate network of water channels and bridges, providing access to different parts of the map. This area is key for flanking maneuvers and controlling movement across the map.",
        "terrainTypes": [
          "Floor",
          "Lake",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 20,
        "toX": 12,
        "toY": 25
      },
      {
        "name": "Southern Chambers",
        "description": "A set of rooms with strategic positions and access to waterways, ideal for ambushes. These chambers offer defensive positions and control over the southern approach.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 4,
        "fromY": 7,
        "toX": 16,
        "toY": 25
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (13,5)",
      "Chests at (5,7) and (1,24)"
    ],
    "chokePoints": [
      "Narrow passage at (10,0) to (12,0)",
      "Stairs at (0,18) to (1,18)"
    ],
    "strategicConsiderations": [
      "Control the Grand Throne Room for a defensive advantage.",
      "Utilize the Waterway Chambers for resource control and strategic movement.",
      "Secure the Central Passage to maintain mobility across the map.",
      "Use the Lower Waterway for flanking and surprise attacks.",
      "Defend the Southern Chambers to control the southern approach."
    ],
    "givenName": "Ancient Throne Chambers",
    "originalName": "Nobles_Evil_Doers_1_(18_00_19_1A)__by_Aura_Wolf",
    "description": "A complex indoor map featuring a series of interconnected chambers and waterways, centered around a grand throne room.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Village",
        "description": "A small village with several houses, providing a strategic point for gathering resources.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Village"
        ],
        "fromX": 4,
        "fromY": 0,
        "toX": 10,
        "toY": 2
      },
      {
        "name": "Southern Village",
        "description": "Another village with multiple houses, mirroring the northern one, offering additional resources.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Village"
        ],
        "fromX": 4,
        "fromY": 9,
        "toX": 11,
        "toY": 10
      },
      {
        "name": "Central Bridge",
        "description": "A crucial bridge crossing the river, serving as the main connection between the north and south.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain"
        ],
        "fromX": 5,
        "fromY": 6,
        "toX": 8,
        "toY": 7
      },
      {
        "name": "Western Castle",
        "description": "A fortified castle located near the river, providing a defensive stronghold.",
        "terrainTypes": [
          "Wall",
          "Gate",
          "Plain"
        ],
        "fromX": 2,
        "fromY": 3,
        "toX": 4,
        "toY": 4
      },
      {
        "name": "Eastern Shore",
        "description": "A stretch of land along the water, offering a tactical advantage for naval maneuvers.",
        "terrainTypes": [
          "Sea",
          "Plain",
          "Cliff"
        ],
        "fromX": 12,
        "fromY": 3,
        "toX": 14,
        "toY": 7
      },
      {
        "name": "Southern Outpost",
        "description": "A small outpost near the southern village, acting as a defensive position.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Armory"
        ],
        "fromX": 4,
        "fromY": 11,
        "toX": 8,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "Villages at (10,2) and (11,10)",
      "Armory at (4,11)",
      "Vendor at (5,9)"
    ],
    "chokePoints": [
      "Bridge at (6,6) to (7,6)",
      "Gate at (3,4)"
    ],
    "strategicConsiderations": [
      "Control the bridge to maintain movement between north and south.",
      "Defend the villages to secure resources.",
      "Utilize the castle for a strong defensive position.",
      "Consider naval maneuvers along the eastern shore."
    ],
    "givenName": "River Crossing",
    "originalName": "Knights_Villagers_Bandits_2_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic map featuring a central river with a bridge, surrounded by villages and a castle.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Village",
        "description": "A small village with a few houses, providing a strategic point for resources.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "Village"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 12,
        "toY": 8
      },
      {
        "name": "Western Armory",
        "description": "A building likely containing weapons and supplies, crucial for preparation.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "Wall",
          "Armory"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 4,
        "toY": 19
      },
      {
        "name": "Central Fortress",
        "description": "A large, fortified structure with multiple entry points, serving as the main defensive position.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Door",
          "Chest",
          "Barrel"
        ],
        "fromX": 8,
        "fromY": 7,
        "toX": 15,
        "toY": 13
      },
      {
        "name": "Southern Market",
        "description": "A cluster of buildings that appear to be shops or vendors, useful for trading and supplies.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "House",
          "Vendor"
        ],
        "fromX": 4,
        "fromY": 16,
        "toX": 15,
        "toY": 19
      },
      {
        "name": "Eastern Outpost",
        "description": "A small building on the outskirts, possibly serving as a lookout or minor defensive position.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "Wall"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 15,
        "toY": 6
      }
    ],
    "keyPointsOfInterest": [
      "Village at (10,2)",
      "Armory at (3,18)",
      "House at (8,17)",
      "Vendor at (13,17)",
      "Chest at (10,8)"
    ],
    "chokePoints": [
      "Doors at (12,13) and (14,9)",
      "Narrow roads between walls at (8,6) and (8,16)"
    ],
    "strategicConsiderations": [
      "The Northern Village provides resources and a defensive position.",
      "The Western Armory is crucial for resupplying weapons.",
      "The Central Fortress is the main defensive position with multiple entry points, making it a key target for attackers.",
      "The Southern Market offers trading opportunities and additional supplies.",
      "The Eastern Outpost serves as a lookout and minor defensive position."
    ],
    "givenName": "Fortress Approach",
    "originalName": "Mages_Mercenaries_1_(0E_00_72_10)__by_Aura_Wolf",
    "description": "A strategic outdoor map featuring a central fortress surrounded by various buildings and pathways. The terrain includes forests and open fields, providing tactical opportunities for both offense and defense.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Castle Entrance",
        "description": "A fortified castle structure with a grand entrance, providing a defensive position with limited access points.",
        "terrainTypes": [
          "Wall",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 4,
        "toY": 1
      },
      {
        "name": "Central Forest",
        "description": "A dense forest area providing cover and strategic movement options, ideal for ambushes and defensive maneuvers.",
        "terrainTypes": [
          "Forest",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 2,
        "toX": 7,
        "toY": 7
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
        "fromY": 0,
        "toX": 13,
        "toY": 5
      },
      {
        "name": "Mountain Edge",
        "description": "A small mountain range providing a natural barrier, limiting movement and offering a vantage point for ranged units.",
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
        "fromY": 8,
        "toX": 9,
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
      "Defend the bridges to control movement across the river.",
      "Use the forest for ambushes and cover.",
      "The castle entrance provides a strong defensive position."
    ],
    "givenName": "Forest Crossing",
    "originalName": "(7)Ch01_Diff_Tileset__by_Shin19",
    "description": "A lush outdoor map featuring a castle, dense forests, and a river with bridges.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Throne Chamber",
        "description": "A grand room with a throne, elevated and adorned with intricate designs. It is located in the top left corner of the map, surrounded by walls, making it a defensible position.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 3,
        "fromY": 2,
        "toX": 7,
        "toY": 5
      },
      {
        "name": "Main Corridor",
        "description": "A long corridor connecting various parts of the map, with decorative tiles. It runs through the center of the map, providing access to different rooms and areas.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 12,
        "toX": 10,
        "toY": 21
      },
      {
        "name": "Stairway Hall",
        "description": "A hall with prominent staircases leading to different levels. It is located in the top right corner of the map, providing access to elevated platforms.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 11,
        "fromY": 6,
        "toX": 14,
        "toY": 15
      },
      {
        "name": "Treasure Room",
        "description": "A small room containing a chest, guarded by walls. It is located in the center left of the map, accessible through a narrow passage.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 0,
        "fromY": 20,
        "toX": 3,
        "toY": 21
      },
      {
        "name": "Side Chamber",
        "description": "A small chamber with decorative elements, possibly for meetings or rest. It is located in the bottom left corner of the map, providing a secluded area for strategic planning.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 22,
        "toX": 4,
        "toY": 28
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (3,3)",
      "Chest at (3,20)"
    ],
    "chokePoints": [
      "Narrow passage to Treasure Room at (2,20)",
      "Staircases at (4,15) and (11,11)"
    ],
    "strategicConsiderations": [
      "The Throne Chamber is a key defensive position, ideal for holding against attackers.",
      "The Main Corridor allows for quick movement across the map, but is vulnerable to ambushes.",
      "The Stairway Hall provides access to elevated positions, useful for archers or mages.",
      "The Treasure Room is a high-value target, but difficult to access due to its narrow entrance.",
      "The Side Chamber offers a safe area for regrouping or planning."
    ],
    "givenName": "Ancient Throne Room",
    "originalName": "Nobles_Evil_Doers_10_(88_00_89_8A)__by_Aura_Wolf",
    "description": "A grand indoor map featuring a throne room, corridors, and chambers, with intricate tile patterns and elevated platforms.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central Crossroads",
        "description": "The main intersection of paths surrounded by mountains, providing strategic access to various parts of the map.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill"
        ],
        "fromX": 5,
        "fromY": 5,
        "toX": 15,
        "toY": 7
      },
      {
        "name": "Northern Mountain Range",
        "description": "A series of impassable mountains dominating the northern area, acting as a natural barrier.",
        "terrainTypes": [
          "Mountain"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 19,
        "toY": 3
      },
      {
        "name": "Western Village",
        "description": "A small village nestled near the mountains, offering a strategic point for defense and supply.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 8,
        "toX": 3,
        "toY": 9
      },
      {
        "name": "Eastern Village",
        "description": "A village located near the eastern edge of the map, providing a strategic location for controlling the eastern approach.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Fort"
        ],
        "fromX": 15,
        "fromY": 8,
        "toX": 19,
        "toY": 9
      },
      {
        "name": "Southern Mountain Pass",
        "description": "A narrow path through the mountains leading south, serving as a chokepoint for movement.",
        "terrainTypes": [
          "Plain",
          "Mountain",
          "Hill"
        ],
        "fromX": 5,
        "fromY": 10,
        "toX": 15,
        "toY": 12
      },
      {
        "name": "Southwestern Coastline",
        "description": "A coastal area with water and cliffs, providing a natural boundary and potential for naval engagement.",
        "terrainTypes": [
          "Sea",
          "Cliff",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 4,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "Fort at (3,8)",
      "House at (1,8)",
      "House at (15,8)",
      "Fort at (18,5)"
    ],
    "chokePoints": [
      "Narrow path at Southern Mountain Pass",
      "Central Crossroads"
    ],
    "strategicConsiderations": [
      "Control the Central Crossroads to dominate movement across the map.",
      "Defend the villages to maintain supply lines and strategic positions.",
      "Utilize the Southern Mountain Pass as a defensive chokepoint.",
      "The Southwestern Coastline offers potential for naval support or threats."
    ],
    "givenName": "Mountain Crossroads",
    "originalName": "Knights_Villagers_Bandits_5_(01_00_38_03)__by_Aura_Wolf",
    "description": "A rugged outdoor map featuring a central crossroads surrounded by mountains and villages.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Entrance Hall",
        "description": "The starting area with wide stairs leading into the fortress, providing access to the main corridors.",
        "terrainTypes": [
          "Plain",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 3,
        "toY": 10
      },
      {
        "name": "Central Corridor",
        "description": "A long hallway connecting various rooms, filled with columns, providing strategic movement options.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 2,
        "fromY": 6,
        "toX": 8,
        "toY": 12
      },
      {
        "name": "Treasure Room",
        "description": "A secluded room containing a treasure chest, offering valuable loot.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 11,
        "fromY": 1,
        "toX": 13,
        "toY": 3
      },
      {
        "name": "Guard Post",
        "description": "A small room likely used for monitoring the corridors, providing a defensive position.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 1,
        "fromY": 1,
        "toX": 4,
        "toY": 3
      },
      {
        "name": "Inner Chamber",
        "description": "A spacious room with decorative columns, possibly a meeting area, offering strategic control of the fortress.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 4,
        "fromY": 6,
        "toX": 9,
        "toY": 10
      }
    ],
    "keyPointsOfInterest": [
      "Treasure Chest at (12,2)",
      "Stairs at (4,5) and (7,5)"
    ],
    "chokePoints": [
      "Door at (4,4)",
      "Door at (7,4)",
      "Door at (12,4)"
    ],
    "strategicConsiderations": [
      "The Entrance Hall provides a strong starting position with access to the main corridors.",
      "The Central Corridor allows for flexible movement and positioning, but is vulnerable to ambushes from the Guard Post.",
      "The Treasure Room is a high-value target but is isolated, requiring careful planning to access.",
      "The Guard Post offers a defensive advantage for controlling the Central Corridor.",
      "The Inner Chamber is a key area for controlling the fortress, with multiple access points."
    ],
    "givenName": "Fortress Labyrinth",
    "originalName": "Alusq_FE8_0A009B0C_in_the_dark__by_FEU",
    "description": "A complex indoor map with narrow corridors and multiple rooms, featuring a mix of open spaces and tight passages.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central Fortress",
        "description": "A large, ruined fortress with multiple entry points and narrow corridors. It is the main strategic point on the map, offering both defensive and offensive opportunities.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Door",
          "Stairs",
          "Pillar",
          "Chest"
        ],
        "fromX": 0,
        "fromY": 3,
        "toX": 22,
        "toY": 23
      },
      {
        "name": "Northern Lake",
        "description": "A serene lake with a small island, surrounded by forested areas. It acts as a natural barrier, limiting movement and providing a defensive advantage to those controlling the surrounding high ground.",
        "terrainTypes": [
          "Sea",
          "Cliff",
          "Forest",
          "Plain"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 22,
        "toY": 4
      },
      {
        "name": "Western Ruins",
        "description": "Scattered ruins and rocky terrain, providing strategic cover and vantage points for ranged units. The ruins are located in the northwest, offering a defensive position against advancing enemies.",
        "terrainTypes": [
          "Ruins",
          "Cliff",
          "Forest",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 16,
        "toY": 2
      },
      {
        "name": "Southern Forest",
        "description": "Dense forest area with narrow paths, ideal for ambushes and guerilla tactics. The forest provides cover and concealment for units, making it a challenging area to traverse without proper scouting.",
        "terrainTypes": [
          "Forest",
          "Plain",
          "Thicket"
        ],
        "fromX": 0,
        "fromY": 14,
        "toX": 22,
        "toY": 23
      },
      {
        "name": "Eastern Pathway",
        "description": "A clear path leading towards the fortress, flanked by trees. This pathway is crucial for moving troops quickly across the map, but is vulnerable to ambushes from the surrounding forest.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 6,
        "fromY": 0,
        "toX": 12,
        "toY": 7
      }
    ],
    "keyPointsOfInterest": [
      "Ruins at (16,1)",
      "Chest at (7,20)",
      "Stairs at (9,12) and (18,21)"
    ],
    "chokePoints": [
      "Door at (7,18)",
      "Narrow corridors within the fortress"
    ],
    "strategicConsiderations": [
      "Control of the Central Fortress is crucial for map dominance.",
      "The Northern Lake provides a natural barrier, making it difficult for enemies to advance from the north.",
      "The Western Ruins offer excellent cover and vantage points for ranged units.",
      "The Southern Forest is ideal for ambushes and requires careful navigation.",
      "The Eastern Pathway allows for rapid troop movement but is susceptible to ambushes."
    ],
    "givenName": "Ruined Fortress and Lake",
    "originalName": "Nobles_Evil_Doers_7_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "A map featuring a large ruined fortress surrounded by a lake and forested areas. The fortress is central, with a lake to the northeast and forested paths around.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Village Cluster",
        "description": "A group of villages surrounded by forests and mountains, providing resources and strategic positioning.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Mountain",
          "Village",
          "Wall",
          "House"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 8,
        "toY": 8
      },
      {
        "name": "Central River Crossing",
        "description": "A wide river with multiple bridges, serving as a crucial point for movement and control.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 15,
        "toX": 34,
        "toY": 17
      },
      {
        "name": "Eastern Castle Grounds",
        "description": "A fortified castle area with surrounding plains, offering defensive advantages.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Gate",
          "House",
          "Village",
          "Armory",
          "Vendor"
        ],
        "fromX": 9,
        "fromY": 0,
        "toX": 34,
        "toY": 8
      },
      {
        "name": "Southern Mountain Pass",
        "description": "A narrow passage through the mountains, leading to a castle, ideal for ambushes.",
        "terrainTypes": [
          "Mountain",
          "Plain",
          "Forest",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 18,
        "toX": 8,
        "toY": 34
      },
      {
        "name": "Western Bridge Approach",
        "description": "A bridge leading to the central river, flanked by forests and hills.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Bridge",
          "Hill"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 8,
        "toY": 14
      },
      {
        "name": "Southeastern Village Outskirts",
        "description": "A small village area near the river, providing access to resources and strategic positioning.",
        "terrainTypes": [
          "Plain",
          "Village",
          "Wall",
          "House",
          "Forest"
        ],
        "fromX": 9,
        "fromY": 9,
        "toX": 34,
        "toY": 34
      }
    ],
    "keyPointsOfInterest": [
      "Villages at (3,2), (20,5), (33,9)",
      "Armories at (25,4), (24,4)",
      "Forts at (8,8), (22,8), (24,8)",
      "Vendor at (26,5)"
    ],
    "chokePoints": [
      "Bridges at (23,6), (23,7), (11,16), (3,17), (27,12), (28,12), (27,13), (28,13), (26,30), (26,31)",
      "Gates at (6,6), (8,25), (28,18)"
    ],
    "strategicConsiderations": [
      "Control the Central River Crossing to manage movement across the map.",
      "Utilize the Northern Village Cluster for resource gathering and strategic positioning.",
      "Defend the Eastern Castle Grounds to maintain a strong defensive position.",
      "Use the Southern Mountain Pass for ambushes and surprise attacks.",
      "Secure the Western Bridge Approach to control access to the central river.",
      "Leverage the Southeastern Village Outskirts for additional resources and strategic positioning."
    ],
    "givenName": "Riverland Convergence",
    "originalName": "Snakey1_FE8_01003803_Many_Castles__by_FEU",
    "description": "A map featuring a central river with multiple bridges, surrounded by villages and castles. The terrain includes mountains, forests, and plains, providing strategic opportunities for movement and defense.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Grand Gate",
        "description": "The central entrance to the fortress, heavily fortified and imposing, with a large gate and defensive structures.",
        "terrainTypes": [
          "Wall",
          "Door",
          "Floor"
        ],
        "fromX": 4,
        "fromY": 6,
        "toX": 8,
        "toY": 9
      },
      {
        "name": "Left Tower",
        "description": "A symmetrical tower providing defense and vantage points, with stairs and floors for movement.",
        "terrainTypes": [
          "Wall",
          "Floor",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 2,
        "toX": 3,
        "toY": 5
      },
      {
        "name": "Right Tower",
        "description": "A symmetrical tower providing defense and vantage points, with stairs and floors for movement.",
        "terrainTypes": [
          "Wall",
          "Floor",
          "Stairs"
        ],
        "fromX": 13,
        "fromY": 2,
        "toX": 15,
        "toY": 5
      },
      {
        "name": "Outer Courtyard",
        "description": "An open area outside the fortress, leading up to the main gate, with plains and some forested areas for cover.",
        "terrainTypes": [
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 17,
        "toX": 15,
        "toY": 18
      }
    ],
    "keyPointsOfInterest": [
      "Central Gate",
      "Left Tower Stairs",
      "Right Tower Stairs"
    ],
    "chokePoints": [
      "Central Gate Doors",
      "Left Tower Stairs",
      "Right Tower Stairs"
    ],
    "strategicConsiderations": [
      "The Grand Gate serves as a major chokepoint, making it a critical area for defense.",
      "The Left and Right Towers provide vantage points and are crucial for controlling the battlefield.",
      "The Outer Courtyard offers open space for maneuvering but lacks cover, making it risky for prolonged engagements."
    ],
    "givenName": "Fortress Entrance",
    "originalName": "Alusq_FE8_3C00CE3E_afro_comb_fort__by_FEU",
    "description": "A fortified structure with a grand entrance, featuring both indoor and outdoor areas. The map is dominated by a large central gate and flanked by symmetrical towers.",
    "setting": "mixed indoor and outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Village",
        "description": "A cluster of buildings including a vendor and a house, surrounded by roads and plains. Provides a strategic point for defense and resource gathering.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "House",
          "Vendor"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 17,
        "toY": 3
      },
      {
        "name": "Central Square",
        "description": "An open area with a central building surrounded by paths, ideal for maneuvering and staging attacks.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "House",
          "Village"
        ],
        "fromX": 0,
        "fromY": 4,
        "toX": 17,
        "toY": 7
      },
      {
        "name": "Eastern Homestead",
        "description": "A small house with a red roof, isolated from other structures, providing a secluded defensive position.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "House"
        ],
        "fromX": 14,
        "fromY": 0,
        "toX": 17,
        "toY": 3
      },
      {
        "name": "Southern Fortifications",
        "description": "A series of walls and gates providing a defensive structure, crucial for holding off enemy advances from the south.",
        "terrainTypes": [
          "Wall",
          "Road",
          "Plain",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 11,
        "toX": 17,
        "toY": 14
      },
      {
        "name": "Western Residences",
        "description": "A pair of houses with distinct roofs, located near the center left, offering a strategic point for defense and ambushes.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "House"
        ],
        "fromX": 0,
        "fromY": 8,
        "toX": 13,
        "toY": 10
      }
    ],
    "keyPointsOfInterest": [
      "Vendor at (16,3)",
      "Armory at (2,2)",
      "House at (11,4)",
      "Village at (6,5)",
      "House at (2,8)"
    ],
    "chokePoints": [
      "Narrow road at (6,0) to (7,0)",
      "Wall and road intersection at (10,3)",
      "Stairs at (6,13) and (7,13)"
    ],
    "strategicConsiderations": [
      "Defend the Northern Village to control resources and maintain a strong defensive position.",
      "Utilize the Central Square for maneuverability and staging attacks.",
      "Secure the Southern Fortifications to prevent enemy advances from the south.",
      "Use the Western Residences for ambushes and defensive strategies."
    ],
    "givenName": "Village Outskirts",
    "originalName": "Knights_Villagers_Bandits_3_(0E_00_72_10)__by_Aura_Wolf",
    "description": "A rural map featuring a cluster of buildings surrounded by open fields and a fortified wall to the south.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Throne Room",
        "description": "A grand room with a throne, symbolizing power and authority. It is located in the top right corner of the map and serves as a key strategic point.",
        "terrainTypes": [
          "Floor",
          "Throne"
        ],
        "fromX": 13,
        "fromY": 3,
        "toX": 16,
        "toY": 4
      },
      {
        "name": "Treasure Room",
        "description": "A secure room containing a valuable chest, located in the center left of the map. It is a key target for looting.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 3,
        "fromY": 7,
        "toX": 5,
        "toY": 7
      },
      {
        "name": "Main Corridor",
        "description": "A wide corridor connecting different parts of the map, providing strategic movement options.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 7,
        "fromY": 2,
        "toX": 11,
        "toY": 5
      },
      {
        "name": "Side Hallway",
        "description": "A narrow passage leading to various rooms, located in the top left of the map. It provides access to the treasure room and other areas.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 3,
        "toY": 4
      },
      {
        "name": "Entrance Hall",
        "description": "The initial area providing access to the main sections of the map, located at the bottom center. It serves as the main entry point for units.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 5,
        "fromY": 10,
        "toX": 9,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (15,3)",
      "Chest at (4,7)"
    ],
    "chokePoints": [
      "Door at (6,7)",
      "Narrow passage at (2,3)"
    ],
    "strategicConsiderations": [
      "The throne room is a key defensive position.",
      "The treasure room is a high-value target for looting.",
      "The main corridor allows for strategic movement and flanking.",
      "The side hallway provides access to multiple areas, useful for ambushes.",
      "The entrance hall is the main entry point, crucial for initial positioning."
    ],
    "givenName": "Royal Chamber",
    "originalName": "Knights_Villagers_Bandits_8_(18_00_19_1A)__by_Aura_Wolf",
    "description": "An ornate indoor map featuring a throne room, treasure room, and various corridors, designed for strategic battles.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Castle",
        "description": "A large castle with fortified walls, serving as the central stronghold. It is surrounded by cliffs and walls, making it a defensible position.",
        "terrainTypes": [
          "Wall",
          "Gate",
          "Fort",
          "Plain",
          "Cliff"
        ],
        "fromX": 3,
        "fromY": 0,
        "toX": 5,
        "toY": 2
      },
      {
        "name": "Western City",
        "description": "A bustling city with multiple buildings and roads leading outwards. It includes a village and several houses, providing resources and strategic points.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Village"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 4,
        "toY": 14
      },
      {
        "name": "Eastern City",
        "description": "Another large city, mirroring the western one, with roads and buildings. It includes a village and several houses, providing resources and strategic points.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Village"
        ],
        "fromX": 11,
        "fromY": 6,
        "toX": 14,
        "toY": 10
      },
      {
        "name": "Central Village",
        "description": "A small village located between the two cities, connected by roads. It serves as a strategic point for movement and control.",
        "terrainTypes": [
          "Plain",
          "Village"
        ],
        "fromX": 4,
        "fromY": 8,
        "toX": 12,
        "toY": 11
      },
      {
        "name": "Mountain Pass",
        "description": "A rugged mountain area with a cave entrance, providing a natural barrier. It is surrounded by cliffs and mountains, making it difficult to traverse.",
        "terrainTypes": [
          "Mountain",
          "Cliff",
          "Hill"
        ],
        "fromX": 11,
        "fromY": 0,
        "toX": 14,
        "toY": 3
      },
      {
        "name": "Southern Village",
        "description": "A quaint village near the southern edge of the map, connected by a road. It provides a strategic point for movement and control.",
        "terrainTypes": [
          "Plain",
          "Village"
        ],
        "fromX": 4,
        "fromY": 11,
        "toX": 12,
        "toY": 14
      },
      {
        "name": "Forest Outskirts",
        "description": "Scattered forests surrounding the main roads and cities, offering cover and resources. They provide natural barriers and strategic points for ambushes.",
        "terrainTypes": [
          "Forest",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 10,
        "toY": 8
      }
    ],
    "keyPointsOfInterest": [
      "Northern Castle",
      "Western City",
      "Eastern City",
      "Central Village",
      "Mountain Pass",
      "Southern Village"
    ],
    "chokePoints": [
      "Gate at Northern Castle",
      "Mountain Pass"
    ],
    "strategicConsiderations": [
      "The Northern Castle is a strong defensive position due to its walls and surrounding cliffs.",
      "The Western and Eastern Cities provide resources and strategic points for control.",
      "The Central Village serves as a key point for movement between the cities.",
      "The Mountain Pass is a natural barrier, difficult to traverse, and can be used to control access.",
      "The Southern Village provides a strategic point for movement and control.",
      "The Forest Outskirts offer cover and opportunities for ambushes."
    ],
    "givenName": "Twin Cities and Castle",
    "originalName": "Knights_Villagers_Bandits_1_(01_00_02_03)__by_Aura_Wolf",
    "description": "A map featuring two prominent cities connected by roads, with a central castle and surrounding villages. The terrain includes forests, mountains, and a cave.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northwest Village and Surroundings",
        "description": "A small village located in the northwest, surrounded by plains and forests, accessible by a bridge. Provides a strategic point for gathering resources and launching attacks.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Village",
          "Bridge"
        ],
        "fromX": 0,
        "fromY": 8,
        "toX": 3,
        "toY": 9
      },
      {
        "name": "Northeast Village and Surroundings",
        "description": "A village in the northeast, surrounded by plains and forests, connected by a bridge over the river. Offers a strategic position for defense and resource gathering.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Village",
          "Bridge"
        ],
        "fromX": 15,
        "fromY": 4,
        "toX": 17,
        "toY": 8
      },
      {
        "name": "Southwest Village and Armory",
        "description": "A village in the southwest corner, near a bridge crossing, with an armory nearby. Provides a strategic point for resupplying and launching attacks.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Village",
          "Bridge",
          "Armory"
        ],
        "fromX": 0,
        "fromY": 8,
        "toX": 3,
        "toY": 19
      },
      {
        "name": "Southern Fort and Surroundings",
        "description": "A small fort located south of the central castle, providing strategic defense. Surrounded by plains and forests, offering a strong defensive position.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 5,
        "fromY": 14,
        "toX": 12,
        "toY": 20
      },
      {
        "name": "Central Castle and River",
        "description": "A fortified castle located at the heart of the map, surrounded by rivers and cliffs. Provides a strong defensive position and control over the central area.",
        "terrainTypes": [
          "Plain",
          "Cliff",
          "Wall",
          "Gate",
          "River",
          "Bridge"
        ],
        "fromX": 10,
        "fromY": 11,
        "toX": 12,
        "toY": 12
      },
      {
        "name": "Western Bridge and Surroundings",
        "description": "A bridge connecting the western part of the map, facilitating movement across the river. Surrounded by plains and cliffs, offering a strategic point for controlling movement.",
        "terrainTypes": [
          "Plain",
          "Cliff",
          "Bridge"
        ],
        "fromX": 0,
        "fromY": 15,
        "toX": 4,
        "toY": 18
      },
      {
        "name": "Eastern Bridge and Surroundings",
        "description": "A bridge on the eastern side, linking the northeast village to the central area. Surrounded by plains and cliffs, providing a strategic point for controlling movement.",
        "terrainTypes": [
          "Plain",
          "Cliff",
          "Bridge"
        ],
        "fromX": 15,
        "fromY": 8,
        "toX": 20,
        "toY": 9
      }
    ],
    "keyPointsOfInterest": [
      "Northwest Village",
      "Northeast Village",
      "Southwest Village",
      "Southern Fort",
      "Central Castle"
    ],
    "chokePoints": [
      "Western Bridge",
      "Eastern Bridge",
      "Central Castle Gate"
    ],
    "strategicConsiderations": [
      "Control the bridges to manage movement across the map.",
      "Defend the villages to maintain resource flow.",
      "Utilize the central castle for a strong defensive position.",
      "Use the southern fort to protect the southern approach."
    ],
    "givenName": "Riverland Crossroads",
    "originalName": "Mages_Mercenaries_4_(01_00_02_03)__by_Aura_Wolf",
    "description": "A map featuring a network of rivers and bridges connecting various strategic points, including villages and a central castle.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Fortress Entrance",
        "description": "The main entrance to the fortress, heavily fortified with walls and pillars, providing a strong defensive position.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Pillar"
        ],
        "fromX": 6,
        "fromY": 0,
        "toX": 15,
        "toY": 1
      },
      {
        "name": "Fortress Courtyard",
        "description": "An open area within the fortress walls, leading to the entrance. Contains stairs and pillars for strategic movement and cover.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Pillar",
          "Stairs"
        ],
        "fromX": 9,
        "fromY": 2,
        "toX": 15,
        "toY": 7
      },
      {
        "name": "River Crossing",
        "description": "A bridge over the river, crucial for movement between areas. Provides a chokepoint for controlling access across the map.",
        "terrainTypes": [
          "Road",
          "Bridge",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 2,
        "toX": 3,
        "toY": 3
      },
      {
        "name": "Village Outskirts",
        "description": "A small village area with buildings, providing resources and a fort for defense.",
        "terrainTypes": [
          "Road",
          "Village",
          "Fort",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 12,
        "toY": 11
      },
      {
        "name": "Riverbank",
        "description": "The winding river that separates the village from the fortress, with cliffs and sea providing natural barriers.",
        "terrainTypes": [
          "Cliff",
          "Sea",
          "Forest",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 6,
        "toX": 7,
        "toY": 9
      },
      {
        "name": "Fortified Outpost",
        "description": "A small fortification near the fortress, offering strategic advantage with stairs and walls for defense.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Stairs"
        ],
        "fromX": 12,
        "fromY": 8,
        "toX": 15,
        "toY": 11
      }
    ],
    "keyPointsOfInterest": [
      "Bridge at (0,2)",
      "Village at (2,10)",
      "Fort at (12,10)"
    ],
    "chokePoints": [
      "Bridge at (0,2)",
      "Stairs at (12,7)"
    ],
    "strategicConsiderations": [
      "Control the bridge to manage movement between the village and fortress.",
      "Utilize the fortress walls and pillars for defensive advantage.",
      "The village provides resources and a defensive position with the fort.",
      "The riverbank and cliffs create natural barriers, limiting movement options."
    ],
    "givenName": "Fortress Riverfront",
    "originalName": "Nobles_Evil_Doers_4_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "A strategic map featuring a fortress by a river, with a village and a bridge crossing.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Castle",
        "description": "A large castle with red rooftops, serving as a stronghold. It is located in the bottom left of the map and is surrounded by walls and a gate, providing a defensive advantage.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Gate",
          "Fort",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 9,
        "toY": 10
      },
      {
        "name": "Central River",
        "description": "A river running vertically through the map, with a bridge crossing it. This region acts as a natural barrier and a strategic chokepoint for controlling movement across the map.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Forest"
        ],
        "fromX": 8,
        "fromY": 0,
        "toX": 11,
        "toY": 7
      },
      {
        "name": "Eastern Fortress",
        "description": "A fortified structure with high walls, located near the mountains. It provides a strong defensive position and is surrounded by cliffs and mountains.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Fort",
          "Cliff",
          "Mountain"
        ],
        "fromX": 18,
        "fromY": 0,
        "toX": 23,
        "toY": 5
      },
      {
        "name": "Northern Villages",
        "description": "A cluster of small villages surrounded by forests, providing cover and strategic positioning for ambushes or defense.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 7,
        "toY": 4
      },
      {
        "name": "Southern Plains",
        "description": "Open plains with scattered trees and a few villages, offering mobility and space for large-scale battles.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House"
        ],
        "fromX": 0,
        "fromY": 11,
        "toX": 23,
        "toY": 12
      },
      {
        "name": "Mountain Range",
        "description": "A rugged mountain range providing a natural barrier, limiting movement and offering high ground advantage.",
        "terrainTypes": [
          "Mountain",
          "Cliff",
          "Plain"
        ],
        "fromX": 16,
        "fromY": 0,
        "toX": 23,
        "toY": 1
      }
    ],
    "keyPointsOfInterest": [
      "Western Castle",
      "Central River Bridge",
      "Eastern Fortress",
      "Northern Villages",
      "Southern Plains",
      "Mountain Range"
    ],
    "chokePoints": [
      "Central River Bridge",
      "Western Castle Gate",
      "Eastern Fortress Walls"
    ],
    "strategicConsiderations": [
      "Control the Central River Bridge to manage movement across the map.",
      "Utilize the Western Castle for a strong defensive position.",
      "The Eastern Fortress offers a fortified position near the mountains, ideal for defense.",
      "The Northern Villages provide cover and opportunities for ambushes.",
      "The Southern Plains allow for open battles with room for maneuvering.",
      "The Mountain Range limits movement but offers high ground advantage."
    ],
    "givenName": "River Crossing Battle",
    "originalName": "Nobles_Evil_Doers_3_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic map featuring a central river with a bridge, surrounded by castles and villages. The terrain includes forests and mountains, providing tactical advantages.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Fortress",
        "description": "A large fortress at the top of the map, serving as a stronghold with strategic defensive positions.",
        "terrainTypes": [
          "Wall",
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 10,
        "toY": 2
      },
      {
        "name": "Western Village",
        "description": "A small village with several buildings, providing resources and cover for units.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Village",
          "House"
        ],
        "fromX": 0,
        "fromY": 3,
        "toX": 3,
        "toY": 8
      },
      {
        "name": "Eastern Village",
        "description": "A small village with several buildings, providing resources and cover for units.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Village",
          "House"
        ],
        "fromX": 11,
        "fromY": 12,
        "toX": 14,
        "toY": 14
      },
      {
        "name": "Central Lake",
        "description": "A large body of water dominating the center of the map, acting as a natural barrier.",
        "terrainTypes": [
          "Sea",
          "Plain"
        ],
        "fromX": 9,
        "fromY": 6,
        "toX": 14,
        "toY": 9
      },
      {
        "name": "Southern Fortress",
        "description": "A large fortress at the bottom of the map, serving as a stronghold with strategic defensive positions.",
        "terrainTypes": [
          "Wall",
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 12,
        "toX": 10,
        "toY": 16
      },
      {
        "name": "Mountain Pass",
        "description": "A rugged area with mountains, providing a natural barrier and a strategic chokepoint.",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 14,
        "toX": 3,
        "toY": 16
      },
      {
        "name": "Winding Path",
        "description": "A winding path connecting the northern and southern fortresses, passing through villages and around the lake.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Cliff",
          "Fort"
        ],
        "fromX": 4,
        "fromY": 3,
        "toX": 8,
        "toY": 11
      }
    ],
    "keyPointsOfInterest": [
      "Northern Fortress",
      "Western Village",
      "Eastern Village",
      "Central Lake",
      "Southern Fortress"
    ],
    "chokePoints": [
      "Mountain Pass",
      "Winding Path"
    ],
    "strategicConsiderations": [
      "The Northern and Southern Fortresses serve as strongholds and are key defensive positions.",
      "The Central Lake acts as a natural barrier, forcing units to navigate around it.",
      "The Mountain Pass provides a strategic chokepoint, limiting movement and providing defensive advantages.",
      "The Winding Path connects key areas and is crucial for movement between the fortresses and villages."
    ],
    "givenName": "Twin Fortresses Pathway",
    "originalName": "Knights_Villagers_Bandits_12_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic outdoor map featuring two fortresses connected by a winding path, with a central lake and surrounding villages.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central Waterway",
        "description": "A wide water channel running horizontally through the center of the map, acting as a natural barrier and strategic point for controlling movement across the map.",
        "terrainTypes": [
          "Sea",
          "Lake",
          "Bridge"
        ],
        "fromX": 11,
        "fromY": 16,
        "toX": 17,
        "toY": 16
      },
      {
        "name": "Northern Chambers",
        "description": "A series of enclosed rooms and corridors with limited access points, ideal for defensive positioning and ambushes.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 31,
        "toY": 15
      },
      {
        "name": "Southern Passage",
        "description": "A narrow path running parallel to the central waterway, providing access to the lower sections and potential flanking routes.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 17,
        "toX": 31,
        "toY": 25
      },
      {
        "name": "Eastern Reservoir",
        "description": "A large water-filled area with stone platforms, located at the far right of the map, offering a strategic vantage point and control over the waterway.",
        "terrainTypes": [
          "Sea",
          "Lake",
          "Wall"
        ],
        "fromX": 25,
        "fromY": 12,
        "toX": 31,
        "toY": 25
      },
      {
        "name": "Western Alcoves",
        "description": "Small, enclosed spaces with limited access, located at the far left of the map, suitable for hiding units or setting up defensive positions.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 7,
        "toY": 25
      }
    ],
    "keyPointsOfInterest": [
      "Bridge at (15,16) and (16,16)",
      "Stairs scattered throughout the map",
      "Pillars providing cover in various rooms"
    ],
    "chokePoints": [
      "Bridge over the central waterway",
      "Narrow corridors in the Northern Chambers",
      "Limited access points in the Western Alcoves"
    ],
    "strategicConsiderations": [
      "Control the bridge to dominate movement across the map",
      "Utilize the Northern Chambers for defensive setups",
      "Use the Southern Passage for flanking maneuvers",
      "Secure the Eastern Reservoir for a strategic vantage point",
      "Defend the Western Alcoves to prevent enemy infiltration"
    ],
    "givenName": "Ancient Aqueduct",
    "originalName": "Nobles_Evil_Doers_8_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "A complex indoor map featuring a network of waterways and stone structures, creating a maze-like environment.",
    "setting": "indoor"
  }
];