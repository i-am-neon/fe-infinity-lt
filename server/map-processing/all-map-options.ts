import { MapMetadata } from "@/types/maps/map-metadata.ts";

  export const allMapOptions: MapMetadata[] = [
  {
    "distinctRegions": [
      {
        "name": "Fortress Interior",
        "description": "The inner area of the fortress containing the throne room and stairs, heavily fortified and ideal for defense.",
        "terrainTypes": [
          "Floor",
          "Throne",
          "Stairs",
          "Wall"
        ],
        "fromX": 2,
        "fromY": 0,
        "toX": 8,
        "toY": 4
      },
      {
        "name": "Northern Plains",
        "description": "Open plains north of the fortress, providing clear movement but limited cover.",
        "terrainTypes": [
          "Plain",
          "Road"
        ],
        "fromX": 8,
        "fromY": 2,
        "toX": 15,
        "toY": 6
      },
      {
        "name": "Central Roadway",
        "description": "A major road connecting various strategic points, facilitating rapid troop movement.",
        "terrainTypes": [
          "Road",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 20,
        "toY": 8
      },
      {
        "name": "Merchant's Row",
        "description": "A commercial area with vendors and armories, crucial for resupply and trade.",
        "terrainTypes": [
          "Vendor",
          "Armory",
          "Road",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 20,
        "toY": 12
      },
      {
        "name": "Village Square",
        "description": "Central village area with multiple houses, providing cover and strategic positioning.",
        "terrainTypes": [
          "Village",
          "Road",
          "Wall"
        ],
        "fromX": 12,
        "fromY": 14,
        "toX": 20,
        "toY": 18
      },
      {
        "name": "Training Grounds",
        "description": "An open area with an arena, ideal for training and skirmishes.",
        "terrainTypes": [
          "Arena",
          "Road",
          "Forest"
        ],
        "fromX": 5,
        "fromY": 16,
        "toX": 16,
        "toY": 19
      },
      {
        "name": "Forest Path",
        "description": "A narrow path through dense trees, offering concealment and ambush potential.",
        "terrainTypes": [
          "Forest",
          "Road",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 19,
        "toX": 11,
        "toY": 22
      },
      {
        "name": "Southern Village",
        "description": "A small village area at the southern edge, providing additional strategic points.",
        "terrainTypes": [
          "Village",
          "Road",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 23,
        "toX": 15,
        "toY": 25
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (5,1)",
      "Armories at (14,10) and (19,11)",
      "Vendors at (2,12)",
      "Arena at (6,16)",
      "Villages at (15,15), (19,15), (13,18), (1,18), (13,24), (1,24), (15,21), (19,21)"
    ],
    "chokePoints": [
      "Fortress Gate at (4,8) and (5,8)",
      "Door at (17,3)",
      "Narrow roads near Merchant's Row and Village Square"
    ],
    "strategicConsiderations": [
      "Fortress Interior is highly defensible; controlling it is crucial for victory.",
      "Central Roadway allows rapid troop movement but is vulnerable to ambushes.",
      "Merchant's Row provides essential resources; securing it early can offer significant advantages.",
      "Village Square and Southern Village offer cover and strategic positioning for both offense and defense.",
      "Forest Path is ideal for ambushes and guerrilla tactics, especially for units with high mobility."
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
        "description": "A secluded room containing a valuable chest, accessible through a door at the north.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 1,
        "fromY": 0,
        "toX": 3,
        "toY": 3
      },
      {
        "name": "Central Pillar Hall",
        "description": "A large central hall with pillars providing cover and strategic positioning.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 4,
        "toX": 17,
        "toY": 6
      },
      {
        "name": "Eastern Corridor",
        "description": "A narrow corridor on the eastern side, providing limited mobility and strategic chokepoints.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 15,
        "toY": 7
      },
      {
        "name": "Southern Staircase",
        "description": "A staircase area in the southwest, potentially allowing reinforcements to enter.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 11,
        "toX": 4,
        "toY": 13
      },
      {
        "name": "Entrance Archway",
        "description": "The main entrance area with a large arch, providing initial deployment and entry point.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 5,
        "fromY": 11,
        "toX": 17,
        "toY": 13
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (2,2)",
      "Door at (2,0)",
      "Stairs at (2,11)-(4,11)"
    ],
    "chokePoints": [
      "Door at (2,0)",
      "Narrow Eastern Corridor (13,0)-(15,7)",
      "Central Pillar Hall (pillars at (7,5) and (13,5))"
    ],
    "strategicConsiderations": [
      "The Treasure Chamber is isolated and can be easily defended or trapped.",
      "Central Pillar Hall provides cover and is ideal for defensive positioning.",
      "Eastern Corridor is narrow and can be used to funnel enemy units.",
      "Southern Staircase may introduce reinforcements, requiring vigilance.",
      "Entrance Archway serves as the main entry point, crucial for initial positioning and control."
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
        "description": "A large, open room with multiple entrances, pillars for cover, and stairs for vertical mobility. Acts as the main hub of the map.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 19,
        "toY": 7
      },
      {
        "name": "Left Wing Corridors",
        "description": "Narrow corridors and small rooms with walls and pillars providing strategic cover and limited movement options.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 9
      },
      {
        "name": "Right Wing Corridors",
        "description": "Mirrored layout of the Left Wing, featuring narrow corridors, small rooms, and strategic cover.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Pillar"
        ],
        "fromX": 20,
        "fromY": 0,
        "toX": 26,
        "toY": 9
      },
      {
        "name": "Lower Hall",
        "description": "A long corridor connecting the central chamber to the bottom of the map, with limited access points and stairs for vertical movement.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 26,
        "toY": 11
      },
      {
        "name": "Upper Staircase Area",
        "description": "An elevated area with multiple staircases providing vertical mobility and strategic positioning.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 9,
        "fromY": 2,
        "toX": 25,
        "toY": 4
      }
    ],
    "keyPointsOfInterest": [
      "Multiple staircases for vertical mobility",
      "Pillars providing strategic cover",
      "Central Chamber as a main hub"
    ],
    "chokePoints": [
      "Narrow corridors in Left and Right Wings",
      "Limited access points to Lower Hall",
      "Staircase entrances and exits"
    ],
    "strategicConsiderations": [
      "Control of the Central Chamber is crucial for map dominance.",
      "Utilize pillars and narrow corridors for defensive positioning.",
      "Vertical mobility via staircases can provide tactical advantages and surprise attacks.",
      "Careful management of choke points can restrict enemy movement and control engagements."
    ],
    "givenName": "Ancient Ruins",
    "originalName": "Nobles_Evil_Doers_6_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "A complex indoor map featuring multiple enclosed rooms and narrow corridors, surrounded by impassable terrain and water.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Village Area",
        "description": "A village area with houses, an armory, and a vendor, providing resources and shelter. Important for resupply and defense.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Village",
          "Vendor",
          "Armory",
          "House"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 5,
        "toY": 11
      },
      {
        "name": "Eastern Castle Grounds",
        "description": "A fortified castle area with walls and a gate, providing a strong defensive position and strategic control.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Wall",
          "Gate",
          "House",
          "Fort"
        ],
        "fromX": 14,
        "fromY": 4,
        "toX": 18,
        "toY": 11
      },
      {
        "name": "Central Mountain Range",
        "description": "A large impassable mountain range dividing the map, creating strategic choke points and limiting mobility.",
        "terrainTypes": [
          "Mountain",
          "Hill"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 12,
        "toY": 9
      },
      {
        "name": "Northern Fort Area",
        "description": "A small fort providing a defensive position and control over the northern approach, surrounded by plains and forests.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 4
      },
      {
        "name": "Southern Road",
        "description": "A winding road through the southern part of the map, connecting the western village and eastern castle, important for troop movement.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill"
        ],
        "fromX": 6,
        "fromY": 9,
        "toX": 13,
        "toY": 11
      },
      {
        "name": "Western Fort Area",
        "description": "A fort located near the western village, offering additional defense and strategic positioning.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 5,
        "fromY": 1,
        "toX": 6,
        "toY": 2
      }
    ],
    "keyPointsOfInterest": [
      "Western Village at (2,7)",
      "Eastern Castle Gate at (16,6)",
      "Northern Fort at (5,1)",
      "Western Fort at (5,1)",
      "Vendor at (4,9)",
      "Armory at (1,10)",
      "Houses at (5,11), (16,9), (5,11), (14,11)"
    ],
    "chokePoints": [
      "Eastern Castle Gate at (16,6)",
      "Mountain passes around central mountain range"
    ],
    "strategicConsiderations": [
      "Control of the central mountain range is crucial for limiting enemy movement and creating choke points.",
      "Securing the western village and eastern castle provides essential resources and defensive positions.",
      "The southern road is vital for rapid troop deployment and reinforcement between key locations.",
      "Utilize forts for defensive bonuses and to control key approaches."
    ],
    "givenName": "Mountain Pass Siege",
    "originalName": "Knights_Villagers_Bandits_4_(01_00_38_03)__by_Aura_Wolf",
    "description": "A strategic outdoor map featuring a central mountain range dividing the battlefield, with villages and a castle on either side.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Throne Room",
        "description": "A grand room with a throne, indicating the seat of power. Highly defensible and strategically important.",
        "terrainTypes": [
          "Floor",
          "Throne",
          "Pillar"
        ],
        "fromX": 5,
        "fromY": 1,
        "toX": 21,
        "toY": 6
      },
      {
        "name": "Dining Hall",
        "description": "A spacious room with pillars, suitable for gatherings or strategic positioning.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 16,
        "fromY": 1,
        "toX": 24,
        "toY": 6
      },
      {
        "name": "Treasure Vault",
        "description": "A secure area with multiple treasure chests, valuable for acquiring resources.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 25,
        "fromY": 3,
        "toX": 28,
        "toY": 8
      },
      {
        "name": "Maze Corridors",
        "description": "Complex network of corridors connecting various rooms, ideal for ambushes and defensive maneuvers.",
        "terrainTypes": [
          "Floor",
          "Door"
        ],
        "fromX": 7,
        "fromY": 7,
        "toX": 24,
        "toY": 14
      },
      {
        "name": "Left Treasure Room",
        "description": "A small, isolated room containing a treasure chest, accessible through a locked door.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Door"
        ],
        "fromX": 4,
        "fromY": 19,
        "toX": 9,
        "toY": 23
      },
      {
        "name": "Entrance Hall",
        "description": "The main entrance to the fortress, flanked by towers and stairs, crucial for controlling access.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 9,
        "fromY": 18,
        "toX": 21,
        "toY": 25
      },
      {
        "name": "Southern Defensive Perimeter",
        "description": "A heavily fortified area with cliffs and walls, providing strong defensive positions.",
        "terrainTypes": [
          "Wall",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 25,
        "toX": 24,
        "toY": 31
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (9,1)",
      "Multiple treasure chests at (5,20), (5,23), (26,4), (26,6), (27,8), (26,12)",
      "Main entrance stairs at (11,25), (12,25), (18,0), (19,0)",
      "Locked doors at (7,20), (24,5), (26,10), (27,14)"
    ],
    "chokePoints": [
      "Doors at (7,20), (24,5), (26,10), (27,14)",
      "Corridors in Maze Corridors region"
    ],
    "strategicConsiderations": [
      "Control of the Throne Room is crucial for victory.",
      "Treasure Vault and Left Treasure Room contain valuable resources; securing them early can provide significant advantages.",
      "Maze Corridors offer opportunities for ambushes and defensive setups; controlling these corridors can restrict enemy movement.",
      "Entrance Hall is vital for controlling reinforcements and retreat paths; maintaining control here is essential for both offense and defense.",
      "Southern Defensive Perimeter provides strong defensive positions; use cliffs and walls to your advantage."
    ],
    "givenName": "Labyrinthine Fortress",
    "originalName": "Chapter12TheTrueEnemy_Fire_tileset_Minor_Changes__by_Shin19",
    "description": "A complex indoor fortress with winding corridors and multiple treasure rooms.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "North Fortress Interior",
        "description": "A large indoor area with pillars and stairs, providing defensive positions and multiple entry points.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Chest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 16,
        "toY": 4
      },
      {
        "name": "East Fortress Treasure Room",
        "description": "A small enclosed room containing a valuable chest, accessible through a door.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Door"
        ],
        "fromX": 17,
        "fromY": 8,
        "toX": 19,
        "toY": 12
      },
      {
        "name": "Central Courtyard",
        "description": "An open area with plains, forests, and roads, ideal for open combat and maneuvering.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Road",
          "Hill"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 19,
        "toY": 13
      },
      {
        "name": "South Pathway",
        "description": "A narrow pathway with stairs and pillars, providing strategic chokepoints and access to the southern edge.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar",
          "Road"
        ],
        "fromX": 0,
        "fromY": 14,
        "toX": 19,
        "toY": 17
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (1,1) in North Fortress Interior",
      "Chest at (19,10) in East Fortress Treasure Room",
      "Multiple stairs providing access between different elevations"
    ],
    "chokePoints": [
      "Door at (19,12) leading to East Fortress Treasure Room",
      "Narrow pathways and stairs in South Pathway"
    ],
    "strategicConsiderations": [
      "Control of the North Fortress Interior provides defensive advantages and access to valuable items.",
      "Securing the East Fortress Treasure Room early can provide a significant advantage due to the chest.",
      "The Central Courtyard offers open combat opportunities but requires careful positioning due to scattered forests and hills.",
      "The South Pathway's narrow passages and stairs can be effectively used to control enemy movement and create defensive chokepoints."
    ],
    "givenName": "Fortress Courtyard",
    "originalName": "Knights_Villagers_Bandits_10_(3C_00_CE_3E)__by_Aura_Wolf",
    "description": "An outdoor map featuring a central courtyard surrounded by fortress walls and buildings. The area is dotted with trees and has a mix of open spaces and narrow pathways.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Castle Stronghold",
        "description": "A heavily fortified castle at the northern edge, surrounded by walls and mountains, providing excellent defensive capabilities.",
        "terrainTypes": [
          "Wall",
          "Gate",
          "Mountain",
          "Hill",
          "Plain",
          "Fort"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 16,
        "toY": 4
      },
      {
        "name": "Central River Crossing",
        "description": "A strategic river running horizontally across the map, featuring multiple bridges and forts, crucial for controlling movement.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Fort",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 16,
        "toY": 11
      },
      {
        "name": "Western Village Area",
        "description": "A small village area on the western side, providing resources and shelter, surrounded by forests and plains.",
        "terrainTypes": [
          "House",
          "Plain",
          "Forest",
          "River"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 4,
        "toY": 4
      },
      {
        "name": "Eastern Village Area",
        "description": "A small village area on the eastern side, offering supplies and refuge, surrounded by plains and forests.",
        "terrainTypes": [
          "House",
          "Plain",
          "Forest",
          "River"
        ],
        "fromX": 13,
        "fromY": 18,
        "toX": 16,
        "toY": 22
      },
      {
        "name": "Southern Coastal Region",
        "description": "A large coastal area at the southern edge, featuring cliffs, sea, and open plains, providing limited mobility and strategic positioning.",
        "terrainTypes": [
          "Sea",
          "Cliff",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 16,
        "toY": 17
      },
      {
        "name": "Southwestern Town",
        "description": "A bustling town in the southwest, featuring multiple buildings including an armory, vendor, and village, connected by roads and bridges.",
        "terrainTypes": [
          "Village",
          "Armory",
          "Vendor",
          "Wall",
          "Bridge",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 18,
        "toX": 12,
        "toY": 22
      },
      {
        "name": "Southeastern Town",
        "description": "A lively town in the southeast, with various structures including an armory, vendor, and houses, connected by roads and bridges.",
        "terrainTypes": [
          "Village",
          "Armory",
          "Vendor",
          "Wall",
          "Bridge",
          "Plain",
          "Forest"
        ],
        "fromX": 4,
        "fromY": 18,
        "toX": 16,
        "toY": 22
      },
      {
        "name": "Northeastern Mountain Range",
        "description": "A rugged mountain area in the northeast, providing natural barriers and limited access, ideal for defensive positioning.",
        "terrainTypes": [
          "Mountain",
          "Hill",
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
      "Northern Castle Gate at (8,3)",
      "Western Village House at (0,2)",
      "Eastern Village House at (16,14)",
      "Southwestern Town Village at (2,20), Armory at (5,20), Vendor at (11,20)",
      "Southeastern Town Village at (15,18), Armory at (5,20), Vendor at (11,20)"
    ],
    "chokePoints": [
      "Bridges at (4,3), (4,4), (9,8), (10,8), (14,11), (15,11)",
      "Castle Gate at (8,3)"
    ],
    "strategicConsiderations": [
      "Control of the central river and bridges is crucial for mobility and defense.",
      "The northern castle provides a strong defensive position but can be isolated if bridges are lost.",
      "Villages and towns offer valuable resources and should be protected or captured early.",
      "The southern coastal region limits mobility, making it a potential trap or defensive fallback.",
      "Mountain ranges in the northeast provide natural barriers, ideal for defensive units or ambushes."
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
        "description": "A large open area with plains and scattered forests, providing ample space for maneuvering and combat.",
        "terrainTypes": [
          "Plain",
          "Forest"
        ],
        "fromX": 3,
        "fromY": 6,
        "toX": 17,
        "toY": 13
      },
      {
        "name": "Northern Throne Room",
        "description": "A fortified room containing a throne, offering defensive advantages and strategic importance.",
        "terrainTypes": [
          "Floor",
          "Throne",
          "Wall"
        ],
        "fromX": 9,
        "fromY": 4,
        "toX": 11,
        "toY": 6
      },
      {
        "name": "Western Chambers",
        "description": "Indoor rooms with pillars and stairs, providing cover and strategic positioning.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 5,
        "toY": 8
      },
      {
        "name": "Eastern Chambers",
        "description": "Indoor rooms with stairs and pillars, offering multiple entry points and defensive positions.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Wall"
        ],
        "fromX": 15,
        "fromY": 0,
        "toX": 20,
        "toY": 9
      },
      {
        "name": "Southern Treasure Rooms",
        "description": "Rooms containing chests and valuable items, accessible through locked doors and stairs.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Door",
          "Stairs",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 14,
        "toX": 8,
        "toY": 18
      },
      {
        "name": "Southern Entrance",
        "description": "A fortified southern entrance with stairs leading into the central courtyard.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Stairs",
          "Wall"
        ],
        "fromX": 9,
        "fromY": 19,
        "toX": 12,
        "toY": 21
      },
      {
        "name": "Southeastern Hall",
        "description": "A long indoor hallway with pillars and stairs, providing strategic movement and defensive positions.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Wall"
        ],
        "fromX": 9,
        "fromY": 14,
        "toX": 20,
        "toY": 18
      }
    ],
    "keyPointsOfInterest": [
      "Northern Throne at (10,5)",
      "Southern Treasure Rooms with chests at (0,14), (0,16), (0,18)",
      "Multiple staircases providing access to different regions"
    ],
    "chokePoints": [
      "Door at (2,16) leading to Southern Treasure Rooms",
      "Narrow corridors in Western and Eastern Chambers",
      "Southern Entrance stairs at (9,20)-(11,20)"
    ],
    "strategicConsiderations": [
      "Control of the Central Courtyard is crucial for mobility and positioning.",
      "Securing the Northern Throne Room provides a strong defensive position.",
      "Southern Treasure Rooms contain valuable items but are vulnerable to being trapped or ambushed.",
      "Utilize choke points effectively to control enemy movement and protect key areas."
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
        "description": "A small village area with buildings, including a house and a village tile, providing cover and potential resources.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "Village",
          "House",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 8,
        "toY": 3
      },
      {
        "name": "Central Fort",
        "description": "A fortified area with walls and roads, strategically positioned to control access to the bridges.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall"
        ],
        "fromX": 4,
        "fromY": 4,
        "toX": 14,
        "toY": 6
      },
      {
        "name": "Western Bridge",
        "description": "A stone bridge crossing the river, providing a critical chokepoint for movement between north and south.",
        "terrainTypes": [
          "Road",
          "Wall",
          "Sea"
        ],
        "fromX": 7,
        "fromY": 7,
        "toX": 8,
        "toY": 12
      },
      {
        "name": "Eastern Bridge",
        "description": "Another stone bridge parallel to the western one, offering an alternative route and strategic flexibility.",
        "terrainTypes": [
          "Road",
          "Wall",
          "Sea"
        ],
        "fromX": 13,
        "fromY": 7,
        "toX": 14,
        "toY": 12
      },
      {
        "name": "Southern Riverbank",
        "description": "Open terrain south of the river, providing ample space for maneuvering and staging attacks on the bridges.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 18,
        "toY": 15
      },
      {
        "name": "Eastern Village",
        "description": "A small village located to the east, providing additional resources and strategic positioning.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "Village",
          "Forest"
        ],
        "fromX": 14,
        "fromY": 0,
        "toX": 18,
        "toY": 4
      }
    ],
    "keyPointsOfInterest": [
      "Northern Village at (7,1)",
      "Eastern Village at (15,3)",
      "Central Fort area with walls and roads",
      "Western Bridge chokepoint",
      "Eastern Bridge chokepoint"
    ],
    "chokePoints": [
      "Western Bridge (7,7 to 8,12)",
      "Eastern Bridge (13,7 to 14,12)",
      "Central Fort walls and roads"
    ],
    "strategicConsiderations": [
      "Control of the bridges is crucial for movement and defense. Holding these points can significantly restrict enemy mobility.",
      "The villages provide valuable resources and should be secured early to gain an advantage.",
      "The Central Fort offers a strong defensive position and should be utilized to control access to the bridges.",
      "The open terrain of the Southern Riverbank allows for flexible troop deployment and staging of attacks or defenses."
    ],
    "givenName": "Twin Bridges Crossing",
    "originalName": "Knights_Villagers_Bandits_11_(0E_00_72_10)__by_Aura_Wolf",
    "description": "A strategic outdoor map featuring two parallel bridges over a wide river, with villages and a fort nearby.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Cliffside Fortresses",
        "description": "Elevated area with multiple forts and cliffs, providing strong defensive positions and vantage points.",
        "terrainTypes": [
          "Plain",
          "Cliff",
          "Fort"
        ],
        "fromX": 5,
        "fromY": 0,
        "toX": 18,
        "toY": 4
      },
      {
        "name": "Central Plains",
        "description": "Open plains with scattered forests and cliffs, ideal for cavalry and mobile units.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 18,
        "toY": 10
      },
      {
        "name": "Oasis Town",
        "description": "A small town featuring houses, an armory, and a vendor, providing resources and cover.",
        "terrainTypes": [
          "Road",
          "House",
          "Armory",
          "Vendor",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 8,
        "toX": 8,
        "toY": 12
      },
      {
        "name": "Southern Lake and Village",
        "description": "A peaceful area with a lake, bridge, and a village, offering limited mobility but strategic value.",
        "terrainTypes": [
          "Lake",
          "Bridge",
          "Village",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 9,
        "toY": 19
      },
      {
        "name": "Eastern Cliffside",
        "description": "A rugged area with cliffs and scattered plains, providing natural barriers and defensive positions.",
        "terrainTypes": [
          "Cliff",
          "Plain",
          "Forest"
        ],
        "fromX": 10,
        "fromY": 11,
        "toX": 18,
        "toY": 19
      }
    ],
    "keyPointsOfInterest": [
      "Multiple Forts at (11,1), (11,3), (8,9), (12,8)",
      "Armory at (0,10)",
      "Vendor at (6,11)",
      "Houses at (1,8), (7,12)",
      "Village at (1,18)",
      "Bridge at (3,15)-(4,15)"
    ],
    "chokePoints": [
      "Bridge at (3,15)-(4,15)",
      "Narrow passages near cliffs at (10,10)-(12,10)",
      "Walls around Oasis Town"
    ],
    "strategicConsiderations": [
      "Northern Cliffside Fortresses offer strong defensive positions and should be secured early.",
      "Central Plains provide mobility advantages for cavalry and mounted units.",
      "Oasis Town is crucial for resupply and should be defended or captured quickly.",
      "Southern Lake and Village area limits mobility but offers strategic control over the southern approach.",
      "Eastern Cliffside provides natural defensive barriers, ideal for defensive setups or ambushes."
    ],
    "givenName": "Desert Fortress",
    "originalName": "Mages_Mercenaries_3_(42_00_43_44)__by_Aura_Wolf",
    "description": "A vast desert landscape with scattered fortresses and a small oasis town, divided by a river.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Village",
        "description": "A small village area with houses and roads, surrounded by open plains and sparse forests. Provides cover and strategic positioning.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Village",
          "Forest"
        ],
        "fromX": 4,
        "fromY": 0,
        "toX": 14,
        "toY": 3
      },
      {
        "name": "Central Pathway",
        "description": "A central road connecting various regions, flanked by open plains and occasional forests. Ideal for rapid troop movement.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 4,
        "toX": 14,
        "toY": 6
      },
      {
        "name": "Southern Fortifications",
        "description": "A fortified area with walls and defensive structures, providing strong defensive positions and chokepoints.",
        "terrainTypes": [
          "Wall",
          "Road",
          "Plain",
          "Village"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 8,
        "toY": 12
      },
      {
        "name": "Eastern Homestead",
        "description": "A small residential area with houses and vendors, offering resources and strategic cover.",
        "terrainTypes": [
          "House",
          "Vendor",
          "Road",
          "Plain"
        ],
        "fromX": 8,
        "fromY": 7,
        "toX": 14,
        "toY": 9
      },
      {
        "name": "Western Ruins",
        "description": "Old stone structures and ruins providing cover and strategic vantage points, surrounded by plains and forests.",
        "terrainTypes": [
          "Wall",
          "Plain",
          "Forest",
          "Road"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 3
      }
    ],
    "keyPointsOfInterest": [
      "Village at (3,2)",
      "Village at (11,1)",
      "Village at (2,10)",
      "Vendor at (14,5)",
      "Armory at (14,11)",
      "Houses at (8,8)"
    ],
    "chokePoints": [
      "Road between walls at (2,4) and (3,4)",
      "Road between walls at (6,4) and (6,5)",
      "Road between walls at (7,7) and (7,8)",
      "Road between walls at (5,11) and (6,11)"
    ],
    "strategicConsiderations": [
      "Control of the central pathway is crucial for rapid troop movement and reinforcement.",
      "Northern and southern villages provide valuable resources and defensive positions.",
      "Eastern homestead offers vendors and houses for strategic cover and resupply.",
      "Western ruins provide excellent cover and vantage points for ranged units.",
      "Chokepoints created by walls and narrow roads can be effectively used for defensive strategies."
    ],
    "givenName": "Village Outskirts",
    "originalName": "Knights_Villagers_Bandits_6_(0E_00_72_10)__by_Aura_Wolf",
    "description": "A rural map featuring a small village surrounded by open fields and sparse forests. The area is dotted with houses and a few fortified structures, providing strategic points for defense and attack.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Main Entrance",
        "description": "The primary entryway into the castle, featuring large gates and a wide path. It provides direct access to the central courtyard and is crucial for controlling movement.",
        "terrainTypes": [
          "Plain",
          "Stairs",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 16,
        "toY": 14
      },
      {
        "name": "Central Courtyard",
        "description": "An open area surrounded by castle walls, with decorative pillars and pathways. It serves as a central hub connecting various parts of the castle.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 4,
        "toX": 16,
        "toY": 9
      },
      {
        "name": "Upper Chambers",
        "description": "A series of rooms and corridors leading to the upper parts of the castle. Contains valuable chests and strategic positions for ranged units.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Pillar",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 16,
        "toY": 3
      },
      {
        "name": "Side Staircases",
        "description": "Narrow staircases providing access to different levels of the castle. These staircases are critical choke points for controlling enemy movement.",
        "terrainTypes": [
          "Stairs",
          "Wall"
        ],
        "fromX": 4,
        "fromY": 7,
        "toX": 7,
        "toY": 7
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (1,1)",
      "Multiple staircases at various locations",
      "Pillars providing defensive cover"
    ],
    "chokePoints": [
      "Doors at (1,3) and (0,7)",
      "Narrow staircases at (4,7)-(7,7)"
    ],
    "strategicConsiderations": [
      "Control of the main entrance is crucial for managing enemy reinforcements.",
      "Central courtyard provides flexibility for unit movement and positioning.",
      "Upper chambers offer strategic positions for ranged units and contain valuable loot.",
      "Side staircases are critical choke points that can be used to funnel enemy units."
    ],
    "givenName": "Castle Courtyard",
    "originalName": "Knights_Villagers_Bandits_7_(18_00_48_1A)__by_Aura_Wolf",
    "description": "A fortified castle courtyard with multiple entry points and a central chamber.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Village",
        "description": "A small village area with houses providing resources and shelter, surrounded by plains and forests.",
        "terrainTypes": [
          "Plain",
          "House",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 5,
        "toY": 5
      },
      {
        "name": "Central Forest",
        "description": "A dense forested area with thickets, providing excellent cover and strategic movement options.",
        "terrainTypes": [
          "Forest",
          "Thicket",
          "Plain"
        ],
        "fromX": 6,
        "fromY": 0,
        "toX": 18,
        "toY": 6
      },
      {
        "name": "Eastern Fortress",
        "description": "A fortified structure with walls and a gate, serving as a defensive stronghold and strategic chokepoint.",
        "terrainTypes": [
          "Wall",
          "Gate",
          "Plain"
        ],
        "fromX": 20,
        "fromY": 7,
        "toX": 22,
        "toY": 8
      },
      {
        "name": "Southern Mountain Range",
        "description": "A large range of impassable mountains and hills, creating natural barriers and limiting movement.",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Plain"
        ],
        "fromX": 4,
        "fromY": 7,
        "toX": 11,
        "toY": 12
      },
      {
        "name": "Ruined Outpost",
        "description": "An area with ruins, forests, and plains, providing strategic cover and potential ambush points.",
        "terrainTypes": [
          "Ruins",
          "Forest",
          "Plain"
        ],
        "fromX": 14,
        "fromY": 10,
        "toX": 18,
        "toY": 12
      },
      {
        "name": "Northern Plains",
        "description": "Open plains area allowing for fast movement and skirmishes, with scattered forests and hills.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill"
        ],
        "fromX": 19,
        "fromY": 0,
        "toX": 23,
        "toY": 6
      },
      {
        "name": "Eastern Cliffs",
        "description": "A region with cliffs and forests, providing natural defensive positions and limited access.",
        "terrainTypes": [
          "Cliff",
          "Forest",
          "Plain"
        ],
        "fromX": 21,
        "fromY": 2,
        "toX": 23,
        "toY": 4
      }
    ],
    "keyPointsOfInterest": [
      "Houses at (2,2) and (0,9) providing resources",
      "Gate at (21,8) serving as a critical chokepoint",
      "Ruins at (16,10) offering strategic cover"
    ],
    "chokePoints": [
      "Gate at (21,8)",
      "Mountain passes around (7,9) to (11,9)"
    ],
    "strategicConsiderations": [
      "Control of the Eastern Fortress is crucial for defensive positioning and controlling movement.",
      "The Central Forest provides excellent cover for ambushes and guerrilla tactics.",
      "The Southern Mountain Range limits mobility, making it important to plan unit placement carefully.",
      "The Ruined Outpost can serve as a staging area for attacks or defensive maneuvers."
    ],
    "givenName": "Mountain Pass Clash",
    "originalName": "Mages_Mercenaries_2_(01_00_38_03)__by_Aura_Wolf",
    "description": "A rugged outdoor battlefield featuring a mix of mountains, forests, and open plains, with strategic structures scattered throughout.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Temple Entrance",
        "description": "The main entryway with wide stairs and open plains, providing initial access to the temple.",
        "terrainTypes": [
          "Plain",
          "Floor",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 8,
        "toY": 2
      },
      {
        "name": "Central Ruined Chamber",
        "description": "A large central area filled with broken pillars, stairs, and scattered debris, serving as a strategic hub.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 17,
        "toY": 15
      },
      {
        "name": "Western Corridor",
        "description": "A narrow passageway with stairs and walls, leading to smaller rooms and providing defensive positions.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 3,
        "toX": 4,
        "toY": 12
      },
      {
        "name": "Eastern Corridor",
        "description": "A narrow passageway with stairs, walls, and a locked door, leading to smaller rooms and a chest.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Door",
          "Chest",
          "Stairs"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 17,
        "toY": 12
      },
      {
        "name": "Lower Sanctuary",
        "description": "A secluded area at the bottom of the temple, containing remnants of altars and sacred artifacts.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 17,
        "toY": 20
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (12,12)",
      "Chest at (17,2)",
      "Locked Door at (17,4)",
      "Multiple staircases providing vertical mobility"
    ],
    "chokePoints": [
      "Locked Door at (17,4)",
      "Narrow corridors in Western and Eastern Corridors",
      "Staircases leading to different levels"
    ],
    "strategicConsiderations": [
      "Control of the Central Ruined Chamber is crucial for mobility and defense.",
      "The locked door in the Eastern Corridor can be used to control enemy movement.",
      "Utilize staircases for quick repositioning and surprise attacks.",
      "Secure chests early to gain valuable items and resources."
    ],
    "givenName": "Ruined Temple",
    "originalName": "Nobles_Evil_Doers_5_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "An ancient, crumbling temple with multiple chambers and corridors, filled with debris and overgrown with vegetation.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Lakeside Village",
        "description": "A peaceful village near a lake, providing defensive cover and a strategic retreat point.",
        "terrainTypes": [
          "Plain",
          "Lake",
          "Village",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 4,
        "toX": 4,
        "toY": 7
      },
      {
        "name": "Central Crossroads",
        "description": "The main intersection of roads, crucial for controlling movement across the map.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Wall"
        ],
        "fromX": 4,
        "fromY": 0,
        "toX": 10,
        "toY": 4
      },
      {
        "name": "Eastern Ruins and Armory",
        "description": "Ruins and an armory provide cover and strategic resources, ideal for defensive positioning.",
        "terrainTypes": [
          "Ruins",
          "Armory",
          "Road",
          "Wall",
          "Forest"
        ],
        "fromX": 10,
        "fromY": 1,
        "toX": 14,
        "toY": 7
      },
      {
        "name": "Southern Plains",
        "description": "Open plains with scattered roads, offering mobility but limited defensive cover.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "Cliff",
          "Lake"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 14,
        "toY": 9
      },
      {
        "name": "Northern Forest Pathway",
        "description": "A narrow pathway surrounded by forests, providing natural cover and ambush opportunities.",
        "terrainTypes": [
          "Forest",
          "Road",
          "Plain",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 3,
        "toY": 3
      }
    ],
    "keyPointsOfInterest": [
      "Village at (2,2)",
      "Village at (3,6)",
      "Armory at (13,7)",
      "Ruins at (11,1) to (13,2)"
    ],
    "chokePoints": [
      "Road intersection at (4,3)",
      "Narrow road near walls at (7,4) to (7,7)",
      "Road near Armory at (12,7)"
    ],
    "strategicConsiderations": [
      "Control of the Central Crossroads is vital for mobility and map dominance.",
      "The Eastern Ruins and Armory provide strong defensive positions and valuable resources.",
      "The Western Lakeside Village offers a safe retreat and defensive cover, especially against cavalry.",
      "The Southern Plains allow for rapid movement but expose units to ranged attacks.",
      "The Northern Forest Pathway is ideal for ambushes and guerrilla tactics due to natural cover."
    ],
    "givenName": "Crossroads of Commerce",
    "originalName": "(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19",
    "description": "An outdoor map featuring a network of roads connecting various key locations, including villages, a castle, and a vendor. The map is characterized by its strategic pathways and surrounding natural terrain.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Mountain Range",
        "description": "Dominated by impassable mountains, this region provides limited access and is ideal for flying units. Offers high defensive value due to terrain.",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Plain"
        ],
        "fromX": 3,
        "fromY": 0,
        "toX": 12,
        "toY": 5
      },
      {
        "name": "Northwestern Forest and Plains",
        "description": "Open area with scattered forests and plains, providing moderate cover and mobility.",
        "terrainTypes": [
          "Forest",
          "Plain",
          "Hill"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 2,
        "toY": 4
      },
      {
        "name": "Central Mountain Pass",
        "description": "A narrow pass through mountains, providing limited mobility and strategic chokepoints.",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Plain"
        ],
        "fromX": 4,
        "fromY": 5,
        "toX": 11,
        "toY": 7
      },
      {
        "name": "Ruined Outpost",
        "description": "Area with ruins, providing cover and potential hidden items or ambush points.",
        "terrainTypes": [
          "Ruins",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 2,
        "toY": 7
      },
      {
        "name": "Central Plains and Hills",
        "description": "Open plains interspersed with hills, offering moderate cover and mobility.",
        "terrainTypes": [
          "Plain",
          "Hill",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 13,
        "toY": 10
      },
      {
        "name": "Eastern River Crossing",
        "description": "A river area with limited crossing points, creating natural chokepoints.",
        "terrainTypes": [
          "River",
          "Plain",
          "Forest"
        ],
        "fromX": 12,
        "fromY": 7,
        "toX": 15,
        "toY": 12
      },
      {
        "name": "Southern Ruins and Riverbanks",
        "description": "Ruins near a river, providing cover and strategic positioning opportunities.",
        "terrainTypes": [
          "Ruins",
          "River",
          "Forest",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 8,
        "toX": 11,
        "toY": 13
      },
      {
        "name": "Southeastern Coastal Cliffs",
        "description": "Cliffside area adjacent to the sea, accessible primarily by flying units.",
        "terrainTypes": [
          "Cliff",
          "Sea",
          "Plain",
          "Forest"
        ],
        "fromX": 17,
        "fromY": 5,
        "toX": 19,
        "toY": 12
      },
      {
        "name": "Southwestern Fort and Surroundings",
        "description": "A fortified area with a fort, providing strong defensive positions.",
        "terrainTypes": [
          "Fort",
          "Plain",
          "Forest",
          "River"
        ],
        "fromX": 15,
        "fromY": 16,
        "toX": 19,
        "toY": 19
      }
    ],
    "keyPointsOfInterest": [
      "Ruins at (15,2)",
      "Ruins at (10,8)",
      "Ruins at (3,9)",
      "Ruins at (17,13)",
      "Ruins at (11,18)",
      "Fort at (16,19)"
    ],
    "chokePoints": [
      "Central Mountain Pass",
      "River crossings at (3,12) and (12,9)",
      "Walls near ruins at (2,8) and (2,9)"
    ],
    "strategicConsiderations": [
      "Control of the Central Mountain Pass is crucial for mobility and defense.",
      "Flying units have significant advantages in accessing cliffside and mountainous regions.",
      "River crossings and walls provide natural chokepoints, ideal for defensive positioning.",
      "Ruins offer cover and potential hidden items, making them valuable strategic points.",
      "The Southeastern Coastal Cliffs provide a safe zone for flying units to maneuver and flank enemy positions."
    ],
    "givenName": "Mountain Pass Clash",
    "originalName": "Nobles_Evil_Doers_2_(01_00_4C_03)__by_Aura_Wolf",
    "description": "A rugged outdoor battlefield featuring a winding path through mountains and forests, with strategic forts and villages scattered throughout.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Throne Chamber",
        "description": "The central area containing the throne, highly defensible and strategically crucial.",
        "terrainTypes": [
          "Floor",
          "Throne"
        ],
        "fromX": 8,
        "fromY": 0,
        "toX": 16,
        "toY": 4
      },
      {
        "name": "Main Corridor",
        "description": "A wide corridor connecting the entrance hall to the throne chamber, providing direct access and strategic mobility.",
        "terrainTypes": [
          "Floor",
          "Door"
        ],
        "fromX": 8,
        "fromY": 4,
        "toX": 16,
        "toY": 8
      },
      {
        "name": "Left Wing Chambers",
        "description": "A complex of rooms and corridors on the left side, offering multiple tactical positions and access points.",
        "terrainTypes": [
          "Floor",
          "Door",
          "Wall",
          "Stairs",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 6,
        "toX": 7,
        "toY": 18
      },
      {
        "name": "Right Wing Chambers",
        "description": "A complex of rooms and corridors on the right side, mirroring the left wing, providing tactical flexibility.",
        "terrainTypes": [
          "Floor",
          "Door",
          "Wall",
          "Stairs",
          "Pillar"
        ],
        "fromX": 17,
        "fromY": 6,
        "toX": 25,
        "toY": 18
      },
      {
        "name": "Entrance Hall",
        "description": "The southernmost area leading into the main corridor, serving as the primary entry point for attackers.",
        "terrainTypes": [
          "Floor",
          "Door",
          "Wall",
          "Stairs",
          "Plain",
          "Road"
        ],
        "fromX": 0,
        "fromY": 19,
        "toX": 25,
        "toY": 23
      },
      {
        "name": "Outer Courtyard",
        "description": "An open area surrounding the castle, providing initial staging grounds and limited cover.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 25,
        "toY": 5
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (12,1)",
      "Multiple staircases for reinforcements at (9,0), (10,0), (14,0), (15,0), (12,9), (13,9), (12,10), (13,10), (18,13), (19,13), (10,18), (12,18), (13,18), (15,18)",
      "Strategic doors at (8,4), (16,4), (6,6), (19,6), (5,9), (20,9), (5,14), (20,14), (7,17), (19,17)"
    ],
    "chokePoints": [
      "Doors at (8,4), (16,4), (6,6), (19,6), (5,9), (20,9), (5,14), (20,14), (7,17), (19,17)",
      "Narrow corridors in Left and Right Wing Chambers"
    ],
    "strategicConsiderations": [
      "The Throne Chamber is highly defensible and should be the primary defensive focus.",
      "Main Corridor provides rapid movement but is vulnerable to ranged attacks from adjacent chambers.",
      "Left and Right Wing Chambers offer multiple tactical positions for ambushes and defensive setups.",
      "Entrance Hall is the primary entry point for attackers, making it crucial for initial defense or counterattacks.",
      "Outer Courtyard provides limited cover and is ideal for initial positioning and staging of units."
    ],
    "givenName": "Royal Throne Room",
    "originalName": "Chapter6TheTrapIsSprung_More_Carpet__by_Shin19",
    "description": "A grand indoor map featuring a central throne room surrounded by multiple chambers and corridors. The layout is symmetrical, with a focus on the central red-carpeted path leading to the throne.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Treasure Alcove",
        "description": "A small, enclosed area containing a treasure chest, accessible through a door.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 2,
        "fromY": 1,
        "toX": 4,
        "toY": 4
      },
      {
        "name": "Central Corridor",
        "description": "A winding corridor connecting various parts of the map, featuring strategic choke points and stairs for vertical movement.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 16,
        "toY": 8
      },
      {
        "name": "Entrance Hall",
        "description": "The main entrance area leading into the castle, providing access to the outside and stairs leading upward.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 8,
        "toX": 12,
        "toY": 12
      },
      {
        "name": "Royal Chamber",
        "description": "A large, ornate room with distinct floor patterns and pillars, likely a significant location for strategic positioning.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 16,
        "toY": 8
      },
      {
        "name": "Castle Courtyard",
        "description": "An open outdoor area with plains and forests, providing maneuverability and cover.",
        "terrainTypes": [
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 12,
        "toX": 13,
        "toY": 13
      },
      {
        "name": "Eastern Courtyard",
        "description": "A smaller outdoor area with plains and forests, adjacent to the Royal Chamber.",
        "terrainTypes": [
          "Plain",
          "Forest"
        ],
        "fromX": 4,
        "fromY": 12,
        "toX": 13,
        "toY": 13
      }
    ],
    "keyPointsOfInterest": [
      "Treasure Chest at (3,3)",
      "Multiple Staircases for vertical movement",
      "Pillars providing cover and strategic positioning"
    ],
    "chokePoints": [
      "Door at (3,1) leading to Treasure Alcove",
      "Narrow corridors throughout the Central Corridor",
      "Staircases acting as vertical choke points"
    ],
    "strategicConsiderations": [
      "Control of the Central Corridor is crucial for mobility and access to other regions.",
      "Securing the Treasure Alcove early can provide valuable resources.",
      "The Royal Chamber offers strong defensive positions due to pillars and limited entry points.",
      "Outdoor courtyards provide maneuverability but limited cover, making them vulnerable to ranged attacks."
    ],
    "givenName": "Castle Labyrinth",
    "originalName": "Knights_Villagers_Bandits_9_(18_00_48_1A)__by_Aura_Wolf",
    "description": "A complex indoor map featuring winding corridors and strategic choke points, with a mix of open and enclosed spaces.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Throne Room",
        "description": "Central chamber featuring a throne, surrounded by pillars and accessible through narrow corridors. Highly defensible and strategically important.",
        "terrainTypes": [
          "Floor",
          "Throne",
          "Pillar"
        ],
        "fromX": 8,
        "fromY": 4,
        "toX": 16,
        "toY": 7
      },
      {
        "name": "Northern Treasure Chamber",
        "description": "A small, isolated room containing a valuable treasure chest, accessible via narrow corridors and stairs.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Lake"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 7,
        "toY": 8
      },
      {
        "name": "Central Waterway Passages",
        "description": "Corridors with water channels that connect various chambers, creating natural choke points and mobility constraints.",
        "terrainTypes": [
          "Floor",
          "Lake",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 8,
        "toX": 16,
        "toY": 12
      },
      {
        "name": "Lower Chambers",
        "description": "Interconnected rooms with water features, pillars, and stairs, providing multiple strategic positions and defensive opportunities.",
        "terrainTypes": [
          "Floor",
          "Lake",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 16,
        "toY": 19
      },
      {
        "name": "Entrance Hall",
        "description": "The initial area with multiple pathways leading to other chambers, featuring stairs and pillars for strategic positioning.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 20,
        "toX": 16,
        "toY": 25
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (13,5)",
      "Treasure Chests at (5,7), (1,24), and (5,24)",
      "Multiple staircases providing access to different levels"
    ],
    "chokePoints": [
      "Narrow corridors around the Throne Room",
      "Waterway passages creating natural choke points",
      "Staircases connecting different chambers"
    ],
    "strategicConsiderations": [
      "Control of the Throne Room is crucial for defensive advantage.",
      "Utilize waterway passages to limit enemy mobility and create ambush opportunities.",
      "Secure treasure chambers early to gain valuable resources.",
      "Staircases can be used for quick reinforcements or retreats, making them critical points to control."
    ],
    "givenName": "Ancient Throne Chambers",
    "originalName": "Nobles_Evil_Doers_1_(18_00_19_1A)__by_Aura_Wolf",
    "description": "A complex indoor map featuring multiple chambers connected by narrow corridors, with water channels and treasure chests scattered throughout.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Castle Courtyard",
        "description": "A fortified area with a gate and walls, providing strong defensive positions and control over the western side.",
        "terrainTypes": [
          "Wall",
          "Gate",
          "Plain",
          "Forest"
        ],
        "fromX": 2,
        "fromY": 3,
        "toX": 4,
        "toY": 4
      },
      {
        "name": "Northern Village Area",
        "description": "A small village with houses and resources, offering shelter and strategic support.",
        "terrainTypes": [
          "Village",
          "House",
          "Plain",
          "Forest"
        ],
        "fromX": 6,
        "fromY": 0,
        "toX": 10,
        "toY": 2
      },
      {
        "name": "Central River Crossing",
        "description": "A critical area with bridges over a river, serving as a key chokepoint for movement between north and south.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain"
        ],
        "fromX": 5,
        "fromY": 5,
        "toX": 8,
        "toY": 7
      },
      {
        "name": "Eastern Coastal Shore",
        "description": "A coastal region with cliffs and sea access, providing strategic naval opportunities and limited land access.",
        "terrainTypes": [
          "Sea",
          "Cliff",
          "Plain"
        ],
        "fromX": 11,
        "fromY": 3,
        "toX": 14,
        "toY": 7
      },
      {
        "name": "Southern Village and Trade Hub",
        "description": "A bustling area with vendors, armories, and houses, offering trade and support for units.",
        "terrainTypes": [
          "Vendor",
          "Armory",
          "House",
          "Plain",
          "Forest"
        ],
        "fromX": 4,
        "fromY": 9,
        "toX": 11,
        "toY": 12
      },
      {
        "name": "Southwestern Forest Outpost",
        "description": "A small outpost surrounded by forests, providing defensive cover and lookout positions.",
        "terrainTypes": [
          "Forest",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 3,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "Western Castle Gate at (3,4)",
      "Northern Village at (10,2)",
      "Central Bridges at (6,6) and (7,6)",
      "Eastern Coastal Cliffs and Sea",
      "Southern Village with Armory and Vendors"
    ],
    "chokePoints": [
      "Western Castle Gate at (3,4)",
      "Central River Bridges at (6,6) and (7,6)",
      "Eastern Coastal Cliffs limiting land access"
    ],
    "strategicConsiderations": [
      "Control of the central bridges is crucial for mobility and defense.",
      "The Western Castle provides a strong defensive position and should be secured early.",
      "The Eastern Shore offers naval opportunities but limited land access, making it vulnerable to ranged attacks.",
      "Southern Village serves as a vital resource and trade hub, important for maintaining unit strength and supplies.",
      "Forests and cliffs provide natural defensive cover, useful for ambushes and defensive positioning."
    ],
    "givenName": "River Crossing",
    "originalName": "Knights_Villagers_Bandits_2_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic map featuring a central river with bridges, surrounded by villages and a castle.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Village",
        "description": "A small village area with houses, providing resources and strategic positioning.",
        "terrainTypes": [
          "Village",
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 8,
        "fromY": 0,
        "toX": 12,
        "toY": 4
      },
      {
        "name": "Western Armory",
        "description": "An armory building located to the west, crucial for weapon supplies and preparation.",
        "terrainTypes": [
          "Armory",
          "Road",
          "Plain",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 4,
        "toY": 19
      },
      {
        "name": "Central Fortress",
        "description": "A large fortified structure with multiple entry points, serving as the main defensive position.",
        "terrainTypes": [
          "Wall",
          "Floor",
          "Chest",
          "Door",
          "Barrel"
        ],
        "fromX": 8,
        "fromY": 6,
        "toX": 14,
        "toY": 13
      },
      {
        "name": "Southern Market",
        "description": "A cluster of buildings including a vendor and house, useful for trading and supplies.",
        "terrainTypes": [
          "Vendor",
          "House",
          "Road",
          "Plain",
          "Wall"
        ],
        "fromX": 4,
        "fromY": 16,
        "toX": 15,
        "toY": 19
      },
      {
        "name": "Eastern Outpost",
        "description": "A small building serving as a lookout or minor defensive position, located to the east.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Road"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 15,
        "toY": 5
      },
      {
        "name": "Central Plains",
        "description": "Open plains with scattered forests and roads, providing mobility and tactical flexibility.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Road"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 7,
        "toY": 15
      }
    ],
    "keyPointsOfInterest": [
      "Northern Village at (10,2)",
      "Western Armory at (3,18)",
      "Central Fortress with chest at (10,8)",
      "Southern Market with vendor at (13,17)",
      "Eastern Outpost"
    ],
    "chokePoints": [
      "Door at (12,13) leading into Central Fortress",
      "Door at (14,9) within Central Fortress",
      "Narrow roads around Central Fortress"
    ],
    "strategicConsiderations": [
      "Control of the Central Fortress is crucial for defense and resource management.",
      "Northern Village and Southern Market provide essential resources and should be secured early.",
      "Western Armory is vital for equipping units and should be defended or captured quickly.",
      "Eastern Outpost offers a strategic vantage point for monitoring enemy movements.",
      "Utilize choke points effectively to control enemy advancement and protect key areas."
    ],
    "givenName": "Fortress Approach",
    "originalName": "Mages_Mercenaries_1_(0E_00_72_10)__by_Aura_Wolf",
    "description": "A strategic outdoor map featuring a central fortress surrounded by various buildings and pathways.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Castle Entrance",
        "description": "A fortified area with walls and open plains, providing defensive positions and controlled access.",
        "terrainTypes": [
          "Wall",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 4,
        "toY": 2
      },
      {
        "name": "Northern Hills",
        "description": "Elevated terrain with hills and cliffs, offering strategic high ground advantage.",
        "terrainTypes": [
          "Hill",
          "Cliff",
          "Plain"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 10,
        "toY": 3
      },
      {
        "name": "Mountain Pass",
        "description": "Impassable mountains and narrow paths, ideal for defensive positioning and ambushes.",
        "terrainTypes": [
          "Mountain",
          "Plain"
        ],
        "fromX": 12,
        "fromY": 0,
        "toX": 14,
        "toY": 1
      },
      {
        "name": "Central Forest",
        "description": "Dense forest area providing cover and strategic movement options, crucial for ambushes and stealth.",
        "terrainTypes": [
          "Forest",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 3,
        "toX": 9,
        "toY": 8
      },
      {
        "name": "River Crossing",
        "description": "Area with two bridges crossing a river, essential for controlling movement across the map.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain"
        ],
        "fromX": 11,
        "fromY": 0,
        "toX": 13,
        "toY": 8
      },
      {
        "name": "Eastern Riverbank",
        "description": "Open grassy area along the river, providing space for maneuvering and potential flanking.",
        "terrainTypes": [
          "Plain",
          "Cliff",
          "River"
        ],
        "fromX": 10,
        "fromY": 9,
        "toX": 14,
        "toY": 9
      }
    ],
    "keyPointsOfInterest": [
      "Castle Entrance at top left",
      "Two bridges at coordinates (11,2) and (12,5)",
      "Mountain Pass at top right"
    ],
    "chokePoints": [
      "Bridges at (11,2) and (12,5)",
      "Narrow paths near Mountain Pass"
    ],
    "strategicConsiderations": [
      "Control of bridges is crucial for map dominance.",
      "Forests provide excellent cover for ambushes and stealth maneuvers.",
      "High ground in Northern Hills offers significant tactical advantage.",
      "Castle Entrance provides strong defensive positions but limited mobility."
    ],
    "givenName": "Forest Crossing",
    "originalName": "(7)Ch01_Diff_Tileset__by_Shin19",
    "description": "A lush outdoor map featuring a castle, dense forests, and a river with bridges.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central Crossroads",
        "description": "The central intersection of paths, surrounded by plains and forests, providing access to all areas.",
        "terrainTypes": [
          "Plain",
          "Forest"
        ],
        "fromX": 5,
        "fromY": 5,
        "toX": 15,
        "toY": 7
      },
      {
        "name": "Northern Mountain Range",
        "description": "Impassable mountains forming a natural barrier at the northern edge of the map.",
        "terrainTypes": [
          "Mountain",
          "Hill"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 19,
        "toY": 4
      },
      {
        "name": "Western Village",
        "description": "A small village area with houses and a fort, providing resources and defensive positions.",
        "terrainTypes": [
          "Plain",
          "House",
          "Fort",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 8,
        "toX": 4,
        "toY": 9
      },
      {
        "name": "Eastern Village",
        "description": "Another village area with houses and a fort, offering strategic advantages and supplies.",
        "terrainTypes": [
          "Plain",
          "House",
          "Fort",
          "Forest"
        ],
        "fromX": 15,
        "fromY": 8,
        "toX": 19,
        "toY": 9
      },
      {
        "name": "Southern Mountain Pass",
        "description": "A narrow path through mountains and hills, providing limited access to the southern edge.",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 15,
        "toY": 12
      },
      {
        "name": "Coastal Edge",
        "description": "The southeastern edge of the map bordered by cliffs and sea, limiting movement and providing defensive positions.",
        "terrainTypes": [
          "Cliff",
          "Sea",
          "Mountain",
          "Plain"
        ],
        "fromX": 16,
        "fromY": 10,
        "toX": 19,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "Western Village Houses and Fort",
      "Eastern Village Houses and Fort",
      "Central Crossroads"
    ],
    "chokePoints": [
      "Southern Mountain Pass",
      "Central Crossroads"
    ],
    "strategicConsiderations": [
      "Control of the Central Crossroads is crucial for mobility and access to all regions.",
      "The villages provide valuable resources and defensive positions, making them key targets.",
      "The Southern Mountain Pass is a critical choke point, ideal for defensive strategies.",
      "The Coastal Edge offers limited access, making it a defensible position against attacks from the south."
    ],
    "givenName": "Mountain Crossroads",
    "originalName": "Knights_Villagers_Bandits_5_(01_00_38_03)__by_Aura_Wolf",
    "description": "A strategic outdoor map featuring a central crossroads surrounded by mountains and villages.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Entrance Hall",
        "description": "The starting area with a wide open space and stairs leading deeper into the complex. Provides initial positioning and deployment.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 1,
        "fromY": 12,
        "toX": 4,
        "toY": 14
      },
      {
        "name": "Central Corridor",
        "description": "A long hallway connecting various rooms, featuring decorative pillars for cover and strategic positioning.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 2,
        "fromY": 6,
        "toX": 9,
        "toY": 8
      },
      {
        "name": "Treasure Room",
        "description": "A secluded room containing a valuable treasure chest, accessible through a locked door.",
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
        "name": "Pillar Room",
        "description": "A room with multiple decorative pillars, providing cover and obstacles, ideal for defensive positioning.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 6,
        "fromY": 11,
        "toX": 12,
        "toY": 12
      },
      {
        "name": "Narrow Passage",
        "description": "A tight corridor connecting different sections of the map, creating a strategic chokepoint.",
        "terrainTypes": [
          "Floor",
          "Door"
        ],
        "fromX": 7,
        "fromY": 4,
        "toX": 12,
        "toY": 4
      },
      {
        "name": "Upper Chambers",
        "description": "Rooms located in the upper section of the map, accessible via stairs, providing strategic high ground.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 4,
        "fromY": 5,
        "toX": 7,
        "toY": 5
      }
    ],
    "keyPointsOfInterest": [
      "Treasure Chest at (12,2)",
      "Multiple Staircases at (4,5), (7,5), (5,13), (5,14)",
      "Locked Doors at (7,4), (12,4), (4,12)"
    ],
    "chokePoints": [
      "Door at (7,4)",
      "Door at (12,4)",
      "Door at (4,12)"
    ],
    "strategicConsiderations": [
      "Control of the Central Corridor is crucial for mobility and access to other regions.",
      "Securing the Treasure Room early can provide valuable resources.",
      "Utilize the Pillar Room for defensive setups and ambushes.",
      "The Narrow Passage doors serve as critical chokepoints; controlling these can limit enemy movement.",
      "Staircases provide strategic high ground and potential reinforcement points."
    ],
    "givenName": "Labyrinthine Chambers",
    "originalName": "Alusq_FE8_0A009B0C_in_the_dark__by_FEU",
    "description": "A complex indoor map with winding corridors and multiple rooms, featuring a treasure chest in a secluded area.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Fortress Entrance",
        "description": "The main entrance to the fortress, featuring open areas and pathways leading inside. Key for initial positioning and entry.",
        "terrainTypes": [
          "Floor",
          "Plain",
          "Wall",
          "Door",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 17,
        "toX": 22,
        "toY": 23
      },
      {
        "name": "Central Courtyard",
        "description": "An open courtyard within the fortress, surrounded by walls and narrow passages. Ideal for defensive positioning.",
        "terrainTypes": [
          "Plain",
          "Floor",
          "Wall",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 11,
        "toX": 22,
        "toY": 16
      },
      {
        "name": "Northern Lake",
        "description": "A large body of water with cliffs and sea, providing natural barriers and limited access points.",
        "terrainTypes": [
          "Sea",
          "Cliff",
          "Forest",
          "Plain"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 22,
        "toY": 5
      },
      {
        "name": "Western Ruins",
        "description": "Crumbling walls and scattered debris, marking the remains of the fortress's western section. Offers cover and strategic positioning.",
        "terrainTypes": [
          "Ruins",
          "Forest",
          "Plain",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 12,
        "toY": 5
      },
      {
        "name": "Eastern Forest",
        "description": "A dense forest area with scattered trees, providing cover and strategic movement options.",
        "terrainTypes": [
          "Forest",
          "Plain",
          "Thicket"
        ],
        "fromX": 13,
        "fromY": 6,
        "toX": 22,
        "toY": 10
      },
      {
        "name": "Southern Fortress Interior",
        "description": "Interior rooms and corridors of the fortress, containing strategic points like chests and stairs.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Chest",
          "Stairs",
          "Door",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 18,
        "toX": 22,
        "toY": 23
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (7,20)",
      "Stairs at (9,12), (18,21), (19,21)",
      "Door at (7,18)",
      "Ruins at (16,1)"
    ],
    "chokePoints": [
      "Door at (7,18)",
      "Narrow passages around walls in Central Courtyard"
    ],
    "strategicConsiderations": [
      "Fortress Entrance is crucial for initial positioning and controlling access to the fortress.",
      "Central Courtyard provides strong defensive positions but can become a bottleneck.",
      "Northern Lake and cliffs limit movement, making flying units valuable for mobility.",
      "Eastern Forest offers cover for ambushes and strategic movement.",
      "Southern Fortress Interior contains valuable items and reinforcements points, requiring careful management."
    ],
    "givenName": "Ruined Fortress and Lake",
    "originalName": "Nobles_Evil_Doers_7_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "A map featuring a large ruined fortress surrounded by a lake and forested areas. The fortress is divided into multiple sections with narrow pathways and open courtyards.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Village Cluster",
        "description": "A cluster of villages and houses surrounded by mountains and forests, providing resources and strategic positioning.",
        "terrainTypes": [
          "Plain",
          "Village",
          "House",
          "Mountain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 25,
        "toY": 8
      },
      {
        "name": "Central River Crossing",
        "description": "A wide river with multiple bridges, serving as a major strategic point for crossing and defense.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 34,
        "toY": 17
      },
      {
        "name": "Eastern Castle Grounds",
        "description": "A fortified castle area with surrounding open fields, offering a strong defensive position and access to armory and vendor.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Gate",
          "Armory",
          "Vendor",
          "Village"
        ],
        "fromX": 26,
        "fromY": 0,
        "toX": 34,
        "toY": 8
      },
      {
        "name": "Southern Mountain Pass",
        "description": "A narrow passage through mountains and cliffs, ideal for ambushes and defensive maneuvers.",
        "terrainTypes": [
          "Mountain",
          "Cliff",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 18,
        "toX": 25,
        "toY": 25
      },
      {
        "name": "Western Bridge Approach",
        "description": "A bridge leading to the central river, flanked by forests and hills, crucial for advancing troops.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill",
          "Bridge"
        ],
        "fromX": 0,
        "fromY": 26,
        "toX": 25,
        "toY": 34
      },
      {
        "name": "Southeastern Village Outskirts",
        "description": "A small village area with open fields, providing resources and a staging ground for attacks.",
        "terrainTypes": [
          "Plain",
          "Village",
          "Forest",
          "Cliff"
        ],
        "fromX": 26,
        "fromY": 9,
        "toX": 34,
        "toY": 17
      },
      {
        "name": "Southeastern Coastal Plains",
        "description": "Open plains and cliffs along the coast, providing limited mobility but strategic positioning for ranged units.",
        "terrainTypes": [
          "Plain",
          "Cliff",
          "Sea",
          "Forest"
        ],
        "fromX": 26,
        "fromY": 18,
        "toX": 34,
        "toY": 25
      },
      {
        "name": "Southern Forest and Mountain Range",
        "description": "Dense forests and mountains providing cover and defensive advantages, suitable for guerrilla tactics.",
        "terrainTypes": [
          "Forest",
          "Mountain",
          "Plain",
          "Hill"
        ],
        "fromX": 26,
        "fromY": 26,
        "toX": 34,
        "toY": 34
      }
    ],
    "keyPointsOfInterest": [
      "Northern villages and houses for resources",
      "Central river bridges for strategic crossing",
      "Eastern castle with armory and vendor",
      "Southern mountain pass for ambushes",
      "Western bridge approach for troop advancement",
      "Southeastern village outskirts for staging attacks"
    ],
    "chokePoints": [
      "Central river bridges",
      "Eastern castle gates",
      "Southern mountain pass",
      "Western bridge approach"
    ],
    "strategicConsiderations": [
      "Control of the central river bridges is crucial for mobility and defense.",
      "Eastern castle grounds provide strong defensive positions and resources.",
      "Southern mountain pass is ideal for ambushes and defensive tactics.",
      "Western bridge approach is critical for advancing troops and controlling the central area.",
      "Southeastern village outskirts offer resources and a staging ground for attacks, but are vulnerable to enemy advances.",
      "Utilize forests and mountains for cover and guerrilla tactics, especially in the southern regions."
    ],
    "givenName": "River Crossing Confrontation",
    "originalName": "Snakey1_FE8_01003803_Many_Castles__by_FEU",
    "description": "A strategic map featuring a central river with multiple bridges, surrounded by villages and castles. The terrain includes mountains and forests, providing tactical advantages.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Grand Entrance",
        "description": "The main entryway to the fortress, featuring large doors and a wide path, providing a strategic point for initial engagements.",
        "terrainTypes": [
          "Floor",
          "Door",
          "Wall"
        ],
        "fromX": 4,
        "fromY": 0,
        "toX": 11,
        "toY": 2
      },
      {
        "name": "Central Hall",
        "description": "An expansive indoor area with pillars and stairs, connecting various corridors and rooms, ideal for defensive positioning.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Wall"
        ],
        "fromX": 4,
        "fromY": 3,
        "toX": 11,
        "toY": 5
      },
      {
        "name": "Left Corridor",
        "description": "A narrow passage on the left side of the fortress, providing limited movement and strategic chokepoints.",
        "terrainTypes": [
          "Floor",
          "Door",
          "Wall",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 3,
        "toY": 15
      },
      {
        "name": "Right Corridor",
        "description": "A narrow passage on the right side of the fortress, mirroring the left corridor with similar strategic chokepoints.",
        "terrainTypes": [
          "Floor",
          "Door",
          "Wall",
          "Stairs"
        ],
        "fromX": 12,
        "fromY": 5,
        "toX": 15,
        "toY": 15
      },
      {
        "name": "Outer Grounds",
        "description": "The open grassy area surrounding the fortress, providing ample space for maneuvering and flanking.",
        "terrainTypes": [
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 15,
        "toY": 18
      }
    ],
    "keyPointsOfInterest": [
      "Main Entrance Doors at (7,6) and (8,6)",
      "Central Hall Pillars at (6,4) and (9,4)",
      "Multiple Staircases for vertical movement at various locations"
    ],
    "chokePoints": [
      "Main Entrance Doors at (7,6) and (8,6)",
      "Corridor Doors at (3,9) and (12,9)",
      "Narrow passages in Left and Right Corridors"
    ],
    "strategicConsiderations": [
      "Control of the Grand Entrance is crucial for initial engagements and defense.",
      "Central Hall provides strong defensive positions with pillars and stairs for cover.",
      "Left and Right Corridors offer strategic chokepoints for controlling enemy movement.",
      "Outer Grounds allow for flanking maneuvers and positioning of ranged units."
    ],
    "givenName": "Fortress Entrance",
    "originalName": "Alusq_FE8_3C00CE3E_afro_comb_fort__by_FEU",
    "description": "A fortified structure with a grand entrance and multiple pathways leading inside. The map features a mix of indoor and outdoor areas, with a focus on strategic movement through narrow corridors and open spaces.",
    "setting": "mixed indoor and outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Village",
        "description": "A cluster of buildings including an armory, vendor, and houses, providing resources and cover.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "Armory",
          "Vendor",
          "House",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 17,
        "toY": 5
      },
      {
        "name": "Central Square",
        "description": "An open area with a central village building, surrounded by roads and paths connecting to other regions.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Village",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 17,
        "toY": 10
      },
      {
        "name": "Eastern Homestead",
        "description": "A small residential area with houses and a village, providing strategic cover and resources.",
        "terrainTypes": [
          "Plain",
          "Road",
          "House",
          "Village",
          "Wall",
          "Forest"
        ],
        "fromX": 8,
        "fromY": 4,
        "toX": 17,
        "toY": 10
      },
      {
        "name": "Southern Fortifications",
        "description": "A fortified area with walls, stairs, and narrow passages, ideal for defensive positioning.",
        "terrainTypes": [
          "Wall",
          "Road",
          "Stairs",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 11,
        "toX": 17,
        "toY": 14
      },
      {
        "name": "Western Pathway",
        "description": "A path lined with trees and forests, connecting the northern village to the central square.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 5,
        "toY": 10
      }
    ],
    "keyPointsOfInterest": [
      "Armory at (2,2)",
      "Vendor at (16,3)",
      "Villages at (6,5), (10,8), and (6,5)",
      "Houses at (11,4), (2,8)"
    ],
    "chokePoints": [
      "Narrow roads between walls at (10,3)-(12,3), (10,4)-(12,4), and (11,6)-(12,6)",
      "Stairs at (6,13)-(7,13) and (17,13)"
    ],
    "strategicConsiderations": [
      "Control of the Northern Village provides access to valuable resources like the armory and vendor.",
      "Central Square is crucial for mobility and connecting different regions, making it a key area to control.",
      "Eastern Homestead offers defensive positions and resources, ideal for staging attacks or defense.",
      "Southern Fortifications provide strong defensive positions, especially useful for holding off enemy advances.",
      "Western Pathway is important for quick troop movements and flanking maneuvers, but vulnerable to ambushes due to surrounding forests."
    ],
    "givenName": "Village Outskirts",
    "originalName": "Knights_Villagers_Bandits_3_(0E_00_72_10)__by_Aura_Wolf",
    "description": "A rural map featuring a cluster of buildings surrounded by open fields and a fortified wall to the south.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Throne Chamber",
        "description": "A grand room with a prominent throne, symbolizing power and authority. Highly defensible and strategically important.",
        "terrainTypes": [
          "Floor",
          "Throne",
          "Wall"
        ],
        "fromX": 14,
        "fromY": 2,
        "toX": 18,
        "toY": 4
      },
      {
        "name": "Treasure Vault",
        "description": "A secure room containing a valuable chest, likely holding treasures or important items. Accessible through a locked door.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Door",
          "Wall"
        ],
        "fromX": 3,
        "fromY": 7,
        "toX": 6,
        "toY": 8
      },
      {
        "name": "Main Corridor",
        "description": "A wide corridor connecting various parts of the map, adorned with decorative tiles and pillars for cover.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Wall"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 11,
        "toY": 6
      },
      {
        "name": "Entrance Hall",
        "description": "The initial entry point into the map, leading to other areas. Contains stairs for reinforcements.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 13,
        "toY": 12
      },
      {
        "name": "Side Chambers",
        "description": "Smaller rooms and corridors branching off from the main areas, possibly for strategic positioning and ambushes.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 6
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (15,3)",
      "Chest at (4,7)",
      "Multiple stairs for reinforcements at (3,2), (5,4), (11,5), (9,10), (9,11), (14,7), (15,7), (16,7), (17,5)"
    ],
    "chokePoints": [
      "Door at (6,7) leading to Treasure Vault",
      "Narrow corridors around pillars in Main Corridor"
    ],
    "strategicConsiderations": [
      "Control of the Throne Chamber is crucial for victory; it is highly defensible.",
      "Treasure Vault contains valuable items; securing it early can provide significant advantages.",
      "Main Corridor provides mobility but is vulnerable to ranged attacks due to pillars and narrow spaces.",
      "Entrance Hall is a critical area for reinforcements; controlling stairs can prevent enemy reinforcements.",
      "Side Chambers offer opportunities for ambushes and defensive positioning."
    ],
    "givenName": "Royal Throne Room",
    "originalName": "Knights_Villagers_Bandits_8_(18_00_19_1A)__by_Aura_Wolf",
    "description": "An ornate indoor map featuring a grand throne room, surrounded by intricate corridors and chambers.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Castle",
        "description": "A fortified castle area with walls and a gate, providing strong defensive positions.",
        "terrainTypes": [
          "Wall",
          "Gate",
          "Fort",
          "Plain"
        ],
        "fromX": 3,
        "fromY": 0,
        "toX": 5,
        "toY": 2
      },
      {
        "name": "Western Fort",
        "description": "A small fortification strategically placed along the western road, offering defensive advantages.",
        "terrainTypes": [
          "Fort",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 3,
        "toX": 7,
        "toY": 8
      },
      {
        "name": "Eastern City",
        "description": "A bustling city enclosed by walls, featuring a village and houses, providing significant strategic value.",
        "terrainTypes": [
          "Wall",
          "Village",
          "House",
          "Plain"
        ],
        "fromX": 11,
        "fromY": 6,
        "toX": 14,
        "toY": 10
      },
      {
        "name": "Southern City",
        "description": "A vibrant city with protective walls, houses, and a village, offering strong defensive and economic benefits.",
        "terrainTypes": [
          "Wall",
          "Village",
          "House",
          "Plain"
        ],
        "fromX": 3,
        "fromY": 9,
        "toX": 10,
        "toY": 11
      },
      {
        "name": "Mountain Pass",
        "description": "A rugged mountainous region providing natural barriers and limited access, ideal for defensive maneuvers.",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Cliff",
          "Forest"
        ],
        "fromX": 8,
        "fromY": 0,
        "toX": 14,
        "toY": 4
      },
      {
        "name": "Central Village",
        "description": "A small village centrally located, providing a strategic resting and resupply point.",
        "terrainTypes": [
          "Village",
          "Plain",
          "Forest"
        ],
        "fromX": 4,
        "fromY": 11,
        "toX": 8,
        "toY": 14
      },
      {
        "name": "Southern Village",
        "description": "A peaceful village near the mountains, offering a quiet retreat and strategic positioning.",
        "terrainTypes": [
          "Village",
          "Plain",
          "Forest",
          "Hill",
          "Mountain"
        ],
        "fromX": 11,
        "fromY": 11,
        "toX": 14,
        "toY": 14
      }
    ],
    "keyPointsOfInterest": [
      "Northern Castle Gate at (4,2)",
      "Eastern City Village at (12,8)",
      "Southern City Village at (4,11)",
      "Central Village at (4,11)",
      "Southern Village at (11,11)",
      "Houses at (10,10), (1,12)"
    ],
    "chokePoints": [
      "Northern Castle Gate at (4,2)",
      "Walls surrounding Eastern City and Southern City",
      "Mountain Pass cliffs and mountains"
    ],
    "strategicConsiderations": [
      "Northern Castle provides strong defensive positions, ideal for holding against enemy advances.",
      "Eastern and Southern Cities offer economic and defensive advantages, crucial for maintaining control.",
      "Mountain Pass restricts movement, making it a critical area for controlling enemy mobility.",
      "Central and Southern Villages provide valuable resupply points, essential for sustaining prolonged engagements.",
      "Western Fort offers strategic defense along the western road, useful for controlling troop movements."
    ],
    "givenName": "Twin Cities Crossroads",
    "originalName": "Knights_Villagers_Bandits_1_(01_00_02_03)__by_Aura_Wolf",
    "description": "A vibrant map featuring two bustling cities connected by winding roads, surrounded by forests and mountains.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Coastal Cliffs",
        "description": "A rugged coastal area with cliffs and sea, providing limited access and excellent defensive positions.",
        "terrainTypes": [
          "Sea",
          "Cliff",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 20,
        "toY": 4
      },
      {
        "name": "Central Plains and Forests",
        "description": "Open plains interspersed with forests, offering moderate cover and mobility for units.",
        "terrainTypes": [
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 20,
        "toY": 10
      },
      {
        "name": "Western Village and Fortifications",
        "description": "A fortified village area with walls and a gate, providing strong defensive capabilities and resources.",
        "terrainTypes": [
          "Village",
          "Wall",
          "Gate",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 6,
        "toX": 4,
        "toY": 12
      },
      {
        "name": "Eastern Village and Fortifications",
        "description": "A fortified village area with walls and a gate, strategically important for controlling eastern movements.",
        "terrainTypes": [
          "Village",
          "Wall",
          "Gate",
          "Plain",
          "Forest"
        ],
        "fromX": 15,
        "fromY": 2,
        "toX": 17,
        "toY": 12
      },
      {
        "name": "Southern Plains and Bridges",
        "description": "Open plains with multiple bridges, crucial for controlling troop movements and supply lines.",
        "terrainTypes": [
          "Plain",
          "Bridge",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 20,
        "toY": 18
      },
      {
        "name": "Southern Coastal Cliffs",
        "description": "A coastal area with cliffs and sea, limiting access and providing natural defensive barriers.",
        "terrainTypes": [
          "Sea",
          "Cliff",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 19,
        "toX": 20,
        "toY": 20
      }
    ],
    "keyPointsOfInterest": [
      "Western Village at (3,8)",
      "Eastern Village at (16,4)",
      "Central Fort at (12,14)",
      "Armory at (1,16)",
      "Vendor at (2,19)"
    ],
    "chokePoints": [
      "Western Gate at (11,12)",
      "Eastern Gate at (11,12)",
      "Bridges at (7,9), (15,8), (16,8), (13,16), (4,17), (4,18)"
    ],
    "strategicConsiderations": [
      "Control of bridges is crucial for mobility and supply lines.",
      "Fortified villages provide defensive strongholds and resources.",
      "Coastal cliffs limit movement, making them ideal for defensive positioning.",
      "Central plains offer open combat areas, suitable for cavalry and ranged units.",
      "Southern coastal cliffs provide natural barriers, restricting enemy flanking maneuvers."
    ],
    "givenName": "River Crossing Clash",
    "originalName": "Mages_Mercenaries_4_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic map featuring multiple river crossings and fortified positions. The terrain is varied with bridges connecting key areas, making control of these points crucial.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Fortress Interior",
        "description": "The interior of the fortress, featuring floors, pillars, and stairs. Highly defensible with limited entry points.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 9,
        "fromY": 0,
        "toX": 15,
        "toY": 7
      },
      {
        "name": "Riverside Path",
        "description": "A narrow path along the river, including a bridge and road, providing access to the fortress. Vulnerable to ranged attacks from cliffs.",
        "terrainTypes": [
          "Road",
          "Bridge",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 3,
        "toY": 4
      },
      {
        "name": "Cliffside Forest",
        "description": "Forested area with cliffs and sea, providing natural barriers and cover. Ideal for ambushes and defensive positioning.",
        "terrainTypes": [
          "Forest",
          "Cliff",
          "Sea",
          "Plain"
        ],
        "fromX": 1,
        "fromY": 1,
        "toX": 8,
        "toY": 9
      },
      {
        "name": "Village Outskirts",
        "description": "A small village area near the river, featuring a village tile and roads. Important for resource gathering and unit recruitment.",
        "terrainTypes": [
          "Village",
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 3,
        "toY": 11
      },
      {
        "name": "Secluded Fort",
        "description": "A small isolated fort providing strategic advantage and defensive capabilities. Accessible via roads.",
        "terrainTypes": [
          "Fort",
          "Road",
          "Plain"
        ],
        "fromX": 10,
        "fromY": 9,
        "toX": 12,
        "toY": 10
      },
      {
        "name": "Open Plains",
        "description": "Open area with minimal cover, ideal for cavalry and ranged units. Connects the fortress and secluded fort.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest"
        ],
        "fromX": 9,
        "fromY": 8,
        "toX": 15,
        "toY": 11
      }
    ],
    "keyPointsOfInterest": [
      "Fortress Entrance at (9,0)",
      "Village at (2,10)",
      "Secluded Fort at (12,10)",
      "Stairs inside Fortress at (9,2) and (12,7)"
    ],
    "chokePoints": [
      "Bridge at (0,2)",
      "Fortress Entrance at (9,0)",
      "Narrow paths through cliffs at (1,4) and (5,8)"
    ],
    "strategicConsiderations": [
      "Control of the fortress interior is crucial for defense and reinforcement.",
      "The riverside path is vulnerable to ranged attacks from cliffs; use caution when advancing.",
      "The secluded fort provides a strategic advantage for controlling the southern region.",
      "Open plains offer mobility advantages for cavalry but leave units exposed to ranged attacks.",
      "Village outskirts are important for resource management and unit recruitment; secure early."
    ],
    "givenName": "Fortress Riverfront",
    "originalName": "Nobles_Evil_Doers_4_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "A strategic map featuring a fortress by a river, with a village and a fort nearby.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Castle Grounds",
        "description": "A fortified area with walls and a gate, providing strong defensive positions.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Wall",
          "Gate"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 7,
        "toY": 8
      },
      {
        "name": "Central River Crossing",
        "description": "A strategic river with bridges, serving as critical choke points for movement.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Fort"
        ],
        "fromX": 8,
        "fromY": 0,
        "toX": 11,
        "toY": 6
      },
      {
        "name": "Eastern Fortress",
        "description": "A heavily fortified area with walls, cliffs, and a gate, providing excellent defensive capabilities.",
        "terrainTypes": [
          "Wall",
          "Gate",
          "Cliff",
          "Fort",
          "Plain"
        ],
        "fromX": 18,
        "fromY": 2,
        "toX": 23,
        "toY": 5
      },
      {
        "name": "Northern Forest Villages",
        "description": "A region with scattered forests and forts, offering cover and defensive positions.",
        "terrainTypes": [
          "Forest",
          "Fort",
          "Plain",
          "Hill"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 7,
        "toY": 4
      },
      {
        "name": "Southern Coastal Plains",
        "description": "Open plains near the sea, with scattered forests and forts, suitable for rapid movement.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort",
          "Sea",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 18,
        "toY": 12
      },
      {
        "name": "Mountain Range",
        "description": "A rugged mountainous area providing natural defense and limited mobility.",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Cliff"
        ],
        "fromX": 12,
        "fromY": 0,
        "toX": 23,
        "toY": 2
      }
    ],
    "keyPointsOfInterest": [
      "Western Castle Gate at (2,7)",
      "Central Bridges at (11,4) and (11,5)",
      "Eastern Fortress Gate at (19,4)",
      "Southern House at (3,11) and (20,10)"
    ],
    "chokePoints": [
      "Western Castle Gate at (2,7)",
      "Central River Bridges at (11,4) and (11,5)",
      "Eastern Fortress Gate at (19,4)"
    ],
    "strategicConsiderations": [
      "Control of the central bridges is crucial for mobility and reinforcement.",
      "The Western Castle and Eastern Fortress provide strong defensive positions and should be prioritized for defense or assault.",
      "The Southern Coastal Plains offer open terrain for cavalry and rapid troop movements but are vulnerable to ranged attacks from cliffs and forts.",
      "The Mountain Range restricts movement and provides natural defensive barriers, ideal for positioning ranged units."
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
        "description": "A fortified area with walls and a gate, providing strong defensive positions and control over the northern part of the map.",
        "terrainTypes": [
          "Wall",
          "Gate",
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 10,
        "fromY": 0,
        "toX": 12,
        "toY": 2
      },
      {
        "name": "Southern Fortress",
        "description": "A fortified area at the southern end, mirroring the northern fortress, providing strategic defense and control.",
        "terrainTypes": [
          "Wall",
          "Village",
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 10,
        "fromY": 12,
        "toX": 12,
        "toY": 14
      },
      {
        "name": "Central Lake",
        "description": "A large body of water creating a natural barrier, limiting movement and providing strategic chokepoints.",
        "terrainTypes": [
          "Sea"
        ],
        "fromX": 9,
        "fromY": 6,
        "toX": 14,
        "toY": 9
      },
      {
        "name": "Western Village",
        "description": "A small village surrounded by walls, offering resources and shelter, strategically positioned on the western side.",
        "terrainTypes": [
          "Village",
          "Wall",
          "Plain",
          "Forest"
        ],
        "fromX": 1,
        "fromY": 6,
        "toX": 3,
        "toY": 8
      },
      {
        "name": "Eastern Pathway",
        "description": "A winding path connecting the northern and southern fortresses, passing by the central lake, crucial for mobility.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 7,
        "fromY": 3,
        "toX": 10,
        "toY": 12
      },
      {
        "name": "Mountain Range",
        "description": "A small mountain range providing natural defense and limiting movement, located at the bottom left.",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Forest",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 14,
        "toX": 3,
        "toY": 16
      },
      {
        "name": "Northern Village Cluster",
        "description": "A cluster of villages and houses providing resources, located at the top left, offering strategic value.",
        "terrainTypes": [
          "House",
          "Vendor",
          "Armory",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 5,
        "toY": 4
      }
    ],
    "keyPointsOfInterest": [
      "Northern Fortress Gate at (11,2)",
      "Southern Fortress Village at (11,14)",
      "Western Village at (2,8)",
      "Armory at (3,4)",
      "Vendor at (3,2)"
    ],
    "chokePoints": [
      "Gate at Northern Fortress (11,2)",
      "Narrow paths around Central Lake",
      "Walls surrounding Western Village"
    ],
    "strategicConsiderations": [
      "Control of the fortresses is crucial for defense and offense.",
      "The central lake significantly restricts movement, making control of surrounding paths vital.",
      "The Western Village provides valuable resources and should be secured early.",
      "Mountain Range offers defensive advantages but limits mobility, requiring careful positioning of units.",
      "Northern Village Cluster provides early-game resources and should be contested quickly."
    ],
    "givenName": "Twin Fortresses Pathway",
    "originalName": "Knights_Villagers_Bandits_12_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic outdoor map featuring two fortresses connected by a winding path, with a central lake and surrounding villages.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Chambers",
        "description": "A series of enclosed rooms with narrow passages, pillars, and stairs, providing defensive positions and strategic mobility.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 31,
        "toY": 6
      },
      {
        "name": "Central Waterway",
        "description": "A wide channel of water running horizontally through the center, creating natural barriers and chokepoints.",
        "terrainTypes": [
          "Sea",
          "Lake",
          "Bridge"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 31,
        "toY": 19
      },
      {
        "name": "Eastern Bridge",
        "description": "A stone bridge crossing the waterway, connecting the northern and southern parts, crucial for mobility and control.",
        "terrainTypes": [
          "Bridge",
          "Floor"
        ],
        "fromX": 15,
        "fromY": 16,
        "toX": 16,
        "toY": 17
      },
      {
        "name": "Western Bridge",
        "description": "A stone bridge crossing the waterway, connecting the northern and southern parts, crucial for mobility and control.",
        "terrainTypes": [
          "Bridge",
          "Floor"
        ],
        "fromX": 15,
        "fromY": 16,
        "toX": 16,
        "toY": 17
      },
      {
        "name": "Southern Halls",
        "description": "Open halls with access to the waterway and bridges, featuring pillars and stairs for strategic positioning.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 20,
        "toX": 31,
        "toY": 25
      }
    ],
    "keyPointsOfInterest": [
      "Eastern Bridge at (15,16)-(16,17)",
      "Western Bridge at (15,16)-(16,17)",
      "Multiple staircases for reinforcements and mobility"
    ],
    "chokePoints": [
      "Eastern Bridge",
      "Western Bridge",
      "Narrow passages in Northern Chambers"
    ],
    "strategicConsiderations": [
      "Control of bridges is essential for mobility and map control.",
      "Northern Chambers provide defensive positions but limited mobility.",
      "Southern Halls offer open spaces for maneuvering but require careful positioning to avoid being flanked.",
      "Utilize staircases for rapid deployment and reinforcement."
    ],
    "givenName": "Ancient Aqueduct",
    "originalName": "Nobles_Evil_Doers_8_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "A complex indoor map featuring a network of waterways and stone structures, creating a maze-like environment.",
    "setting": "indoor"
  }
];