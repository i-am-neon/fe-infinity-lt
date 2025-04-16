import { MapMetadata } from "@/types/maps/map-metadata.ts";

  export const allMapOptions: MapMetadata[] = [
  {
    "distinctRegions": [
      {
        "name": "Castle Throne Room",
        "description": "The innermost chamber of the fortress, containing the throne. Highly defensible and only accessible via stairs and narrow corridors.",
        "terrainTypes": [
          "Floor",
          "Throne"
        ],
        "fromX": 2,
        "fromY": 0,
        "toX": 8,
        "toY": 2
      },
      {
        "name": "Northern Stairs Hall",
        "description": "A hall with stairs leading up to the throne room, acting as a buffer zone and choke point for attackers.",
        "terrainTypes": [
          "Stairs",
          "Floor"
        ],
        "fromX": 4,
        "fromY": 2,
        "toX": 6,
        "toY": 4
      },
      {
        "name": "Central Fortress Road",
        "description": "The main thoroughfare through the fortress, connecting the north and south. Contains armories, vendors, and is flanked by forests and plains for tactical movement.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest",
          "Armory",
          "Vendor"
        ],
        "fromX": 0,
        "fromY": 4,
        "toX": 20,
        "toY": 16
      },
      {
        "name": "Eastern Treasure Alcove",
        "description": "A small, walled-off area containing treasure chests, accessible from the main road via a door.",
        "terrainTypes": [
          "Chest",
          "Road"
        ],
        "fromX": 17,
        "fromY": 1,
        "toX": 20,
        "toY": 2
      },
      {
        "name": "Arena Complex",
        "description": "A central arena surrounded by roads and forests, ideal for duels and skirmishes.",
        "terrainTypes": [
          "Arena",
          "Road",
          "Forest",
          "Plain"
        ],
        "fromX": 6,
        "fromY": 16,
        "toX": 10,
        "toY": 17
      },
      {
        "name": "Village Row",
        "description": "A series of villages lining the southern and eastern edges, providing cover and potential objectives.",
        "terrainTypes": [
          "Village",
          "Road",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 15,
        "toX": 20,
        "toY": 26
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (5,1)",
      "Chests at (18,1) and (20,1)",
      "Armory at (14,10) and (19,11)",
      "Vendor at (2,12)",
      "Arena at (6,16)",
      "Multiple Villages at (1,18), (13,18), (15,15), (19,15), (13,24), (1,24), (19,21), (15,21)"
    ],
    "chokePoints": [
      "Stairs at (4,3)-(6,3)",
      "Doors at (4,8), (5,8), (5,8)",
      "Narrow road sections between walls at (7,7)-(8,7), (13,9)-(14,9), (13,14)-(14,14)"
    ],
    "strategicConsiderations": [
      "The throne room is highly defensible, with only one main approach via stairs.",
      "The central road is open but flanked by forests, allowing for ambushes and cover.",
      "The treasure alcove is isolated and can be easily defended or trapped.",
      "The arena provides a large open space for direct confrontations.",
      "Villages on the periphery can be used for defense or as objectives for side missions.",
      "Choke points at doors and stairs should be controlled to prevent enemy advances."
    ],
    "givenName": "Fortress Approach",
    "originalName": "Chapter7OstiasRebellion_Diff_Tileset__by_Shin19",
    "description": "A strategic map featuring a fortified castle entrance, surrounded by villages and a central arena. The layout encourages tactical movement through narrow paths and open areas.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Treasure Chamber",
        "description": "A small, well-guarded room in the northwest corner containing a valuable chest. Accessible only through a locked door, making it a prime target for thieves and a defensive stronghold for enemies.",
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
        "name": "Grand Central Hall",
        "description": "A large, open hall with pillars providing cover. This is the main thoroughfare of the ruins, connecting most other regions and offering both mobility and defensive options.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 5,
        "fromY": 4,
        "toX": 15,
        "toY": 6
      },
      {
        "name": "Northern Corridor",
        "description": "A narrow corridor running along the northern edge of the ruins, connecting the Treasure Chamber to the Grand Central Hall. Useful for flanking or quick movement between rooms.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 5,
        "fromY": 0,
        "toX": 8,
        "toY": 3
      },
      {
        "name": "Western Hallway",
        "description": "A long hallway along the western side, with pillars for cover. Provides access to the central hall and southern rooms, and is a likely route for reinforcements or ambushes.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 4,
        "toY": 13
      },
      {
        "name": "Southern Gallery",
        "description": "A wide southern room with pillars, likely serving as a staging area or final defensive line before the exit. Offers multiple routes into the central hall.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 5,
        "fromY": 12,
        "toX": 17,
        "toY": 13
      },
      {
        "name": "Eastern Passage",
        "description": "A narrow passage along the eastern edge, connecting the north to the southern gallery. Useful for flanking or as an escape route.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 15,
        "toY": 3
      },
      {
        "name": "Southeast Exit Hall",
        "description": "A small hall in the southeast corner, likely serving as the main exit or entrance to the ruins. Provides a final choke point for defenders.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 15,
        "fromY": 10,
        "toX": 17,
        "toY": 13
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (2,2)",
      "Pillars at (7,5), (13,5), (12,12), (3,13), (8,13), (13,12), (8,5)",
      "Stairs at (2,11), (3,11), (4,11)",
      "Door at (2,0)"
    ],
    "chokePoints": [
      "Door at (2,0) leading to Treasure Chamber",
      "Narrow corridor at (5,0)-(8,3)",
      "Pillar clusters in Grand Central Hall",
      "Southeast exit at (15,10)-(17,13)"
    ],
    "strategicConsiderations": [
      "The Treasure Chamber is highly defensible but only accessible through a single door, making it easy to block or trap units.",
      "The Grand Central Hall is the main battleground, with pillars providing both cover and obstacles for movement.",
      "The Western Hallway and Northern Corridor allow for flanking maneuvers or reinforcement routes.",
      "The Southern Gallery and Southeast Exit Hall are likely escape or reinforcement points; controlling these can prevent enemy reinforcements or allow for a safe retreat.",
      "Pillars and narrow passages create natural choke points, ideal for defensive stands or ambushes.",
      "Stairs in the southwest may be used for reinforcements or as a secondary objective."
    ],
    "givenName": "Ancient Ruins",
    "originalName": "Nobles_Evil_Doers_9_(5F_00_60_61)__by_Aura_Wolf",
    "description": "A mysterious indoor map featuring stone pathways, overgrown vegetation, and hidden treasures.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Grand Central Hall",
        "description": "A large, open hall with pillars for cover, serving as the main hub and connecting point for the map. Multiple entrances and exits make it a key area for movement and control.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 19,
        "toY": 2
      },
      {
        "name": "Northern Corridor",
        "description": "A long corridor running along the north side of the map, featuring stairs and pillars. Provides access between the Grand Central Hall and the right wing.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 9,
        "fromY": 2,
        "toX": 19,
        "toY": 3
      },
      {
        "name": "Left Wing Chambers",
        "description": "A series of interconnected rooms and corridors on the left side, offering strategic cover and movement options. Includes some plain tiles at the southern edge.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 3,
        "toX": 7,
        "toY": 11
      },
      {
        "name": "Right Wing Chambers",
        "description": "A mirrored layout of the Left Wing, providing similar strategic opportunities on the right side. Contains stairs and some plain tiles at the southern edge.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Plain",
          "Stairs"
        ],
        "fromX": 12,
        "fromY": 3,
        "toX": 26,
        "toY": 11
      },
      {
        "name": "Central Southern Passage",
        "description": "A narrow corridor leading to smaller rooms, offering a tactical approach from the bottom. Contains stairs and pillars, making it a defensible route.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar"
        ],
        "fromX": 8,
        "fromY": 7,
        "toX": 18,
        "toY": 11
      }
    ],
    "keyPointsOfInterest": [
      "Stairs at (19,2), (10,3), (25,2), (25,3), (25,4), (25,6), (16,6), (16,9), (16,10), (26,9)",
      "Pillars scattered throughout the map, especially in the central and wing chambers"
    ],
    "chokePoints": [
      "Narrow corridors at (8,1)-(8,2), (14,4)-(14,5), (14,8)-(14,9), (16,5)-(16,6), (17,8)-(17,9), (18,5)-(18,6), (25,5)-(25,6)",
      "Entrances to the Grand Central Hall from the wings and southern passage"
    ],
    "strategicConsiderations": [
      "The Grand Central Hall is the main area of control; holding it allows rapid response to threats in any direction.",
      "Pillars and walls provide cover for defensive play, especially in the wings.",
      "Stairs may be used for reinforcements or flanking maneuvers.",
      "Choke points in corridors and entrances can be used to limit enemy movement and set up ambushes.",
      "The southern passage is a potential route for surprise attacks or reinforcements."
    ],
    "givenName": "Ancient Ruins",
    "originalName": "Nobles_Evil_Doers_6_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "A complex indoor map featuring multiple rooms and corridors, with a mix of open spaces and narrow passages.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Plains and Fort",
        "description": "A large open area with scattered forests and hills, containing a fort (5,1), a vendor (4,9), and an armory (1,10). This region is ideal for cavalry and infantry movement, with defensive options at the fort and vendor.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort",
          "Hill",
          "Vendor",
          "Armory"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 11
      },
      {
        "name": "Northwestern Village Enclave",
        "description": "A walled-off village at (2,7), accessible only from the west. Provides a defensive position and potential for civilian rescue or rewards.",
        "terrainTypes": [
          "Village",
          "Wall"
        ],
        "fromX": 1,
        "fromY": 6,
        "toX": 3,
        "toY": 7
      },
      {
        "name": "Central Mountain Range",
        "description": "A massive, impassable mountain range running north-south, splitting the map and severely restricting movement. Only fliers can cross directly.",
        "terrainTypes": [
          "Mountain",
          "Hill"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 12,
        "toY": 8
      },
      {
        "name": "Northern Castle Approach",
        "description": "The approach to the castle, with open plains, forests, and a fort at (5,1). Provides staging ground for assaults on the castle gate.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort",
          "Hill"
        ],
        "fromX": 5,
        "fromY": 0,
        "toX": 18,
        "toY": 3
      },
      {
        "name": "Eastern Castle Grounds",
        "description": "A fortified area with walls and a gate at (16,6), containing houses and a forest. The main defensive stronghold, likely the map's objective.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Wall",
          "Gate",
          "House"
        ],
        "fromX": 13,
        "fromY": 4,
        "toX": 18,
        "toY": 11
      },
      {
        "name": "Southern Trade Road",
        "description": "A broad southern road with houses, a fort (14,11), and forests. Connects the western and eastern sides of the map, providing a route around the mountains.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill",
          "House",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 18,
        "toY": 11
      }
    ],
    "keyPointsOfInterest": [
      "Fort at (5,1)",
      "Vendor at (4,9)",
      "Armory at (1,10)",
      "Village at (2,7)",
      "Gate at (16,6)",
      "House at (16,9)",
      "House at (5,11)",
      "Fort at (14,11)"
    ],
    "chokePoints": [
      "Mountain range from (7,0) to (12,8) blocks central passage",
      "Gate at (16,6) is the only direct entrance to the castle grounds",
      "Walled village at (2,7) only accessible from the west"
    ],
    "strategicConsiderations": [
      "The central mountain range forces armies to take the northern or southern routes, making the gate and southern road critical for movement.",
      "The castle grounds are highly defensible due to walls and a single gate; attackers must concentrate forces or use fliers.",
      "The western fort and vendor provide defensive and resupply options for the western army.",
      "The southern road is the main route for flanking or bypassing the mountains, but is exposed to attacks from both sides.",
      "The walled village can be used as a defensive fallback or to secure civilian objectives.",
      "Fliers have a significant advantage in mobility due to the impassable mountains."
    ],
    "givenName": "Mountain Pass Siege",
    "originalName": "Knights_Villagers_Bandits_4_(01_00_38_03)__by_Aura_Wolf",
    "description": "A strategic map featuring a central mountain range dividing a village and a castle, with various paths and structures scattered around.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Throne Room",
        "description": "A fortified chamber containing the throne, likely the main objective. Defensible with limited entrances and surrounded by walls.",
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
        "name": "Grand Pillared Hall",
        "description": "A large open hall with pillars and stairs, providing both cover and vertical access. Connects the throne room to the rest of the fortress.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 11,
        "fromY": 1,
        "toX": 21,
        "toY": 6
      },
      {
        "name": "Central Maze of Corridors",
        "description": "A complex network of winding corridors and doors, forming the main interior maze of the fortress. Multiple access points and choke points.",
        "terrainTypes": [
          "Floor",
          "Door"
        ],
        "fromX": 5,
        "fromY": 3,
        "toX": 23,
        "toY": 7
      },
      {
        "name": "Northern Treasure Gallery",
        "description": "A secure gallery with several chests, accessible from the main hall and protected by doors. Valuable loot and a potential side objective.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Pillar"
        ],
        "fromX": 25,
        "fromY": 3,
        "toX": 28,
        "toY": 8
      },
      {
        "name": "Southern Treasure Vault",
        "description": "A vault in the southeast with multiple chests, protected by doors. High-value area for treasure-seeking units.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Door"
        ],
        "fromX": 25,
        "fromY": 10,
        "toX": 28,
        "toY": 16
      },
      {
        "name": "Left Treasure Room",
        "description": "A small, isolated room on the west side containing chests, accessible through a door. Good for side objectives or ambushes.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Door"
        ],
        "fromX": 4,
        "fromY": 20,
        "toX": 7,
        "toY": 24
      },
      {
        "name": "Southwestern Hallway",
        "description": "A hallway leading to the left treasure room, with a chest and access to the main southern corridor.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 4,
        "fromY": 18,
        "toX": 7,
        "toY": 19
      },
      {
        "name": "Main Southern Corridor",
        "description": "A broad corridor running along the southern edge of the fortress, connecting the entrance to the central maze and treasure rooms.",
        "terrainTypes": [
          "Floor",
          "Door"
        ],
        "fromX": 8,
        "fromY": 16,
        "toX": 24,
        "toY": 21
      },
      {
        "name": "Fortress Entrance Hall",
        "description": "The main entrance to the fortress, featuring stairs and direct access to the central maze. Key for both defense and initial assault.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 18,
        "fromY": 0,
        "toX": 19,
        "toY": 1
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (9,1)",
      "Multiple chests at (27,4), (26,6), (27,8), (26,12), (27,12), (5,20), (5,23)",
      "Stairs at (18,0), (19,0), (12,6), (26,20), (11,25), (12,25)",
      "Doors at (24,5), (8,7), (9,7), (24,5), (7,20), (24,5), (26,10), (27,14)"
    ],
    "chokePoints": [
      "Doors at (8,7), (9,7), (24,5), (7,20), (26,10), (27,14)",
      "Narrow corridors in the central maze (e.g., (15,7), (16,7))"
    ],
    "strategicConsiderations": [
      "The throne room is highly defensible with limited access and surrounded by walls.",
      "The central maze of corridors creates multiple ambush points and makes direct assaults difficult.",
      "Treasure rooms are isolated and require passing through doors, making them easy to defend but also easy to trap.",
      "The main southern corridor allows for rapid movement between the entrance and the rest of the fortress.",
      "Stairs and pillars in the grand hall provide both cover and vertical mobility, favoring units with high movement or flying capabilities.",
      "Choke points at doors and narrow corridors are ideal for defensive stands or delaying enemy advances."
    ],
    "givenName": "Fortress Maze",
    "originalName": "Chapter12TheTrueEnemy_Fire_tileset_Minor_Changes__by_Shin19",
    "description": "A complex indoor fortress with winding corridors and multiple treasure rooms.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Fortress Hall",
        "description": "A large, enclosed stone hall with pillars and a chest, accessible by stairs to the south. This is the main defensive structure, likely the command center or throne room.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Chest",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 16,
        "toY": 4
      },
      {
        "name": "Central Courtyard",
        "description": "A spacious open area with scattered trees, roads, and some hills, serving as the main outdoor space and the primary battlefield between the fortress and the barracks.",
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
        "name": "Western Barracks",
        "description": "A stone building in the southwest corner, featuring pillars and stairs, likely used for troop accommodation or as a defensive fallback.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 14,
        "toX": 2,
        "toY": 17
      },
      {
        "name": "Eastern Barracks and Treasury",
        "description": "A fortified stone building in the southeast, containing a chest and a locked door, serving as a treasury or storage area and a key defensive position.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar",
          "Chest",
          "Door"
        ],
        "fromX": 13,
        "fromY": 13,
        "toX": 19,
        "toY": 17
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (1,1) in the Northern Fortress Hall",
      "Chest at (19,10) in the Eastern Barracks and Treasury",
      "Stairs at (12,3), (16,0), (16,1), (16,2), (8,6), (9,16), (3,17), (9,17), (16,13)",
      "Door at (19,12) in the Eastern Barracks and Treasury"
    ],
    "chokePoints": [
      "Stairs at (12,3) and (8,6) connecting the Northern Fortress Hall to the Central Courtyard",
      "Door at (19,12) restricting access to the Eastern Barracks and Treasury",
      "Narrow wall gaps at (8,5) and (8,6) between the Central Courtyard and the fortress/barracks"
    ],
    "strategicConsiderations": [
      "The Northern Fortress Hall is highly defensible with limited entrances and pillars for cover.",
      "The Central Courtyard is open and exposed, favoring mobile units and ranged attackers.",
      "The Western Barracks provides a fallback position for defenders and can be used to flank attackers in the courtyard.",
      "The Eastern Barracks and Treasury is a high-value target due to the chest and is protected by a locked door, making it a key objective for both offense and defense.",
      "Control of the stairs and door choke points is critical for movement between regions and for maintaining defensive lines."
    ],
    "givenName": "Fortress Courtyard",
    "originalName": "Knights_Villagers_Bandits_10_(3C_00_CE_3E)__by_Aura_Wolf",
    "description": "A fortified outdoor area surrounded by stone structures, featuring a central open space with scattered trees and pathways.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Castle Approach",
        "description": "The northern approach to the castle, featuring a mix of plains, forests, and rivers, with bridges and a fortified gate. The area is bounded by mountains and cliffs to the east and south, and walls and a gate block direct access to the castle interior.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "River",
          "Bridge",
          "Fort",
          "Wall",
          "Gate",
          "Hill",
          "Mountain",
          "Cliff",
          "House"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 9,
        "toY": 4
      },
      {
        "name": "Castle Interior and Courtyard",
        "description": "A small, enclosed castle area behind walls and a gate, containing a fort tile. This is a key defensive position and likely the main objective for attackers.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Gate",
          "Fort"
        ],
        "fromX": 7,
        "fromY": 1,
        "toX": 9,
        "toY": 4
      },
      {
        "name": "Northeastern Mountain Pass",
        "description": "A rugged mountain pass with limited access, providing natural defense and high ground. Difficult terrain restricts movement, favoring defenders.",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Cliff",
          "Plain",
          "Forest"
        ],
        "fromX": 10,
        "fromY": 0,
        "toX": 16,
        "toY": 6
      },
      {
        "name": "Central River Crossing",
        "description": "The main river bisects the map, with several bridges and fords allowing passage. This area is a major chokepoint and the focus of most engagements.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Forest",
          "Cliff"
        ],
        "fromX": 3,
        "fromY": 3,
        "toX": 12,
        "toY": 12
      },
      {
        "name": "Western Village and Outskirts",
        "description": "A small village and its outskirts, including a house and fort. Provides resources and a defensive fallback for western forces.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Fort",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 2,
        "toX": 4,
        "toY": 14
      },
      {
        "name": "Eastern Village and Settlement",
        "description": "A cluster of houses and a fort in the eastern part of the map, offering supplies and a strong defensive position.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Fort",
          "Cliff"
        ],
        "fromX": 13,
        "fromY": 10,
        "toX": 16,
        "toY": 16
      },
      {
        "name": "Southern Plains and Market",
        "description": "A broad southern plain with several villages, an armory, a vendor, and bridges leading north. The area is partially bounded by cliffs and the sea, with multiple access points for reinforcements.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort",
          "Armory",
          "Vendor",
          "Village",
          "Bridge",
          "Cliff",
          "Sea",
          "House"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 16,
        "toY": 22
      }
    ],
    "keyPointsOfInterest": [
      "Castle Gate at (8,3)",
      "Fort at (4,1)",
      "House at (0,2)",
      "Bridge at (4,3)",
      "Bridge at (4,4)",
      "Fort at (8,7)",
      "Fort at (12,12)",
      "Village at (2,20)",
      "Armory at (5,20)",
      "Vendor at (11,20)",
      "Bridge at (8,20)",
      "Bridge at (8,21)",
      "Fort at (13,10)",
      "Fort at (15,13)",
      "House at (16,14)"
    ],
    "chokePoints": [
      "Castle Gate at (8,3)",
      "Bridges at (4,3), (4,4), (9,8), (10,8), (8,20), (8,21), (14,11), (15,11)",
      "Mountain pass between (10,0)-(16,6)",
      "Walls enclosing castle interior (7,1)-(9,4)"
    ],
    "strategicConsiderations": [
      "The central river and its bridges are the main chokepoints; controlling them is vital for movement between north and south.",
      "The castle interior is highly defensible, accessible only through a single gate and surrounded by walls.",
      "Mountain and cliff terrain in the northeast restricts movement and provides natural defense.",
      "Villages and forts on the flanks offer healing and defensive bonuses, and are important for resource control.",
      "The southern plains provide open maneuvering space but are vulnerable to attacks from multiple directions.",
      "Armory and vendor in the south are key for resupplying units during prolonged engagements.",
      "Sea and cliff tiles in the south and east limit movement and can be used to funnel enemy advances."
    ],
    "givenName": "River Crossing Battle",
    "originalName": "Knights_Villagers_Bandits_13_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic map featuring a central river with multiple bridges, surrounded by villages and a castle.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Fortress Hall",
        "description": "A series of connected indoor rooms and corridors with pillars and chests, forming the western side of the fortress. Contains a door at (2,16) and several chests, making it a valuable area for loot and defense.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Chest",
          "Door"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 16
      },
      {
        "name": "Central Fortress Courtyard",
        "description": "A large open courtyard surrounded by walls and buildings, with scattered forest tiles and stairs. This area serves as the main battleground and is accessible from multiple directions, making it strategically important for both offense and defense.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Stairs"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 20,
        "toY": 16
      },
      {
        "name": "Eastern Fortress Hall",
        "description": "A series of connected indoor rooms and corridors with pillars and stairs, forming the eastern side of the fortress. Provides flanking opportunities and access to the central courtyard.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 15,
        "fromY": 0,
        "toX": 20,
        "toY": 16
      },
      {
        "name": "Northern Throne Room",
        "description": "A small, well-defended room at the north end of the fortress, containing the throne. This is a key objective area, likely the victory condition for seize or defend missions.",
        "terrainTypes": [
          "Floor",
          "Throne",
          "Pillar"
        ],
        "fromX": 9,
        "fromY": 5,
        "toX": 11,
        "toY": 6
      },
      {
        "name": "Southern Outer Road",
        "description": "A broad road and plain area outside the southern wall of the fortress, with some forest tiles for cover. This area is likely the main approach for attackers and offers multiple entry points into the fortress.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest"
        ],
        "fromX": 3,
        "fromY": 17,
        "toX": 20,
        "toY": 21
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (10,5)",
      "Chests at (0,14), (0,16), (0,18)",
      "Door at (2,16)",
      "Stairs at (3,3), (15,3), (7,9), (13,9), (18,9), (18,10), (9,20), (10,20), (11,20), (6,18), (14,18)",
      "Pillars at (0,0), (4,0), (2,1), (6,16), (14,16), (10,17), (10,15), (19,15), (20,10), (20,15)"
    ],
    "chokePoints": [
      "Door at (2,16)",
      "Narrow corridor at (7,6)-(7,7)",
      "Stairs at (3,3), (15,3), (7,9), (13,9), (18,9), (18,10), (9,20), (10,20), (11,20), (6,18), (14,18)",
      "Entrances to throne room at (9,5), (11,5)"
    ],
    "strategicConsiderations": [
      "The central courtyard is highly exposed and can be attacked from multiple directions; control of the flanking halls is crucial.",
      "The throne room is a key defensive position, with limited access points that can be easily blocked.",
      "The western and eastern halls provide access to chests and allow for flanking maneuvers.",
      "The southern road is the main approach for attackers; defenders should be wary of multiple entry points.",
      "Stairs and doors act as natural choke points and should be used to control enemy movement."
    ],
    "givenName": "Fortress Courtyard",
    "originalName": "Nobles_Evil_Doers_11_(3C_00_68_3E)__by_Aura_Wolf",
    "description": "A fortified structure with a central courtyard surrounded by walls and buildings, featuring both indoor and outdoor areas.",
    "setting": "mixed indoor and outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Village and Outskirts",
        "description": "A large area containing the main northern village, a burning house, and surrounding plains and forests. This region is the main deployment and staging area for northern forces, with access to both bridges and the central road.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Road",
          "Village",
          "House"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 18,
        "toY": 4
      },
      {
        "name": "Western Bridge Approach",
        "description": "A narrow road and bridge crossing the river on the west side, connecting the northern village to the southern fort. This is a key chokepoint for movement between north and south.",
        "terrainTypes": [
          "Road",
          "Plain"
        ],
        "fromX": 7,
        "fromY": 5,
        "toX": 8,
        "toY": 12
      },
      {
        "name": "Eastern Bridge Approach",
        "description": "A parallel bridge to the east, also connecting the north and south. Slightly wider than the western bridge, but still a major chokepoint.",
        "terrainTypes": [
          "Road",
          "Plain"
        ],
        "fromX": 13,
        "fromY": 5,
        "toX": 14,
        "toY": 12
      },
      {
        "name": "Central River",
        "description": "A wide, impassable river running horizontally through the center of the map, separating the northern and southern regions. Only crossable via the two bridges.",
        "terrainTypes": [
          "Sea"
        ],
        "fromX": 3,
        "fromY": 7,
        "toX": 18,
        "toY": 12
      },
      {
        "name": "Southern Fortified Outpost",
        "description": "A fortified area with roads, plains, and some forest cover. This region controls the southern exits of both bridges and is ideal for defensive formations.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest"
        ],
        "fromX": 5,
        "fromY": 13,
        "toX": 15,
        "toY": 15
      }
    ],
    "keyPointsOfInterest": [
      "Village at (7,1)",
      "Burning House at (1,3)",
      "Western Bridge (7,7)-(8,12)",
      "Eastern Bridge (13,7)-(14,12)"
    ],
    "chokePoints": [
      "Western Bridge (7,7)-(8,12)",
      "Eastern Bridge (13,7)-(14,12)",
      "Narrow road entries at (7,5) and (13,5)"
    ],
    "strategicConsiderations": [
      "Both bridges are critical chokepoints; controlling them allows movement between north and south.",
      "The central river is impassable except by bridge, making flanking impossible without fliers.",
      "The northern village offers some cover and healing, but is vulnerable to a direct assault across the bridges.",
      "The southern fort is ideal for turtling or last-stand defense, especially with forests for evasion.",
      "Splitting forces to contest both bridges is risky but may be necessary to prevent being flanked."
    ],
    "givenName": "Twin Bridges Crossing",
    "originalName": "Knights_Villagers_Bandits_11_(0E_00_72_10)__by_Aura_Wolf",
    "description": "A strategic outdoor map featuring two parallel bridges over a wide river, with villages and a fort nearby.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central Desert Fortress",
        "description": "A large, walled fortress complex with multiple forts, shops, and houses. The area is highly defensible, with walls and choke points, and contains valuable resources such as vendors and an armory. The fortress is the main strategic stronghold on the map.",
        "terrainTypes": [
          "Wall",
          "Plain",
          "Forest",
          "Fort",
          "Vendor",
          "Armory",
          "House",
          "Road"
        ],
        "fromX": 2,
        "fromY": 0,
        "toX": 8,
        "toY": 13
      },
      {
        "name": "Northern Clifftop Expanse",
        "description": "A high ground area with cliffs and open plains, providing excellent vantage points for ranged units. The cliffs act as natural barriers, limiting movement and creating defensible positions.",
        "terrainTypes": [
          "Plain",
          "Cliff"
        ],
        "fromX": 8,
        "fromY": 0,
        "toX": 18,
        "toY": 4
      },
      {
        "name": "Eastern Desert Plains",
        "description": "A wide, open desert plain with scattered forts, houses, and vendors. The area is mostly open, with some cliffs and forests providing cover. It connects to the fortress and is a key approach route for attackers.",
        "terrainTypes": [
          "Plain",
          "Cliff",
          "Forest",
          "Fort",
          "Vendor",
          "House",
          "Road"
        ],
        "fromX": 9,
        "fromY": 5,
        "toX": 18,
        "toY": 15
      },
      {
        "name": "Southern Lake and Village District",
        "description": "A region dominated by lakes, bridges, and a small village. The lakes restrict movement, making the bridges critical choke points. The village offers resources and a potential objective.",
        "terrainTypes": [
          "Lake",
          "Plain",
          "Bridge",
          "Village",
          "Forest",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 7,
        "toY": 19
      },
      {
        "name": "Southeastern Lake Borderlands",
        "description": "A border region with lakes, plains, and some forested areas. The terrain is difficult to traverse, with walls and cliffs further restricting movement. This area is less defensible but can be used for flanking maneuvers.",
        "terrainTypes": [
          "Lake",
          "Plain",
          "Forest",
          "Wall",
          "Cliff"
        ],
        "fromX": 8,
        "fromY": 15,
        "toX": 18,
        "toY": 19
      }
    ],
    "keyPointsOfInterest": [
      "Fortress shops (Vendor at 6,11 and 6,11)",
      "Armory at 0,10",
      "Multiple Forts (11,1; 11,3; 12,8; 8,9)",
      "Village at 1,18",
      "Bridges at 3,15 and 4,15",
      "Houses at 1,8; 7,12; 7,12"
    ],
    "chokePoints": [
      "Fortress wall entrances at (2,8), (7,8), (8,13)",
      "Bridges at (3,15), (4,15)",
      "Narrow cliff passes at (10,7), (11,7), (14,7), (16,7)"
    ],
    "strategicConsiderations": [
      "The fortress is the most defensible position, with walls and limited entrances. Control of the fortress provides access to shops and healing forts.",
      "The northern cliffs offer high ground for archers and mages, but are difficult to traverse for most units.",
      "The southern lakes and bridges create natural choke points, ideal for holding off enemy advances or forcing bottlenecks.",
      "The eastern plains are open and vulnerable to cavalry and flying units, but lack strong defensive terrain.",
      "Flanking through the southeastern borderlands is possible but slow due to lakes and walls."
    ],
    "givenName": "Desert Fortress",
    "originalName": "Mages_Mercenaries_3_(42_00_43_44)__by_Aura_Wolf",
    "description": "A sprawling desert map featuring a mix of sandy dunes, a central fortress, and scattered ruins. The map is divided by a river, with a fortified area and several villages.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Village and Outskirts",
        "description": "A large, mostly open area with a central road network, a walled village at (3,2), and a house at (8,8). The area is bounded by walls to the east and south, with some forest tiles providing cover. This region is the main approach to the central and eastern parts of the map.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "Village",
          "Forest",
          "House"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 10,
        "toY": 9
      },
      {
        "name": "Eastern Village and Market Row",
        "description": "A bustling region with a village at (11,1), a vendor at (14,5), an armory at (14,11), and a house at (8,8). The area is defined by a network of roads, several walls, and forest patches. It serves as the economic and strategic heart of the map, with multiple entry points and defensive positions.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "Village",
          "Forest",
          "Vendor",
          "Armory",
          "House"
        ],
        "fromX": 4,
        "fromY": 0,
        "toX": 14,
        "toY": 12
      },
      {
        "name": "Southwest Homestead and Fields",
        "description": "A small, semi-enclosed area with a village at (2,10), bordered by walls and forests. This region is accessible from the north and east, and provides a defensive fallback or reinforcement point.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "Village",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 10,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "Village at (3,2)",
      "Village at (11,1)",
      "Village at (2,10)",
      "House at (8,8)",
      "Vendor at (14,5)",
      "Armory at (14,11)"
    ],
    "chokePoints": [
      "Narrow road between walls at (6,0)-(6,1)",
      "Wall-enclosed road at (6,5)-(6,6)",
      "Entry to eastern market at (6,7)-(7,7)",
      "Southern entry to armory at (14,11)"
    ],
    "strategicConsiderations": [
      "The central road network allows for rapid movement but is exposed to attacks from the flanking forests and walls.",
      "Villages and houses provide defensive bonuses and may be objectives for protection or capture.",
      "The eastern market row is a high-value area with vendor and armory access, making it a likely hotspot for conflict.",
      "Choke points created by walls and narrow roads can be used to funnel enemy units or set up ambushes.",
      "The southwest homestead is a potential reinforcement or retreat zone, but can be isolated if the central roads are blocked."
    ],
    "givenName": "Village Outskirts",
    "originalName": "Knights_Villagers_Bandits_6_(0E_00_72_10)__by_Aura_Wolf",
    "description": "A rural map featuring a mix of villages, open fields, and scattered trees, surrounded by stone walls and buildings.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Treasure Vault",
        "description": "A secure room in the northwest corner containing a chest and pillars for cover. Accessible only through a door at (1,3), making it a high-value, defensible area.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 12,
        "toY": 2
      },
      {
        "name": "Central Fortress Corridor",
        "description": "The main passageway running through the fortress, connecting multiple rooms and stairways. Features pillars and stairs, offering both mobility and defensive positions.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 3,
        "fromY": 3,
        "toX": 13,
        "toY": 9
      },
      {
        "name": "Western Guard Quarters",
        "description": "A series of rooms and corridors on the western side, likely used by guards. Contains stairs for vertical movement and is separated from the main corridor by walls and doors.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 4,
        "toX": 2,
        "toY": 9
      },
      {
        "name": "Eastern Pillar Gallery",
        "description": "A long eastern room lined with pillars and stairs, providing defensive cover and access to the upper levels. Connects to the main corridor and the outer areas.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 10,
        "fromY": 0,
        "toX": 14,
        "toY": 9
      },
      {
        "name": "Southern Outer Hall",
        "description": "The southernmost area of the fortress, transitioning from indoor floors to outdoor plains and forest. Provides access to the fortress from the outside.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 12,
        "toY": 14
      },
      {
        "name": "Southeastern Courtyard",
        "description": "An open courtyard area at the southeast, featuring plains and forest tiles. Offers flanking opportunities and a secondary entrance to the fortress.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Plain",
          "Forest"
        ],
        "fromX": 13,
        "fromY": 10,
        "toX": 16,
        "toY": 14
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (1,1)",
      "Multiple stairs at (7,1), (8,3), (5,7), (6,7), (1,8), (0,8), (1,9), (0,9), (14,4), (14,5), (13,9), (7,13), (8,13), (9,13)",
      "Pillars at (5,1), (10,0), (7,4), (12,5), (12,8), (6,9), (10,9), (6,9), (10,9), (6,9), (10,9)",
      "Doors at (1,3), (0,7), (1,7)"
    ],
    "chokePoints": [
      "Door at (1,3) leading to the Northern Treasure Vault",
      "Doors at (0,7) and (1,7) separating the Western Guard Quarters from the main corridor",
      "Narrow corridor at (7,4) with pillars"
    ],
    "strategicConsiderations": [
      "The Northern Treasure Vault is highly defensible due to its single door access and cover from pillars.",
      "The Central Fortress Corridor is the main route for movement and control of this area is crucial for both offense and defense.",
      "Western Guard Quarters can be used to stage ambushes or reinforce the main corridor quickly via stairs.",
      "The Eastern Pillar Gallery offers strong defensive positions and quick access to the upper levels.",
      "Southern Outer Hall and Southeastern Courtyard provide entry points for attackers and must be watched for flanking maneuvers.",
      "Stairs throughout the map allow for vertical mobility, enabling reinforcements or retreats between levels."
    ],
    "givenName": "Fortress Entrance",
    "originalName": "Knights_Villagers_Bandits_7_(18_00_48_1A)__by_Aura_Wolf",
    "description": "A fortified indoor area with multiple rooms and corridors, featuring a central entrance and various strategic points.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Village and Outskirts",
        "description": "A small village with houses and surrounding plains, forests, and thickets. Provides shelter and resource points, and is a likely starting area or objective.",
        "terrainTypes": [
          "Plain",
          "House",
          "Forest",
          "Thicket",
          "Hill"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 5
      },
      {
        "name": "Central Mountain Range",
        "description": "A large, mostly impassable mountain range running vertically through the center of the map, with some hills at the edges. This region acts as a natural barrier, splitting the map and funneling movement through limited passes.",
        "terrainTypes": [
          "Mountain",
          "Hill"
        ],
        "fromX": 2,
        "fromY": 0,
        "toX": 11,
        "toY": 12
      },
      {
        "name": "Northern and Central Forest Belt",
        "description": "A dense belt of forests and thickets with some plains, stretching across the northern and central part of the map. Offers cover and ambush opportunities, and connects the western and eastern sides via forested paths.",
        "terrainTypes": [
          "Forest",
          "Thicket",
          "Plain"
        ],
        "fromX": 6,
        "fromY": 0,
        "toX": 19,
        "toY": 6
      },
      {
        "name": "Eastern Fortified Gate",
        "description": "A fortified structure with walls and a central gate, serving as a defensive stronghold and key chokepoint for controlling eastern access.",
        "terrainTypes": [
          "Wall",
          "Gate",
          "Plain",
          "Forest",
          "Thicket"
        ],
        "fromX": 20,
        "fromY": 7,
        "toX": 22,
        "toY": 8
      },
      {
        "name": "Eastern Plains and Cliffs",
        "description": "Open plains interspersed with cliffs and some forest, providing fast movement but limited cover. The cliffs restrict movement and create tactical high ground.",
        "terrainTypes": [
          "Plain",
          "Cliff",
          "Forest",
          "Hill"
        ],
        "fromX": 19,
        "fromY": 0,
        "toX": 23,
        "toY": 6
      },
      {
        "name": "Southern Plains and Ruins",
        "description": "A broad southern area with open plains, scattered forests, hills, and ruins. The region is open for cavalry and fast units, with some defensive terrain near the ruins.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill",
          "Ruins",
          "Thicket",
          "Mountain"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 23,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "House at (2,2)",
      "House at (0,9)",
      "Ruins at (16,10) and (16,12)",
      "Fortified Gate at (21,8)"
    ],
    "chokePoints": [
      "Mountain passes at (7,7)-(8,8) and (12,7)-(13,8)",
      "Fortified Gate at (21,8)"
    ],
    "strategicConsiderations": [
      "The central mountain range divides the map, forcing units to use narrow passes or go around, making these passes critical for control.",
      "The fortified gate in the east is a major defensive position; holding it can prevent enemy advances from the east.",
      "Forests and thickets in the north and center provide cover for ambushes and slow down cavalry.",
      "Southern plains allow for rapid movement but offer little cover, making them risky for exposed units.",
      "Ruins in the south can be used as defensive positions or objectives."
    ],
    "givenName": "Mountain Pass Ambush",
    "originalName": "Mages_Mercenaries_2_(01_00_38_03)__by_Aura_Wolf",
    "description": "A rugged outdoor map featuring a mix of forests, mountains, and a fortified structure, ideal for strategic ambushes and defensive maneuvers.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Temple Entrance Hall",
        "description": "The main entryway to the temple, featuring wide stairs and a mix of overgrown forest and plain tiles. This area serves as the initial staging ground for units entering the temple.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 8,
        "toY": 4
      },
      {
        "name": "Left Temple Corridor",
        "description": "A narrow, partially collapsed corridor running along the left side of the temple. Contains several pillars and stairs, providing cover and vertical movement options.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 4,
        "toY": 15
      },
      {
        "name": "Central Temple Chamber",
        "description": "A large, open chamber at the heart of the temple, filled with broken pillars and debris. Contains chests and multiple staircases, making it a key area for both defense and treasure acquisition.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar",
          "Chest"
        ],
        "fromX": 5,
        "fromY": 5,
        "toX": 13,
        "toY": 15
      },
      {
        "name": "Right Temple Corridor",
        "description": "A winding corridor on the right side of the temple, with overgrown vegetation and broken walls. Provides flanking opportunities and alternate routes through the temple.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar",
          "Plain",
          "Forest"
        ],
        "fromX": 14,
        "fromY": 0,
        "toX": 17,
        "toY": 15
      },
      {
        "name": "Lower Sanctuary",
        "description": "A secluded sanctuary at the bottom of the map, featuring ancient altars, statues, and pillars. This area is likely to be the final objective or a strong defensive position.",
        "terrainTypes": [
          "Floor",
          "Stairs",
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
      "Chests at (12,12), (17,2)",
      "Multiple staircases throughout the temple",
      "Pillars providing cover in central and lower regions"
    ],
    "chokePoints": [
      "Narrow corridor at (2,5)-(4,15)",
      "Door at (17,4)",
      "Stair bottlenecks at (3,4)-(3,5), (10,6), (10,7), (10,8), (13,11), (15,12)"
    ],
    "strategicConsiderations": [
      "Defenders can use pillars and narrow corridors to limit attacker movement.",
      "Multiple staircases allow for vertical flanking and reinforcement.",
      "Central chamber is key for controlling access to chests and sanctuary.",
      "Right corridor offers a flanking route but is more exposed.",
      "Lower sanctuary is a likely stronghold or objective, with multiple access points to defend or assault."
    ],
    "givenName": "Ruined Temple",
    "originalName": "Nobles_Evil_Doers_5_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "An ancient, crumbling temple with multiple chambers and corridors, filled with debris and overgrown with moss.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Lake Village",
        "description": "A small village area bordered by walls and a lake to the south and west. The village is accessible from the north and east, but is otherwise protected by natural and man-made barriers. Provides a defensive position and a potential objective.",
        "terrainTypes": [
          "Plain",
          "Village",
          "Wall",
          "Lake",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 3,
        "toY": 6
      },
      {
        "name": "Central Crossroads",
        "description": "The main intersection of roads, connecting all major map areas. This open region is the primary route for movement and skirmishes, with some forest tiles for cover. Control of this area is crucial for mobility and reinforcement routes.",
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
        "name": "Eastern Castle Approach",
        "description": "A fortified approach to the eastern castle, with walls, ruins, and a floor tile indicating an interior or fortified structure. The area is defensible and contains obstacles for cover.",
        "terrainTypes": [
          "Road",
          "Wall",
          "Ruins",
          "Floor",
          "Barrel",
          "Plain"
        ],
        "fromX": 10,
        "fromY": 0,
        "toX": 14,
        "toY": 4
      },
      {
        "name": "Southern Fort and Armory",
        "description": "A southern fortified area with an armory, surrounded by walls and accessible by road. Provides a strong defensive position and access to supplies.",
        "terrainTypes": [
          "Wall",
          "Road",
          "Plain",
          "Forest",
          "Armory"
        ],
        "fromX": 10,
        "fromY": 5,
        "toX": 14,
        "toY": 9
      },
      {
        "name": "Northern Pathway",
        "description": "A narrow road leading north, flanked by forest and open terrain. Serves as a route for reinforcements or flanking maneuvers.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 4,
        "fromY": 0,
        "toX": 9,
        "toY": 3
      }
    ],
    "keyPointsOfInterest": [
      "Village at (2,2) and (3,6)",
      "Armory at (13,7)",
      "Ruins at (11,1)-(13,2)",
      "Barrel at (14,0)",
      "Floor at (14,1)"
    ],
    "chokePoints": [
      "Roads passing through walls at (5,1),(6,1),(7,1)",
      "Narrow road at (7,6)-(8,6)",
      "Wall gaps at (10,7),(10,8)"
    ],
    "strategicConsiderations": [
      "Control of the Central Crossroads is vital for movement and reinforcement.",
      "The Western Lake Village is defensible but can be isolated if the crossroads is lost.",
      "The Eastern Castle Approach is heavily fortified and best attacked from multiple directions.",
      "The Southern Fort and Armory provide resources and a stronghold for defense or launching attacks northward.",
      "The Northern Pathway is a potential route for flanking or surprise attacks, but is narrow and can be blocked."
    ],
    "givenName": "Crossroads of Commerce",
    "originalName": "(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19",
    "description": "An outdoor map featuring a network of roads connecting various key locations, including villages, a fort, and a castle. The map is characterized by its strategic layout, with roads intersecting at a central point, surrounded by natural barriers like forests and water.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central Mountain Pass",
        "description": "The main traversable route through the map, winding between impassable mountain ranges. This pass is the only way for ground units to cross from north to south, with scattered forests and hills providing cover and movement penalties.",
        "terrainTypes": [
          "Plain",
          "Hill",
          "Forest",
          "Ruins"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 19,
        "toY": 7
      },
      {
        "name": "Western Ruined Outpost",
        "description": "A small ruined area on the western side, offering some cover and alternate approach to the central pass. Ruins may provide defensive bonuses.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Ruins"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 2,
        "toY": 8
      },
      {
        "name": "Northern Impassable Mountain Range",
        "description": "A vast stretch of impassable mountains forming a natural barrier, restricting movement and funneling units into the central pass.",
        "terrainTypes": [
          "Mountain"
        ],
        "fromX": 3,
        "fromY": 0,
        "toX": 12,
        "toY": 5
      },
      {
        "name": "Eastern Cliffside and Sea",
        "description": "A narrow region of cliffs and sea on the eastern edge, accessible only to fliers. Provides a flanking route for mobile units.",
        "terrainTypes": [
          "Cliff",
          "Sea",
          "Forest",
          "Plain"
        ],
        "fromX": 17,
        "fromY": 2,
        "toX": 19,
        "toY": 8
      },
      {
        "name": "Central River Crossing",
        "description": "A river bisects the map horizontally, with a single bridge at (3,12) serving as a major chokepoint. Forests and plains on either side offer defensive and offensive opportunities.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Forest"
        ],
        "fromX": 2,
        "fromY": 12,
        "toX": 13,
        "toY": 15
      },
      {
        "name": "Southern Plains and Fort",
        "description": "A broad southern field with scattered forests and a fort at (16,19). This area is key for late-game defense or reinforcement entry.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort",
          "Ruins"
        ],
        "fromX": 5,
        "fromY": 16,
        "toX": 19,
        "toY": 19
      },
      {
        "name": "Southeastern Castle Gate",
        "description": "A walled castle entrance with a gate at (16,17), forming a defensive bottleneck into the southeastern fort area.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Gate",
          "Forest"
        ],
        "fromX": 15,
        "fromY": 16,
        "toX": 17,
        "toY": 18
      }
    ],
    "keyPointsOfInterest": [
      "Bridge at (3,12)",
      "Fort at (16,19)",
      "Gate at (16,17)",
      "Ruins at (0,5), (2,16), (11,18), (17,13)",
      "Cliff/Sea edge at (19,5)-(19,8)"
    ],
    "chokePoints": [
      "Bridge at (3,12)",
      "Castle Gate at (16,17)",
      "Narrow mountain pass between (13,7)-(15,7)"
    ],
    "strategicConsiderations": [
      "The central mountain pass is the only route for ground units, making it a prime location for ambushes and defensive stands.",
      "The bridge at (3,12) is a critical chokepoint; controlling it can halt enemy advances.",
      "Fliers can bypass the central pass by using the eastern cliffside and sea, threatening the rear or flanks.",
      "The southern fort and castle gate provide strong defensive positions for the endgame.",
      "Ruins and forests scattered throughout offer cover and can be used to slow enemy movement or set up ambushes.",
      "The impassable mountains and cliffs force most movement into predictable lanes, increasing the importance of controlling key points."
    ],
    "givenName": "Mountain Pass Clash",
    "originalName": "Nobles_Evil_Doers_2_(01_00_4C_03)__by_Aura_Wolf",
    "description": "A rugged outdoor map featuring a winding path through mountainous terrain, with strategic forts and villages scattered throughout.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Throne Room",
        "description": "A grand, well-defended room at the top center of the fortress, containing the throne. Accessible only through doors to the south and surrounded by walls, making it the primary defensive objective.",
        "terrainTypes": [
          "Floor",
          "Throne"
        ],
        "fromX": 9,
        "fromY": 1,
        "toX": 15,
        "toY": 4
      },
      {
        "name": "Central Fortress Corridor",
        "description": "A long corridor running horizontally in the center of the fortress, connecting the throne room to the left and right wings. Features doors at both ends, serving as a major choke point for attackers.",
        "terrainTypes": [
          "Floor",
          "Door"
        ],
        "fromX": 8,
        "fromY": 4,
        "toX": 16,
        "toY": 5
      },
      {
        "name": "Left Fortress Wing",
        "description": "A series of interconnected rooms and hallways on the left side of the fortress, including stairs and pillars for cover. Multiple doors and walls create defensive bottlenecks.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar",
          "Door"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 7,
        "toY": 18
      },
      {
        "name": "Right Fortress Wing",
        "description": "A mirrored set of chambers and corridors on the right side of the fortress, with stairs, pillars, and several doors. Provides flanking opportunities and defensive positions.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar",
          "Door"
        ],
        "fromX": 17,
        "fromY": 5,
        "toX": 25,
        "toY": 18
      },
      {
        "name": "Southern Entrance Hall",
        "description": "The main entrance area at the bottom of the fortress, featuring a mix of indoor and outdoor terrain. Multiple entry points and doors lead into the fortress proper, making it a key area for both offense and defense.",
        "terrainTypes": [
          "Floor",
          "Road",
          "Plain",
          "Forest",
          "Door"
        ],
        "fromX": 0,
        "fromY": 15,
        "toX": 25,
        "toY": 23
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (12,1)",
      "Multiple doors at (8,4), (16,4), (6,6), (19,6), (5,9), (19,9), (5,14), (20,9), (20,14), (7,17), (19,17), (7,17), (19,17)",
      "Stairs at (9,0), (10,0), (14,0), (15,0), (12,9), (13,9), (12,10), (13,10), (6,13), (7,13), (18,13), (19,13), (10,18), (12,18), (13,18), (15,18)",
      "Pillars at (10,12), (15,12)",
      "Corridor intersections at (8,5), (16,5), (8,7), (16,7)"
    ],
    "chokePoints": [
      "Doors at (8,4), (16,4) leading into the throne room",
      "Doors at (6,6), (19,6) controlling access to the left and right wings",
      "Doors at (5,9), (19,9), (5,14), (20,9), (20,14), (7,17), (19,17) in the lower fortress and entrance hall",
      "Narrow corridors at (8,5)-(8,7) and (16,5)-(16,7)"
    ],
    "strategicConsiderations": [
      "The throne room is the primary defensive objective, with limited access through doors and surrounded by walls.",
      "The central corridor is a major battleground, as it connects the throne room to the rest of the fortress and is flanked by doors.",
      "The left and right wings offer flanking routes but are segmented by doors and walls, making them defensible but also vulnerable to being isolated.",
      "The southern entrance hall is open and exposed, requiring careful positioning to prevent enemy breakthroughs.",
      "Stairs and pillars provide cover and elevation, useful for both defense and ambushes.",
      "Controlling the doors and choke points is critical for both attackers and defenders to manage the flow of battle."
    ],
    "givenName": "Fortress of Trials",
    "originalName": "Chapter6TheTrapIsSprung_More_Carpet__by_Shin19",
    "description": "A symmetrical indoor fortress with a central throne room and surrounding chambers, designed for strategic battles.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northwest Treasure Vault",
        "description": "A small, highly secure room in the northwest corner containing a treasure chest. Accessible only through a door, making it easy to defend.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 2,
        "fromY": 2,
        "toX": 4,
        "toY": 3
      },
      {
        "name": "Northern Pillar Hall",
        "description": "A hall with a pillar at the entrance, leading into the fortress. Provides some cover and is the first area encountered from the north.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 0
      },
      {
        "name": "Central Fortress Corridor",
        "description": "A long, winding corridor running through the center of the fortress, connecting multiple rooms and staircases. Key for movement and reinforcement routes.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Stairs",
          "Pillar"
        ],
        "fromX": 6,
        "fromY": 0,
        "toX": 12,
        "toY": 8
      },
      {
        "name": "Eastern Pillar Gallery",
        "description": "A gallery with several pillars and stairs, providing defensive cover and access to upper levels. Located on the eastern side of the fortress.",
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
        "name": "Southwest Entrance Hall",
        "description": "The main entrance area in the southwest, with stairs leading up and down. The primary access point for units entering from the south.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 4,
        "toX": 3,
        "toY": 8
      },
      {
        "name": "Southern Outer Grounds",
        "description": "The area outside the fortress proper, featuring plains and a patch of forest. Provides approach routes and some concealment for attackers.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 12,
        "toX": 12,
        "toY": 13
      },
      {
        "name": "Southeast Royal Chamber",
        "description": "A large, ornate chamber in the southeast with pillars for cover. Likely the final defensive position or a boss room.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 13,
        "fromY": 4,
        "toX": 16,
        "toY": 13
      }
    ],
    "keyPointsOfInterest": [
      "Treasure Chest at (3,3)",
      "Multiple Stairs at (0,5), (6,8), (11,3), (11,4), (16,3), (6,8), (12,8), (1,12), (2,12)",
      "Pillars at (0,0), (2,8), (7,5), (13,4), (16,0), (16,8)"
    ],
    "chokePoints": [
      "Door at (3,1)",
      "Narrow corridor at (6,6)-(6,7)",
      "Narrow corridor at (15,10)-(16,10)"
    ],
    "strategicConsiderations": [
      "The treasure vault is easily defensible due to its single door access.",
      "Central corridors allow for rapid reinforcement but are vulnerable to ambushes from side rooms.",
      "Pillars and stairs provide defensive cover and vertical movement options.",
      "The entrance hall is a likely point of initial engagement and should be fortified.",
      "The royal chamber is the probable boss area and final defensive stand."
    ],
    "givenName": "Fortress Interior",
    "originalName": "Knights_Villagers_Bandits_9_(18_00_48_1A)__by_Aura_Wolf",
    "description": "A complex indoor map featuring narrow corridors, a central chamber, and multiple staircases leading to different levels.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Grand Northern Hall",
        "description": "A large open hall at the top of the fortress, featuring pillars for cover and wide movement space. This area is ideal for initial deployment and early skirmishes.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 9,
        "toY": 1
      },
      {
        "name": "Central Throne Room",
        "description": "A fortified room with the throne, surrounded by pillars and accessible from the west and south. This is the primary defensive objective of the map.",
        "terrainTypes": [
          "Floor",
          "Throne",
          "Pillar"
        ],
        "fromX": 11,
        "fromY": 4,
        "toX": 16,
        "toY": 6
      },
      {
        "name": "Western Waterway Passages",
        "description": "A maze of narrow corridors and water channels, with several staircases and a chest. Movement is restricted by water, making this area defensible but slow to traverse.",
        "terrainTypes": [
          "Floor",
          "Lake",
          "Stairs",
          "Chest"
        ],
        "fromX": 0,
        "fromY": 2,
        "toX": 8,
        "toY": 12
      },
      {
        "name": "Eastern Gallery",
        "description": "A long, open gallery with pillars and stairs, connecting the throne room to the lower fortress. Provides flanking opportunities and access to the throne.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 10,
        "fromY": 7,
        "toX": 16,
        "toY": 14
      },
      {
        "name": "Lower Treasure Vault",
        "description": "A secluded vault at the bottom left, surrounded by water and containing multiple chests. Accessible only via narrow land bridges and stairs, making it a high-value but risky objective.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Lake",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 20,
        "toX": 12,
        "toY": 25
      },
      {
        "name": "Southern Fortress Approach",
        "description": "The main approach to the fortress from the south, with wide corridors and some pillars for cover. This area is the primary entry point for attackers.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 12,
        "toY": 19
      },
      {
        "name": "Southeast Lower Hall",
        "description": "A lower hall in the southeast, with pillars, stairs, and some water obstacles. Connects to the eastern gallery and provides access to the lower vault.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Lake"
        ],
        "fromX": 13,
        "fromY": 15,
        "toX": 16,
        "toY": 25
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (13,5)",
      "Chest at (5,7)",
      "Chest at (1,24)",
      "Multiple staircases throughout the fortress"
    ],
    "chokePoints": [
      "Narrow waterway passages in the western region",
      "Entrances to the throne room at (11,4) and (12,6)",
      "Bridges over lakes in the lower vault",
      "Corridors between the southern approach and the central fortress"
    ],
    "strategicConsiderations": [
      "Defenders should prioritize holding the throne room and controlling the narrow waterway passages to limit attacker movement.",
      "Attackers can use the southern approach for a direct assault or attempt to flank via the eastern gallery.",
      "The lower treasure vault is valuable but risky to access due to water obstacles and limited entry points.",
      "Staircases allow for vertical movement and potential reinforcement spawns.",
      "Pillars provide cover for both offense and defense, especially in the throne room and galleries."
    ],
    "givenName": "Aquatic Fortress",
    "originalName": "Nobles_Evil_Doers_1_(18_00_19_1A)__by_Aura_Wolf",
    "description": "A complex indoor fortress with multiple water channels and treasure rooms, featuring a central throne room and intricate pathways.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Castle Grounds",
        "description": "A fortified area enclosed by walls and cliffs, featuring a gate at (3,4) and a vendor. The castle grounds are defensible and provide access to the central bridge via the gate.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Cliff",
          "Wall",
          "Gate",
          "House",
          "Vendor"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 10,
        "toY": 5
      },
      {
        "name": "Northern Village and Outskirts",
        "description": "A village area with houses and a village tile at (10,2), surrounded by plains and forests. The area is partially walled off to the south and west.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Village",
          "Wall"
        ],
        "fromX": 4,
        "fromY": 0,
        "toX": 14,
        "toY": 2
      },
      {
        "name": "Central River and Bridge Crossing",
        "description": "A central river bisects the map, with two bridges (6,6) and (7,6) providing the main crossing. This is the primary chokepoint between north and south.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Forest"
        ],
        "fromX": 5,
        "fromY": 5,
        "toX": 8,
        "toY": 7
      },
      {
        "name": "Eastern Shoreline and Cliffs",
        "description": "A coastal region with cliffs and sea tiles, providing a natural boundary and limited access. The area is mostly open but bordered by impassable terrain.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Cliff",
          "Sea",
          "Wall"
        ],
        "fromX": 11,
        "fromY": 0,
        "toX": 14,
        "toY": 9
      },
      {
        "name": "Southern Village and Market",
        "description": "A bustling southern village with houses, a village tile at (11,10), a vendor, and an armory. The area is open and ideal for recruitment and resupply.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Village",
          "Vendor",
          "Armory",
          "Wall"
        ],
        "fromX": 4,
        "fromY": 8,
        "toX": 14,
        "toY": 12
      },
      {
        "name": "Southwestern Fields",
        "description": "Open fields with scattered forests, a house, an armory, and a vendor. Provides flanking opportunities and access to the southern village.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Armory",
          "Vendor"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 3,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "Gate at (3,4)",
      "Village at (10,2)",
      "Village at (11,10)",
      "Vendor at (5,9)",
      "Vendor at (5,9) and (5,9)",
      "Armory at (4,11)",
      "Bridges at (6,6) and (7,6)",
      "House at (6,1), (6,1), (8,10), (8,10)"
    ],
    "chokePoints": [
      "Gate at (3,4)",
      "Bridges at (6,6) and (7,6)",
      "Walls separating castle grounds from central bridge"
    ],
    "strategicConsiderations": [
      "The central river and bridges are the main chokepoints; controlling them is vital for movement between north and south.",
      "The western castle grounds are highly defensible and can serve as a stronghold.",
      "Villages in the north and south provide recruitment and supply opportunities; securing them early is advantageous.",
      "The eastern shoreline is difficult to traverse due to cliffs and sea, limiting flanking options.",
      "Vendors and armories are key for resupplying units and should be protected.",
      "Open fields in the southwest allow for flanking but are less defensible."
    ],
    "givenName": "River Crossing",
    "originalName": "Knights_Villagers_Bandits_2_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic map featuring a central river with a bridge, surrounded by villages and a castle.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Village Cluster",
        "description": "A cluster of villages and roads in the northern part of the map, providing multiple access points and some forest cover. The area is important for early positioning and offers a mix of open and covered terrain.",
        "terrainTypes": [
          "Village",
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 12,
        "toY": 4
      },
      {
        "name": "Central Fortress Interior",
        "description": "A heavily fortified central structure with multiple rooms, chests, and doors. This is the main defensive stronghold and likely the focal point for both offense and defense.",
        "terrainTypes": [
          "Wall",
          "Floor",
          "Chest",
          "Door",
          "Barrel"
        ],
        "fromX": 8,
        "fromY": 6,
        "toX": 15,
        "toY": 13
      },
      {
        "name": "Western Approach and Armory",
        "description": "The western side of the map features an armory, a house, and open plains with some forest. This area is key for flanking maneuvers and resupplying units.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "Armory",
          "House"
        ],
        "fromX": 0,
        "fromY": 15,
        "toX": 8,
        "toY": 19
      },
      {
        "name": "Southern Market and Vendor Row",
        "description": "A bustling southern area with vendors, houses, and open roads. This region is important for economic and support units, and can serve as a reinforcement route.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "Vendor",
          "House"
        ],
        "fromX": 9,
        "fromY": 15,
        "toX": 15,
        "toY": 19
      },
      {
        "name": "Eastern Outpost and Fields",
        "description": "A small outpost area with open fields and some forest, providing a defensive position and a potential route for eastern flanking.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 15,
        "toY": 14
      }
    ],
    "keyPointsOfInterest": [
      "Village at (10,2)",
      "Chest at (10,8)",
      "Armory at (3,18)",
      "Vendor at (13,17)",
      "House at (8,17)"
    ],
    "chokePoints": [
      "Door at (12,13)",
      "Door at (14,9)",
      "Narrow road at (7,6)-(8,6)",
      "Wall gaps at (8,7)-(8,9)"
    ],
    "strategicConsiderations": [
      "The central fortress is the main defensive position and is difficult to breach without controlling the doors and choke points.",
      "The northern village cluster offers multiple entry points and can be used to stage early attacks or defenses.",
      "The western approach provides access to the armory and is ideal for flanking or reinforcing the central area.",
      "The southern market is important for support and economic units, and can be used to reinforce the fortress or launch counterattacks.",
      "The eastern outpost is a potential weak point if left undefended, but can also be used for a surprise flanking maneuver.",
      "Controlling the doors and narrow passages is crucial for both offense and defense, as they limit enemy movement and can be used to funnel attackers."
    ],
    "givenName": "Fortress Approach",
    "originalName": "Mages_Mercenaries_1_(0E_00_72_10)__by_Aura_Wolf",
    "description": "A strategic map featuring a central fortress surrounded by various buildings and pathways, ideal for tactical maneuvers.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Castle Wall Approach",
        "description": "A small fortified area at the northwest corner, representing the outer approach to the castle. Provides initial defensive cover and restricts movement into the main field.",
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
        "name": "Western Forest and Plains",
        "description": "A large, continuous area of plains and forests on the western side of the map. Offers significant cover and maneuvering space for infantry and cavalry, with forests providing defensive bonuses.",
        "terrainTypes": [
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 2,
        "toX": 6,
        "toY": 9
      },
      {
        "name": "Northern Hills and Cliffs",
        "description": "A hilly and elevated region in the north-central part of the map, bordered by cliffs. Provides a vantage point and restricts movement for non-flying units.",
        "terrainTypes": [
          "Hill",
          "Plain",
          "Forest",
          "Cliff"
        ],
        "fromX": 5,
        "fromY": 0,
        "toX": 10,
        "toY": 2
      },
      {
        "name": "Central River Crossing",
        "description": "A river runs vertically through the eastern side of the map, with two bridges (at (11,2) and (12,5)) serving as the main crossing points. The river and bridges create natural chokepoints and divide the map into east and west.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Forest"
        ],
        "fromX": 11,
        "fromY": 0,
        "toX": 14,
        "toY": 9
      },
      {
        "name": "Eastern Mountain Pass",
        "description": "A narrow mountain pass in the northeast, only accessible to fliers or units with special movement. Provides a flanking route but is isolated from the main field.",
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
        "name": "Southeastern Riverbank and Cliffs",
        "description": "A small area of plains bordered by cliffs and the river in the southeast. Limited access, but can be used for flanking or ranged attacks across the river.",
        "terrainTypes": [
          "Plain",
          "Cliff",
          "River"
        ],
        "fromX": 10,
        "fromY": 8,
        "toX": 14,
        "toY": 9
      }
    ],
    "keyPointsOfInterest": [
      "Bridge at (11,2)",
      "Bridge at (12,5)",
      "Mountain pass at (12,0)-(14,1)"
    ],
    "chokePoints": [
      "Bridge at (11,2)",
      "Bridge at (12,5)",
      "Narrow mountain pass at (12,0)-(14,1)"
    ],
    "strategicConsiderations": [
      "The two bridges are the only reliable crossings for most units, making them critical chokepoints for both offense and defense.",
      "The western forests provide excellent cover for ambushes and defensive stands.",
      "The northern hills and cliffs offer elevation and restrict movement, favoring ranged units and fliers.",
      "The eastern mountain pass is only accessible to fliers or special units, allowing for surprise flanking but limited in scope.",
      "The southeastern riverbank is isolated and can be used for ranged harassment or as a fallback position."
    ],
    "givenName": "Forest Crossing",
    "originalName": "(7)Ch01_Diff_Tileset__by_Shin19",
    "description": "A lush outdoor map featuring a castle, dense forests, and a river with bridges.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central Crossroads Plains",
        "description": "The main intersection of the map, where several paths converge. This open area is surrounded by forests and hills, providing both mobility and some cover. It is the primary route between the map's villages and flanks.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill"
        ],
        "fromX": 2,
        "fromY": 4,
        "toX": 17,
        "toY": 7
      },
      {
        "name": "Western Village and Fort",
        "description": "A small settlement with a house and a fort, nestled at the base of the mountains. Offers healing and defensive bonuses, and is a likely player starting area or objective.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 8,
        "toX": 5,
        "toY": 9
      },
      {
        "name": "Eastern Village and Fort",
        "description": "A village and fort on the eastern side, providing resources and a defensive position. Accessible from the crossroads and partially protected by mountains and cliffs.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Fort"
        ],
        "fromX": 15,
        "fromY": 5,
        "toX": 18,
        "toY": 8
      },
      {
        "name": "Northern Mountain Pass",
        "description": "A narrow, winding pass through the mountains at the top of the map. Movement is restricted, making it a natural choke point for defense or ambushes.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill",
          "Mountain"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 12,
        "toY": 3
      },
      {
        "name": "Southern Cliffs and Coast",
        "description": "The southern edge of the map, dominated by cliffs and a small stretch of sea. Difficult terrain limits movement, but offers strong defensive positions and natural boundaries.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill",
          "Cliff",
          "Sea"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 19,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "House at (1,8)",
      "House at (15,8)",
      "Fort at (3,8)",
      "Fort at (18,5)"
    ],
    "chokePoints": [
      "Mountain pass at (7,0)-(12,3)",
      "Narrow path between mountains at (6,4)-(7,4)",
      "Cliffside path at (0,10)-(2,12)"
    ],
    "strategicConsiderations": [
      "The central crossroads is highly contested and offers the fastest routes between objectives.",
      "Villages and forts provide healing and defensive bonuses; controlling them is key for sustainability.",
      "Mountain passes and cliffside paths are natural choke points, ideal for stalling enemy advances.",
      "Southern cliffs and sea restrict movement, making flanking from the south difficult.",
      "Forests and hills scattered throughout provide cover for archers and ambushes."
    ],
    "givenName": "Mountain Crossroads",
    "originalName": "Knights_Villagers_Bandits_5_(01_00_38_03)__by_Aura_Wolf",
    "description": "A rugged outdoor map featuring a central crossroads surrounded by mountains and villages.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Main Hall",
        "description": "A large open hall at the north end of the map, providing access to several rooms and corridors. It is a central area for movement and control.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 1,
        "fromY": 1,
        "toX": 4,
        "toY": 3
      },
      {
        "name": "Northwest Chamber",
        "description": "A small chamber with stairs, potentially used for reinforcements or vertical movement within the structure.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 4,
        "fromY": 4,
        "toX": 4,
        "toY": 5
      },
      {
        "name": "Western Pillar Room",
        "description": "A room with several pillars, providing cover and strategic positioning for both offense and defense.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 2,
        "fromY": 7,
        "toX": 9,
        "toY": 8
      },
      {
        "name": "Central Corridor",
        "description": "A long corridor connecting the western and eastern parts of the map, with stairs at both ends.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 2,
        "fromY": 6,
        "toX": 9,
        "toY": 6
      },
      {
        "name": "Southern Passage",
        "description": "A southern passage with pillars, connecting to the lower rooms and providing a route for flanking or retreat.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 1,
        "fromY": 12,
        "toX": 10,
        "toY": 12
      },
      {
        "name": "Southwest Lower Hall",
        "description": "A lower hall in the southwest, accessible by stairs, serving as a secondary approach or escape route.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 1,
        "fromY": 13,
        "toX": 9,
        "toY": 14
      },
      {
        "name": "Eastern Treasure Room",
        "description": "A secluded room containing a valuable chest, accessible through a narrow passage and protected by doors.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 6,
        "fromY": 2,
        "toX": 12,
        "toY": 2
      },
      {
        "name": "Eastern Pillar Hall",
        "description": "A large hall with pillars on the eastern side, offering defensive cover and access to adjacent rooms.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 6,
        "fromY": 7,
        "toX": 14,
        "toY": 8
      },
      {
        "name": "Southeast Lower Hall",
        "description": "A lower hall in the southeast, with stairs and open space for maneuvering or staging units.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 6,
        "fromY": 13,
        "toX": 13,
        "toY": 15
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (12,2)",
      "Multiple doors at (7,4), (12,4), (4,12)",
      "Stairs at (4,5), (7,5), (5,13), (5,14)",
      "Pillars in central and eastern rooms"
    ],
    "chokePoints": [
      "Door at (7,4) between main hall and central corridor",
      "Door at (12,4) leading to treasure room",
      "Door at (4,12) in southern passage"
    ],
    "strategicConsiderations": [
      "The central corridor and pillar rooms provide strong defensive positions due to cover and limited access.",
      "Doors act as choke points, making it difficult for attackers to advance without key units.",
      "Stairs may allow for reinforcements or vertical movement, so control of these areas is important.",
      "The treasure room is isolated and can be easily defended if the doors are held."
    ],
    "givenName": "Labyrinthine Chambers",
    "originalName": "Alusq_FE8_0A009B0C_in_the_dark__by_FEU",
    "description": "A complex indoor map with winding corridors and multiple rooms, featuring a mix of open spaces and narrow passages.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Cliffside Approach",
        "description": "A rugged area dominated by cliffs and some forest, with a narrow road leading toward the fortress. The sea and cliffs form natural boundaries, making this a difficult approach for attackers and a strong defensive position for defenders.",
        "terrainTypes": [
          "Cliff",
          "Plain",
          "Forest",
          "Sea",
          "Ruins",
          "Road",
          "Thicket"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 16,
        "toY": 6
      },
      {
        "name": "Northern Lake Shore",
        "description": "A scenic but impassable lake and cliff region forming the northern boundary of the map. Only accessible to fliers, it serves as a natural barrier and prevents most units from crossing.",
        "terrainTypes": [
          "Sea",
          "Cliff",
          "Plain",
          "Forest"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 22,
        "toY": 6
      },
      {
        "name": "Outer Fortress Grounds",
        "description": "Open plains and scattered forests/thickets outside the fortress walls, providing some cover for advancing units. This area is the main staging ground for assaults on the fortress.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Thicket",
          "Road"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 22,
        "toY": 10
      },
      {
        "name": "Fortress Main Hall and Courtyard",
        "description": "The central area of the fortress, including the main hall, inner rooms, and connecting corridors. Features multiple floors, pillars, and defensive doors, making it the primary battleground for control of the fortress.",
        "terrainTypes": [
          "Floor",
          "Plain",
          "Forest",
          "Thicket",
          "Wall",
          "Stairs",
          "Pillar",
          "Door"
        ],
        "fromX": 0,
        "fromY": 11,
        "toX": 22,
        "toY": 18
      },
      {
        "name": "Southern Barracks and Storage",
        "description": "A series of rooms and corridors in the southern part of the fortress, including barracks, storage, and treasure rooms. Contains chests and pillars, offering both rewards and defensive cover.",
        "terrainTypes": [
          "Floor",
          "Plain",
          "Wall",
          "Pillar",
          "Chest",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 19,
        "toX": 16,
        "toY": 23
      },
      {
        "name": "Eastern Vault and Rear Chambers",
        "description": "The easternmost section of the fortress, containing additional treasure, stairs, and defensive features. Accessible from the main hall and southern barracks, but separated by walls and doors.",
        "terrainTypes": [
          "Floor",
          "Plain",
          "Wall",
          "Pillar",
          "Chest",
          "Stairs",
          "Forest"
        ],
        "fromX": 17,
        "fromY": 19,
        "toX": 22,
        "toY": 23
      }
    ],
    "keyPointsOfInterest": [
      "Chests at (7,20), (7,20) and nearby rooms",
      "Stairs at (9,12), (3,22), (18,21), (19,21)",
      "Pillars in southern rooms (7,16), (3,19), (12,21)",
      "Ruins at (16,1)",
      "Door at (7,18)"
    ],
    "chokePoints": [
      "Main entrance doors at (7,18)",
      "Narrow corridors between main hall and barracks",
      "Stairs and wall bottlenecks in southern and eastern rooms"
    ],
    "strategicConsiderations": [
      "Defenders can use the cliffs and lake to funnel attackers into predictable paths.",
      "The main entrance door is a critical choke point; breaching it opens access to the main hall.",
      "Pillars and walls in the southern barracks and eastern vault provide cover for defenders.",
      "Chests and stairs may attract both sides, creating secondary objectives.",
      "Fliers can bypass some natural barriers but are vulnerable to archers stationed on the walls."
    ],
    "givenName": "Fortress by the Lake",
    "originalName": "Nobles_Evil_Doers_7_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "A strategic fortress surrounded by rugged terrain and a serene lake, offering both defensive advantages and challenges for attackers.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northwest Village and Mountain Cluster",
        "description": "A large area in the northwest featuring a walled village, several houses, and a mix of plains, forests, and mountains. Provides strong defensive positions and resource points.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Village",
          "House",
          "Mountain",
          "Hill",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 18,
        "toY": 8
      },
      {
        "name": "Central River and Bridge Network",
        "description": "A wide river bisecting the map with multiple bridges and fords, flanked by plains and forests. The bridges are key choke points for movement between north and south.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Fort",
          "Thicket",
          "Forest"
        ],
        "fromX": 19,
        "fromY": 0,
        "toX": 34,
        "toY": 18
      },
      {
        "name": "Eastern Castle and Village Grounds",
        "description": "A fortified eastern area with a castle gate, armory, vendor, and village, surrounded by walls and open ground. Offers strong defensive value and access to supplies.",
        "terrainTypes": [
          "Wall",
          "Gate",
          "Village",
          "Armory",
          "Vendor",
          "House",
          "Plain",
          "Forest",
          "Hill"
        ],
        "fromX": 26,
        "fromY": 2,
        "toX": 34,
        "toY": 9
      },
      {
        "name": "Southwest Plains and Southern Fort",
        "description": "Expansive southern plains with scattered forests, hills, and a southern fort. Good for cavalry movement and flanking, with some defensive cover.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Mountain",
          "Fort",
          "Hill",
          "House"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 18,
        "toY": 34
      },
      {
        "name": "Southeast Village and Outskirts",
        "description": "A southeastern area with a village, houses, and a fort, bordered by cliffs and forests. Contains bridges connecting to the central river region.",
        "terrainTypes": [
          "Plain",
          "Village",
          "House",
          "Forest",
          "Cliff",
          "Fort",
          "Bridge"
        ],
        "fromX": 19,
        "fromY": 19,
        "toX": 34,
        "toY": 34
      }
    ],
    "keyPointsOfInterest": [
      "Village at (3,2)",
      "Village at (20,5)",
      "Village at (33,9)",
      "Armory at (25,4)",
      "Vendor at (26,5)",
      "Fort at (8,8)",
      "Fort at (22,8)",
      "Fort at (24,8)",
      "Fort at (7,17)",
      "Fort at (27,29)",
      "Bridge at (23,6)",
      "Bridge at (23,7)",
      "Bridge at (11,16)",
      "Bridge at (3,17)",
      "Bridge at (27,12)",
      "Bridge at (28,12)",
      "Bridge at (27,13)",
      "Bridge at (28,13)",
      "Gate at (6,6)",
      "Gate at (30,4)",
      "Gate at (28,18)"
    ],
    "chokePoints": [
      "Bridges at (23,6), (23,7), (11,16), (3,17), (27,12), (28,12), (27,13), (28,13)",
      "Castle gates at (6,6), (30,4), (28,18)",
      "Narrow mountain passes in northwest and northeast"
    ],
    "strategicConsiderations": [
      "Control of bridges is vital for movement between north and south; losing them can split your forces.",
      "Villages and forts provide healing and resources—securing them early is advantageous.",
      "The eastern castle grounds are highly defensible but can be isolated if bridges are lost.",
      "Mountain and forest terrain in the northwest and southwest offer strong defensive positions but limit cavalry mobility.",
      "Cliffs and sea on the map edges restrict movement and can be used to funnel enemy advances."
    ],
    "givenName": "Riverland Convergence",
    "originalName": "Snakey1_FE8_01003803_Many_Castles__by_FEU",
    "description": "A strategic map featuring a central river with multiple bridges, surrounded by villages and castles. The terrain includes mountains, forests, and plains, offering diverse tactical opportunities.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Outer Courtyard",
        "description": "A large open area in front of the fortress, providing space for initial deployment and movement. The only access to the fortress interior is through the central gate or side doors.",
        "terrainTypes": [
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 15,
        "toY": 2
      },
      {
        "name": "Central Fortress Hall",
        "description": "The main interior of the fortress, featuring pillars for cover, multiple staircases for vertical movement, and several doors acting as choke points. This is the primary defensive area.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Door"
        ],
        "fromX": 4,
        "fromY": 3,
        "toX": 12,
        "toY": 16
      },
      {
        "name": "Left Tower",
        "description": "A fortified tower on the left side of the fortress, accessible via stairs. Provides a vantage point and defensive position.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 1,
        "fromY": 3,
        "toX": 5,
        "toY": 16
      },
      {
        "name": "Right Tower",
        "description": "A fortified tower on the right side of the fortress, accessible via stairs. Provides a vantage point and defensive position.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 10,
        "fromY": 3,
        "toX": 14,
        "toY": 16
      },
      {
        "name": "Rear Courtyard",
        "description": "An open area behind the fortress, potentially used for flanking or retreat. Accessible from the fortress interior.",
        "terrainTypes": [
          "Plain"
        ],
        "fromX": 0,
        "fromY": 17,
        "toX": 15,
        "toY": 18
      }
    ],
    "keyPointsOfInterest": [
      "Central gate at (7,6) and (8,6)",
      "Multiple staircases throughout the fortress (e.g., (4,2), (11,2), (7,7), (8,7), (12,7), etc.)",
      "Numerous doors acting as choke points (e.g., (7,6), (8,6), (3,9), (12,9))"
    ],
    "chokePoints": [
      "Central double door at (7,6) and (8,6)",
      "Side doors at (3,9) and (12,9)",
      "Narrow corridors within the towers"
    ],
    "strategicConsiderations": [
      "The central gate is the main entry and a critical choke point for attackers.",
      "Towers provide high ground and defensive bonuses for ranged units.",
      "Multiple staircases allow for vertical movement and reinforcement deployment.",
      "Defenders can use doors and narrow corridors to limit the number of attackers.",
      "The rear courtyard can be used for flanking or as a fallback position if the main hall is breached."
    ],
    "givenName": "Fortress Entrance",
    "originalName": "Alusq_FE8_3C00CE3E_afro_comb_fort__by_FEU",
    "description": "A fortified structure with a grand entrance, featuring both indoor and outdoor areas. The map is dominated by a large central gate and flanked by symmetrical towers.",
    "setting": "mixed indoor and outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Village Cluster",
        "description": "A large, open northern area with a mix of plains, roads, and scattered buildings including an armory and vendor. The area is partially enclosed by walls and contains several houses, making it a hub for commerce and initial deployment.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "Wall",
          "Armory",
          "House",
          "Vendor"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 17,
        "toY": 3
      },
      {
        "name": "Central Market Street",
        "description": "A bustling central region with multiple roads, houses, and two villages. The area is segmented by walls but remains largely interconnected, serving as the main thoroughfare and point of conflict between north and south.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "Wall",
          "Village",
          "House"
        ],
        "fromX": 0,
        "fromY": 4,
        "toX": 17,
        "toY": 8
      },
      {
        "name": "Southern Fortified Corridor",
        "description": "A heavily fortified southern region with multiple walls, corridors, and staircases. This area is ideal for defense, with limited access points and strong choke points, making it the last line of defense or a staging ground for counterattacks.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "Stairs",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 17,
        "toY": 14
      }
    ],
    "keyPointsOfInterest": [
      "Armory at (2,2)",
      "Vendor at (16,3)",
      "Village at (6,5)",
      "Village at (10,8)",
      "House at (11,4)",
      "House at (2,8)",
      "Stairs at (6,13)",
      "Stairs at (7,13)",
      "Stairs at (17,13)"
    ],
    "chokePoints": [
      "Narrow road between walls at (5,6)-(10,6)",
      "Wall-enclosed corridor at (6,13)-(7,13)",
      "Southern stair access at (17,13)",
      "Wall bottleneck at (10,4)-(12,4)"
    ],
    "strategicConsiderations": [
      "The Northern Village Cluster is open and ideal for cavalry and ranged units, but vulnerable to flanking from the central market.",
      "Central Market Street is the main battleground, with multiple access points and buildings for cover. Control of this area allows rapid movement between north and south.",
      "Southern Fortified Corridor is best defended with armored units and can be used to funnel attackers into kill zones at the stairs and narrow roads.",
      "Villages and shops are key objectives for both gold and recruitment; securing them early is crucial.",
      "Walls and houses provide cover for infantry and archers, while open roads favor mounted units.",
      "Stairs and narrow corridors in the south are critical for controlling reinforcements and preventing enemy breakthroughs."
    ],
    "givenName": "Village Outskirts",
    "originalName": "Knights_Villagers_Bandits_3_(0E_00_72_10)__by_Aura_Wolf",
    "description": "A rural map featuring a cluster of buildings surrounded by open fields and a fortified area to the south.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Grand Throne Room",
        "description": "A large, ornate room with a throne at its center, pillars for cover, and multiple staircases. This is the primary defensive objective and likely the boss's location.",
        "terrainTypes": [
          "Floor",
          "Throne",
          "Pillar",
          "Stairs"
        ],
        "fromX": 13,
        "fromY": 2,
        "toX": 17,
        "toY": 6
      },
      {
        "name": "Northern Main Hall",
        "description": "A wide hall with pillars and stairs, connecting the entrance to the throne room. Provides multiple routes and cover for both attackers and defenders.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 11,
        "toY": 5
      },
      {
        "name": "Western Treasure Chamber",
        "description": "A small, secure room containing a valuable chest, accessible only through a door. High-value target for thieves.",
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
        "name": "Southern Corridor",
        "description": "A long corridor with pillars and stairs, connecting the main hall to the lower parts of the map. Useful for flanking or retreating.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar"
        ],
        "fromX": 1,
        "fromY": 10,
        "toX": 13,
        "toY": 12
      },
      {
        "name": "Eastern Gallery",
        "description": "A side area with pillars and stairs, providing an alternate approach to the throne room or a defensive fallback.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 12,
        "fromY": 8,
        "toX": 18,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (15,3)",
      "Chest at (4,7)",
      "Multiple stair tiles (e.g., (5,4), (11,5), (17,5), (14,7), (15,7), (16,7), (9,10), (9,11))",
      "Doors at (6,7), (6,7) [mirrored in both halves]"
    ],
    "chokePoints": [
      "Door at (6,7) between Western Treasure Chamber and Main Hall",
      "Narrow corridor at (7,3)-(7,4)",
      "Corridor junctions at (7,7), (7,8)"
    ],
    "strategicConsiderations": [
      "The throne room is heavily fortified and best approached from multiple directions to avoid bottlenecks.",
      "The Western Treasure Chamber is only accessible via a door, making it easy to defend but also a tempting target for thieves.",
      "Pillars and stairs throughout the map provide cover and movement options, favoring defensive play.",
      "The Southern Corridor allows for flanking maneuvers or retreat if the main hall is lost.",
      "Controlling the doors and choke points is critical for both offense and defense."
    ],
    "givenName": "Royal Throne Room",
    "originalName": "Knights_Villagers_Bandits_8_(18_00_19_1A)__by_Aura_Wolf",
    "description": "An ornate indoor map featuring a throne room, treasure chamber, and various corridors.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Castle Grounds",
        "description": "A fortified castle area in the north, enclosed by walls with a central gate at (4,2). Contains several forts for defense and is a key defensive position.",
        "terrainTypes": [
          "Wall",
          "Gate",
          "Plain",
          "Fort"
        ],
        "fromX": 3,
        "fromY": 0,
        "toX": 7,
        "toY": 2
      },
      {
        "name": "Northwest Plains and Forest Approach",
        "description": "Open plains and scattered forests leading up to the castle walls, with a fort at (1,3). Provides cover and approach routes for attackers.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 2,
        "toY": 4
      },
      {
        "name": "Northeast Cliffside and Mountain Barrier",
        "description": "A rugged area of cliffs, hills, and mountains forming a natural barrier to the northeast. Difficult terrain restricts movement, with only a few passable plains and forests.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Cliff",
          "Mountain",
          "Hill"
        ],
        "fromX": 8,
        "fromY": 0,
        "toX": 14,
        "toY": 5
      },
      {
        "name": "Central Crossroad",
        "description": "The main open area connecting the castle, both villages, and the southern approaches. Contains several forts and forests for tactical positioning.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 3,
        "fromY": 3,
        "toX": 10,
        "toY": 8
      },
      {
        "name": "Western Village Square",
        "description": "A small village with houses and a central village tile at (4,11), surrounded by walls. Provides healing and a defensive fallback for western forces.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Village",
          "House",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 5,
        "toY": 12
      },
      {
        "name": "Eastern Village and Outskirts",
        "description": "A village area with a village tile at (12,8), houses, and some forest cover. Enclosed by walls to the west, it serves as a key eastern stronghold.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Village",
          "House",
          "Wall"
        ],
        "fromX": 11,
        "fromY": 6,
        "toX": 14,
        "toY": 11
      },
      {
        "name": "Southern Plains and Hills",
        "description": "Open southern fields with scattered forests, hills, and mountains. Provides approach routes to both villages and the central crossroad, but movement is restricted by hills and mountains.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill",
          "Mountain"
        ],
        "fromX": 0,
        "fromY": 12,
        "toX": 14,
        "toY": 14
      }
    ],
    "keyPointsOfInterest": [
      "Castle Gate at (4,2)",
      "Forts at (1,3), (7,1), (7,4), (7,7)",
      "Village tile at (4,11)",
      "Village tile at (12,8)",
      "Houses at (10,10), (1,12), (10,10), (10,10)",
      "Mountain barrier to the east and south"
    ],
    "chokePoints": [
      "Castle Gate at (4,2)",
      "Narrow pass between cliffs at (6,6)-(7,6)",
      "Village entrances at (4,11) and (12,8)",
      "Central crossroad between villages"
    ],
    "strategicConsiderations": [
      "The castle grounds are highly defensible due to walls and a single gate.",
      "Both villages offer healing and defensive positions but are vulnerable to being surrounded.",
      "The central crossroad is a key area for controlling movement between all regions.",
      "Cliffs, mountains, and walls create natural barriers, funneling movement through predictable routes.",
      "Forts provide defensive bonuses and are ideal for holding key positions.",
      "Southern hills and mountains restrict cavalry and favor infantry or flying units."
    ],
    "givenName": "Twin Villages Crossroad",
    "originalName": "Knights_Villagers_Bandits_1_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic outdoor map featuring two villages connected by roads, surrounded by forests and mountains, with a central castle and a cave entrance.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northwest Coastal Plains",
        "description": "A large, open area with scattered forests and a house, bordered by sea and cliffs to the north and west. Provides ample space for cavalry and infantry movement, with a bridge at the southern edge for river crossing.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Bridge"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 15,
        "toY": 10
      },
      {
        "name": "Western Village Enclosure",
        "description": "A walled 3x3 village with a house adjacent, serving as a key defensive and resource point on the western side of the map.",
        "terrainTypes": [
          "Village",
          "Wall",
          "Plain",
          "House"
        ],
        "fromX": 0,
        "fromY": 8,
        "toX": 4,
        "toY": 8
      },
      {
        "name": "Central Riverbank and Bridge",
        "description": "A narrow riverbank with two bridges (at 7,9 and 15,8) connecting the western and eastern halves of the map. Acts as a major chokepoint for movement and control.",
        "terrainTypes": [
          "Plain",
          "Bridge",
          "Forest"
        ],
        "fromX": 7,
        "fromY": 8,
        "toX": 15,
        "toY": 9
      },
      {
        "name": "Central Fortified Gate Approach",
        "description": "A fortified area with a gate and walls, serving as the main entrance to the central castle region. Highly defensible and critical for controlling access to the castle.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Gate",
          "Cliff"
        ],
        "fromX": 10,
        "fromY": 11,
        "toX": 12,
        "toY": 12
      },
      {
        "name": "Central Castle Grounds",
        "description": "The main castle area, including a fort tile and surrounding plains and forests. The heart of the map, likely the main objective for both offense and defense.",
        "terrainTypes": [
          "Plain",
          "Fort",
          "Forest"
        ],
        "fromX": 11,
        "fromY": 13,
        "toX": 13,
        "toY": 15
      },
      {
        "name": "Eastern Village Enclosure",
        "description": "A walled 3x3 village on the eastern side, mirroring the western village. Provides resources and a defensive position.",
        "terrainTypes": [
          "Village",
          "Wall",
          "Plain"
        ],
        "fromX": 15,
        "fromY": 4,
        "toX": 17,
        "toY": 4
      },
      {
        "name": "Northeast Coastal Plains",
        "description": "Open plains and forests bordered by cliffs and sea, providing flanking opportunities and access to the eastern bridge.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Cliff"
        ],
        "fromX": 16,
        "fromY": 0,
        "toX": 20,
        "toY": 10
      },
      {
        "name": "Southern Trade Road",
        "description": "A broad southern region with multiple bridges, shops (armory and vendor), houses, and forests. Key for reinforcements and supply lines.",
        "terrainTypes": [
          "Plain",
          "Bridge",
          "Armory",
          "Vendor",
          "House",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 15,
        "toX": 20,
        "toY": 20
      }
    ],
    "keyPointsOfInterest": [
      "House at (0,8)",
      "Village at (3,8)",
      "Bridge at (7,9)",
      "Bridge at (15,8)",
      "Gate at (11,12)",
      "Fort at (12,14)",
      "Village at (16,4)",
      "Armory at (1,16)",
      "Vendor at (2,19)",
      "House at (16,18)"
    ],
    "chokePoints": [
      "Bridge at (7,9)",
      "Bridge at (15,8)",
      "Gate at (11,12)",
      "Narrow wall passages at (2,6)-(4,6) and (2,7)-(4,7)",
      "Bridge at (13,16)",
      "Bridge at (0,15)",
      "Bridge at (4,17)",
      "Bridge at (4,18)"
    ],
    "strategicConsiderations": [
      "Control of the central bridges is vital for moving between the east and west sides of the map.",
      "The central gate and walls create a strong defensive position for the castle grounds.",
      "Villages on both sides offer resources and can be fortified to slow enemy advances.",
      "Southern trade road provides access to shops and reinforcements; securing it ensures supply lines.",
      "Cliffs and sea restrict movement, funneling units toward bridges and gates, making these areas prime for ambushes or defense.",
      "Forests provide cover for infantry and archers, especially near the castle and along the southern road."
    ],
    "givenName": "River Crossing Battle",
    "originalName": "Mages_Mercenaries_4_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic map featuring multiple river crossings and fortified positions. The map is divided by rivers, with key structures like castles and villages scattered throughout.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western River Crossing and Bridge",
        "description": "A key crossing point over the river, connecting the western plains to the fortress. The bridge and surrounding roads are vital for movement between the west and the fortress, with cliffs and forests providing some cover and obstacles.",
        "terrainTypes": [
          "Road",
          "Bridge",
          "Plain",
          "Forest",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 5,
        "toY": 9
      },
      {
        "name": "Northern Fortress Courtyard",
        "description": "The main open area inside the fortress, featuring pillars for cover and stairs for elevation changes. This area is accessible from the western approach and leads deeper into the fortress.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 9,
        "fromY": 0,
        "toX": 15,
        "toY": 6
      },
      {
        "name": "Eastern Fortress Hall",
        "description": "A narrow hall within the fortress, lined with pillars and stairs, providing access to the deeper sections of the stronghold. Defensible and a likely site for close-quarters combat.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 12,
        "fromY": 3,
        "toX": 15,
        "toY": 7
      },
      {
        "name": "Southern Fortress Outskirts and Fort",
        "description": "The southern approach to the fortress, including a village and a fort. This area is important for reinforcements and provides healing and defensive bonuses.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest",
          "Fort",
          "Village"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 12,
        "toY": 11
      },
      {
        "name": "Southeastern Fortified Road",
        "description": "A fortified road leading to the eastern fort, with forest tiles for cover. This area is a secondary approach to the fortress and can be used for flanking maneuvers.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 10,
        "fromY": 8,
        "toX": 15,
        "toY": 11
      }
    ],
    "keyPointsOfInterest": [
      "Bridge at (0,2)",
      "Village at (2,10)",
      "Fort at (12,10)",
      "Stairs at (9,2), (12,7), (13,7), (14,7)",
      "Pillars at (10,0), (13,1), (13,4)"
    ],
    "chokePoints": [
      "Bridge at (0,2)",
      "Narrow fortress entrance at (9,0)-(9,1)",
      "Stairs at (12,7), (13,7), (14,7)",
      "Walls at (6,0)-(8,1), (7,3)-(8,5)"
    ],
    "strategicConsiderations": [
      "The bridge is the main access point for units moving from the west; controlling it is crucial for both offense and defense.",
      "The fortress courtyard is open but has pillars and stairs for defensive positioning; ranged units can take advantage of cover.",
      "The eastern hall is narrow and easily defended, making it a strong point for holding off attackers.",
      "The southern outskirts provide healing and reinforcement opportunities via the fort and village.",
      "The southeastern road allows for flanking but is exposed to attacks from the fortress walls.",
      "Cliffs and sea tiles restrict movement, funneling units into predictable paths and making choke points more important."
    ],
    "givenName": "Fortress Riverfront",
    "originalName": "Nobles_Evil_Doers_4_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "A strategic map featuring a fortress by a river, with a village and a bridge crossing.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Castle Grounds",
        "description": "A fortified area enclosed by walls and a gate, with multiple forts and forests for defense. This is a stronghold area, likely a starting or defensive position.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort",
          "Wall",
          "Gate"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 7,
        "toY": 7
      },
      {
        "name": "Central River and Bridge Crossing",
        "description": "A river running north-south with two bridges (at y=4 and y=5) as the only crossings. The area is a major chokepoint and the main route between east and west.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Forest",
          "Cliff"
        ],
        "fromX": 8,
        "fromY": 0,
        "toX": 12,
        "toY": 7
      },
      {
        "name": "Eastern Fortress Complex",
        "description": "A heavily fortified area with walls, a gate, and multiple forts, located on the eastern side. The gate at (19,4) is the main entrance, making this a key defensive position.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort",
          "Wall",
          "Gate",
          "Cliff"
        ],
        "fromX": 18,
        "fromY": 2,
        "toX": 23,
        "toY": 5
      },
      {
        "name": "Northern Villages and Outskirts",
        "description": "A large, open northern area with scattered forts, hills, and mountains. Provides multiple approach routes and some defensive cover.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort",
          "Hill",
          "Mountain",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 23,
        "toY": 2
      },
      {
        "name": "Southern Plains and Coastal Road",
        "description": "Open plains with scattered forts and a house, bordered by the sea. Ideal for cavalry and fast movement, but exposed to attacks from multiple directions.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort",
          "Sea",
          "House"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 23,
        "toY": 12
      },
      {
        "name": "Central-Eastern Plains and Forts",
        "description": "A stretch of plains and forts east of the river, providing staging ground for assaults on the eastern fortress or defense against western advances.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort",
          "Cliff"
        ],
        "fromX": 13,
        "fromY": 3,
        "toX": 17,
        "toY": 9
      }
    ],
    "keyPointsOfInterest": [
      "Bridge at (11,4) and (11,5)",
      "Gate at (2,7) (Western Castle)",
      "Gate at (19,4) (Eastern Fortress)",
      "Forts at (6,2), (9,5), (14,5), (14,1), (23,8), (6,10)",
      "House at (3,11) and (20,10)"
    ],
    "chokePoints": [
      "Bridge crossings at (11,4) and (11,5)",
      "Gate at (2,7)",
      "Gate at (19,4)",
      "Narrow cliff pass at (15,3)-(16,4)"
    ],
    "strategicConsiderations": [
      "Controlling the bridges is vital for movement between east and west; losing both can split your army.",
      "The Western Castle and Eastern Fortress are highly defensible but can be surrounded if the enemy controls the river crossings.",
      "The open southern plains favor cavalry and fast units, but are vulnerable to attacks from the flanks.",
      "The northern area offers multiple approach routes but is less defensible due to open terrain.",
      "Forts scattered throughout the map provide healing and defensive bonuses—securing them can turn the tide in prolonged engagements."
    ],
    "givenName": "River Crossing Clash",
    "originalName": "Nobles_Evil_Doers_3_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic map featuring a central river with a bridge, surrounded by castles and villages. Ideal for tactical maneuvers and control of key points.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Market and Village District",
        "description": "A bustling area with houses, a vendor, an armory, and a village. Provides multiple points of interest and defensive cover with forests. The village at (2,8) is a key objective.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Vendor",
          "Armory",
          "Village"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 12
      },
      {
        "name": "Eastern Market and Village District",
        "description": "Mirroring the western side, this area contains houses, a village at (11,14), and forests for cover. The region is separated from the west by a central wall and gate.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Village"
        ],
        "fromX": 5,
        "fromY": 0,
        "toX": 14,
        "toY": 12
      },
      {
        "name": "Central Fortified Corridor",
        "description": "A corridor running north-south, fortified with walls and a gate at (11,2). Contains several forts for defense and is a key choke point between the east and west.",
        "terrainTypes": [
          "Wall",
          "Gate",
          "Plain",
          "Fort"
        ],
        "fromX": 7,
        "fromY": 6,
        "toX": 13,
        "toY": 10
      },
      {
        "name": "Northern Cliffside Approach",
        "description": "A narrow area with cliffs and forests, providing a difficult but defensible approach to the central corridor.",
        "terrainTypes": [
          "Cliff",
          "Plain",
          "Forest"
        ],
        "fromX": 6,
        "fromY": 3,
        "toX": 8,
        "toY": 7
      },
      {
        "name": "Central Lake and Sea",
        "description": "A large body of water with a few forts on the shore. Blocks direct movement between the north and south except via the corridor or the far east/west.",
        "terrainTypes": [
          "Sea",
          "Plain",
          "Fort"
        ],
        "fromX": 9,
        "fromY": 6,
        "toX": 14,
        "toY": 11
      },
      {
        "name": "Southern Plains and Mountain Pass",
        "description": "A broad southern area with hills, mountains, and forests. The only open approach to the north is through the central corridor or the far east/west.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill",
          "Mountain",
          "House"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 14,
        "toY": 16
      }
    ],
    "keyPointsOfInterest": [
      "Village at (2,8)",
      "Village at (11,14)",
      "Vendor at (3,2)",
      "Armory at (3,4)",
      "Gate at (11,2)",
      "Forts at (8,6), (10,8), (13,4), (8,10)"
    ],
    "chokePoints": [
      "Gate at (11,2)",
      "Central corridor between walls (7,6)-(13,10)",
      "Cliffside approaches at (7,4)-(8,7)"
    ],
    "strategicConsiderations": [
      "The central corridor is the main route between east and west, heavily fortified and easily defended.",
      "Villages on both sides are key objectives and must be protected or seized quickly.",
      "The central lake/sea blocks direct movement, forcing units to use the corridor or go around.",
      "Cliffs and forests provide defensive cover but restrict movement, especially for cavalry.",
      "Southern mountains and hills slow movement and can be used to funnel enemy advances.",
      "Forts provide healing and defensive bonuses, making them valuable for holding key positions."
    ],
    "givenName": "Twin Fortresses",
    "originalName": "Knights_Villagers_Bandits_12_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic outdoor map featuring two fortified towns, a central lake, and a northern castle. The map is divided by roads and natural barriers, creating distinct regions for tactical maneuvers.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Forest Approach",
        "description": "A forested and plain area forming the western approach to the village, providing cover and multiple entry points for attackers. The roads here lead directly into the village proper.",
        "terrainTypes": [
          "Forest",
          "Plain",
          "Road"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 10,
        "toY": 5
      },
      {
        "name": "Central Village Main Street",
        "description": "The main thoroughfare of the village, containing the central road network, ruins, and open plains. This area connects most other regions and is the primary battleground for control of the village.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "Ruins"
        ],
        "fromX": 7,
        "fromY": 6,
        "toX": 18,
        "toY": 16
      },
      {
        "name": "Northern Walled Village Cluster",
        "description": "A walled-off cluster in the north containing a key village tile, surrounded by walls and accessible only via the main road. This area is defensible and contains important objectives.",
        "terrainTypes": [
          "Wall",
          "Village",
          "Road",
          "Plain"
        ],
        "fromX": 11,
        "fromY": 0,
        "toX": 17,
        "toY": 4
      },
      {
        "name": "Eastern Coastal Outskirts",
        "description": "The eastern edge of the map, featuring open plains, some forest, and the coastline with sea and lake tiles. This area is more open and vulnerable to flanking.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "Sea",
          "Lake"
        ],
        "fromX": 19,
        "fromY": 0,
        "toX": 24,
        "toY": 16
      },
      {
        "name": "Southern Market and Vendor Row",
        "description": "A southern section of the village with vendor and armory tiles, representing the market area. This region is important for resupply and features several entry points.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Vendor",
          "Armory",
          "Forest"
        ],
        "fromX": 11,
        "fromY": 12,
        "toX": 18,
        "toY": 16
      },
      {
        "name": "Southwestern Residential Block",
        "description": "A residential area in the southwest, including village and house tiles. This block is somewhat separated by walls and is a potential spawn or defense zone.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "Village",
          "House"
        ],
        "fromX": 0,
        "fromY": 11,
        "toX": 10,
        "toY": 18
      },
      {
        "name": "Southeastern Coastal Bridge and Docks",
        "description": "The southeastern edge of the map, featuring bridges, dock-like floor tiles, and barrels. This area is the main access point to the sea and is a strategic exit or entry for reinforcements.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Bridge",
          "Floor",
          "Barrel",
          "Sea"
        ],
        "fromX": 18,
        "fromY": 16,
        "toX": 24,
        "toY": 22
      }
    ],
    "keyPointsOfInterest": [
      "Village tile at (16,1)",
      "Village tile at (12,8)",
      "Village tile at (2,11)",
      "Village tile at (9,13)",
      "Village tile at (16,17)",
      "Vendor at (17,12)",
      "Armory at (1,14)",
      "House at (10,18)",
      "Bridges at (20,16), (21,16), (22,16), (20,17), (21,17), (22,17)"
    ],
    "chokePoints": [
      "Walled northern cluster entrances (around 11,2 and 13,2)",
      "Ruins corridor at (7,7)-(8,8)",
      "Bridge cluster at (20,16)-(22,17)",
      "Narrow road between walls at (12,10)-(13,11)",
      "Southern vendor/market entry at (17,12)"
    ],
    "strategicConsiderations": [
      "The Western Forest Approach offers cover for attackers but is vulnerable to being blocked by defenders at the main road.",
      "The Central Village Main Street is the primary area for movement and combat, with multiple access points and little cover.",
      "The Northern Walled Village Cluster is highly defensible and contains a key objective; controlling the entrances is crucial.",
      "The Eastern Coastal Outskirts are open and susceptible to flanking, but also allow for rapid movement along the edge.",
      "The Southern Market and Vendor Row is important for resupply and can be a fallback point for defenders.",
      "The Southwestern Residential Block is a potential spawn or reinforcement area, with some cover and alternate routes.",
      "The Southeastern Coastal Bridge and Docks are critical for controlling access to the sea and for late-map reinforcements or escapes.",
      "Choke points at bridges and narrow roads should be held by durable units to prevent enemy breakthroughs."
    ],
    "givenName": "Coastal Village",
    "originalName": "Aegris",
    "description": "A quaint village by the sea, featuring a mix of residential areas, a marketplace, and a dock. The map is characterized by its coastal setting and strategic layout.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Grand Northern Hall",
        "description": "A large, open hall with pillars and multiple staircases, forming the main entry and congregation area of the aqueduct. It is well-defended by walls on the north and east, and connects to the central and western sections.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 24,
        "toY": 6
      },
      {
        "name": "Western Gallery",
        "description": "A long, narrow western corridor with pillars and a few open plain tiles, providing flanking opportunities and access to the southern bridge.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 7,
        "toY": 15
      },
      {
        "name": "Central Aqueduct Walkways",
        "description": "The main central region of the map, featuring interconnected walkways, pillars, and open spaces. This area is the heart of the aqueduct, with multiple access points and strategic cover.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Plain"
        ],
        "fromX": 8,
        "fromY": 7,
        "toX": 24,
        "toY": 15
      },
      {
        "name": "Eastern Hall and Passage",
        "description": "A series of eastern rooms and corridors, including staircases and pillars, leading to the map's far right edge. This area is more segmented and can be used for ambushes or retreats.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Plain"
        ],
        "fromX": 25,
        "fromY": 0,
        "toX": 31,
        "toY": 15
      },
      {
        "name": "Southern Bridge and Platform",
        "description": "A prominent bridge spanning a lake and sea tiles, serving as the only direct connection between the north/central and southernmost regions. This is a critical chokepoint for movement.",
        "terrainTypes": [
          "Floor",
          "Bridge",
          "Lake",
          "Sea"
        ],
        "fromX": 14,
        "fromY": 16,
        "toX": 16,
        "toY": 16
      },
      {
        "name": "Southern Lower Platform",
        "description": "A small, isolated southern platform accessible only via the southern bridge, ideal for last stands or staging reinforcements.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 15,
        "fromY": 17,
        "toX": 16,
        "toY": 19
      },
      {
        "name": "Far Southeast Storage",
        "description": "A large, segmented southeastern area with pillars and stairs, likely used for storage or as a hidden approach. It is separated from the main aqueduct by walls and water.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 25,
        "fromY": 16,
        "toX": 31,
        "toY": 25
      },
      {
        "name": "Southwest Lower Platform",
        "description": "A small, isolated southwestern platform, only accessible from the southern bridge area, useful for flanking or retreating.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 15,
        "fromY": 20,
        "toX": 16,
        "toY": 21
      }
    ],
    "keyPointsOfInterest": [
      "Multiple staircases throughout the map (e.g., 24,1; 13,2; 24,2; 20,10; 20,11; 22,11; 20,12; 22,12; 16,22; 18,22; 11,24; 12,24; 11,25; 12,25)",
      "Bridges at (15,16) and (16,16)",
      "Numerous pillars providing cover",
      "Large open halls and segmented rooms"
    ],
    "chokePoints": [
      "Southern bridge at (15,16)-(16,16)",
      "Narrow corridors in the Eastern Hall (e.g., 25,7-31,7)",
      "Entrances to the Grand Northern Hall (e.g., 0,7; 24,7)",
      "Transitions between central walkways and southern platforms"
    ],
    "strategicConsiderations": [
      "The southern bridge is the most critical chokepoint; controlling it restricts enemy movement between north and south.",
      "Pillars and segmented rooms provide ample cover for defensive play and ambushes.",
      "Multiple staircases allow for rapid repositioning and potential reinforcement spawns.",
      "The far southeast and southwest platforms are isolated and can be used for flanking or as fallback positions.",
      "Central walkways are exposed but offer the fastest route across the map."
    ],
    "givenName": "Ancient Aqueduct",
    "originalName": "Nobles_Evil_Doers_8_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "A complex indoor structure featuring waterways, bridges, and chambers, suggesting an ancient aqueduct system.",
    "setting": "indoor"
  }
];