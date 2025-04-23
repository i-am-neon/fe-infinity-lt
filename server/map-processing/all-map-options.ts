import { MapMetadata } from "@/types/maps/map-metadata.ts";

export const allMapOptions: MapMetadata[] = [
  {
    "distinctRegions": [
      {
        "name": "Castle Throne Room",
        "description": "The innermost chamber of the fortress, containing the throne. Highly defensible and the main objective for seize missions.",
        "terrainTypes": [
          "Floor",
          "Throne"
        ],
        "fromX": 2,
        "fromY": 0,
        "toX": 8,
        "toY": 1
      },
      {
        "name": "Northern Castle Interior",
        "description": "A series of rooms and corridors with stairs, connecting the throne room to the rest of the fortress. Provides access to the treasure alcove and castle gate.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 2,
        "fromY": 2,
        "toX": 6,
        "toY": 4
      },
      {
        "name": "Treasure Alcove",
        "description": "A small, walled-off area containing valuable chests. Accessible via stairs and a door, making it a high-priority target for thieves.",
        "terrainTypes": [
          "Chest",
          "Road",
          "Plain"
        ],
        "fromX": 17,
        "fromY": 1,
        "toX": 20,
        "toY": 2
      },
      {
        "name": "Castle Gate and Approach",
        "description": "The main entrance to the fortress, featuring a wide road and stairs. Acts as a major chokepoint for attackers.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Stairs",
          "Door"
        ],
        "fromX": 4,
        "fromY": 4,
        "toX": 16,
        "toY": 6
      },
      {
        "name": "Central Arena",
        "description": "A large, open area surrounded by forest and roads, ideal for large-scale battles and duels. The arena is a key feature here.",
        "terrainTypes": [
          "Arena",
          "Road",
          "Forest",
          "Plain"
        ],
        "fromX": 6,
        "fromY": 16,
        "toX": 11,
        "toY": 17
      },
      {
        "name": "Village Row",
        "description": "A line of villages along the eastern edge, providing cover and potential objectives for both sides.",
        "terrainTypes": [
          "Village",
          "Road",
          "Plain"
        ],
        "fromX": 13,
        "fromY": 15,
        "toX": 15,
        "toY": 21
      },
      {
        "name": "Southern Pathway",
        "description": "A long, winding road bordered by forests and plains, connecting the southern villages and arena to the rest of the map.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 19,
        "toX": 20,
        "toY": 27
      },
      {
        "name": "Western Vendor and Armory District",
        "description": "A small area with a vendor and armory, providing shopping opportunities and strategic value for resupplying units.",
        "terrainTypes": [
          "Vendor",
          "Armory",
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 2,
        "fromY": 10,
        "toX": 14,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (5,1)",
      "Chests at (18,1) and (20,1)",
      "Arena at (6,16)",
      "Vendor at (2,12)",
      "Armory at (14,10) and (19,11)",
      "Villages at (15,15), (13,18), (19,15), (13,24), (19,21), (1,18), (1,24), (15,21)"
    ],
    "chokePoints": [
      "Castle gate at (4,4)-(16,4)",
      "Doors at (4,8), (5,8), (5,8)",
      "Stairs at (5,3), (6,3), (17,4), (17,5)",
      "Narrow road at (8,15)-(11,15)"
    ],
    "strategicConsiderations": [
      "The castle gate is the primary defensive chokepoint; defenders can hold off attackers here.",
      "The treasure alcove is isolated and can be reached only through a door, making it vulnerable to thieves but easy to defend.",
      "The central arena is open and ideal for cavalry or large-scale battles, but the surrounding forests provide cover for infantry and archers.",
      "Village row on the east can be used for defensive positioning or as objectives for side missions.",
      "The southern pathway allows for flanking maneuvers and reinforcements, but is exposed to ambushes from the forests.",
      "Vendors and armories are critical for resupplying, and controlling these areas can provide a logistical advantage."
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
        "description": "A small, well-guarded room in the northwest corner containing a valuable chest. Accessible only through a locked door at (2,0), making it a high-value, defensible area.",
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
        "toY": 7
      },
      {
        "name": "Northern Corridor",
        "description": "A long corridor running along the north side of the map, connecting the Treasure Chamber to the Grand Central Hall. Useful for flanking or rapid movement between regions.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 5,
        "fromY": 0,
        "toX": 15,
        "toY": 3
      },
      {
        "name": "Southern Pillared Gallery",
        "description": "A southern gallery with multiple pillars and stairs, providing defensive positions and access to the lower part of the ruins.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 11,
        "toX": 13,
        "toY": 13
      },
      {
        "name": "Eastern Gallery",
        "description": "A gallery on the eastern side, accessible from the Grand Central Hall and the Southern Pillared Gallery. Offers a route to the map's eastern edge and potential escape or reinforcement path.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 10,
        "fromY": 10,
        "toX": 17,
        "toY": 13
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (2,2)",
      "Door at (2,0)",
      "Stairs at (2,11), (3,11), (4,11)",
      "Pillars at (7,5), (13,5), (12,12), (3,13), (8,13), (13,12), (8,5), (13,13), (8,13)"
    ],
    "chokePoints": [
      "Door at (2,0) leading to Treasure Chamber",
      "Narrow corridor at (5,7)-(6,7)",
      "Stairs at (2,11)-(4,11)",
      "Wall bottlenecks at (5,7), (9,7), (11,7), (15,7)"
    ],
    "strategicConsiderations": [
      "The Treasure Chamber is highly defensible but only accessible through a single door, making it easy to block or trap units inside.",
      "The Grand Central Hall is the main combat zone, with pillars for cover and multiple access points, making it ideal for both offense and defense.",
      "The Northern Corridor allows for flanking maneuvers and quick movement between the left and right sides of the map.",
      "The Southern Pillared Gallery and Eastern Gallery provide alternative routes for reinforcements or retreat, and their pillars offer strong defensive positions.",
      "Choke points at doors, stairs, and narrow corridors should be controlled to limit enemy movement and protect key areas."
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
        "description": "A large, open hall with pillars for cover, serving as the main hub and connecting point for all wings of the ruins. Multiple entrances and wide sightlines make it a key battleground.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 19,
        "toY": 4
      },
      {
        "name": "Western Gallery",
        "description": "A series of rooms and corridors on the left side, featuring pillars and stairs. Offers flanking routes and defensive positions, with some plain tiles at the edge.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 6,
        "toY": 11
      },
      {
        "name": "Eastern Gallery",
        "description": "A mirrored set of rooms and corridors on the right side, with similar features to the Western Gallery. Provides access to the central hall and lower passage.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Plain"
        ],
        "fromX": 12,
        "fromY": 5,
        "toX": 19,
        "toY": 11
      },
      {
        "name": "Northern Corridor",
        "description": "A corridor running along the north side of the map, connecting the two wings and providing access to the central hall. Contains stairs for vertical movement.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 19,
        "toY": 3
      },
      {
        "name": "Southern Passage",
        "description": "A long passage along the southern edge, with several rooms, pillars, and stairs. Connects to both galleries and the central hall, and features some plain tiles at the far end.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar",
          "Plain"
        ],
        "fromX": 7,
        "fromY": 5,
        "toX": 26,
        "toY": 11
      }
    ],
    "keyPointsOfInterest": [
      "Multiple Stairs (e.g., 10,3; 16,6; 16,9; 25,2; 25,3; 25,4; 25,9; 26,9; 16,10)",
      "Numerous Pillars (e.g., 4,0; 14,1; 3,5; 0,8; 22,4; 20,6; 23,9; 10,10; 20,10)",
      "Transition to Plain tiles at map edges (e.g., 0,5; 1,6; 23,6; 22,7; 22,8; 21,9; 23,11; 26,11)"
    ],
    "chokePoints": [
      "Narrow corridors between rooms (e.g., 8,1-8,2; 14,4-14,5; 14,8-14,9)",
      "Stairwells (e.g., 10,3; 16,6; 16,9; 25,2; 25,3; 25,4; 25,9; 26,9; 16,10)",
      "Entrances to central hall from wings"
    ],
    "strategicConsiderations": [
      "The Grand Central Hall is a key area for control due to its connectivity and open sightlines.",
      "Pillars provide cover for both offense and defense, especially in the galleries and central hall.",
      "Stairs allow for vertical movement and can be used for ambushes or quick repositioning.",
      "Narrow corridors and room entrances serve as natural choke points for defensive stands.",
      "Plain tiles at the map's edge may be less defensible and are likely entry/exit points for reinforcements or escape."
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
        "description": "A large open area with scattered forests and a fort at (5,1). Provides good mobility and some defensive cover. Key for initial deployment and flanking maneuvers.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort",
          "Hill"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 4
      },
      {
        "name": "Northwestern Mountain Barrier",
        "description": "A nearly impassable mountain range with some hills, forming a natural barrier between the western and eastern halves of the map. Only accessible to fliers.",
        "terrainTypes": [
          "Mountain",
          "Hill"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 13,
        "toY": 5
      },
      {
        "name": "Central Northern Plains",
        "description": "A stretch of plains and forests south of the mountain range, with a vendor at (4,9) and an armory at (1,10). Important for regrouping and supply.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 6,
        "toY": 9
      },
      {
        "name": "Western Village Enclave",
        "description": "A walled village at (2,7), providing a defensive position and possible objective or recruitment point.",
        "terrainTypes": [
          "Village",
          "Wall",
          "Plain"
        ],
        "fromX": 1,
        "fromY": 6,
        "toX": 3,
        "toY": 7
      },
      {
        "name": "Eastern Mountain Pass and Gate",
        "description": "A narrow mountain pass with a gate at (16,6), heavily fortified and the main chokepoint between east and west. Critical for controlling movement across the map.",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Gate",
          "Wall",
          "Forest",
          "Plain"
        ],
        "fromX": 15,
        "fromY": 4,
        "toX": 17,
        "toY": 7
      },
      {
        "name": "Northeastern Castle Grounds",
        "description": "A fortified area with a fort at (14,11), houses, and open ground. Likely the main defensive objective or boss area.",
        "terrainTypes": [
          "Plain",
          "Fort",
          "Forest",
          "Hill",
          "House"
        ],
        "fromX": 14,
        "fromY": 0,
        "toX": 18,
        "toY": 11
      },
      {
        "name": "Eastern Plains and Village",
        "description": "Open plains with scattered houses, providing some cover and possible side objectives.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House"
        ],
        "fromX": 13,
        "fromY": 8,
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
      "Fort at (14,11)",
      "House at (16,9)",
      "House at (5,11)"
    ],
    "chokePoints": [
      "Mountain pass and gate at (16,6)",
      "Walled village at (2,7)",
      "Narrow plains between mountains at (7,4)-(13,4)"
    ],
    "strategicConsiderations": [
      "The central mountain range divides the map, forcing movement through narrow passes or around the edges.",
      "The gate at (16,6) is the primary chokepoint for east-west movement and will be heavily contested.",
      "The western fort and village provide strong defensive positions for the western side.",
      "The northeastern castle grounds are likely the main objective and are well-defended by terrain.",
      "Control of the vendor and armory in the central plains can provide a supply advantage.",
      "Fliers can bypass the mountain range, offering opportunities for surprise attacks or reinforcement."
    ],
    "givenName": "Mountain Pass Siege",
    "originalName": "Knights_Villagers_Bandits_4_(01_00_38_03)__by_Aura_Wolf",
    "description": "A strategic map featuring a central mountain range dividing a village and a castle, with various paths and structures scattered around.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Forecastle Deck",
        "description": "The front section of the leftmost ship, featuring a narrow deck, barrels for cover, and stairs leading below deck. Bordered by walls and surrounded by sea and lake tiles.",
        "terrainTypes": [
          "Floor",
          "Barrel",
          "Stairs",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 6,
        "toY": 10
      },
      {
        "name": "Main Deck of Left Ship",
        "description": "The central and rear area of the leftmost ship, with open space for movement, stairs, and barrels. Enclosed by walls and surrounded by water.",
        "terrainTypes": [
          "Floor",
          "Barrel",
          "Stairs",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 11,
        "toX": 6,
        "toY": 17
      },
      {
        "name": "Central Bridge",
        "description": "A narrow bridge connecting the leftmost ship to the middle ship, serving as a critical chokepoint for advancing units.",
        "terrainTypes": [
          "Bridge"
        ],
        "fromX": 6,
        "fromY": 11,
        "toX": 9,
        "toY": 11
      },
      {
        "name": "Main Deck of Middle Ship",
        "description": "The main deck of the central ship, with open combat space, stairs, and barrels. Bordered by walls and surrounded by sea and lake.",
        "terrainTypes": [
          "Floor",
          "Barrel",
          "Stairs",
          "Wall"
        ],
        "fromX": 10,
        "fromY": 5,
        "toX": 13,
        "toY": 17
      },
      {
        "name": "Right Bridge",
        "description": "A bridge connecting the middle ship to the rightmost ship, another key chokepoint for movement.",
        "terrainTypes": [
          "Bridge"
        ],
        "fromX": 14,
        "fromY": 11,
        "toX": 16,
        "toY": 11
      },
      {
        "name": "Deck of Right Ship",
        "description": "The deck of the rightmost ship, a smaller area with stairs and barrels, enclosed by walls and surrounded by water.",
        "terrainTypes": [
          "Floor",
          "Barrel",
          "Stairs",
          "Wall"
        ],
        "fromX": 17,
        "fromY": 5,
        "toX": 18,
        "toY": 15
      }
    ],
    "keyPointsOfInterest": [
      "Barrels (cover) at (3,7), (17,10)",
      "Stairs at (1,8), (4,8), (11,15), (12,15), (1,17), (4,17), (13,7), (18,5), (18,6), (11,7), (13,15), (17,7), (18,7), (11,15), (12,15)",
      "Bridges at (6,11)-(9,11) and (14,11)-(16,11)"
    ],
    "chokePoints": [
      "Central Bridge (6,11)-(9,11)",
      "Right Bridge (14,11)-(16,11)",
      "Narrow ship corridors between walls"
    ],
    "strategicConsiderations": [
      "Bridges are critical chokepoints; controlling them can halt enemy advances.",
      "Ships are surrounded by impassable water, limiting movement to bridges and decks.",
      "Barrels provide cover for ranged units.",
      "Stairs may allow for reinforcements or flanking from below deck.",
      "Defending the bridges is key to preventing enemy progression.",
      "Narrow corridors on ships favor defensive formations and can bottleneck attackers."
    ],
    "givenName": "Triple Ship Assault",
    "originalName": "BoatsatSea",
    "description": "A map featuring three connected ships on the open sea, with narrow bridges linking them. The layout requires strategic movement across the vessels.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Throne Room",
        "description": "The main objective area, heavily fortified and only accessible through a series of corridors. Contains the throne tile, likely the boss location.",
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
        "name": "Central Pillared Hall",
        "description": "A large, open hall with pillars and stairs, providing both cover and vertical movement. Connects the throne room to the rest of the fortress.",
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
        "name": "Northern Treasure Corridor",
        "description": "A narrow corridor lined with treasure chests, accessible from the central hall and protected by doors.",
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
        "name": "Maze of Halls",
        "description": "A complex network of winding corridors and doors, forming the main body of the fortress. Multiple access points to other regions.",
        "terrainTypes": [
          "Floor",
          "Door",
          "Pillar"
        ],
        "fromX": 5,
        "fromY": 3,
        "toX": 24,
        "toY": 7
      },
      {
        "name": "Southern Treasure Vault",
        "description": "A secure vault in the lower left, containing chests and protected by a door. Accessible from the southern corridor.",
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
        "name": "Eastern Treasure Vault",
        "description": "A treasure room on the east side, containing chests and protected by a door. Accessible from the eastern corridor.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Door"
        ],
        "fromX": 25,
        "fromY": 12,
        "toX": 27,
        "toY": 16
      },
      {
        "name": "Southern Corridor",
        "description": "A long corridor running along the southern edge of the fortress, connecting the entrance to the vaults and the central maze.",
        "terrainTypes": [
          "Floor",
          "Door",
          "Stairs"
        ],
        "fromX": 9,
        "fromY": 16,
        "toX": 24,
        "toY": 21
      },
      {
        "name": "Main Entrance Hall",
        "description": "The main entrance to the fortress, featuring stairs leading up into the main structure.",
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
      "Multiple chests at (5,20), (5,23), (26,6), (26,12), (27,4), (27,8)",
      "Stairs at (18,0), (19,0), (12,6), (26,20), (11,25), (12,25)",
      "Doors at (24,5), (8,7), (9,7), (24,7), (26,10), (27,14), (7,20), (7,24)"
    ],
    "chokePoints": [
      "Doors at (24,5), (8,7), (9,7), (24,7), (26,10), (27,14), (7,20), (7,24)",
      "Narrow corridors between (5,3)-(7,7) and (25,3)-(28,8)"
    ],
    "strategicConsiderations": [
      "The throne room is heavily fortified and only accessible through a series of corridors and doors, making it ideal for a last stand or boss defense.",
      "Treasure vaults are isolated and require opening doors, making them vulnerable to ambushes but also easy to defend.",
      "The central hall with pillars provides cover and multiple movement options, but is exposed to attacks from several directions.",
      "Choke points at doors and narrow corridors can be used to control enemy movement and set up defensive lines.",
      "Stairs provide vertical movement and potential reinforcement entry points.",
      "The southern corridor and entrance hall are the main access routes for attackers, and should be guarded to prevent flanking."
    ],
    "givenName": "Fortress Maze",
    "originalName": "Chapter12TheTrueEnemy_Fire_tileset_Minor_Changes__by_Shin19",
    "description": "A complex indoor fortress with winding corridors and multiple treasure rooms.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northwestern Mountain Barrier",
        "description": "A rugged mountain range with some hills and forests, forming a natural barrier that restricts movement between the northwest and the rest of the map. Only accessible by fliers or units with special movement.",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Plain",
          "Forest"
        ],
        "fromX": 1,
        "fromY": 1,
        "toX": 5,
        "toY": 5
      },
      {
        "name": "Western Plains Approach",
        "description": "A broad area of plains and scattered forests, with several forts providing defensive positions. This region serves as the main approach to the central river and bridges from the west.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 12,
        "toY": 6
      },
      {
        "name": "Central River and Cliff Divide",
        "description": "A river and cliff system running north-south, splitting the map. Two bridges (at (10,7)-(11,7) and (1,13)) are the only crossings for non-fliers, making them critical choke points.",
        "terrainTypes": [
          "Cliff",
          "Sea",
          "Bridge",
          "Plain",
          "Forest"
        ],
        "fromX": 3,
        "fromY": 7,
        "toX": 12,
        "toY": 12
      },
      {
        "name": "Northeastern Forested Uplands",
        "description": "A region of dense forests, thickets, and some hills and mountains. Provides excellent cover and is difficult to traverse, favoring defensive play.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Thicket",
          "Hill",
          "Mountain"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 16,
        "toY": 12
      },
      {
        "name": "Eastern Plains and Forts",
        "description": "Open plains with scattered forests and two forts, offering both mobility and defensive options. This area is a key staging ground for attacks across the eastern bridge.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort",
          "Hill"
        ],
        "fromX": 13,
        "fromY": 4,
        "toX": 16,
        "toY": 12
      },
      {
        "name": "Southern Open Fields",
        "description": "A large, open area with some forests, hills, and mountains at the edges. Provides space for maneuvering and flanking, but limited cover in the center.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill",
          "Mountain"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 16,
        "toY": 16
      }
    ],
    "keyPointsOfInterest": [
      "Fort at (6,5)",
      "Fort at (12,5)",
      "Fort at (2,11)",
      "Bridge at (10,7)-(11,7)",
      "Bridge at (1,13)",
      "Thicket at (15,0), (14,1), (14,11)",
      "Hill at (6,2), (4,6), (13,15)"
    ],
    "chokePoints": [
      "Bridge at (10,7)-(11,7)",
      "Bridge at (1,13)",
      "Narrow cliff pass at (7,7)-(8,7)",
      "Narrow cliff pass at (12,6)-(13,6)"
    ],
    "strategicConsiderations": [
      "The central river and cliffs split the map, making the bridges the most important choke points for movement.",
      "Forts on both sides of the river provide strong defensive positions for holding the bridges.",
      "Dense forests and thickets in the northeast favor defensive units and archers.",
      "The southern open fields allow for cavalry and flanking maneuvers but offer little cover.",
      "Mountain and cliff regions are impassable to most units, channeling movement through predictable routes.",
      "Controlling both bridges is key to dominating the map and enabling reinforcements to cross."
    ],
    "givenName": "Mountain Pass Crossing",
    "originalName": "Skirmish",
    "description": "A rugged outdoor map featuring a river cutting through mountainous terrain, with bridges connecting key areas.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Coastal Forts and Plains",
        "description": "A coastal region with two forts and open plains, bordered by the sea. Provides strong defensive positions and is a likely starting area for one side.",
        "terrainTypes": [
          "Sea",
          "Plain",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 14,
        "toY": 2
      },
      {
        "name": "North Central Forested Plains",
        "description": "A mix of open plains, forests, and thickets, with cliffs to the west. Offers both mobility and cover, and serves as a transition between the coast and the river.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Thicket",
          "Cliff"
        ],
        "fromX": 3,
        "fromY": 3,
        "toX": 14,
        "toY": 6
      },
      {
        "name": "Western Riverbank and Bridge",
        "description": "A winding riverbank with a key bridge at (3,14), surrounded by forests and thickets. This area is a major chokepoint for movement between north and south.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "River",
          "Bridge",
          "Thicket",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 10,
        "toY": 15
      },
      {
        "name": "Central River Crossing",
        "description": "The main river crossing in the center-east, with a bridge at (11,11). Surrounded by forests and thickets, this is a critical area for controlling map flow.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "River",
          "Bridge",
          "Thicket"
        ],
        "fromX": 11,
        "fromY": 7,
        "toX": 14,
        "toY": 15
      },
      {
        "name": "Southern Forested Plains and Hills",
        "description": "A large southern region with open plains, dense forests, thickets, and a hill in the southeast. Multiple bridges and rivers create several movement options and chokepoints.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Thicket",
          "River",
          "Bridge",
          "Hill"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 14,
        "toY": 20
      }
    ],
    "keyPointsOfInterest": [
      "Fort at (4,0)",
      "Fort at (4,0) and (4,0) (overlap due to chunk, but only one fort)",
      "Bridge at (3,14)",
      "Bridge at (11,11)",
      "Bridge at (6,19)",
      "Bridge at (9,17)"
    ],
    "chokePoints": [
      "Bridge at (3,14)",
      "Bridge at (11,11)",
      "Bridge at (6,19)",
      "Bridge at (9,17)",
      "Narrow river crossings at (5,7)-(7,7) and (5,8)-(7,8)"
    ],
    "strategicConsiderations": [
      "Controlling the bridges is vital for movement between north and south.",
      "Forts in the north provide strong defensive positions and healing.",
      "Forests and thickets offer cover for ambushes and defense.",
      "The central and eastern bridges are likely to be heavily contested.",
      "Southern hills and forests provide defensive terrain for units holding the bottom of the map.",
      "Wide open plains in the south and north allow for cavalry and flier mobility, but are vulnerable to ranged attacks."
    ],
    "givenName": "River Crossing",
    "originalName": "AssassinTest",
    "description": "A lush landscape with winding rivers and multiple bridges connecting various paths. The map features dense forests and open plains, providing strategic opportunities for movement and ambush.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Fortress Hall",
        "description": "A large, enclosed stone structure at the top of the map, featuring pillars for cover, a chest, and multiple staircases. This is likely the command center or throne room, highly defensible and a key objective.",
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
        "description": "A spacious open area with scattered trees, roads, and some hills. This is the main outdoor space, providing mobility but limited cover. It connects the fortress to the barracks and the southern approach.",
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
        "name": "Eastern Barracks and Vault",
        "description": "A stone building on the east side, accessible via a door at (19,12), containing a chest and stairs. This area is isolated from the main courtyard by walls and is a valuable target for treasure.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Chest",
          "Door"
        ],
        "fromX": 17,
        "fromY": 8,
        "toX": 19,
        "toY": 13
      },
      {
        "name": "Western Barracks",
        "description": "A stone building on the west side, featuring pillars and stairs. It is separated from the courtyard by walls and serves as a defensive outpost or troop quarters.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 14,
        "toX": 4,
        "toY": 17
      },
      {
        "name": "Southern Passage and Outbuildings",
        "description": "A series of southern rooms and passages, including outbuildings and connecting roads. This area provides access to the rest of the fortress and may serve as a reinforcement entry point.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 5,
        "fromY": 14,
        "toX": 19,
        "toY": 17
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (1,1)",
      "Chest at (19,10)",
      "Door at (19,12)",
      "Multiple stairs: (12,3), (16,0), (16,1), (16,2), (8,6), (9,16), (3,17), (9,17), (16,13), (16,14), (16,15), (16,16), (16,17)"
    ],
    "chokePoints": [
      "Door at (19,12) leading to Eastern Barracks and Vault",
      "Narrow stair access at (8,6) and (9,16)",
      "Entrances to Northern Fortress Hall at (12,3), (16,0), (16,1), (16,2)"
    ],
    "strategicConsiderations": [
      "The Northern Fortress Hall is highly defensible with limited entrances and pillars for cover.",
      "The Central Courtyard is open and vulnerable to ranged attacks but allows for rapid movement.",
      "The Eastern Barracks and Vault is isolated and can be locked down via the door at (19,12); prioritize thieves or keys.",
      "The Western Barracks provides a flanking position and can be used to reinforce the courtyard or defend against southern incursions.",
      "Southern Passage and Outbuildings may be used for reinforcements or as a fallback position if the courtyard is lost."
    ],
    "givenName": "Fortress Courtyard",
    "originalName": "Knights_Villagers_Bandits_10_(3C_00_CE_3E)__by_Aura_Wolf",
    "description": "A fortified outdoor area surrounded by stone structures, featuring a central open space with scattered trees and pathways.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Outer Courtyard",
        "description": "An outdoor area with plains, forests, and roads. Provides approach routes to the fortress and some cover for attackers or defenders.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Road"
        ],
        "fromX": 0,
        "fromY": 6,
        "toX": 4,
        "toY": 14
      },
      {
        "name": "Northern Entry Hall",
        "description": "The main entry hall of the fortress, accessible from the west. Serves as the initial indoor area after entering from the courtyard.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 4,
        "toY": 1
      },
      {
        "name": "Central Fortress Corridor",
        "description": "A long, continuous corridor running through the center of the fortress, connecting multiple rooms and providing access to the inner areas.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 6,
        "fromY": 0,
        "toX": 10,
        "toY": 5
      },
      {
        "name": "Eastern Fortress Hall",
        "description": "A large hall with stairs and barrels, likely used for storage or as a secondary defensive position. Connects to the central corridor and inner rooms.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Barrel"
        ],
        "fromX": 6,
        "fromY": 6,
        "toX": 14,
        "toY": 13
      },
      {
        "name": "Southern Fortress Passage",
        "description": "A narrow passage at the southern edge of the fortress, providing a route between the eastern and western sides.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 6,
        "fromY": 14,
        "toX": 14,
        "toY": 14
      }
    ],
    "keyPointsOfInterest": [
      "Stairs at (11,5) and (11,9)",
      "Barrel at (14,2) and (14,12)",
      "Multiple wall segments forming defensive bottlenecks"
    ],
    "chokePoints": [
      "Narrow corridor at (6,4)-(6,5)",
      "Wall gaps at (6,0)-(6,1) and (6,6)-(6,7)",
      "Southern passage at (6,14)-(14,14)"
    ],
    "strategicConsiderations": [
      "The outer courtyard provides cover and approach options for attackers, but is exposed to defenders in the fortress.",
      "The central corridor is a key defensive line; controlling it restricts enemy movement between regions.",
      "Stairs and barrels in the eastern hall can be used for ambushes or to slow down attackers.",
      "Choke points at corridor entrances and the southern passage are ideal for defensive stands.",
      "Multiple wall segments create natural bottlenecks, making it difficult for large groups to advance together."
    ],
    "givenName": "Fortress Entrance",
    "originalName": "TrainingFortress",
    "description": "A fortified indoor area with strategic pathways and defensive structures.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Grand Throne Room",
        "description": "A large, open room with pillars and the throne at (18,1). This is the main objective and a strong defensive position, accessible from the south and west.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Throne"
        ],
        "fromX": 5,
        "fromY": 0,
        "toX": 19,
        "toY": 2
      },
      {
        "name": "Northern Fortress Hall",
        "description": "A wide hall with pillars, serving as the main approach to the throne room from the west. Offers some cover and multiple entry points.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 15,
        "toY": 2
      },
      {
        "name": "Central Fortress Corridors",
        "description": "A network of corridors and stairwells connecting the northern hall to the southern and eastern parts of the fortress. Stairs at (4,4), (5,4), (4,5), (5,5) allow for vertical movement and possible reinforcements.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 3,
        "toX": 15,
        "toY": 6
      },
      {
        "name": "Eastern Treasure Vaults",
        "description": "A secure vault room containing chests at (16,8) and (18,8), accessible through doors and heavily walled off from the rest of the fortress.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 12,
        "fromY": 8,
        "toX": 19,
        "toY": 8
      },
      {
        "name": "Southern Fortress Hall",
        "description": "A large southern hall with pillars and multiple doors, serving as a staging area for attackers or reinforcements. Contains a chest at (14,19) and connects to the rest of the fortress via doors.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 15,
        "toY": 19
      },
      {
        "name": "Western Lower Corridors",
        "description": "A series of corridors and rooms in the western part of the fortress, with pillars for cover and multiple doors connecting to the southern hall.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 6,
        "toX": 14,
        "toY": 15
      },
      {
        "name": "Eastern Lower Vaults",
        "description": "A set of vault rooms in the southeast, containing chests at (16,19), (18,19), and (14,19). Accessible via doors and separated from the main southern hall by walls.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Pillar"
        ],
        "fromX": 15,
        "fromY": 14,
        "toX": 19,
        "toY": 19
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (18,1)",
      "Chests at (16,8), (18,8), (14,19), (16,19), (18,19)",
      "Stairs at (4,4), (5,4), (4,5), (5,5)",
      "Multiple doors at (2,9), (7,9), (2,12), (7,12), (2,18), (5,18), (7,9), (7,12), (5,18), (18,18), (7,9), (7,12), (7,18), (12,9), (12,12)"
    ],
    "chokePoints": [
      "Doors at (2,9), (7,9), (2,12), (7,12), (2,18), (5,18), (7,9), (7,12), (5,18), (18,18), (7,9), (7,12), (7,18), (12,9), (12,12)",
      "Narrow corridors between vaults and main halls",
      "Stairs at (4,4), (5,4), (4,5), (5,5)"
    ],
    "strategicConsiderations": [
      "The throne room is the primary defensive objective, with limited access and strong defensive terrain (pillars).",
      "Treasure vaults are isolated and require breaching doors, making them vulnerable to ambushes.",
      "Central corridors and stairwells allow for rapid movement and reinforcement between regions.",
      "Southern and western halls provide staging areas for attackers, but are separated from the throne by multiple choke points.",
      "Defenders can use the many doors and walls to create bottlenecks and slow attackers' advance.",
      "Pillars provide cover for both attackers and defenders in open halls."
    ],
    "givenName": "Fortress Siege",
    "originalName": "PrisonBreak",
    "description": "A fortified indoor map featuring a central throne room, multiple corridors, and strategic defensive positions.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Aquatic Hall",
        "description": "A long, open hall with pillars, running along the north side of the fortress. Provides a vantage point over the central waterway and is ideal for ranged units to control movement across the top of the map.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 11,
        "fromY": 0,
        "toX": 19,
        "toY": 5
      },
      {
        "name": "Central Waterway",
        "description": "A wide, impassable water channel that divides the fortress horizontally. It acts as a natural barrier, restricting movement and forcing units to use the surrounding walkways.",
        "terrainTypes": [
          "Lake"
        ],
        "fromX": 0,
        "fromY": 1,
        "toX": 9,
        "toY": 3
      },
      {
        "name": "Western Walkway",
        "description": "A corridor running along the west side of the fortress, featuring pillars for cover. Connects the northern hall to the southern chambers and provides flanking opportunities.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 11,
        "fromY": 6,
        "toX": 15,
        "toY": 13
      },
      {
        "name": "Eastern Walkway",
        "description": "A corridor on the east side, mirroring the western walkway. Offers access to the upper and lower parts of the fortress and is a key route for maneuvering around the central waterway.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 16,
        "fromY": 6,
        "toX": 19,
        "toY": 13
      },
      {
        "name": "Southern Grand Hall",
        "description": "A large, open chamber at the southern end of the fortress, with multiple staircases and pillars. This area is a major battleground and connects to the throne room and treasure vault.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 11,
        "fromY": 14,
        "toX": 19,
        "toY": 19
      },
      {
        "name": "Throne Room and Vault",
        "description": "A secure chamber containing the throne and treasure chests, heavily fortified and accessible only through a locked door. The final defensive position for the map.",
        "terrainTypes": [
          "Floor",
          "Throne",
          "Chest"
        ],
        "fromX": 4,
        "fromY": 20,
        "toX": 14,
        "toY": 21
      },
      {
        "name": "Southern Outer Corridor",
        "description": "A wide corridor running along the southernmost edge of the fortress, providing access to the throne room and serving as a staging area for reinforcements.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 0,
        "fromY": 24,
        "toX": 19,
        "toY": 25
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (4,20)",
      "Chests at (11,20) and (13,20)",
      "Locked Door at (12,22)",
      "Multiple Stairs at (15,8)-(19,10), (15,14), (15,15), (15,20), (16,8)-(19,10), (16,14)-(19,15), (12,23), (5,23), (4,23), (3,23), (4,14), (4,15), (4,13)",
      "Pillars at (14,1), (18,1), (12,6), (12,11), (12,16), (18,21)"
    ],
    "chokePoints": [
      "Locked Door at (12,22)",
      "Narrow staircases at (15,8)-(19,10), (15,14), (15,15), (15,20), (16,8)-(19,10), (16,14)-(19,15), (12,23), (5,23), (4,23), (3,23), (4,14), (4,15), (4,13)",
      "Corridor junctions at (11,5)-(11,6) and (19,5)-(19,6)"
    ],
    "strategicConsiderations": [
      "The central waterway divides the map, forcing attackers to use the narrow walkways on the east and west sides or the southern grand hall to advance.",
      "The throne room is heavily fortified, accessible only through a locked door and surrounded by defensive terrain.",
      "Pillars throughout the walkways and halls provide cover for defenders, making ranged attacks and defensive formations highly effective.",
      "Staircases and narrow corridors act as natural choke points, ideal for stalling enemy advances or setting up ambushes.",
      "The southern outer corridor allows for rapid reinforcement movement and flanking, but is exposed to attacks from multiple directions."
    ],
    "givenName": "Aquatic Fortress",
    "originalName": "BacrunCastle",
    "description": "A fortified indoor structure with water channels and multiple chambers, designed for strategic defense and movement.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Castle Approach",
        "description": "The northern approach to the castle, featuring a mix of plains, forests, and rivers, with bridges and a fortified gate. This area is the main entryway to the castle and is heavily defensible due to the river and wall barriers.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "River",
          "Bridge",
          "Wall",
          "Gate",
          "Fort",
          "House",
          "Hill"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 9,
        "toY": 4
      },
      {
        "name": "Northern Mountain Pass",
        "description": "A rugged mountain pass to the northeast, providing natural defense and limited mobility. Only accessible to fliers or units with high mobility.",
        "terrainTypes": [
          "Mountain",
          "Cliff",
          "Hill",
          "Plain"
        ],
        "fromX": 10,
        "fromY": 0,
        "toX": 16,
        "toY": 5
      },
      {
        "name": "Central River Crossing",
        "description": "The central region dominated by a wide river with multiple bridges and fords. This area is the main battleground for crossing between north and south, with several forts and forests providing cover.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Forest",
          "Fort",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 16,
        "toY": 12
      },
      {
        "name": "Western Village and Outskirts",
        "description": "A village and its outskirts on the western side, including houses, a village, armory, and vendor. This area is important for resupplying and recruiting, and is partially protected by cliffs and sea.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Village",
          "Armory",
          "Vendor",
          "Bridge",
          "Cliff",
          "Sea"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 6,
        "toY": 22
      },
      {
        "name": "Eastern Settlement and Forts",
        "description": "A settlement with multiple buildings, including houses, forts, a village, and shops. This region is a key resource and reinforcement point, with some natural barriers.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Fort",
          "Armory",
          "Vendor",
          "Bridge",
          "Cliff",
          "Sea",
          "Village"
        ],
        "fromX": 13,
        "fromY": 10,
        "toX": 16,
        "toY": 22
      },
      {
        "name": "Southern Plains and Lake Shore",
        "description": "The southern part of the map, featuring open plains, some forest, and the shore of a large lake (sea tiles). This area is open to flanking and rapid movement, but is bordered by cliffs and water.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Cliff",
          "Sea",
          "Bridge"
        ],
        "fromX": 7,
        "fromY": 13,
        "toX": 12,
        "toY": 22
      }
    ],
    "keyPointsOfInterest": [
      "Castle Gate at (8,3)",
      "Bridges at (4,3), (4,4), (9,8), (10,8), (9,20), (8,21), (8,22)",
      "Forts at (4,1), (8,7), (12,12), (1,14), (13,10), (12,12), (15,13)",
      "Villages at (2,20), (15,18)",
      "Armory at (5,20), (5,20)",
      "Vendor at (11,20), (11,20)",
      "Houses at (0,2), (16,14), (13,21)"
    ],
    "chokePoints": [
      "Castle Gate at (8,3)",
      "Bridges at (4,3), (4,4), (9,8), (10,8), (9,20), (8,21), (8,22)",
      "Narrow mountain pass at (10,0)-(16,5)",
      "Cliff bottlenecks at (6,13)-(7,13), (10,13)-(11,13), (5,14)-(6,14)"
    ],
    "strategicConsiderations": [
      "The central river and its bridges are the main points of conflict; controlling these is vital for movement between north and south.",
      "The castle gate is a strong defensive position, with walls and limited access.",
      "Mountain and cliff regions restrict movement, favoring fliers and ranged units.",
      "Villages and shops in the west and east provide resources and potential reinforcements; securing these early can be decisive.",
      "Southern plains and lake shore are open to fast movement and flanking, but are vulnerable to attacks from multiple directions.",
      "Forts scattered throughout the map offer healing and defensive bonuses, making them valuable for holding or staging attacks."
    ],
    "givenName": "River Crossing Battle",
    "originalName": "Knights_Villagers_Bandits_13_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic map featuring a central river with multiple bridges, surrounded by villages and a castle.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Grand Central Hall",
        "description": "A vast open hall with pillars for cover, forming the main thoroughfare of the fortress. It connects to most other regions and is ideal for large-scale battles or regrouping.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 19,
        "toY": 6
      },
      {
        "name": "Western Pillar Gallery",
        "description": "A side gallery with multiple pillars, providing defensive cover and flanking opportunities. It is separated from the central hall by walls and pillars.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 6
      },
      {
        "name": "Northern Treasure Alcove",
        "description": "A small, secure room in the northeast corner containing chests. Accessible only from the north, making it a valuable but defensible objective.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 16,
        "fromY": 0,
        "toX": 18,
        "toY": 3
      },
      {
        "name": "Main Stairwell Block",
        "description": "A large area dominated by stair tiles, connecting the upper and lower levels of the fortress. It serves as a major vertical transition zone and a key movement bottleneck.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 7,
        "fromY": 5,
        "toX": 17,
        "toY": 9
      },
      {
        "name": "Inner Fortress Ring",
        "description": "A ring-shaped set of rooms and corridors encircling the central hall, with multiple staircases and pillars. It provides access to the outer wings and is critical for controlling fortress movement.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 6,
        "fromY": 10,
        "toX": 13,
        "toY": 17
      },
      {
        "name": "Western Lower Quarters",
        "description": "A series of rooms and corridors in the lower western part of the fortress, featuring stairs and defensive walls. Useful for flanking or retreating.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 5,
        "toY": 19
      },
      {
        "name": "Eastern Lower Quarters",
        "description": "A mirrored set of rooms to the east, with stairs and narrow passages. Provides access to the armory and vendor in the southeast.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 14,
        "fromY": 10,
        "toX": 19,
        "toY": 19
      },
      {
        "name": "Southern Sea Wall",
        "description": "A southern boundary with sea tiles and walls, limiting movement and providing a natural defensive barrier.",
        "terrainTypes": [
          "Floor",
          "Sea",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 18,
        "toX": 19,
        "toY": 19
      },
      {
        "name": "Southeast Market Row",
        "description": "An open market area with an armory and vendor, accessible from the fortress interior. Important for resupplying and recruiting.",
        "terrainTypes": [
          "Plain",
          "Armory",
          "Vendor"
        ],
        "fromX": 9,
        "fromY": 22,
        "toX": 19,
        "toY": 25
      }
    ],
    "keyPointsOfInterest": [
      "Chests at (17,0) and (17,3)",
      "Armory at (17,23)",
      "Vendor at (18,24)",
      "Multiple staircases throughout the fortress"
    ],
    "chokePoints": [
      "Narrow stairwells at (7,5)-(8,9) and (14,7)-(17,9)",
      "Corridor bottlenecks at (6,10)-(13,17)",
      "Entrances to treasure alcove at (16,0)-(18,3)",
      "Market access at (15,22)-(19,25)"
    ],
    "strategicConsiderations": [
      "The central hall is ideal for large battles but vulnerable to flanking from the inner ring.",
      "Stairwells are critical for vertical movement and can be easily blocked to control access.",
      "Treasure alcoves and market row are high-value targets but can be defended by holding narrow entrances.",
      "Sea and wall boundaries in the south limit mobility and can be used to anchor defensive lines.",
      "Pillars and walls provide cover for ranged units and can be used to create kill zones."
    ],
    "givenName": "Fortress of Tides",
    "originalName": "KilthelTemple",
    "description": "A complex indoor fortress with multiple levels and water features, featuring narrow corridors and strategic choke points.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Plains Approach",
        "description": "A wide open field with scattered forests and a hill, providing approach routes to the fortress. Offers little cover except for a few forest tiles and a hill in the northwest.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 18,
        "toY": 4
      },
      {
        "name": "Twin Thrones Audience Hall",
        "description": "A large, central indoor hall featuring two thrones and multiple staircases. This is the main defensive and symbolic heart of the fortress, accessible from multiple directions but protected by thick walls.",
        "terrainTypes": [
          "Floor",
          "Throne",
          "Stairs"
        ],
        "fromX": 5,
        "fromY": 5,
        "toX": 13,
        "toY": 8
      },
      {
        "name": "Inner Fortress Corridors",
        "description": "A network of corridors and rooms within the fortress, containing pillars for cover and staircases for vertical movement. Connects the throne room to the treasure chamber and other fortress areas.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 5,
        "fromY": 9,
        "toX": 13,
        "toY": 14
      },
      {
        "name": "Treasure Vault",
        "description": "A small, secure chamber containing a valuable chest and pillars for defense. Accessible only through the inner corridors, making it easy to defend.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Pillar"
        ],
        "fromX": 5,
        "fromY": 13,
        "toX": 12,
        "toY": 14
      },
      {
        "name": "Southern Fortress Exit and Road",
        "description": "The southern exit of the fortress, featuring doors, stairs, and a road leading out to the open plains. This area is a key point for reinforcements or escape, and is the main route for entering or leaving the fortress from the south.",
        "terrainTypes": [
          "Floor",
          "Door",
          "Stairs",
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 5,
        "fromY": 15,
        "toX": 18,
        "toY": 20
      }
    ],
    "keyPointsOfInterest": [
      "Twin Thrones at (7,6) and (7,6)",
      "Treasure Chest at (11,13)",
      "Multiple staircases at (13,6), (14,8), (14,9), (5,16), (6,16)",
      "Doors at (5,15), (6,15)"
    ],
    "chokePoints": [
      "Doors at (5,15) and (6,15) separating the inner fortress from the southern exit",
      "Narrow corridor at (7,9) with pillar",
      "Staircase bottlenecks at (13,6), (14,8), (14,9)"
    ],
    "strategicConsiderations": [
      "Defenders can hold the throne room and treasure vault with ease due to limited access points and strong walls.",
      "Attackers must breach the southern doors or scale the walls to enter the fortress, making frontal assaults risky.",
      "The open northern plains favor cavalry and fliers, but offer little cover for infantry.",
      "Staircases and pillars inside the fortress provide defensive advantages and limit movement, favoring defenders.",
      "The southern road is the main reinforcement and escape route; controlling the doors here is crucial for both sides."
    ],
    "givenName": "Fortress of the Twin Thrones",
    "originalName": "BorderFort",
    "description": "A fortified structure with a mix of indoor chambers and outdoor pathways, featuring a throne room and treasure storage.",
    "setting": "mixed indoor and outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Fortress Interior",
        "description": "A series of interconnected rooms and corridors with pillars and chests, forming the western indoor section of the fortress. Contains a locked door at (2,16) and several chests, making it a valuable area for loot and defense.",
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
        "name": "Central Courtyard and Main Hall",
        "description": "A large open courtyard with some forest patches and stairs, surrounded by walls and connecting to the throne room at (10,5). This is the main area for movement and combat, with multiple access points from all directions.",
        "terrainTypes": [
          "Plain",
          "Floor",
          "Stairs",
          "Forest",
          "Throne"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 15,
        "toY": 16
      },
      {
        "name": "Eastern Fortress Interior",
        "description": "A set of rooms and corridors on the eastern side of the fortress, featuring pillars and stairs. Provides flanking opportunities and access to the central courtyard.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 16,
        "fromY": 0,
        "toX": 20,
        "toY": 16
      },
      {
        "name": "Southern Outer Approach",
        "description": "The southernmost area outside the main fortress, with a mix of open ground, road, and some forest. This is the main approach for attackers and a key area to control for defense.",
        "terrainTypes": [
          "Plain",
          "Floor",
          "Pillar",
          "Stairs",
          "Road",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 17,
        "toX": 20,
        "toY": 21
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (10,5)",
      "Chests at (0,14), (0,16), (0,18)",
      "Locked Door at (2,16)",
      "Stairs at (3,3), (15,3), (1,8), (7,9), (13,9), (18,9), (18,10), (6,16), (14,16), (10,17), (14,18), (9,20), (10,20), (11,20)"
    ],
    "chokePoints": [
      "Locked Door at (2,16)",
      "Narrow corridor at (2,6)-(2,7)",
      "Stairs at (3,3), (15,3), (7,9), (13,9), (18,9), (18,10)"
    ],
    "strategicConsiderations": [
      "Defenders can hold the central courtyard and throne room, using the surrounding walls and choke points to limit attacker movement.",
      "Attackers must breach the western or eastern interiors or push through the southern approach, dealing with locked doors and narrow corridors.",
      "Chests in the western interior are valuable but require careful navigation of tight spaces and potential ambushes.",
      "Stairs and pillars provide defensive cover and can be used to funnel enemies into kill zones.",
      "The southern approach is open but exposed, making it risky for attackers to advance without support."
    ],
    "givenName": "Fortress Courtyard",
    "originalName": "Nobles_Evil_Doers_11_(3C_00_68_3E)__by_Aura_Wolf",
    "description": "A fortified structure with a central courtyard surrounded by walls and buildings, featuring both indoor and outdoor areas.",
    "setting": "mixed indoor and outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Village District",
        "description": "A walled village area in the north, containing a vendor and surrounded by plains and forests. The walls and lake to the south form a natural barrier, making this a defensible starting or objective area.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Wall",
          "Village",
          "Vendor"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 18,
        "toY": 3
      },
      {
        "name": "Northern Lake and Vendor Outskirts",
        "description": "A region with lakes, a vendor, and some forest, acting as a buffer between the northern village and the central river. The lakes and walls restrict movement, creating a natural defensive line.",
        "terrainTypes": [
          "Plain",
          "Lake",
          "Wall",
          "Vendor",
          "Forest"
        ],
        "fromX": 8,
        "fromY": 1,
        "toX": 15,
        "toY": 6
      },
      {
        "name": "Central River and Bridge Crossing",
        "description": "The main river crossing with three parallel bridges, flanked by roads and forests. This is the primary chokepoint connecting north and south, and will be heavily contested.",
        "terrainTypes": [
          "Road",
          "Bridge",
          "Plain",
          "Forest"
        ],
        "fromX": 7,
        "fromY": 7,
        "toX": 18,
        "toY": 10
      },
      {
        "name": "Western Forest Path",
        "description": "A narrow, forested path along the western edge, providing flanking opportunities and alternate access to the central and southern regions.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Road"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 6,
        "toY": 12
      },
      {
        "name": "Eastern Forest Path",
        "description": "A narrow, forested path along the eastern edge, useful for flanking or bypassing the central bridge area.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Road"
        ],
        "fromX": 19,
        "fromY": 4,
        "toX": 23,
        "toY": 12
      },
      {
        "name": "Southern Village District",
        "description": "A southern walled village with a lake and forest, mirroring the northern village. It is a likely objective or reinforcement area, with limited access due to walls and water.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Wall",
          "Village",
          "Lake"
        ],
        "fromX": 6,
        "fromY": 12,
        "toX": 18,
        "toY": 16
      },
      {
        "name": "Southwestern Plains",
        "description": "Open plains and a small village in the southwest, with some forest and a lake. Provides an alternate southern approach or retreat route.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Wall",
          "Village",
          "Lake",
          "Road"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 5,
        "toY": 16
      }
    ],
    "keyPointsOfInterest": [
      "Village at (6,2) and (16,12)",
      "Vendor at (14,2)",
      "Multiple bridges at (12-14,8-9)",
      "Lake tiles at (11-13,2-6), (13,11-13), (12,12-13), (13,14-15), (16,16)",
      "Walls enclosing villages and paths"
    ],
    "chokePoints": [
      "Triple bridge crossing at (12-14,8-9)",
      "Narrow forested western path at (0-6,7-12)",
      "Narrow forested eastern path at (19-23,4-12)",
      "Village gates at (6,2) and (16,12)"
    ],
    "strategicConsiderations": [
      "The central bridge area is the main route and will be heavily contested; controlling it is key to map dominance.",
      "The western and eastern forest paths allow for flanking or bypassing the main chokepoint, but are narrower and riskier.",
      "Both villages (north and south) are defensible due to walls and limited entrances, making them ideal for objectives or last stands.",
      "Lakes and walls create natural barriers, funneling movement and making certain areas ideal for defensive play.",
      "Forests provide cover for ambushes, especially along the flanking paths."
    ],
    "givenName": "River Crossing Village",
    "originalName": "Deidar",
    "description": "A quaint village divided by a river, featuring multiple bridges and surrounded by lush greenery.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Fortress Main Hall",
        "description": "The central interior of the fortress, featuring multiple rooms, pillars for cover, and a chest room in the north. Accessible via several doors and stairs, this is the main defensive area and the heart of the fortress.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Chest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 14,
        "toY": 10
      },
      {
        "name": "Fortress Western Approach",
        "description": "The open area west and south of the fortress, with a mix of plains, hills, forests, and roads. Provides multiple approach vectors for attackers and is key for staging assaults or defending against reinforcements.",
        "terrainTypes": [
          "Plain",
          "Hill",
          "Forest",
          "Road"
        ],
        "fromX": 0,
        "fromY": 11,
        "toX": 15,
        "toY": 23
      },
      {
        "name": "Fortress Eastern Fields",
        "description": "Expansive open fields east of the fortress, with scattered forests and hills. Offers flanking opportunities and is important for controlling the battlefield outside the fortress walls.",
        "terrainTypes": [
          "Plain",
          "Hill",
          "Forest",
          "Road"
        ],
        "fromX": 12,
        "fromY": 0,
        "toX": 20,
        "toY": 23
      },
      {
        "name": "Southern Outpost",
        "description": "A small, isolated building or outpost at the southern edge of the map, possibly used for storage or as a guard post. Provides a secondary objective or fallback point.",
        "terrainTypes": [
          "Floor",
          "Plain",
          "Forest",
          "Hill"
        ],
        "fromX": 15,
        "fromY": 20,
        "toX": 20,
        "toY": 23
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (12,7)",
      "Multiple doors at (9,2), (1,11), (2,11), (1,12), (2,12)",
      "Stairs at (0,3), (1,3), (2,3), (4,7), (5,7), (6,7), (11,7), (11,8), (1,17), (1,18)",
      "Pillars at (5,3), (9,6), (5,9), (9,9)",
      "Outpost building at (15,20)-(20,23)"
    ],
    "chokePoints": [
      "Doors at (9,2), (1,11), (2,11), (1,12), (2,12)",
      "Narrow fortress entrances at (7,0)-(7,6), (11,0)-(11,6)",
      "Stairs and wall bottlenecks at (4,7)-(6,7), (11,7)-(12,8)"
    ],
    "strategicConsiderations": [
      "The fortress main hall is highly defensible with limited entrances and interior cover from pillars.",
      "Attackers must breach doors or funnel through narrow stairways, making them vulnerable to defenders.",
      "The open fields to the east and west allow for flanking but provide little cover, so controlling forests and hills is key.",
      "The southern outpost can be used as a fallback or reinforcement point, but is isolated from the main fortress.",
      "Securing the chest room early can provide valuable resources, but it is deep within the fortress and requires breaching multiple defenses."
    ],
    "givenName": "Fortress Approach",
    "originalName": "DefenseFort",
    "description": "A strategic map featuring a fortress with multiple entry points and surrounding open fields.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Treasure Corridor",
        "description": "A long, narrow corridor at the top of the fortress lined with treasure chests and pillars, ideal for ambushes and defensive stands. The corridor is segmented by walls and pillars, with chests at both ends.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 13,
        "toY": 3
      },
      {
        "name": "Central Fortress Hall",
        "description": "The main chamber of the fortress, spacious and filled with pillars and staircases. Multiple exits and connections to other regions make this the strategic heart of the map, suitable for both defense and rapid movement.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 4,
        "toX": 13,
        "toY": 15
      },
      {
        "name": "Eastern Treasure Corridor",
        "description": "A secluded corridor on the eastern side, containing treasure chests and pillars. It is separated from the main hall by walls, making it a defensible and isolated area.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Pillar",
          "Stairs"
        ],
        "fromX": 14,
        "fromY": 0,
        "toX": 18,
        "toY": 3
      },
      {
        "name": "Eastern Lower Hall",
        "description": "A large hall on the eastern side, accessible through doors and stairs. Contains pillars for cover and is connected to the southern and central regions via doors, making it a key area for flanking or retreat.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 14,
        "fromY": 4,
        "toX": 18,
        "toY": 15
      },
      {
        "name": "Southern Storage and Pillar Room",
        "description": "A southern room filled with pillars, providing cover and multiple movement options. It is separated from the central hall by walls and doors, making it a secondary defensive position or a staging area for reinforcements.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 13,
        "toY": 20
      },
      {
        "name": "Southeast Lower Hall",
        "description": "A southeastern extension of the lower hall, with pillars and open space. It is accessible from the eastern lower hall and provides a route for flanking or retreat.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 14,
        "fromY": 16,
        "toX": 18,
        "toY": 20
      }
    ],
    "keyPointsOfInterest": [
      "Chests at (10,0), (12,0), (7,6), (10,9), (12,9), (7,6), (10,9), (12,9)",
      "Multiple staircases throughout the map",
      "Doors at (10,11), (11,11), (12,11), (10,12), (11,12), (12,12), (16,5), (17,5), (16,6), (17,6), (10,11), (11,11), (12,11), (10,12), (11,12), (12,12)"
    ],
    "chokePoints": [
      "Narrow corridors at the north and east",
      "Doors at (10,11), (11,11), (12,11), (10,12), (11,12), (12,12), (16,5), (17,5), (16,6), (17,6)",
      "Staircases connecting upper and lower levels"
    ],
    "strategicConsiderations": [
      "Defenders can use the narrow treasure corridors and doors to create strong choke points.",
      "The central hall allows for rapid movement and reinforcement between regions.",
      "Pillars and staircases provide cover and vertical mobility, favoring units with high movement or ranged attacks.",
      "Attackers must breach doors and navigate narrow corridors, making them vulnerable to ambushes.",
      "Control of the central hall is crucial for both offense and defense, as it connects all major regions."
    ],
    "givenName": "Fortress of Treasures",
    "originalName": "CesarianCapitalRetreat",
    "description": "An indoor fortress filled with treasure chests and narrow corridors, designed for strategic movement and defense.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Village and Outskirts",
        "description": "A large area containing the main northern village, a burning house, and surrounding plains and forests. This region is the main deployment and staging area for northern forces, with access to both bridges.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "Village",
          "House"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 18,
        "toY": 4
      },
      {
        "name": "Western Bridge Crossing",
        "description": "A narrow stone bridge crossing the central river, providing a key chokepoint for movement between north and south. Control of this bridge is vital for advancing or defending either side.",
        "terrainTypes": [
          "Road"
        ],
        "fromX": 7,
        "fromY": 5,
        "toX": 8,
        "toY": 12
      },
      {
        "name": "Eastern Bridge Crossing",
        "description": "A second, parallel stone bridge crossing the river to the east. Offers an alternative route for flanking or splitting forces.",
        "terrainTypes": [
          "Road"
        ],
        "fromX": 13,
        "fromY": 5,
        "toX": 14,
        "toY": 12
      },
      {
        "name": "Central River",
        "description": "A wide, impassable river running horizontally through the map, separating the north and south. Only crossable at the two bridges.",
        "terrainTypes": [
          "Sea"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 18,
        "toY": 12
      },
      {
        "name": "Southern Fortified Approach",
        "description": "A fortified southern area with roads, plains, and some forest cover. This region is the main defensive position for southern forces and the goal for attackers crossing the bridges.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 18,
        "toY": 15
      }
    ],
    "keyPointsOfInterest": [
      "Village at (7,1)",
      "House at (1,3)",
      "Western Bridge (7,5)-(8,12)",
      "Eastern Bridge (13,5)-(14,12)"
    ],
    "chokePoints": [
      "Western Bridge Crossing (7,5)-(8,12)",
      "Eastern Bridge Crossing (13,5)-(14,12)"
    ],
    "strategicConsiderations": [
      "Both bridges are critical chokepoints; controlling them allows movement between north and south.",
      "The river is impassable except at the bridges, forcing units to funnel through narrow crossings.",
      "The northern village provides cover and deployment options, but is vulnerable to being cut off if bridges are lost.",
      "The southern approach is fortified and offers defensive terrain, making it difficult for attackers to break through if defenders hold the bridges.",
      "Splitting forces to threaten both bridges can force defenders to divide their attention, but risks being defeated in detail if not coordinated."
    ],
    "givenName": "Twin Bridges Crossing",
    "originalName": "Knights_Villagers_Bandits_11_(0E_00_72_10)__by_Aura_Wolf",
    "description": "A strategic outdoor map featuring two parallel bridges over a wide river, with villages and a fort nearby.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Forest and Thicket",
        "description": "A dense area of forest and thicket in the northwest, providing excellent cover and ambush opportunities. Movement is slowed for most units, but it offers strong defensive value.",
        "terrainTypes": [
          "Forest",
          "Thicket",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 5,
        "toY": 2
      },
      {
        "name": "Central Grassy Corridor",
        "description": "A wide, open corridor of plains and scattered forests running through the center of the map. This area connects the north and south and is the main route for movement between regions.",
        "terrainTypes": [
          "Plain",
          "Forest"
        ],
        "fromX": 3,
        "fromY": 0,
        "toX": 13,
        "toY": 11
      },
      {
        "name": "Eastern Forest Fringe",
        "description": "A patch of forest and plains on the far northeast, providing a flanking route and some cover for units approaching from the east.",
        "terrainTypes": [
          "Forest",
          "Plain"
        ],
        "fromX": 14,
        "fromY": 0,
        "toX": 17,
        "toY": 4
      },
      {
        "name": "Northern Cliffs and Coast",
        "description": "A line of cliffs and sea tiles forming a natural barrier along the north and northeast, impassable to most units except fliers. Controls access between the north and the rest of the map.",
        "terrainTypes": [
          "Cliff",
          "Sea"
        ],
        "fromX": 10,
        "fromY": 2,
        "toX": 17,
        "toY": 8
      },
      {
        "name": "Southern Plains",
        "description": "A large, open area of plains and scattered forests in the southern half of the map, ideal for cavalry and fast movement. Offers little cover but is crucial for maneuvering.",
        "terrainTypes": [
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 13,
        "toY": 13
      },
      {
        "name": "Mountain Range",
        "description": "A massive, impassable mountain range stretching across the southern and eastern edges of the map, forming a hard boundary and funneling movement through the central corridor.",
        "terrainTypes": [
          "Mountain"
        ],
        "fromX": 4,
        "fromY": 12,
        "toX": 17,
        "toY": 19
      }
    ],
    "keyPointsOfInterest": [
      "Central corridor (main route for movement)",
      "Northern cliffs (impassable barrier)",
      "Mountain range (impassable, forms map boundary)"
    ],
    "chokePoints": [
      "Narrow passage between the northern forest and central corridor",
      "Gaps between the mountain range and central plains"
    ],
    "strategicConsiderations": [
      "The central corridor is the main battleground and must be controlled for map dominance.",
      "The northern forest and thicket provide strong defensive positions for ambushes.",
      "The mountain range and cliffs restrict movement, forcing units into predictable paths.",
      "Fliers can bypass cliffs and mountains, offering unique flanking opportunities.",
      "The eastern forest fringe can be used for surprise attacks or to avoid the main battle line."
    ],
    "givenName": "Mountain Pass",
    "originalName": "MountainyLake",
    "description": "A rugged outdoor map featuring a mountain range, dense forests, and a sandy desert area.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central Fortress Complex",
        "description": "A large, walled fortress area with multiple forts, shops, and houses. The walls and cliffs create a defensible stronghold with limited entrances, making it a key strategic point for defense or siege.",
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
        "description": "A high ground area with cliffs, providing excellent vantage points and limiting access to fliers or units with high mobility. Useful for archers or controlling movement between the north and the rest of the map.",
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
        "description": "A wide, open area with scattered forts, houses, and vendors. The terrain is mostly open, with some cliffs and forests providing cover. This region is ideal for cavalry and fast movement, but vulnerable to ranged attacks from the clifftops.",
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
        "name": "Southern Lake and Village Approach",
        "description": "A region dominated by lakes, bridges, and a village in the southwest. The bridges act as chokepoints, and the lakes restrict movement, making this area defensively valuable and a likely reinforcement entry point.",
        "terrainTypes": [
          "Lake",
          "Plain",
          "Bridge",
          "Wall",
          "Village",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 7,
        "toY": 19
      },
      {
        "name": "South-Central Open Field",
        "description": "A mostly open field with some forest patches and walls, connecting the southern lake region to the eastern plains. This area is suitable for large-scale battles and flanking maneuvers.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Wall"
        ],
        "fromX": 8,
        "fromY": 13,
        "toX": 18,
        "toY": 19
      }
    ],
    "keyPointsOfInterest": [
      "Fortress shops (Armory at 0,10; Vendor at 6,11 and 6,11)",
      "Multiple Fort tiles (e.g., 11,1; 11,3; 12,8; 8,9; 12,8; 8,9)",
      "Village (1,18)",
      "Bridges (3,15; 4,15)",
      "Houses (1,8; 7,12; 7,12)",
      "Clifftop vantage points (various along y=0-4, x=8-18)"
    ],
    "chokePoints": [
      "Bridges at (3,15) and (4,15)",
      "Narrow fortress entrances at (2,8), (7,5), (7,13)",
      "Wall gaps at (8,11), (8,12), (8,13)"
    ],
    "strategicConsiderations": [
      "The fortress is highly defensible with limited entrances; attackers must breach walls or funnel through chokepoints.",
      "Cliffs in the north and east provide strong positions for ranged units and restrict movement to fliers.",
      "The southern lakes and bridges create natural choke points, ideal for holding off enemy advances or controlling reinforcements.",
      "Open fields in the south and east favor cavalry and mobile units, but are vulnerable to attacks from the clifftops.",
      "Villages and shops provide resources and healing, making them important to control early."
    ],
    "givenName": "Desert Fortress",
    "originalName": "Mages_Mercenaries_3_(42_00_43_44)__by_Aura_Wolf",
    "description": "A sprawling desert map featuring a mix of sandy dunes, a central fortress, and scattered ruins. The map is divided by a river, with a fortified area and several villages.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northwest Village Compound",
        "description": "A walled village compound in the northwest, accessible by roads and surrounded by walls. Provides a defensive position and is a key objective for protection or attack.",
        "terrainTypes": [
          "Village",
          "Wall",
          "Road",
          "Plain"
        ],
        "fromX": 2,
        "fromY": 1,
        "toX": 4,
        "toY": 2
      },
      {
        "name": "Northern Main Road",
        "description": "A broad road running east-west across the northern part of the map, connecting the northwest village to the northeast. Offers fast movement but is exposed to attacks from the flanking forests and walls.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 10,
        "toY": 3
      },
      {
        "name": "Central Walled Corridor",
        "description": "A narrow, walled corridor in the center of the map, acting as a choke point between the north and south. Control of this area is crucial for movement between regions.",
        "terrainTypes": [
          "Wall",
          "Road",
          "Plain"
        ],
        "fromX": 2,
        "fromY": 4,
        "toX": 5,
        "toY": 6
      },
      {
        "name": "Western Residential Block",
        "description": "A small residential area with a house, surrounded by walls. Provides a defensive position and potential for item acquisition.",
        "terrainTypes": [
          "House",
          "Wall",
          "Plain",
          "Road"
        ],
        "fromX": 7,
        "fromY": 8,
        "toX": 8,
        "toY": 8
      },
      {
        "name": "Northeast Village and Vendor Row",
        "description": "A cluster of village and vendor tiles in the northeast, surrounded by walls and roads. Important for shopping and side objectives.",
        "terrainTypes": [
          "Village",
          "Vendor",
          "Wall",
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 11,
        "fromY": 1,
        "toX": 14,
        "toY": 5
      },
      {
        "name": "Eastern Main Road and Forest Edge",
        "description": "A long stretch of road and open plain with scattered forests, running along the eastern edge. Offers mobility and some cover, but is vulnerable to attacks from the north and south.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 6,
        "fromY": 3,
        "toX": 14,
        "toY": 9
      },
      {
        "name": "Southwest Village and Road",
        "description": "A small village in the southwest corner, with adjacent roads and forest. Provides a defensive position and a potential objective.",
        "terrainTypes": [
          "Village",
          "Wall",
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 2,
        "toY": 12
      },
      {
        "name": "Southern Central Roadway",
        "description": "A wide road running east-west along the southern edge, connecting the southwest village to the southeast armory and vendor. Key for reinforcements and flanking maneuvers.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 3,
        "fromY": 10,
        "toX": 10,
        "toY": 12
      },
      {
        "name": "Southeast Armory and Vendor Block",
        "description": "A fortified block in the southeast with an armory and vendor, surrounded by walls and roads. Important for resupplying and controlling the southeast corner.",
        "terrainTypes": [
          "Armory",
          "Vendor",
          "Wall",
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 13,
        "fromY": 10,
        "toX": 14,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "Village at (3,2)",
      "Village at (11,1)",
      "House at (8,8)",
      "Vendor at (14,5)",
      "Armory at (14,11)"
    ],
    "chokePoints": [
      "Central walled corridor (2,4)-(5,6)",
      "Narrow road between walls at (6,6)-(7,6)",
      "Entrances to villages at (3,2) and (11,1)",
      "Southeast armory/vendor block entrances at (13,10)-(14,12)"
    ],
    "strategicConsiderations": [
      "Control of the central walled corridor is vital for movement between north and south.",
      "Villages and houses provide defensive bonuses and may contain items or objectives.",
      "The eastern and southern roads allow for rapid movement but are exposed to attacks from flanking forests.",
      "The armory and vendor in the southeast are important for resupplying and should be secured early.",
      "Choke points at village entrances and narrow corridors can be used to hold off larger enemy forces."
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
        "description": "A secure room in the northwest with a chest and pillars for cover, accessible only through a door at (1,3). This is a high-value area for loot and is easily defensible due to limited entry.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 7,
        "toY": 3
      },
      {
        "name": "Central Fortress Corridor",
        "description": "The main passageway running through the fortress, connecting most rooms and providing access to stairs and pillars for tactical positioning. This corridor is the primary route for movement and engagement.",
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
        "description": "A set of rooms on the western side, likely used by guards. Accessible via doors at (0,7) and (1,7), and stairs at (0,8) and (1,8). Provides flanking opportunities and defensive positions.",
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
        "description": "A long eastern room lined with pillars and stairs, ideal for defensive stands and ranged units. Connects to the main corridor and has multiple access points.",
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
        "description": "The southernmost area, transitioning from fortress interior to the outside. Includes plain and forest tiles, making it a potential entry or exit point and a staging area for reinforcements.",
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
        "description": "An open courtyard outside the main structure, with forest and plain terrain. Provides a flanking route and a place for mounted or flying units to maneuver.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Plain",
          "Forest"
        ],
        "fromX": 13,
        "fromY": 13,
        "toX": 16,
        "toY": 14
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (1,1)",
      "Multiple stairs at (7,1), (8,3), (5,7), (6,7), (0,8), (1,8), (0,9), (1,9), (14,4), (14,5), (13,9), (8,13), (9,13)",
      "Doors at (1,3), (0,7), (1,7)",
      "Pillars throughout central and eastern rooms"
    ],
    "chokePoints": [
      "Door at (1,3) leading to the Northern Treasure Vault",
      "Doors at (0,7) and (1,7) controlling access to the Western Guard Quarters",
      "Narrow corridor sections at (7,4), (7,5), (7,8), (7,9)",
      "Stair clusters at (5,7), (6,7), (8,13), (9,13)"
    ],
    "strategicConsiderations": [
      "The Northern Treasure Vault is highly defensible and valuable, but only accessible through a single door, making it easy to block or trap enemies.",
      "The Central Fortress Corridor is the main battleground, with pillars and stairs providing cover and elevation advantages.",
      "Western Guard Quarters can be used for flanking or as a fallback position if the main corridor is lost.",
      "Eastern Pillar Gallery is ideal for archers and mages due to its long sightlines and cover.",
      "Southern Outer Hall and Southeastern Courtyard are vulnerable to fast-moving units and can be used for reinforcements or surprise attacks.",
      "Control of doors and narrow passages is critical for defense and for preventing enemy breakthroughs."
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
        "description": "A small village with houses and surrounding plains, forests, and thickets. Provides shelter, resource points, and defensive cover for units. Accessible from the west and north, but bordered by hills and mountains to the east.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Thicket",
          "Hill",
          "House"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 5,
        "toY": 9
      },
      {
        "name": "Central Mountain Range",
        "description": "A large, mostly impassable mountain range running north-south through the center of the map, with some hills at the edges. Acts as a natural barrier, splitting the map and funneling movement through limited passes.",
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
        "name": "Northern and Central Forest Corridor",
        "description": "A dense corridor of forests and thickets with some plains, running east-west above the mountains. Offers concealment and ambush opportunities, and connects the western and eastern sides of the map.",
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
        "description": "A fortified structure with walls and a central gate, blocking the main eastern pass. Serves as a major choke point and defensive stronghold for the eastern side.",
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
        "name": "Eastern Approach and Plateau",
        "description": "A plateau and approach area leading up to the eastern fort, with cliffs and hills providing elevation and defensive advantage. Accessible from the north and central forest corridor.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Thicket",
          "Hill",
          "Cliff"
        ],
        "fromX": 19,
        "fromY": 0,
        "toX": 23,
        "toY": 6
      },
      {
        "name": "Southern Plains and Ruins",
        "description": "A broad, open area south of the mountains, with scattered forests, thickets, hills, and a set of ruins. Allows for fast movement and flanking, but offers less cover than the forests or mountains.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Thicket",
          "Hill",
          "Ruins",
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
      "Ruins at (16,10)",
      "Fortified Gate at (21,8)"
    ],
    "chokePoints": [
      "Mountain pass at (12,7)-(13,7)",
      "Fortified Gate at (21,8)",
      "Narrow forest corridor at (7,1)-(9,2)"
    ],
    "strategicConsiderations": [
      "The central mountain range divides the map, forcing units to use limited passes or go around via the north or south.",
      "The fortified gate on the east is a critical defensive position; controlling it can prevent enemy advances.",
      "Forests and thickets in the north and center provide excellent ambush and defensive opportunities.",
      "The southern plains allow for rapid movement and flanking but are more exposed.",
      "Houses and ruins offer resource points and defensive bonuses."
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
        "description": "The main entryway to the temple, featuring stairs and a mix of floor, plain, and forest tiles. This area serves as the initial staging ground for units entering the temple, with multiple access points to the inner chambers.",
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
        "name": "Central Temple Chamber",
        "description": "A large, open chamber at the heart of the temple, filled with pillars and stairs. This area is ideal for large-scale battles and offers multiple routes to other regions, with pillars providing cover and choke points.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 13,
        "toY": 15
      },
      {
        "name": "Northern Right Passage",
        "description": "A narrow corridor on the temple's right side, connecting the entrance to the deeper temple. Contains stairs and floor tiles, and is partially walled off, making it a potential flanking route.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Plain"
        ],
        "fromX": 14,
        "fromY": 0,
        "toX": 17,
        "toY": 4
      },
      {
        "name": "Eastern Sanctuary and Vault",
        "description": "A secluded area on the temple's eastern side, containing chests and pillars. This region is valuable for its loot and defensive positioning, with limited access points and several choke points.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Chest",
          "Pillar",
          "Plain",
          "Forest"
        ],
        "fromX": 14,
        "fromY": 5,
        "toX": 17,
        "toY": 20
      },
      {
        "name": "Southern Temple Ruins",
        "description": "The lower part of the temple, featuring ruined floors, pillars, and stairs. This area is more open and less defensible, but provides access to the rest of the temple and potential escape routes.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 13,
        "toY": 20
      }
    ],
    "keyPointsOfInterest": [
      "Chests at (12,12), (17,2), (12,12) (duplicate in data, but only one chest per tile)",
      "Multiple stairs throughout the temple (notably at (3,4), (10,6), (10,7), (10,8), (13,11), (15,12), (4,18), (4,19))",
      "Pillars at (0,9), (7,9), (6,15), (17,15), (9,19), (14,19)"
    ],
    "chokePoints": [
      "Door at (17,4) leading to the Eastern Sanctuary and Vault",
      "Narrow corridors at (2,7)-(3,7) and (14,5)-(15,5)",
      "Stair clusters at (3,4)-(4,4) and (10,6)-(10,8)"
    ],
    "strategicConsiderations": [
      "The Entrance Hall is wide and open, making it difficult to defend but easy for large groups to enter.",
      "The Central Temple Chamber is the main battleground, with pillars and stairs providing both cover and movement options.",
      "The Eastern Sanctuary and Vault is highly defensible due to limited access (notably the door at (17,4)), making it ideal for protecting valuable units or items.",
      "The Southern Temple Ruins are more exposed, so units here are vulnerable to attacks from multiple directions.",
      "Choke points and narrow corridors can be used to funnel enemies or set up ambushes, especially near doors and stair clusters."
    ],
    "givenName": "Ruined Temple",
    "originalName": "Nobles_Evil_Doers_5_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "An ancient, crumbling temple with multiple chambers and corridors, filled with debris and overgrown with moss.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Grand Entrance Hall",
        "description": "A large, open entry hall with multiple pillars and stairs, as well as chests in the southern part. This area serves as the main entry point and staging ground for units entering the sanctuary.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Chest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 16,
        "toY": 15
      },
      {
        "name": "Sanctum Throne Room",
        "description": "A secluded, defensible room with a throne at its center, surrounded by walls and accessible only through narrow passages. This is likely the map's main objective area.",
        "terrainTypes": [
          "Floor",
          "Throne",
          "Pillar",
          "Stairs"
        ],
        "fromX": 9,
        "fromY": 7,
        "toX": 11,
        "toY": 7
      },
      {
        "name": "Central Sanctuary Chamber",
        "description": "A vast, open chamber with pillars and stairs, forming the main battleground. It connects the entrance hall to the throne room and the eastern waterway.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 5,
        "fromY": 1,
        "toX": 16,
        "toY": 15
      },
      {
        "name": "Eastern Waterway and Bridge",
        "description": "A series of bridges and narrow walkways over a lake, forming a critical passage to the eastern side of the map. The bridges act as chokepoints and are vital for movement between regions.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Bridge",
          "Lake",
          "Plain",
          "Throne",
          "Stairs"
        ],
        "fromX": 17,
        "fromY": 1,
        "toX": 22,
        "toY": 20
      },
      {
        "name": "Southern Storage and Pillar Hall",
        "description": "A southern hall filled with pillars and stairs, providing cover and multiple access points to the rest of the sanctuary. This area is important for flanking and reinforcement routes.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 16,
        "toY": 20
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (10,7)",
      "Chests at (0,11) and (0,13)",
      "Multiple stair tiles throughout the map",
      "Bridges at (17,3)-(19,3), (21,6), (21,7), (21,8), (21,14), (21,15), (21,16)",
      "Pillars scattered throughout the central and eastern chambers"
    ],
    "chokePoints": [
      "Narrow bridge passages in the eastern waterway (e.g., (17,3)-(19,3), (21,6)-(21,8), (21,14)-(21,16))",
      "Entrances to the throne room at (9,7) and (11,7)",
      "Corridors between the entrance hall and central chamber",
      "Stair clusters that restrict movement in the central and southern halls"
    ],
    "strategicConsiderations": [
      "The throne room is highly defensible due to limited access points and surrounding walls.",
      "Bridges in the eastern waterway are critical chokepoints; controlling them can prevent enemy reinforcements.",
      "Pillars and stairs provide cover and can be used to block or funnel enemy movement.",
      "The southern hall offers flanking opportunities and reinforcement routes.",
      "Chests in the entrance hall may incentivize early aggression or diversionary tactics."
    ],
    "givenName": "Aquatic Sanctuary",
    "originalName": "ArcanaeCapital",
    "description": "An indoor map featuring a blend of stone architecture and water channels, creating a serene yet strategic battleground.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central Village Main Road",
        "description": "The main thoroughfare of the village, connecting the north and south, with houses, forests, and open plains. This area is the primary battlefield and offers multiple movement options and cover.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest",
          "House"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 17,
        "toY": 11
      },
      {
        "name": "Northwest Village Square",
        "description": "A small, walled-off village square in the northwest, accessible only via the main road. It is a key objective and a potential defensive position.",
        "terrainTypes": [
          "Village",
          "Road",
          "Plain"
        ],
        "fromX": 7,
        "fromY": 2,
        "toX": 8,
        "toY": 2
      },
      {
        "name": "Northeast Fortress Interior",
        "description": "A fortified building with a door and stairs, likely a stronghold or command post. The only entrance is through a door at (16,3), making it highly defensible.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Door"
        ],
        "fromX": 15,
        "fromY": 0,
        "toX": 17,
        "toY": 5
      },
      {
        "name": "Eastern Market and Armory",
        "description": "A cluster of shops and a village, including an armory and vendor, forming the economic hub of the map. Accessible from the main road and protected by walls.",
        "terrainTypes": [
          "Village",
          "Armory",
          "Vendor",
          "Road",
          "Plain"
        ],
        "fromX": 12,
        "fromY": 12,
        "toX": 17,
        "toY": 16
      },
      {
        "name": "Southwestern Coastline",
        "description": "A coastal region with sea and lake tiles, providing a natural barrier and limiting movement. Only accessible from the north and east.",
        "terrainTypes": [
          "Sea",
          "Lake",
          "Plain",
          "Road"
        ],
        "fromX": 0,
        "fromY": 12,
        "toX": 4,
        "toY": 16
      }
    ],
    "keyPointsOfInterest": [
      "Village at (8,2)",
      "Village at (12,12)",
      "Village at (15,9)",
      "Armory at (16,12)",
      "Vendor at (16,15)",
      "House at (10,7)",
      "House at (10,7) (duplicate, but present in both NE and SE quadrants)"
    ],
    "chokePoints": [
      "Door at (16,3) leading into the Northeast Fortress Interior",
      "Narrow road between walls at (7,2)-(7,3)",
      "Bridge-like road at (10,8)-(10,10)",
      "Narrow passage at (12,12)-(13,12) into the Eastern Market"
    ],
    "strategicConsiderations": [
      "The Central Village Main Road is open and offers multiple attack routes, but is vulnerable to ambush from forests and houses.",
      "The Northeast Fortress Interior is highly defensible due to its single door entrance and interior stairs.",
      "The Eastern Market and Armory region is a valuable objective for resupplying and recruiting, but is protected by walls and narrow entries.",
      "The Southwestern Coastline is impassable for most units, funneling movement into the main village and making the coastline a natural defensive line.",
      "Villages are key objectives for both defense and rewards; securing them early is crucial.",
      "Choke points at doors and narrow roads can be used to hold off larger forces or delay enemy advances."
    ],
    "givenName": "Burning Village",
    "originalName": "ShizonDefense",
    "description": "A village under siege with multiple buildings on fire, surrounded by forests and a coastline.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Lakeside Village",
        "description": "A small village enclosed by walls and adjacent to a lake, providing a defensive position and a potential objective. The lake to the south and west acts as a natural barrier, while the walls restrict access to the village itself.",
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
        "description": "The main intersection of roads connecting all major map areas. This open area is critical for movement and control, with multiple approach vectors and some forest for cover.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest",
          "Barrel"
        ],
        "fromX": 2,
        "fromY": 0,
        "toX": 14,
        "toY": 4
      },
      {
        "name": "Northern Ruined Outpost",
        "description": "A small ruined outpost with floor and ruins tiles, providing limited cover and a potential defensive position at the northern edge of the map.",
        "terrainTypes": [
          "Ruins",
          "Floor",
          "Road",
          "Plain"
        ],
        "fromX": 10,
        "fromY": 1,
        "toX": 14,
        "toY": 2
      },
      {
        "name": "Eastern Armory Approach",
        "description": "A road leading to the armory, flanked by walls and ending at a cliff. This area is a key approach to the eastern side and provides access to the armory for resupply.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Wall",
          "Armory"
        ],
        "fromX": 6,
        "fromY": 6,
        "toX": 14,
        "toY": 8
      },
      {
        "name": "Southern Forest Route",
        "description": "A southern route with open plains and scattered forests, offering alternative movement paths and flanking opportunities. The area is open but has some forest for cover.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Road"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 13,
        "toY": 9
      }
    ],
    "keyPointsOfInterest": [
      "Village at (2,2)",
      "Village at (3,6)",
      "Armory at (13,7)",
      "Ruins at (11,1), (12,1), (13,1), (11,2), (12,2), (13,2)",
      "Barrel at (14,0)"
    ],
    "chokePoints": [
      "Narrow road between walls at (6,0)-(7,0)",
      "Road through wall at (5,1)-(6,1)",
      "Road between lakes at (2,4)-(3,4)",
      "Road through wall at (6,6)-(7,6)",
      "Road through wall at (10,7)-(11,7)"
    ],
    "strategicConsiderations": [
      "Controlling the Central Crossroads is vital for rapid movement and reinforcement between regions.",
      "The Western Lakeside Village is defensible due to natural and constructed barriers, but can be isolated.",
      "The Northern Ruined Outpost offers cover and a vantage point for ranged units.",
      "The Eastern Armory Approach is a key supply point and can be fortified to block enemy advances.",
      "The Southern Forest Route allows for flanking but is more exposed to ambushes from forest tiles.",
      "Choke points created by walls and lakes can be used to funnel enemy movement and set up defensive lines."
    ],
    "givenName": "Crossroads of Commerce",
    "originalName": "(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19",
    "description": "An outdoor map featuring a network of roads connecting various key locations, including villages, a fort, and a castle. The map is characterized by its strategic layout, with roads intersecting at a central point, surrounded by natural barriers like forests and water.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Mountain Range",
        "description": "A long stretch of impassable mountains and cliffs forming a natural barrier along the western edge of the map. Only accessible to fliers, this region blocks direct movement from west to east and funnels units toward the central plains and bridges.",
        "terrainTypes": [
          "Mountain",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 6,
        "toY": 21
      },
      {
        "name": "Northern Plains and Forests",
        "description": "A large, open area with scattered forests and thickets, providing both mobility and cover. This region is ideal for cavalry and infantry movement, with some defensive terrain for archers and mages.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Thicket"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 17,
        "toY": 6
      },
      {
        "name": "Central Mountain Pass",
        "description": "A rugged area with mountains, plains, and a few houses and forts. This pass connects the northern and southern parts of the map, with limited movement options due to the mountainous terrain.",
        "terrainTypes": [
          "Mountain",
          "Plain",
          "Forest",
          "House",
          "Fort"
        ],
        "fromX": 7,
        "fromY": 3,
        "toX": 17,
        "toY": 12
      },
      {
        "name": "Central River and Bridge Crossing",
        "description": "A key chokepoint featuring a bridge over a river, surrounded by cliffs and forests. Control of this region is vital for moving between the northern and southern halves of the map.",
        "terrainTypes": [
          "Plain",
          "Bridge",
          "Cliff",
          "Forest"
        ],
        "fromX": 13,
        "fromY": 13,
        "toX": 19,
        "toY": 15
      },
      {
        "name": "Eastern Plains and Villages",
        "description": "A broad expanse of plains dotted with villages, houses, and forts. This region offers multiple objectives and is important for resource control and reinforcement points.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Thicket",
          "House",
          "Fort"
        ],
        "fromX": 18,
        "fromY": 0,
        "toX": 26,
        "toY": 21
      },
      {
        "name": "Southern Castle Courtyard",
        "description": "A fortified area with a castle gate and walls, serving as a defensive stronghold. The courtyard is a critical objective for both attackers and defenders.",
        "terrainTypes": [
          "Plain",
          "House",
          "Gate",
          "Wall"
        ],
        "fromX": 13,
        "fromY": 17,
        "toX": 19,
        "toY": 21
      },
      {
        "name": "Southeastern Fortified Outskirts",
        "description": "A region with several forts, forests, and a bridge, forming the southeastern edge of the map. This area is important for late-game reinforcements and flanking maneuvers.",
        "terrainTypes": [
          "Plain",
          "Fort",
          "Forest",
          "Bridge"
        ],
        "fromX": 15,
        "fromY": 22,
        "toX": 26,
        "toY": 27
      }
    ],
    "keyPointsOfInterest": [
      "Bridge at (15,13)",
      "Bridge at (14,25)",
      "Castle Gate at (16,19)",
      "Forts at (6,6), (3,9), (17,12), (26,15), (26,20), (4,25), (15,26)",
      "Houses at (12,3), (6,12), (6,19), (7,21), (6,23)",
      "Villages and resource points scattered in the eastern region"
    ],
    "chokePoints": [
      "Bridge at (15,13)",
      "Bridge at (14,25)",
      "Castle Gate at (16,19)",
      "Mountain passes between (7,3)-(7,12) and (7,16)-(7,21)",
      "Narrow cliff corridors at (15,10)-(16,14)"
    ],
    "strategicConsiderations": [
      "Control of the central bridges is essential for moving between the north and south.",
      "The western mountains prevent direct flanking, forcing most movement through the central and eastern regions.",
      "The southern castle courtyard is a key defensive position; breaching the gate is necessary for attackers.",
      "Forts and houses in the east provide healing and reinforcement points, making the region valuable for sustaining an offensive.",
      "Forests and thickets in the north and east offer cover for ranged units and ambushes.",
      "Cliffs and walls create natural bottlenecks, making it easier to defend against larger forces."
    ],
    "givenName": "River Crossing Siege",
    "originalName": "BigBattleground",
    "description": "A strategic map featuring a central river dividing the battlefield, with a castle and multiple villages scattered around.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Grand Staircase Entrance",
        "description": "The main entrance to the fortress, featuring a wide staircase and flanked by walls. This area is the primary access point for units entering the map and is defensible due to the narrow stairways and limited access.",
        "terrainTypes": [
          "Stairs",
          "Wall",
          "Floor"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 7,
        "toY": 6
      },
      {
        "name": "Western Pillar Hall",
        "description": "A large hall with several pillars providing cover. This area connects the entrance to the central and southern parts of the fortress and is open enough for maneuvering, but the pillars offer defensive positions.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 8,
        "toY": 14
      },
      {
        "name": "Central Corridor",
        "description": "A long, narrow corridor running through the center of the fortress, connecting the entrance, treasure rooms, and other chambers. The corridor is a key route for movement and features a door at (10,6) that acts as a choke point.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Door",
          "Stairs"
        ],
        "fromX": 9,
        "fromY": 0,
        "toX": 12,
        "toY": 6
      },
      {
        "name": "Northern Treasure Vault",
        "description": "A secure room containing valuable chests, accessible through a door at (8,8). The vault is well-defended and offers significant rewards for those who can breach it.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Wall",
          "Door"
        ],
        "fromX": 9,
        "fromY": 7,
        "toX": 11,
        "toY": 10
      },
      {
        "name": "Eastern Pillar Gallery",
        "description": "A gallery with pillars and stairs, running along the eastern edge of the fortress. This area provides flanking opportunities and alternate routes for movement.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Wall",
          "Stairs"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 15,
        "toY": 14
      },
      {
        "name": "Southern Guard Post",
        "description": "A fortified area in the southern part of the fortress, likely used for defense and monitoring. The guard post is connected to the central corridor and the pillar hall, making it a strategic defensive position.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Pillar",
          "Stairs"
        ],
        "fromX": 9,
        "fromY": 11,
        "toX": 12,
        "toY": 14
      },
      {
        "name": "Southeast Chamber",
        "description": "A secluded chamber in the southeast, possibly used for meetings or as private quarters. It is accessible from the eastern gallery and offers a defensible retreat.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Pillar",
          "Stairs"
        ],
        "fromX": 13,
        "fromY": 11,
        "toX": 15,
        "toY": 14
      }
    ],
    "keyPointsOfInterest": [
      "Chests at (11,8), (10,9), (11,8) in the Northern Treasure Vault",
      "Doors at (10,6), (8,8), (10,6), (8,8) as choke points",
      "Pillars throughout the Western Pillar Hall and Eastern Gallery"
    ],
    "chokePoints": [
      "Door at (10,6) between Central Corridor and Treasure Vault",
      "Door at (8,8) between Western Pillar Hall and Treasure Vault",
      "Narrow stairways at the Grand Staircase Entrance"
    ],
    "strategicConsiderations": [
      "Defending the doors at (10,6) and (8,8) is crucial to prevent enemy access to the treasure vault.",
      "The pillars in the Western Hall and Eastern Gallery provide cover for both attackers and defenders.",
      "The Grand Staircase Entrance is a natural bottleneck, making it ideal for early defense.",
      "The Central Corridor allows rapid movement between regions but is vulnerable to ambushes.",
      "The Southern Guard Post can be used to reinforce either the central corridor or the pillar hall."
    ],
    "givenName": "Golden Fortress",
    "originalName": "ArcanaeEscape",
    "description": "A fortified indoor structure with multiple chambers and corridors, featuring treasure rooms and strategic choke points.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Mountain Range",
        "description": "A large, impassable mountain range with some hills at the edges. This region forms a natural barrier, restricting movement and funneling units through the central and southern paths.",
        "terrainTypes": [
          "Mountain",
          "Hill"
        ],
        "fromX": 3,
        "fromY": 0,
        "toX": 12,
        "toY": 5
      },
      {
        "name": "Northern Plains and Forest Edge",
        "description": "A mix of plains, forests, and some hills at the northern edge of the map, providing open movement with some cover. This area is accessible and can be used for flanking or staging.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 2,
        "toY": 7
      },
      {
        "name": "Central Winding Path",
        "description": "A winding, open path bordered by mountains and cliffs, connecting the north and south. This is the main route for movement and likely the site of major clashes.",
        "terrainTypes": [
          "Plain",
          "Hill",
          "Forest",
          "Ruins"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 19,
        "toY": 7
      },
      {
        "name": "Northwest Ruins Outpost",
        "description": "A small ruined outpost at the northwest, partially walled off. It can serve as a defensive position or a minor objective.",
        "terrainTypes": [
          "Ruins",
          "Plain",
          "Wall"
        ],
        "fromX": 14,
        "fromY": 2,
        "toX": 15,
        "toY": 2
      },
      {
        "name": "Central River Crossing",
        "description": "A river with a single bridge crossing, forming a critical chokepoint for movement between the north and south. Control of this area is vital for advancing armies.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Forest"
        ],
        "fromX": 2,
        "fromY": 12,
        "toX": 4,
        "toY": 13
      },
      {
        "name": "Southern Plains and Ruins",
        "description": "A broad area of plains and scattered ruins at the southern edge, providing open ground for deployment and maneuvering. Some ruins offer cover.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Ruins"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 15,
        "toY": 19
      },
      {
        "name": "Eastern Riverbank and Fort",
        "description": "A fortified area on the eastern riverbank, including a fort and a gate. This region is defensible and controls access to the eastern side of the map.",
        "terrainTypes": [
          "River",
          "Plain",
          "Forest",
          "Fort",
          "Gate",
          "Wall"
        ],
        "fromX": 15,
        "fromY": 16,
        "toX": 19,
        "toY": 19
      },
      {
        "name": "Southeastern Cliffs and Sea",
        "description": "Impassable cliffs and sea along the southeastern edge, limiting movement and providing a natural boundary.",
        "terrainTypes": [
          "Cliff",
          "Sea",
          "Plain",
          "Forest"
        ],
        "fromX": 18,
        "fromY": 5,
        "toX": 19,
        "toY": 11
      }
    ],
    "keyPointsOfInterest": [
      "Bridge at (3,12)",
      "Ruins at (15,2)",
      "Gate at (16,17)",
      "Fort at (16,19)"
    ],
    "chokePoints": [
      "Bridge at (3,12)",
      "Gate at (16,17)",
      "Narrow river crossings at (6,10)-(7,10) and (12,10)-(13,10)"
    ],
    "strategicConsiderations": [
      "The Western Mountain Range blocks direct movement, forcing units to use the central path or southern plains.",
      "The Central River Crossing is a vital chokepoint; controlling the bridge allows for rapid reinforcement between north and south.",
      "The Eastern Riverbank and Fort region is highly defensible, with a gate and fortification making it difficult to assault.",
      "The Southern Plains and Ruins offer open ground for cavalry and fast units, but limited cover.",
      "The Southeastern Cliffs and Sea prevent flanking from the far east, focusing action toward the center and west.",
      "Ruins and forests scattered throughout provide cover for infantry and archers."
    ],
    "givenName": "Mountain Pass Clash",
    "originalName": "Nobles_Evil_Doers_2_(01_00_4C_03)__by_Aura_Wolf",
    "description": "A rugged outdoor map featuring a winding path through mountainous terrain, with strategic forts and villages scattered throughout.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Forest and Thicket Approach",
        "description": "A dense area of forests and thickets with scattered plains and hills, containing several forts and shops. Provides excellent cover and staging for ambushes or defensive play. The presence of an armory and vendor makes it a logistical hub.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Thicket",
          "Hill",
          "Fort",
          "Armory",
          "Vendor"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 5,
        "toY": 12
      },
      {
        "name": "Northern Mountain Barrier",
        "description": "A formidable line of mountains and cliffs forming a natural barrier across the northern part of the map. Impassable to most units, it channels movement to the south.",
        "terrainTypes": [
          "Mountain",
          "Cliff"
        ],
        "fromX": 6,
        "fromY": 0,
        "toX": 15,
        "toY": 2
      },
      {
        "name": "Central Plains Corridor",
        "description": "A broad corridor of open plains with scattered forts and hills, ideal for cavalry and fast movement. This area connects the western forests to the eastern mountains and is a likely site for major engagements.",
        "terrainTypes": [
          "Plain",
          "Fort",
          "Hill"
        ],
        "fromX": 6,
        "fromY": 3,
        "toX": 20,
        "toY": 5
      },
      {
        "name": "Eastern Mountain Range",
        "description": "A rugged region dominated by mountains and cliffs, with some forest and plain pockets. Contains several forts and hills, making it defensible but difficult to traverse.",
        "terrainTypes": [
          "Mountain",
          "Cliff",
          "Forest",
          "Plain",
          "Fort",
          "Hill"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 20,
        "toY": 11
      },
      {
        "name": "Central River and Bridge Network",
        "description": "A complex network of rivers and bridges, with cliffs restricting movement. The bridges are critical choke points for crossing the river, and the area is flanked by forts for defensive play.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Cliff",
          "Plain",
          "Fort"
        ],
        "fromX": 2,
        "fromY": 6,
        "toX": 14,
        "toY": 14
      },
      {
        "name": "Southern Plains and Forts",
        "description": "A wide southern expanse of plains and forests, dotted with forts and shops. This area is open and ideal for large-scale battles or regrouping after crossing the river.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort",
          "Hill",
          "Vendor",
          "Armory"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 15,
        "toY": 17
      },
      {
        "name": "Southeastern Cliffs and Sea",
        "description": "A southeastern region dominated by cliffs and sea tiles, with some plains and forests. The area is difficult to access and serves as a natural boundary, with a few forts for defense.",
        "terrainTypes": [
          "Cliff",
          "Sea",
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 14,
        "fromY": 12,
        "toX": 20,
        "toY": 17
      }
    ],
    "keyPointsOfInterest": [
      "Armory at (1,10)",
      "Vendor at (0,11)",
      "Fort at (12,1)",
      "Fort at (3,3)",
      "Fort at (1,12)",
      "Fort at (10,11)",
      "Fort at (14,13)",
      "Bridge at (2,6)",
      "Bridge at (2,13)",
      "Bridge at (11,13)",
      "Bridge at (12,13)",
      "Fort at (19,1)",
      "Fort at (10,11)",
      "Fort at (10,15)",
      "Fort at (14,13)"
    ],
    "chokePoints": [
      "Bridge at (2,6)",
      "Bridge at (2,13)",
      "Bridge at (11,13)",
      "Bridge at (12,13)",
      "Narrow mountain passes in the north (around (6,0)-(11,2))",
      "Cliff bottlenecks at (6,6), (7,7), (8,8), (9,9)"
    ],
    "strategicConsiderations": [
      "The central river and bridge network divides the map, making control of bridges essential for movement and reinforcement.",
      "Northern mountains and cliffs force units to funnel through the central corridor or southern plains, making these areas likely for major clashes.",
      "Western forests and thickets provide excellent cover for ambushes and defensive stands.",
      "Eastern mountains are difficult to traverse but offer strong defensive positions and can be used to anchor a flank.",
      "Southern plains are open and ideal for cavalry or regrouping after crossing the river.",
      "Southeastern cliffs and sea tiles limit movement and can be used to protect a flank or retreating units.",
      "Forts scattered throughout the map offer healing and defensive bonuses, making them valuable objectives."
    ],
    "givenName": "Mountain River Crossing",
    "originalName": "RipBlaine",
    "description": "A strategic map featuring a river with multiple bridges, surrounded by mountains and forests. Ideal for tactical maneuvers and ambushes.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Mountain Range",
        "description": "A rugged, mostly impassable mountain region with a few accessible plains and houses at the foothills. Provides natural defense and limits movement to a few passable tiles.",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Forest",
          "Plain",
          "House"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 5,
        "toY": 17
      },
      {
        "name": "Northwestern Village Cluster",
        "description": "A cluster of villages and houses surrounded by plains and forests, offering resources and shelter. Key for early-game objectives and defense.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Village",
          "House",
          "Hill"
        ],
        "fromX": 4,
        "fromY": 2,
        "toX": 15,
        "toY": 5
      },
      {
        "name": "Central River and Bridge",
        "description": "A central river with a single bridge crossing, acting as a major chokepoint. The fort on the north bank provides a strong defensive position.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Forest",
          "Plain",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 6,
        "toX": 5,
        "toY": 7
      },
      {
        "name": "Western Riverbank and Cliffs",
        "description": "A narrow strip of plains and cliffs along the river, with some sea tiles to the east. Movement is restricted by cliffs and sea, making this a secondary approach route.",
        "terrainTypes": [
          "Plain",
          "Cliff",
          "Sea",
          "Forest",
          "House"
        ],
        "fromX": 6,
        "fromY": 5,
        "toX": 15,
        "toY": 8
      },
      {
        "name": "Central Plains and Villages",
        "description": "A large, open area with scattered villages, houses, and an armory. Offers high mobility and is a likely site for major engagements.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Village",
          "House",
          "Armory",
          "Hill"
        ],
        "fromX": 5,
        "fromY": 3,
        "toX": 20,
        "toY": 5
      },
      {
        "name": "Eastern Riverbank and Cliffs",
        "description": "A narrow, cliff-lined area on the east side of the river, with limited access and some forest cover. Useful for flanking or defensive maneuvers.",
        "terrainTypes": [
          "Plain",
          "Cliff",
          "Sea",
          "Forest",
          "House"
        ],
        "fromX": 16,
        "fromY": 5,
        "toX": 20,
        "toY": 8
      },
      {
        "name": "Eastern Bridge Approach",
        "description": "The eastern bridge and its immediate approaches, providing another critical crossing point over the river. Flanked by cliffs and forests.",
        "terrainTypes": [
          "Bridge",
          "Plain",
          "Forest",
          "Cliff"
        ],
        "fromX": 5,
        "fromY": 7,
        "toX": 20,
        "toY": 7
      },
      {
        "name": "Southern Plains and Villages",
        "description": "A broad southern field with villages, houses, and some forest and thicket cover. Vulnerable to attacks from the north and east.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Village",
          "House",
          "Hill",
          "Thicket",
          "River"
        ],
        "fromX": 5,
        "fromY": 12,
        "toX": 20,
        "toY": 17
      }
    ],
    "keyPointsOfInterest": [
      "Bridge at (5,7)",
      "Fort at (4,6)",
      "Armory at (19,3)",
      "Gate at (17,1)",
      "Villages at (7,2), (12,2), (8,11), (12,13)",
      "Houses at (4,4), (1,8), (16,12)",
      "Thicket at (20,11)"
    ],
    "chokePoints": [
      "Bridge at (5,7)",
      "Bridge at (5,7) to (5,8)",
      "Gate at (17,1)",
      "Narrow cliff passages at (6,6)-(10,6) and (16,6)-(20,6)",
      "Wall corridors at (7,9)-(9,9) and (7,10)-(9,10)"
    ],
    "strategicConsiderations": [
      "The central river and its bridges are the main chokepoints; controlling them is vital for movement between north and south.",
      "Mountain and cliff regions restrict movement, funneling units into predictable paths.",
      "Villages and houses provide objectives and healing, making them important to secure early.",
      "The fort north of the bridge offers a strong defensive position for holding the river crossing.",
      "The armory and gate in the northeast are key for resupply and controlling access to the castle grounds.",
      "Flanking through the eastern and western riverbanks is possible but limited by cliffs and sea.",
      "Southern plains are open and vulnerable; defending villages here requires careful positioning."
    ],
    "givenName": "River Crossing",
    "originalName": "Mayor'sVillage",
    "description": "A strategic map featuring a central river with bridges, surrounded by villages and a castle.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Village Outskirts",
        "description": "The western edge of the map, featuring a mix of plains, forests, and roads. Contains a vendor at (0,9). Provides flanking opportunities and access to the main village via several roads.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Road",
          "Vendor"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 4,
        "toY": 22
      },
      {
        "name": "Central Village Main Road",
        "description": "The main thoroughfare running north-south through the village, connecting the northern and southern entrances. Includes stairs at (6,3) and (7,3), and is the primary route for movement and reinforcements.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest",
          "Stairs"
        ],
        "fromX": 5,
        "fromY": 0,
        "toX": 13,
        "toY": 22
      },
      {
        "name": "Northern Clifftop and Sea",
        "description": "A high, impassable clifftop with sea and lake tiles to the east. Only accessible to fliers, this area is isolated from the main village and offers a vantage point.",
        "terrainTypes": [
          "Cliff",
          "Sea",
          "Lake",
          "Plain"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 17,
        "toY": 5
      },
      {
        "name": "Eastern Village District",
        "description": "The eastern section of the map, containing a village at (17,13), another at (8,17), and an armory at (16,9). This area is separated from the central road by walls and is accessible via several roads.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Road",
          "Village",
          "Armory"
        ],
        "fromX": 14,
        "fromY": 6,
        "toX": 17,
        "toY": 22
      },
      {
        "name": "Southern Village and Farmlands",
        "description": "The southern part of the map, featuring a village at (8,17), a house at (10,17), and open farmland. This area is a likely spawn or reinforcement zone and is key for defending the southern approach.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Road",
          "Village",
          "House"
        ],
        "fromX": 5,
        "fromY": 17,
        "toX": 13,
        "toY": 22
      }
    ],
    "keyPointsOfInterest": [
      "Vendor at (0,9)",
      "Village at (12,10)",
      "Village at (17,13)",
      "Village at (8,17)",
      "Armory at (16,9)",
      "House at (10,17)",
      "Stairs at (6,3) and (7,3)"
    ],
    "chokePoints": [
      "Stairs at (6,3) and (7,3)",
      "Narrow road between walls at (6,7)-(8,7)",
      "Wall gaps at (12,10) and (17,13) for village access",
      "Bridge-like road at (8,8)-(13,8)"
    ],
    "strategicConsiderations": [
      "The central road is the fastest route for movement but is exposed to attacks from the flanks.",
      "The northern clifftop is only accessible to fliers and can be used for surprise attacks or archers.",
      "Villages and the armory are key objectives and should be defended or seized quickly.",
      "Choke points at stairs and narrow roads can be used to hold off enemy advances.",
      "The southern farmlands provide open space for cavalry and reinforcements."
    ],
    "givenName": "Village Crossroads",
    "originalName": "BacrunCity2",
    "description": "A bustling village map with multiple paths and buildings, surrounded by natural barriers and a river.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Fortress Hall",
        "description": "A large, open hall running along the western side of the fortress, featuring multiple doors and access points. This area serves as the main thoroughfare for movement between the north and south of the fortress, with doors at (2,6) and (9,6) acting as choke points.",
        "terrainTypes": [
          "Floor",
          "Door"
        ],
        "fromX": 0,
        "fromY": 1,
        "toX": 13,
        "toY": 8
      },
      {
        "name": "Western Treasure Alcoves",
        "description": "Small alcoves in the western hall containing chests at (13,5) and (13,8), providing valuable loot and incentive for exploration or defense.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 10,
        "fromY": 5,
        "toX": 13,
        "toY": 8
      },
      {
        "name": "Eastern Fortress Hall",
        "description": "A long eastern corridor with pillars and doors, connecting the north and south ends of the fortress. This area is important for flanking and rapid movement, with a door at (9,6) providing a key entry point from the west.",
        "terrainTypes": [
          "Floor",
          "Door"
        ],
        "fromX": 15,
        "fromY": 0,
        "toX": 18,
        "toY": 8
      },
      {
        "name": "Eastern Treasure Alcoves",
        "description": "Treasure alcoves in the eastern hall, with chests at (13,5) and (13,8), mirroring the western side and offering similar strategic value.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 13,
        "fromY": 5,
        "toX": 13,
        "toY": 8
      },
      {
        "name": "Central Pillar Hall",
        "description": "A large, open hall in the southern part of the fortress, filled with pillars for cover. This area is ideal for defensive stands and ambushes, and connects both the western and eastern halls.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 5,
        "fromY": 12,
        "toX": 18,
        "toY": 13
      },
      {
        "name": "Southern Fortress Passage",
        "description": "A broad southern passage that links the western and central halls, providing access to the pillar hall and acting as a fallback or reinforcement route.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 13,
        "toY": 13
      }
    ],
    "keyPointsOfInterest": [
      "Chests at (13,5), (13,8), (13,5), (13,8)",
      "Doors at (2,6), (9,6), (9,6)",
      "Pillars at (5,12), (11,12), (16,11), (17,7), (17,2)"
    ],
    "chokePoints": [
      "Door at (2,6) between western hall and rest of fortress",
      "Door at (9,6) between western and eastern halls"
    ],
    "strategicConsiderations": [
      "The main halls allow for rapid movement but are vulnerable to being blocked at the doors.",
      "Treasure alcoves are valuable but can be easily trapped due to their enclosed nature.",
      "The pillar hall offers strong defensive positions and can be used to stall advancing enemies.",
      "Controlling the doors at (2,6) and (9,6) is critical for managing the flow of battle and preventing enemy reinforcements from flanking."
    ],
    "givenName": "Fortress Interior",
    "originalName": "CastleHall",
    "description": "A fortified indoor map featuring a throne room, treasure chamber, and multiple corridors.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Throne Room",
        "description": "A grand, well-defended room at the top center of the fortress, containing the throne. This is the primary objective and is surrounded by walls on most sides, with limited access points.",
        "terrainTypes": [
          "Floor",
          "Throne"
        ],
        "fromX": 9,
        "fromY": 1,
        "toX": 15,
        "toY": 2
      },
      {
        "name": "Central Fortress Corridor",
        "description": "A long corridor running through the center of the fortress, connecting the throne room to the rest of the map. It is flanked by doors and walls, making it a key route for both offense and defense.",
        "terrainTypes": [
          "Floor",
          "Door"
        ],
        "fromX": 8,
        "fromY": 3,
        "toX": 16,
        "toY": 5
      },
      {
        "name": "Left Inner Chambers",
        "description": "A series of interconnected rooms and hallways on the left side of the fortress, featuring multiple doors, stairs, and pillars for cover. Provides flanking opportunities and defensive positions.",
        "terrainTypes": [
          "Floor",
          "Door",
          "Stairs",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 3,
        "toX": 7,
        "toY": 16
      },
      {
        "name": "Right Inner Chambers",
        "description": "A mirrored set of rooms and hallways on the right side of the fortress, with similar features to the left chambers. Offers alternative routes and defensive strongpoints.",
        "terrainTypes": [
          "Floor",
          "Door",
          "Stairs",
          "Pillar"
        ],
        "fromX": 17,
        "fromY": 3,
        "toX": 25,
        "toY": 16
      },
      {
        "name": "Southern Entrance Hall",
        "description": "The main entrance area at the bottom of the fortress, including the approach roads, outer doors, and initial rooms. This is where most attackers will enter and is critical for initial defense.",
        "terrainTypes": [
          "Floor",
          "Door",
          "Stairs",
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 17,
        "toX": 25,
        "toY": 23
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (12,1)",
      "Multiple doors at (8,4), (16,4), (6,6), (19,6), (5,9), (19,9), (5,14), (19,14), (7,17), (19,17), (19,6), (20,9), (20,14), (7,17), (19,17)",
      "Stairs at (9,0), (10,0), (14,0), (15,0), (12,9), (13,9), (12,10), (13,10), (6,13), (7,13), (18,13), (19,13), (10,18), (12,18), (13,18), (15,18)",
      "Pillars at (10,12), (15,12)",
      "Multiple wall-enclosed rooms and corridors"
    ],
    "chokePoints": [
      "Doors at (8,4), (16,4), (6,6), (19,6), (5,9), (19,9), (5,14), (19,14), (7,17), (19,17), (20,9), (20,14)",
      "Narrow corridors between rooms",
      "Stairwells leading to/from the throne room and inner chambers"
    ],
    "strategicConsiderations": [
      "The throne room is highly defensible with limited access, making it ideal for a last stand or boss defense.",
      "Central corridor is a key battleground; controlling it allows rapid movement between the throne and entrance.",
      "Left and right chambers provide flanking routes and can be used to ambush or reinforce the central corridor.",
      "Doors and narrow passages create natural choke points for defensive play; attackers must bring keys or thieves.",
      "Southern entrance is wide but quickly narrows, so defenders can funnel attackers and delay their advance.",
      "Stairs and pillars offer cover and can be used to block or slow enemy progress."
    ],
    "givenName": "Fortress of Trials",
    "originalName": "Chapter6TheTrapIsSprung_More_Carpet__by_Shin19",
    "description": "A symmetrical indoor fortress with a central throne room and surrounding chambers, designed for strategic battles.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Fortress Complex",
        "description": "A heavily fortified area at the top of the map, protected by walls and a gate, with forts and stairs for defense. This is the main stronghold and likely the primary defensive objective.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Gate",
          "Stairs",
          "Fort",
          "Forest",
          "River"
        ],
        "fromX": 4,
        "fromY": 0,
        "toX": 14,
        "toY": 2
      },
      {
        "name": "Northwest Riverbank and Forest",
        "description": "A large open area with forests and a river, including a bridge at (4,7) that serves as a key crossing point. Contains several forts for defense and is a likely approach route for attackers.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "River",
          "Fort",
          "Bridge"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 7,
        "toY": 7
      },
      {
        "name": "Northeast Forested Outskirts",
        "description": "A forested area with houses and an armory, providing resources and cover. This region is accessible from the fortress and the southern plains.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Armory"
        ],
        "fromX": 11,
        "fromY": 3,
        "toX": 14,
        "toY": 7
      },
      {
        "name": "Central River Crossing",
        "description": "The main river crossing, featuring a bridge at (4,7) and surrounded by river tiles. This is a major chokepoint connecting the north and south.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Forest"
        ],
        "fromX": 4,
        "fromY": 3,
        "toX": 7,
        "toY": 8
      },
      {
        "name": "Southwestern Mountain Approach",
        "description": "A rugged area with mountains, cliffs, and lakes, including a bridge at (8,13). Contains a fort and is a difficult but defensible approach to the fortress.",
        "terrainTypes": [
          "Mountain",
          "Plain",
          "Forest",
          "Cliff",
          "Lake",
          "Fort",
          "Bridge"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 10,
        "toY": 14
      },
      {
        "name": "Southeastern Village and Plains",
        "description": "A region with villages, houses, and an armory, surrounded by plains and cliffs. Contains a fort and a bridge at (8,13), making it a valuable area for reinforcements and resources.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Armory",
          "Fort",
          "Cliff",
          "Lake",
          "Bridge"
        ],
        "fromX": 11,
        "fromY": 8,
        "toX": 14,
        "toY": 14
      }
    ],
    "keyPointsOfInterest": [
      "Gate at (10,1)",
      "Stairs at (10,2)",
      "Forts at (5,2), (5,6), (10,9), (7,14), (10,9), (10,14)",
      "Bridge at (4,7)",
      "Armory at (12,7)",
      "Houses at (13,6), (14,6), (14,7), (11,8), (12,9)",
      "Bridge at (8,13)"
    ],
    "chokePoints": [
      "Gate at (10,1)",
      "Bridge at (4,7)",
      "Bridge at (8,13)",
      "Narrow river crossing at (5,8)-(6,8)",
      "Cliff passages at (7,9)-(9,9)"
    ],
    "strategicConsiderations": [
      "The fortress complex is the main defensive position, with walls, a gate, and multiple forts. Defenders should hold the gate and use the stairs and forts for maximum defense.",
      "The central river and its bridges are critical chokepoints. Controlling these crossings will determine the flow of battle.",
      "The northwest and southwest offer open approaches but are slowed by forests, rivers, and mountains, making them ideal for ambushes or delaying actions.",
      "The southeastern region provides resources and reinforcements via houses and an armory, making it a valuable secondary objective.",
      "Cliffs and lakes in the south and east restrict movement, funneling attackers into predictable paths.",
      "Attackers should focus on seizing bridges and forts to establish forward positions before assaulting the fortress."
    ],
    "givenName": "Riverside Fortress",
    "originalName": "Plains",
    "description": "A strategic map featuring a fortress by a river, with multiple bridges and villages scattered around.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northwest Treasure Vault",
        "description": "A small, secure room in the northwest corner containing a treasure chest. Accessible only through a single door, making it easy to defend.",
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
        "name": "Western Pillar Hall",
        "description": "A large hall with several pillars and multiple staircases, forming the main western section of the fortress. Connects to the treasure vault and central corridors.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 12,
        "toY": 8
      },
      {
        "name": "Central Corridor",
        "description": "A central passageway with stairs and pillars, linking the western and eastern parts of the fortress. Key for movement between regions.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar"
        ],
        "fromX": 6,
        "fromY": 4,
        "toX": 12,
        "toY": 8
      },
      {
        "name": "Eastern Pillar Gallery",
        "description": "An ornate gallery with pillars and stairs, forming the eastern edge of the fortress. Provides access to the southeast and central corridor.",
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
        "name": "Southern Fortress Exit",
        "description": "The southernmost area of the fortress, transitioning from interior to exterior terrain. Includes stairs leading outside and a mix of plain and forest tiles.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 12,
        "toX": 12,
        "toY": 13
      },
      {
        "name": "Southeast Outer Grounds",
        "description": "The southeastern exterior grounds, with a mix of plain and forest tiles, providing a staging area for units entering or leaving the fortress.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Floor"
        ],
        "fromX": 5,
        "fromY": 12,
        "toX": 16,
        "toY": 13
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (3,3)",
      "Multiple staircases at (0,5), (11,3), (11,4), (6,8), (16,3), (16,8), (1,12), (2,12)",
      "Pillars at (0,0), (2,8), (7,5), (13,4), (16,0), (16,8)",
      "Door at (3,1)"
    ],
    "chokePoints": [
      "Door at (3,1) leading to the treasure vault",
      "Narrow corridor at (6,4)-(6,6)",
      "Corridor junctions at (7,7), (7,8), (7,5)"
    ],
    "strategicConsiderations": [
      "The treasure vault is easily defensible due to its single entrance.",
      "Pillar halls provide cover and block line of sight, favoring defensive play.",
      "Staircases may be used for reinforcements or flanking.",
      "Central corridor is a key movement route and likely to see heavy combat.",
      "Southern and southeastern exits are vulnerable to outside attack and should be guarded.",
      "Choke points at doors and narrow corridors are ideal for strong defensive units."
    ],
    "givenName": "Fortress Interior",
    "originalName": "Knights_Villagers_Bandits_9_(18_00_48_1A)__by_Aura_Wolf",
    "description": "A complex indoor map featuring narrow corridors, a central chamber, and multiple staircases leading to different levels.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Grand Western Hall",
        "description": "A large open hall with pillars and multiple staircases, forming the main western approach to the fortress. Provides ample space for maneuvering and is a likely entry point for attackers.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 12,
        "toY": 6
      },
      {
        "name": "Northern Waterway and Treasure Alcove",
        "description": "A region of interconnected water channels and narrow walkways, featuring a chest at (5,7). The water restricts movement, creating natural choke points and defensive opportunities.",
        "terrainTypes": [
          "Floor",
          "Lake",
          "Chest",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 12,
        "toY": 12
      },
      {
        "name": "Central Fortress Passage",
        "description": "A series of corridors and rooms with pillars and stairs, connecting the northern and southern parts of the fortress. This area is critical for internal movement and defense.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 12,
        "toY": 19
      },
      {
        "name": "Southern Aquatic Vault",
        "description": "A secluded southern chamber with extensive water features and a chest at (1,24). The water channels limit access, making this a defensible treasure vault.",
        "terrainTypes": [
          "Floor",
          "Lake",
          "Chest",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 20,
        "toX": 12,
        "toY": 25
      },
      {
        "name": "Eastern Throne Room and Royal Quarters",
        "description": "A grand throne room with ornate pillars and a throne at (13,5), surrounded by royal quarters. This is the primary defensive objective and command center of the fortress.",
        "terrainTypes": [
          "Floor",
          "Throne",
          "Pillar",
          "Stairs"
        ],
        "fromX": 11,
        "fromY": 4,
        "toX": 16,
        "toY": 19
      },
      {
        "name": "Eastern Waterway and Pillar Gallery",
        "description": "A lower eastern region with water channels, pillars, and stairs, connecting to the southern vault and providing a secondary approach to the throne room.",
        "terrainTypes": [
          "Floor",
          "Lake",
          "Stairs",
          "Pillar"
        ],
        "fromX": 11,
        "fromY": 20,
        "toX": 16,
        "toY": 25
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (5,7)",
      "Chest at (1,24)",
      "Throne at (13,5)",
      "Multiple staircases throughout the fortress"
    ],
    "chokePoints": [
      "Narrow walkways surrounded by water in the Northern Waterway and Treasure Alcove",
      "Corridors connecting the Grand Western Hall to the Central Fortress Passage",
      "Entrances to the Throne Room and Royal Quarters, especially at (11,4) and (13,13)",
      "Bridges and single-tile passages over lakes in the Southern Aquatic Vault and Eastern Waterway"
    ],
    "strategicConsiderations": [
      "Defenders can use the water channels to funnel attackers into narrow paths, maximizing the effectiveness of ranged and defensive units.",
      "The throne room is well-protected by multiple layers of walls and limited entrances, making it difficult to assault directly.",
      "Treasure chests are located in areas with restricted access, requiring careful planning to reach without being trapped.",
      "Staircases may serve as reinforcement points or alternate routes, so controlling them is vital for both offense and defense.",
      "The fortress layout encourages splitting forces to cover multiple approaches, but overextending can leave key areas vulnerable."
    ],
    "givenName": "Aquatic Fortress",
    "originalName": "Nobles_Evil_Doers_1_(18_00_19_1A)__by_Aura_Wolf",
    "description": "A complex indoor fortress with multiple water channels and treasure rooms, featuring a central throne room and intricate pathways.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Mountain Range",
        "description": "A wide, impassable mountain range forming the northern boundary of the map. It blocks direct movement between the north and the rest of the map, funneling units through the central pass.",
        "terrainTypes": [
          "Mountain"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 14,
        "toY": 4
      },
      {
        "name": "Central Mountain Pass",
        "description": "A narrow, winding pass through the mountains, containing hills, forests, and several forts. This is the main route for movement between east and west, and is highly defensible.",
        "terrainTypes": [
          "Plain",
          "Hill",
          "Forest",
          "Fort"
        ],
        "fromX": 5,
        "fromY": 0,
        "toX": 10,
        "toY": 8
      },
      {
        "name": "Western Approach",
        "description": "The western side of the pass, featuring plains, a fort, and some forest. It serves as the staging area for units entering the pass from the west.",
        "terrainTypes": [
          "Plain",
          "Hill",
          "Forest",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 8,
        "toX": 5,
        "toY": 15
      },
      {
        "name": "Eastern Approach",
        "description": "The eastern side of the pass, with plains, a fort, and forest tiles. It is the main entry point for units coming from the east.",
        "terrainTypes": [
          "Plain",
          "Hill",
          "Forest",
          "Fort"
        ],
        "fromX": 10,
        "fromY": 8,
        "toX": 14,
        "toY": 15
      },
      {
        "name": "Central River and Bridge",
        "description": "A river runs through the center of the map, crossed by a single bridge at (9,13). This is a critical chokepoint for movement between north and south.",
        "terrainTypes": [
          "Plain",
          "River",
          "Bridge"
        ],
        "fromX": 6,
        "fromY": 9,
        "toX": 10,
        "toY": 15
      },
      {
        "name": "Central Town and Village",
        "description": "A walled town with a central village, gates, and walls. It provides defensive positions and is a key objective for both sides.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Gate",
          "Village"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 8,
        "toY": 12
      },
      {
        "name": "Eastern Town and Village",
        "description": "A walled settlement on the eastern side, with a village and defensive gates. It mirrors the central town and is important for control of the eastern approach.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Gate",
          "Village"
        ],
        "fromX": 9,
        "fromY": 9,
        "toX": 14,
        "toY": 12
      },
      {
        "name": "Southern Plains and Outskirts",
        "description": "Open plains with scattered houses, a fort, and some forest and cliff tiles. This area is more open and less defensible, but provides access to the rest of the map.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Fort",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 14,
        "toY": 15
      }
    ],
    "keyPointsOfInterest": [
      "Fort at (5,8)",
      "Fort at (10,8)",
      "Bridge at (9,13)",
      "Village at (4,12)",
      "Village at (4,12) (east)",
      "Gate at (1,10)",
      "Gate at (12,12)",
      "House at (0,13)",
      "House at (1,15)",
      "Fort at (4,15)"
    ],
    "chokePoints": [
      "Central Mountain Pass (6,0)-(10,8)",
      "Bridge at (9,13)",
      "Gates at (1,10) and (12,12)"
    ],
    "strategicConsiderations": [
      "The northern mountains are impassable, forcing all movement through the central pass.",
      "The central pass is narrow and defensible, with forts and forests providing cover.",
      "The river and single bridge at (9,13) create a major chokepoint for north-south movement.",
      "Walled towns and villages offer strong defensive positions and objectives.",
      "The southern plains are open and vulnerable to cavalry and flanking maneuvers.",
      "Control of the forts and bridge is critical for holding the pass and securing victory."
    ],
    "givenName": "Mountain Pass Siege",
    "originalName": "Mountainy",
    "description": "A strategic map featuring a mountain pass with a central town, surrounded by castles and villages. The terrain includes mountains, forests, and roads, creating a complex battlefield.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Castle Grounds",
        "description": "A fortified area enclosed by walls and cliffs, featuring a gate at (3,4) and a vendor at (5,9). Contains a house and is a strong defensive position, controlling access to the central bridge.",
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
        "name": "Northern Village District",
        "description": "A cluster of houses and a village, partially walled off, providing resources and potential recruitment. Accessible from the west and south.",
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
        "description": "A wide river bisecting the map, with two bridges at (6,6) and (7,6) serving as the main crossing points. This is the primary chokepoint between north and south.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Forest"
        ],
        "fromX": 1,
        "fromY": 5,
        "toX": 10,
        "toY": 7
      },
      {
        "name": "Eastern Shoreline and Cliffs",
        "description": "A narrow strip of land bordered by cliffs and the sea, providing a natural boundary and limited access. Offers flanking opportunities for fliers.",
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
        "toY": 7
      },
      {
        "name": "Southern Village and Outpost",
        "description": "A bustling southern settlement with houses, a village, an armory, and a vendor. Key for resupplying and recruiting, with multiple entry points from the north and west.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Village",
          "Armory",
          "Vendor",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 8,
        "toX": 14,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "Gate at (3,4)",
      "Vendor at (5,9)",
      "House at (6,1)",
      "Village at (10,2)",
      "Bridges at (6,6) and (7,6)",
      "House at (8,10)",
      "Village at (11,10)",
      "Armory at (4,11)",
      "Vendor at (5,9) and (5,9)",
      "House at (6,1) and (8,10)"
    ],
    "chokePoints": [
      "Gate at (3,4)",
      "Bridges at (6,6) and (7,6)",
      "Narrow passage between walls at (9,0)-(10,0) and (9,1)-(10,1)"
    ],
    "strategicConsiderations": [
      "The central river and bridges are the main chokepoints; controlling them is vital for movement between north and south.",
      "The western castle grounds offer strong defensive positions and can block access to the bridge.",
      "Villages and houses in the north and south provide resources and potential reinforcements.",
      "The eastern shoreline is difficult to traverse except for fliers, but can be used for flanking.",
      "Vendors and armory in the south are important for resupplying units during prolonged engagements."
    ],
    "givenName": "River Crossing",
    "originalName": "Knights_Villagers_Bandits_2_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic map featuring a central river with a bridge, surrounded by villages and a castle.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Village Complex",
        "description": "A large, open area with a mix of roads, plains, and forests, featuring a walled village at (10,2) and (1,8). Provides multiple approach routes and some cover, but is relatively open to movement and ranged attacks.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest",
          "Village",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 15,
        "toY": 6
      },
      {
        "name": "Central Fortress Interior",
        "description": "A heavily fortified area with thick walls, multiple rooms, chests, and doors. Contains valuable loot and defensive positions, accessible only through specific doors and corridors.",
        "terrainTypes": [
          "Wall",
          "Floor",
          "Chest",
          "Door",
          "Barrel"
        ],
        "fromX": 8,
        "fromY": 7,
        "toX": 15,
        "toY": 13
      },
      {
        "name": "Western Fortress Approach",
        "description": "The main approach to the fortress from the west, featuring roads, plains, and some forest cover. Bordered by walls and doors leading into the fortress interior.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest",
          "Wall",
          "Door"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 7,
        "toY": 15
      },
      {
        "name": "Eastern Fortress Approach",
        "description": "The main approach to the fortress from the east, with roads and some forested areas. Provides access to the fortress interior through doors and is partially walled off.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest",
          "Wall",
          "Door"
        ],
        "fromX": 8,
        "fromY": 7,
        "toX": 15,
        "toY": 15
      },
      {
        "name": "Southern Market and Outbuildings",
        "description": "A bustling southern area with shops, houses, an armory, and a vendor. Open terrain with some walls and buildings, providing resources and potential reinforcements.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest",
          "Wall",
          "House",
          "Armory",
          "Vendor"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 15,
        "toY": 19
      }
    ],
    "keyPointsOfInterest": [
      "Village at (10,2)",
      "Village at (1,8)",
      "Chest at (10,8)",
      "Armory at (3,18)",
      "Vendor at (13,17)",
      "House at (8,17)"
    ],
    "chokePoints": [
      "Door at (12,13)",
      "Door at (14,9)",
      "Door at (12,13) east",
      "Narrow road at (7,7)-(8,7)",
      "Narrow road at (7,12)-(8,12)"
    ],
    "strategicConsiderations": [
      "The fortress interior is highly defensible, with limited access through doors and walls.",
      "The northern village area is open and vulnerable to ranged attacks but offers multiple approach routes.",
      "The southern market provides resources and potential reinforcements but is open to flanking.",
      "Choke points at doors and narrow roads are ideal for defensive stands or ambushes.",
      "Controlling the central fortress is key to holding the map, as it provides access to valuable chests and strong defensive positions."
    ],
    "givenName": "Fortress Approach",
    "originalName": "Mages_Mercenaries_1_(0E_00_72_10)__by_Aura_Wolf",
    "description": "A strategic map featuring a central fortress surrounded by various buildings and pathways, ideal for tactical maneuvers.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Royal Throne Room",
        "description": "A lavish, well-defended room containing the throne, pillars for cover, and direct access to the main corridors. Central to the map's defense and likely the main objective.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Throne"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 18,
        "toY": 2
      },
      {
        "name": "Grand Entrance Hall",
        "description": "A spacious entryway with pillars and multiple staircases, providing access to the rest of the map. Likely the main starting area for player units.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 12,
        "toY": 4
      },
      {
        "name": "Central Treasury",
        "description": "A secure chamber with multiple chests and staircases, heavily guarded and accessible from several directions. The main treasure vault of the map.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Chest",
          "Pillar"
        ],
        "fromX": 10,
        "fromY": 6,
        "toX": 18,
        "toY": 11
      },
      {
        "name": "Guard Quarters",
        "description": "Living and ready rooms for guards, providing quick access to the throne room and treasury. Contains pillars and open space for defense.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 19,
        "fromY": 0,
        "toX": 25,
        "toY": 4
      },
      {
        "name": "Eastern Corridor",
        "description": "A long corridor connecting the guard quarters, treasury, and southern exits. Contains pillars and staircases, making it a key movement route and defensive line.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar"
        ],
        "fromX": 16,
        "fromY": 5,
        "toX": 25,
        "toY": 15
      },
      {
        "name": "Storage Wing",
        "description": "A secluded area for storing supplies and equipment, with several chests and staircases. Accessible via doors and corridors, and a potential reinforcement entry point.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Stairs",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 12,
        "toX": 15,
        "toY": 19
      },
      {
        "name": "Southern Passage",
        "description": "A southern exit passage connecting the storage wing and eastern corridor, providing a potential escape or reinforcement route.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 16,
        "fromY": 16,
        "toX": 25,
        "toY": 19
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (17,1)",
      "Multiple chests at (16,9), (18,9), (11,11), (1,14)",
      "Doors at (17,3), (0,12), (10,13), (11,13), (10,13), (11,13)",
      "Staircases throughout the map (notably at (6,2), (7,2), (8,2), (6,3), (7,3), (8,3), (4,6), (10,7), (11,7), (10,8), (11,8), (10,14), (11,14), (17,11))"
    ],
    "chokePoints": [
      "Door at (17,3) between throne room and treasury",
      "Doors at (0,12), (10,13), (11,13) between storage wing and main map",
      "Narrow corridors at (9,0)-(9,5), (12,0)-(12,5), (15,6)-(15,9), (19,6)-(19,9)"
    ],
    "strategicConsiderations": [
      "The throne room is highly defensible with limited entrances and pillars for cover.",
      "The central treasury is a major objective, but is accessible from multiple directions, requiring careful defense.",
      "The storage wing is isolated and can be used for flanking or as a reinforcement entry.",
      "Choke points at doors and narrow corridors are ideal for defensive stands or ambushes.",
      "Staircases may allow for enemy reinforcements or quick repositioning.",
      "The southern passage can be used for escape or surprise attacks."
    ],
    "givenName": "Royal Treasury Chambers",
    "originalName": "HaedricCastle",
    "description": "An opulent indoor map featuring a series of interconnected chambers and corridors, designed to protect valuable treasures.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Treasure Vault",
        "description": "A secure vault at the top of the fortress, containing two chests. Accessible only through a single narrow passage, making it easy to defend but difficult to assault.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 6,
        "fromY": 0,
        "toX": 9,
        "toY": 2
      },
      {
        "name": "Western Fortress Hallway",
        "description": "A narrow hallway connecting the treasure vault to the central fortress. Features a door at (10,3) that acts as a choke point.",
        "terrainTypes": [
          "Floor",
          "Door"
        ],
        "fromX": 6,
        "fromY": 3,
        "toX": 7,
        "toY": 4
      },
      {
        "name": "Central Fortress Chamber",
        "description": "The main chamber of the fortress, connecting the western and eastern wings. Contains a door at (8,4) and is a key area for movement between regions.",
        "terrainTypes": [
          "Floor",
          "Door"
        ],
        "fromX": 5,
        "fromY": 4,
        "toX": 12,
        "toY": 5
      },
      {
        "name": "Southern Fortress Passage",
        "description": "A southern passage with stairs, likely used for reinforcements or escape. It is isolated from the main fortress by walls.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 4,
        "fromY": 12,
        "toX": 4,
        "toY": 14
      },
      {
        "name": "Eastern Throne Room",
        "description": "A large, open throne room with pillars for cover and the main throne at (21,21). This is the primary objective area and is heavily fortified.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Throne"
        ],
        "fromX": 6,
        "fromY": 21,
        "toX": 21,
        "toY": 24
      },
      {
        "name": "Eastern Fortress Hallway",
        "description": "A hallway leading from the central fortress to the throne room, providing a direct but exposed route to the objective.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 18,
        "fromY": 8,
        "toX": 21,
        "toY": 11
      },
      {
        "name": "Southwestern Escape Route",
        "description": "A hidden escape route in the southwest, possibly used for reinforcements or retreat. It is separated from the main fortress by walls.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 1,
        "fromY": 19,
        "toX": 5,
        "toY": 21
      }
    ],
    "keyPointsOfInterest": [
      "Chests at (9,0) and (9,2)",
      "Doors at (10,3) and (8,4)",
      "Stairs at (4,12), (4,13), (4,14)",
      "Throne at (21,21)",
      "Pillars at (4,21), (9,21), (14,21)"
    ],
    "chokePoints": [
      "Door at (10,3) between the treasure vault and fortress hallway",
      "Door at (8,4) between the central chamber and eastern wing",
      "Narrow hallways at (6,3)-(7,4) and (18,8)-(21,11)"
    ],
    "strategicConsiderations": [
      "The treasure vault is easy to defend due to its single narrow entrance.",
      "The central chamber is a key crossroads and must be controlled to move between regions.",
      "The throne room is the main objective and is protected by multiple layers of walls and pillars, making direct assaults difficult.",
      "Choke points at doors and narrow hallways can be used to stall or funnel attackers.",
      "The southwestern escape route can be used for flanking or retreat, but is isolated from the main action."
    ],
    "givenName": "Lava Fortress",
    "originalName": "Lava",
    "description": "A treacherous indoor fortress surrounded by lava, featuring narrow pathways and fortified structures.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Castle Wall Approach",
        "description": "A fortified area with stone walls and a narrow plain in front, forming the defensive entrance to the castle. Provides a strong defensive position and restricts movement into the map from the northwest.",
        "terrainTypes": [
          "Wall",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 4,
        "toY": 1
      },
      {
        "name": "Northern Hills and Forest",
        "description": "A hilly and forested area north of the river, offering elevation and cover. Useful for archers and units seeking defensive terrain.",
        "terrainTypes": [
          "Hill",
          "Plain",
          "Forest"
        ],
        "fromX": 5,
        "fromY": 0,
        "toX": 10,
        "toY": 1
      },
      {
        "name": "Central Forest Path",
        "description": "A large, interconnected forest and plain region with some cliffs, providing multiple movement options and cover. The main route for units advancing from the west and south.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 2,
        "toX": 10,
        "toY": 7
      },
      {
        "name": "Eastern Riverbank and Plains",
        "description": "A region of plains and cliffs bordered by mountains, forming the eastern edge of the map. Difficult to traverse except for fliers, and provides a flanking route.",
        "terrainTypes": [
          "Plain",
          "Cliff",
          "Mountain"
        ],
        "fromX": 11,
        "fromY": 0,
        "toX": 14,
        "toY": 4
      },
      {
        "name": "River Crossing",
        "description": "A river running north-south with two bridges at (11,2) and (12,5). The only way for most units to cross between east and west, making these bridges critical choke points.",
        "terrainTypes": [
          "River",
          "Bridge"
        ],
        "fromX": 11,
        "fromY": 0,
        "toX": 13,
        "toY": 9
      },
      {
        "name": "Southern Forest and Cliffs",
        "description": "A southern area with dense forests and cliffs, providing cover and limiting movement. Useful for ambushes and defensive play.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 8,
        "toX": 10,
        "toY": 9
      },
      {
        "name": "Southeast Riverbank",
        "description": "A small, isolated area on the southeast edge, bordered by river and cliffs. Difficult to access except by bridge or fliers.",
        "terrainTypes": [
          "Plain",
          "River",
          "Cliff"
        ],
        "fromX": 13,
        "fromY": 7,
        "toX": 14,
        "toY": 9
      }
    ],
    "keyPointsOfInterest": [
      "Bridges at (11,2) and (12,5)",
      "Castle wall at (0,0)-(4,0)",
      "Mountain barrier at (12,0)-(14,0)",
      "Cliff lines at (7,2)-(8,3) and (10,9)-(12,9)"
    ],
    "chokePoints": [
      "Bridge at (11,2)",
      "Bridge at (12,5)",
      "Castle wall entrance at (1,0)-(1,1)",
      "Narrow forest path at (7,2)-(8,3)"
    ],
    "strategicConsiderations": [
      "The bridges are the only way for most units to cross the river, making them vital for both offense and defense.",
      "The castle wall approach is easily defensible and restricts enemy movement.",
      "Forests and hills provide cover and should be used for defensive positioning.",
      "Cliffs and mountains restrict movement, funneling units into predictable paths.",
      "Fliers can bypass many obstacles, making them valuable for flanking or objective runs."
    ],
    "givenName": "Forest Crossing",
    "originalName": "(7)Ch01_Diff_Tileset__by_Shin19",
    "description": "A lush outdoor map featuring a castle, dense forests, and a river with bridges.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central Fortified Compound",
        "description": "A large, walled compound at the center of the map, containing multiple rooms with floor tiles, a vendor, and an armory. This area is highly defensible and serves as the main stronghold.",
        "terrainTypes": [
          "Wall",
          "Floor",
          "Vendor",
          "Armory"
        ],
        "fromX": 3,
        "fromY": 3,
        "toX": 11,
        "toY": 13
      },
      {
        "name": "Western Plains Approach",
        "description": "Open plains and roads with scattered forests leading up to the central fort from the west. Provides multiple approach vectors for attackers and is relatively open, favoring cavalry and high-mobility units.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 11,
        "toY": 16
      },
      {
        "name": "Northern Lake and Fields",
        "description": "A region of open fields and lakes in the north, with some forest cover. The lakes act as natural barriers, channeling movement along the plains and roads.",
        "terrainTypes": [
          "Plain",
          "Lake",
          "Forest",
          "Road"
        ],
        "fromX": 12,
        "fromY": 0,
        "toX": 19,
        "toY": 5
      },
      {
        "name": "Eastern Village Cluster",
        "description": "A small, walled village area on the eastern side, accessible by road. Provides a defensive position and potential for NPC or item interaction.",
        "terrainTypes": [
          "Village",
          "Wall",
          "Plain",
          "Road"
        ],
        "fromX": 12,
        "fromY": 8,
        "toX": 15,
        "toY": 8
      },
      {
        "name": "Southeastern Village and Lake",
        "description": "A village surrounded by walls and lakes in the southeast corner. The lakes restrict movement, making this a defensible but somewhat isolated region.",
        "terrainTypes": [
          "Village",
          "Wall",
          "Plain",
          "Road",
          "Lake"
        ],
        "fromX": 12,
        "fromY": 18,
        "toX": 19,
        "toY": 21
      },
      {
        "name": "Southern Road Network",
        "description": "A network of roads and plains in the southern part of the map, connecting the central fort, villages, and the southeast. Offers fast movement for units and multiple flanking routes.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 15,
        "toX": 11,
        "toY": 21
      }
    ],
    "keyPointsOfInterest": [
      "Vendor at (9,4)",
      "Armory at (2,5)",
      "Village at (13,8)",
      "Village at (12,18)",
      "Village at (3,19)"
    ],
    "chokePoints": [
      "Narrow road entrances to Central Fortified Compound (e.g., at (5,6), (6,6), (7,6))",
      "Village gates at (13,8) and (12,18)",
      "Bridges/roadways between lakes in the north (e.g., (12,0)-(13,1))"
    ],
    "strategicConsiderations": [
      "The Central Fortified Compound is the most defensible area, with limited entrances and strong walls.",
      "Western Plains Approach allows for rapid movement and flanking but offers little cover.",
      "Northern Lake and Fields region channels movement and can be used to funnel enemy units.",
      "Villages provide defensive bonuses and may contain objectives or NPCs.",
      "Southern Road Network enables fast repositioning and can be used for reinforcements or retreats.",
      "Choke points at fort entrances and village gates are ideal for holding off larger forces."
    ],
    "givenName": "Village Outskirts",
    "originalName": "BacrunCity3",
    "description": "A rural map featuring a central fortified structure surrounded by villages and natural terrain.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central Crossroads and Plains",
        "description": "A large, open area at the heart of the map where multiple paths converge. Contains several houses, a fort, and scattered forests and hills for cover. This region is the main battleground and provides access to all other areas.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill",
          "Fort",
          "House"
        ],
        "fromX": 0,
        "fromY": 4,
        "toX": 19,
        "toY": 9
      },
      {
        "name": "Western Mountain Barrier",
        "description": "A solid wall of mountains forming a natural barrier along the western edge of the map. Impassable to most units, it restricts movement and funnels traffic through the central plains.",
        "terrainTypes": [
          "Mountain"
        ],
        "fromX": 1,
        "fromY": 0,
        "toX": 6,
        "toY": 3
      },
      {
        "name": "Northern Mountain Range",
        "description": "A rugged northern region with mountains, hills, and a few narrow plains and forests. Provides defensive high ground and limits direct access to the central crossroads from the north.",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Plain",
          "Forest"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 19,
        "toY": 3
      },
      {
        "name": "Eastern Plateau and Village",
        "description": "A raised area on the eastern side, featuring a house, fort, and some cliffs. Offers a strong defensive position and a potential staging ground for attacks on the crossroads.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill",
          "Fort",
          "House",
          "Cliff"
        ],
        "fromX": 15,
        "fromY": 4,
        "toX": 19,
        "toY": 9
      },
      {
        "name": "Southern Cliffs and Coast",
        "description": "The southern edge of the map is dominated by cliffs and the sea, with a few accessible plains and forests. This region forms a natural boundary and limits southern movement.",
        "terrainTypes": [
          "Cliff",
          "Sea",
          "Plain",
          "Forest",
          "Hill"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 19,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "Fort at (3,8)",
      "Fort at (18,5)",
      "House at (1,8)",
      "House at (15,8)",
      "House at (15,8)",
      "House at (15,8)"
    ],
    "chokePoints": [
      "Narrow mountain pass at (7,0)-(7,3)",
      "Narrow mountain pass at (6,4)-(6,5)",
      "Cliffside path at (18,8)-(19,9)",
      "Mountain funnel at (6,10)-(7,11)"
    ],
    "strategicConsiderations": [
      "The central crossroads is the main area of engagement and offers multiple routes for both offense and defense.",
      "Mountain and cliff regions restrict movement, making flying units valuable for flanking or bypassing obstacles.",
      "Forts and houses provide healing and defensive bonuses; controlling them is key for sustaining your forces.",
      "Choke points at mountain passes and cliffside paths can be used to delay or block enemy advances.",
      "The southern cliffs and sea form a hard boundary, so expect little to no movement from the south."
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
        "description": "The southernmost chamber with stairs, serving as the main entry point into the complex. Provides initial deployment area and access to the central corridor.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 1,
        "fromY": 13,
        "toX": 6,
        "toY": 14
      },
      {
        "name": "Central Corridor",
        "description": "A long, wide hallway running north-south through the map, featuring several pillars for cover and multiple access points to adjacent rooms. Key for movement and control of the map.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 2,
        "fromY": 6,
        "toX": 9,
        "toY": 12
      },
      {
        "name": "Western Chamber",
        "description": "A room in the northwest with multiple floor tiles and a pillar, accessible from the central corridor. Offers defensive positioning and a potential ambush site.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 1,
        "fromY": 1,
        "toX": 4,
        "toY": 4
      },
      {
        "name": "Eastern Chamber",
        "description": "A small room in the northeast containing a chest, accessible via a narrow passage. High-value target for thieves and a likely enemy stronghold.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Chest"
        ],
        "fromX": 11,
        "fromY": 1,
        "toX": 13,
        "toY": 3
      },
      {
        "name": "Northern Passage",
        "description": "A corridor running east-west at the top of the map, connecting the western and eastern chambers. Provides flanking opportunities and alternate routes.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 6,
        "fromY": 1,
        "toX": 10,
        "toY": 4
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (12,2)",
      "Multiple doors at (7,4), (4,12), (12,4), (4,12)",
      "Stairs at (4,5), (7,5), (3,9), (5,13), (5,14)"
    ],
    "chokePoints": [
      "Door at (7,4) between central corridor and northern passage",
      "Door at (4,12) between central corridor and southern area",
      "Door at (12,4) between eastern chamber and northern passage"
    ],
    "strategicConsiderations": [
      "The central corridor is the main artery of the map, controlling it allows rapid response to threats in any room.",
      "Pillars provide cover for both attackers and defenders, making direct assaults risky.",
      "Doors act as choke points; controlling them can delay or funnel enemy advances.",
      "The chest in the eastern chamber is a high-value objective, but the narrow approach makes it easy to defend.",
      "Stairs may be used for reinforcements or flanking, so watch for enemy spawns."
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
        "description": "A rugged area of cliffs, plains, and forests forming the western and northwestern approach to the fortress. The cliffs and sea form natural barriers, while the road and thickets provide limited access. The ruins at (16,1) may be a minor point of interest.",
        "terrainTypes": [
          "Cliff",
          "Plain",
          "Forest",
          "Sea",
          "Ruins",
          "Thicket",
          "Road"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 16,
        "toY": 6
      },
      {
        "name": "Northern Lake and Eastern Cliffs",
        "description": "A natural barrier of sea and cliffs along the northern and northeastern edge of the map, with some forested and plain tiles. This region is largely impassable except for fliers.",
        "terrainTypes": [
          "Sea",
          "Cliff",
          "Forest",
          "Plain"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 22,
        "toY": 6
      },
      {
        "name": "Outer Fortress Grounds",
        "description": "The open area surrounding the fortress walls, including thickets and forests for cover. This region is the main staging ground for attackers and defenders before breaching the fortress proper.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Thicket",
          "Road"
        ],
        "fromX": 0,
        "fromY": 4,
        "toX": 22,
        "toY": 7
      },
      {
        "name": "Fortress Main Hall and Courtyard",
        "description": "The central area inside the fortress walls, including the main hall, open courtyard, and several rooms. Contains stairs, pillars, and a mix of floor and plain tiles. The main defensive and maneuvering area for the fortress garrison.",
        "terrainTypes": [
          "Floor",
          "Plain",
          "Forest",
          "Thicket",
          "Stairs",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 22,
        "toY": 18
      },
      {
        "name": "Southern Barracks and Storage",
        "description": "A series of rooms in the southern part of the fortress, including barracks, storage, and treasure rooms. Contains chests at (7,20) and (7,20), pillars, and stairs. Key for item acquisition and reinforcement spawns.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Chest",
          "Stairs",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 19,
        "toX": 16,
        "toY": 23
      },
      {
        "name": "Eastern Barracks and Vault",
        "description": "A set of rooms in the southeast corner, separated from the main southern barracks by walls. Contains stairs, pillars, and additional chests. Accessible via doors and a narrow passage.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Chest",
          "Stairs",
          "Wall"
        ],
        "fromX": 17,
        "fromY": 19,
        "toX": 22,
        "toY": 23
      }
    ],
    "keyPointsOfInterest": [
      "Ruins at (16,1)",
      "Stairs at (9,12), (3,22), (18,21), (19,21)",
      "Chests at (7,20), (7,20)",
      "Pillars at (7,16), (3,19), (12,21)",
      "Doors at (7,18), (7,18)",
      "Thickets at (8,4), (6,5), (9,5), (10,5), (9,6)"
    ],
    "chokePoints": [
      "Main entrance at (7,18) and (7,18) (double doors)",
      "Narrow passages at (7,14)-(7,15), (7,12)-(7,13)",
      "Stairs at (9,12), (3,22), (18,21), (19,21)",
      "Corridors between southern and eastern barracks"
    ],
    "strategicConsiderations": [
      "The fortress is surrounded by cliffs and sea to the north and west, making those approaches impassable except for fliers.",
      "The main assault must come through the southern and central entrances, which are heavily fortified with double doors and narrow corridors.",
      "Thickets and forests in the outer grounds provide cover for attackers, but also slow movement.",
      "The main hall and courtyard offer open space for defenders to maneuver and counterattack.",
      "Barracks and vaults in the south and east contain valuable items and are likely reinforcement points.",
      "Choke points at doors and stairs are ideal for defensive stands or ambushes.",
      "Control of the stairs and pillars inside the fortress is key for both defense and offense."
    ],
    "givenName": "Fortress by the Lake",
    "originalName": "Nobles_Evil_Doers_7_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "A strategic fortress surrounded by rugged terrain and a serene lake, offering both defensive advantages and challenges for attackers.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Fortified Compound",
        "description": "A defensible indoor fort area with multiple floors, stairs, and thick walls. Provides a stronghold for defenders and a challenging obstacle for attackers.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 7
      },
      {
        "name": "Central Plains and Thicket Approach",
        "description": "A large, open area with scattered thickets and a house, offering both mobility and cover. This region is the main approach to the river and bridges, and is key for maneuvering units.",
        "terrainTypes": [
          "Plain",
          "Thicket",
          "Forest",
          "House"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 15,
        "toY": 14
      },
      {
        "name": "Northern and Eastern Mountain Barrier",
        "description": "A rugged, impassable mountain and cliff region forming a natural barrier along the north and east edges of the map. Only accessible to fliers.",
        "terrainTypes": [
          "Mountain",
          "Cliff"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 24,
        "toY": 7
      },
      {
        "name": "River and Bridge Network",
        "description": "A river with multiple bridges and cliffs, forming the central chokepoint of the map. Control of the bridges is crucial for movement between the east and west sides.",
        "terrainTypes": [
          "Sea",
          "Cliff",
          "Bridge",
          "Plain",
          "Thicket"
        ],
        "fromX": 15,
        "fromY": 8,
        "toX": 18,
        "toY": 13
      },
      {
        "name": "Eastern Plains and Fort",
        "description": "A broad eastern field with a fort, houses, and scattered thickets. This area is important for staging attacks or defending the eastern approach to the bridges.",
        "terrainTypes": [
          "Plain",
          "Thicket",
          "Forest",
          "Fort",
          "House"
        ],
        "fromX": 16,
        "fromY": 7,
        "toX": 24,
        "toY": 17
      },
      {
        "name": "Southern Bridge Crossing",
        "description": "A southern crossing with two bridges and adjacent cliffs, serving as a secondary but vital route across the river.",
        "terrainTypes": [
          "Bridge",
          "Plain",
          "Cliff",
          "Forest"
        ],
        "fromX": 11,
        "fromY": 15,
        "toX": 18,
        "toY": 17
      }
    ],
    "keyPointsOfInterest": [
      "Fort at (13,13)",
      "House at (14,7)",
      "Bridges at (16,12), (16,13), (11,15), (12,15)",
      "Stairs at (6,3), (6,4), (6,5), (3,7), (4,7), (5,7)",
      "House at (14,7)",
      "House at (14,7) and (14,7) (duplicate, but present in both quadrants)"
    ],
    "chokePoints": [
      "Bridges at (16,12), (16,13), (11,15), (12,15)",
      "Narrow pass between cliffs and river at (15,8)-(18,13)",
      "Stairs and wall entrances to the Western Fortified Compound"
    ],
    "strategicConsiderations": [
      "Control of the bridges is essential for moving between the east and west sides of the map.",
      "The Western Fortified Compound is highly defensible but can be surrounded if attackers control the central plains.",
      "The mountain and cliff regions are impassable to most units, funneling movement through the plains and bridges.",
      "The fort and houses in the east provide healing and defensive bonuses, making them valuable for holding territory.",
      "The southern bridge crossing offers a flanking route but is also a chokepoint vulnerable to ambush."
    ],
    "givenName": "River Crossing",
    "originalName": "PeakRiver",
    "description": "A strategic outdoor map featuring a river with multiple bridges, surrounded by mountains and a fort.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northwest Village and Mountain Approach",
        "description": "A region containing a walled village, houses, and a mix of plains, mountains, and forests. This area is a key resource and spawn zone, with natural barriers to the east and south.",
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
        "description": "A wide river bisects the map, with multiple bridges and fords. This region is the main crossing point and a major strategic choke, with forts and forests providing defensive cover.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Fort",
          "Forest",
          "Thicket"
        ],
        "fromX": 19,
        "fromY": 0,
        "toX": 25,
        "toY": 17
      },
      {
        "name": "Northeast Plains and Village",
        "description": "Open plains with scattered villages, houses, and shops. This area is accessible and important for reinforcements and resource gathering.",
        "terrainTypes": [
          "Plain",
          "Village",
          "House",
          "Wall",
          "Armory",
          "Vendor",
          "Hill",
          "Forest"
        ],
        "fromX": 26,
        "fromY": 0,
        "toX": 34,
        "toY": 8
      },
      {
        "name": "Central East Castle Grounds",
        "description": "A fortified castle area with walls, gates, and armories. The castle is a defensive stronghold and a key objective, accessible via bridges and gates.",
        "terrainTypes": [
          "Wall",
          "Gate",
          "Plain",
          "Armory",
          "Village"
        ],
        "fromX": 29,
        "fromY": 2,
        "toX": 34,
        "toY": 9
      },
      {
        "name": "Southwest Riverbank and Southern Fort",
        "description": "A southern region with riverbanks, bridges, and a fort. This area is a defensive approach to the south, with forests and mountains providing cover.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "River",
          "Bridge",
          "Fort",
          "Mountain",
          "Thicket"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 18,
        "toY": 25
      },
      {
        "name": "Southeast Village and Outskirts",
        "description": "A large southeastern region with villages, houses, and a mix of open plains and forests. The area is bounded by cliffs and contains several bridges and defensive positions.",
        "terrainTypes": [
          "Plain",
          "Village",
          "House",
          "Forest",
          "Thicket",
          "Wall",
          "Cliff",
          "Bridge"
        ],
        "fromX": 19,
        "fromY": 9,
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
      "Fort at (7,17)",
      "Fort at (27,29)",
      "Gate at (6,6)",
      "Gate at (8,25)",
      "Gate at (28,18)",
      "Bridge at (23,6)",
      "Bridge at (23,7)",
      "Bridge at (11,16)",
      "Bridge at (3,17)",
      "Bridge at (26,30)",
      "Bridge at (26,31)",
      "Bridge at (27,12)",
      "Bridge at (28,12)",
      "Bridge at (27,13)",
      "Bridge at (28,13)"
    ],
    "chokePoints": [
      "Bridges at (23,6), (23,7), (11,16), (3,17), (26,30), (26,31), (27,12), (28,12), (27,13), (28,13)",
      "Gates at (6,6), (8,25), (28,18)",
      "Castle walls and gates in the central east (29,2)-(34,9)",
      "Narrow mountain passes in the northwest (7,0)-(13,3)"
    ],
    "strategicConsiderations": [
      "Control of the central river bridges is vital for movement and reinforcement between north and south.",
      "The eastern castle grounds are highly defensible and likely a key objective.",
      "Villages and houses provide resources and healing; securing them early is advantageous.",
      "Mountain and forest terrain in the northwest and southwest offer strong defensive positions but limit cavalry movement.",
      "Cliffs and sea along the map edges restrict flanking, focusing combat toward the center and bridges.",
      "The southeast region is open but bounded by cliffs, making it vulnerable to attacks from the central bridges."
    ],
    "givenName": "Riverland Convergence",
    "originalName": "Snakey1_FE8_01003803_Many_Castles__by_FEU",
    "description": "A strategic map featuring a central river with multiple bridges, surrounded by villages and castles. The terrain includes mountains, forests, and plains, offering diverse tactical opportunities.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Vast Northern Plains",
        "description": "A large, open field with scattered forests and a few stairs, ideal for cavalry and fast movement. This area serves as the main approach to the ancient ruins and offers little cover except for a few forest tiles.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 9,
        "toY": 6
      },
      {
        "name": "Western Approach Corridor",
        "description": "A long corridor of plains and forests running along the western edge, providing a flanking route toward the ruins. The forests offer some defensive bonuses for infantry.",
        "terrainTypes": [
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 3,
        "toX": 9,
        "toY": 13
      },
      {
        "name": "Central Ancient Ruins Complex",
        "description": "A large, walled-in complex with multiple rooms, floors, pillars, and stairs. This is the heart of the map, featuring many choke points and defensive positions. The ruins are accessible from multiple directions and are the likely focal point for major battles.",
        "terrainTypes": [
          "Wall",
          "Floor",
          "Stairs",
          "Pillar",
          "Plain",
          "Forest"
        ],
        "fromX": 10,
        "fromY": 3,
        "toX": 21,
        "toY": 15
      },
      {
        "name": "Southern Outer Fields",
        "description": "Open fields and scattered forests south of the ruins, providing space for maneuvering and potential reinforcement entry points.",
        "terrainTypes": [
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 14,
        "toX": 21,
        "toY": 15
      },
      {
        "name": "Southwestern Ruins Annex",
        "description": "A separate annex of the ruins, partially walled off from the main complex. Contains several floor tiles and is accessible from the southern fields. Useful for flanking or as a fallback position.",
        "terrainTypes": [
          "Wall",
          "Floor",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 16,
        "toY": 19
      },
      {
        "name": "Southeastern Ruins Annex",
        "description": "A smaller annex on the southeast, separated from the main complex by walls. Provides an alternative entry or escape route and may be used for ambushes or holding reinforcements.",
        "terrainTypes": [
          "Wall",
          "Floor",
          "Plain",
          "Forest"
        ],
        "fromX": 17,
        "fromY": 16,
        "toX": 21,
        "toY": 19
      }
    ],
    "keyPointsOfInterest": [
      "Multiple stairs at (11,1), (1,9), (7,9), (7,10), (7,11), (18,7), (7,7), (7,10), (7,11)",
      "Pillars at (15,9), (20,9)",
      "Numerous wall and floor transitions indicating room boundaries",
      "Large open courtyards in the central ruins"
    ],
    "chokePoints": [
      "Narrow entrances through walls at (10,0)-(12,0), (10,3)-(12,3), (12,5)-(13,5), (12,6)-(13,6), (12,7)-(13,7), (12,8)-(13,8), (12,9)-(13,9), (12,10)-(13,10), (12,11)-(13,11), (12,12)-(13,12)",
      "Stairs and wall corners in the central ruins",
      "Annex entrances at (16,16), (17,16)"
    ],
    "strategicConsiderations": [
      "The central ruins complex is the main defensive stronghold, with many walls and pillars for cover and choke points for defense.",
      "The northern plains and southern fields allow for rapid movement and flanking, but offer little protection.",
      "The western and eastern annexes can be used for ambushes or as fallback positions if the central complex is breached.",
      "Controlling the stairs and narrow wall entrances is key to holding or breaching the ruins.",
      "Forests on the periphery provide defensive bonuses for infantry and can be used to stage attacks or defend against cavalry."
    ],
    "givenName": "Ancient Ruins",
    "originalName": "HaedrcHideout",
    "description": "A map featuring ancient stone structures surrounded by grassy terrain, with multiple entrances and pathways.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Outer Courtyard",
        "description": "A large open area in front of the fortress, providing space for initial deployment and movement. Offers little cover but is critical for staging assaults on the fortress.",
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
        "description": "The main hall of the fortress, accessible via stairs and containing pillars for cover. This area is the primary defensive interior, connecting to both left and right towers.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 4,
        "fromY": 3,
        "toX": 11,
        "toY": 5
      },
      {
        "name": "Left Tower Interior",
        "description": "The left-side tower, accessible from the main hall and featuring multiple floors and stairs. Provides vertical movement and defensive positions.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 1,
        "fromY": 5,
        "toX": 5,
        "toY": 15
      },
      {
        "name": "Right Tower Interior",
        "description": "The right-side tower, mirroring the left tower, with stairs and defensive positions. Offers flanking opportunities and additional cover.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 10,
        "fromY": 5,
        "toX": 14,
        "toY": 15
      },
      {
        "name": "Rear Fortress Passage",
        "description": "A rear passage behind the fortress, connecting both towers and providing a potential escape or reinforcement route.",
        "terrainTypes": [
          "Plain",
          "Floor",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 17,
        "toX": 15,
        "toY": 18
      }
    ],
    "keyPointsOfInterest": [
      "Central double doors at (7,6) and (8,6)",
      "Multiple stairs throughout the fortress (e.g., (4,2), (11,2), (5,13), (10,13))",
      "Pillars in the main hall (6,4), (9,4)"
    ],
    "chokePoints": [
      "Double doors at (7,6) and (8,6)",
      "Narrow stairwells in both towers",
      "Side doors at (3,9), (12,9)"
    ],
    "strategicConsiderations": [
      "The outer courtyard is exposed and vulnerable to ranged attacks from the fortress walls.",
      "The double doors at the center are the main entry point and a critical chokepoint for attackers.",
      "Pillars in the main hall provide cover for defenders.",
      "Stairs and narrow passages in the towers can be used to funnel attackers and create defensive bottlenecks.",
      "The rear passage allows for flanking or retreat, but is also vulnerable if left undefended."
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
        "description": "A large, open area at the top of the map with several buildings including an armory and vendor, interspersed with roads and patches of forest. This region is the main northern settlement and is accessible from multiple directions.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "House",
          "Armory",
          "Vendor"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 17,
        "toY": 3
      },
      {
        "name": "Central Village Square",
        "description": "The heart of the map, containing several houses, two villages, and a network of roads. This area is the main thoroughfare and is critical for movement between the north and south.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "House",
          "Village"
        ],
        "fromX": 0,
        "fromY": 4,
        "toX": 17,
        "toY": 10
      },
      {
        "name": "Eastern Outskirts",
        "description": "A small, open area to the northeast, separated from the main village by walls. Provides flanking opportunities and a possible spawn or reinforcement point.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest"
        ],
        "fromX": 14,
        "fromY": 0,
        "toX": 17,
        "toY": 3
      },
      {
        "name": "Southern Fortified Approach",
        "description": "A heavily walled and fortified southern region with stairs and narrow passages. This area is defensible and serves as the main southern stronghold.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 11,
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
      "Narrow road between walls at (5,4)-(7,4)",
      "Wall-enclosed passage at (11,6)-(12,6)",
      "Southern stairs at (6,13)-(7,13)",
      "Eastern stairs at (17,13)"
    ],
    "strategicConsiderations": [
      "The central square is highly traversable and connects all major regions, making it a key battleground.",
      "The southern fortifications are ideal for defense, with limited access via stairs and narrow roads.",
      "Villages and houses provide objectives and possible rewards, incentivizing movement across the map.",
      "The northern cluster is open but has some cover from forests and buildings, making it suitable for both offense and defense.",
      "Choke points at the southern stairs and narrow roads can be used to control enemy movement and set up ambushes.",
      "The eastern outskirts can be used for flanking or as a reinforcement entry point."
    ],
    "givenName": "Village Outskirts",
    "originalName": "Knights_Villagers_Bandits_3_(0E_00_72_10)__by_Aura_Wolf",
    "description": "A rural map featuring a cluster of buildings surrounded by open fields and a fortified area to the south.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Royal Throne Chamber",
        "description": "A large, ornate room at the top left of the map, featuring the throne at (6,1). This is the primary defensive position and likely the map's objective.",
        "terrainTypes": [
          "Floor",
          "Throne"
        ],
        "fromX": 1,
        "fromY": 0,
        "toX": 7,
        "toY": 4
      },
      {
        "name": "Grand Main Hall",
        "description": "A wide, open hall with multiple staircases along the east and west, connecting the throne chamber to the rest of the castle. Offers high mobility and is a key area for movement and reinforcement.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 1,
        "fromY": 5,
        "toX": 18,
        "toY": 7
      },
      {
        "name": "Central Corridor Block",
        "description": "A set of three doors in a row, forming a choke point between the main hall and the lower castle. Critical for controlling access between upper and lower regions.",
        "terrainTypes": [
          "Floor",
          "Door"
        ],
        "fromX": 5,
        "fromY": 8,
        "toX": 7,
        "toY": 9
      },
      {
        "name": "Lower Castle Hall",
        "description": "A large, open area with pillars for cover, spanning the width of the map. This hall is the main thoroughfare for units moving between east and west.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 19,
        "toY": 13
      },
      {
        "name": "Western Maze of Corridors",
        "description": "A complex network of corridors and small rooms in the lower left, with pillars and walls creating tactical cover and ambush points.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 14,
        "toX": 12,
        "toY": 19
      },
      {
        "name": "Eastern Maze of Corridors",
        "description": "A mirrored set of corridors and rooms on the lower right, with stairs and pillars. Contains the treasure chamber and multiple access points to the main hall.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 13,
        "fromY": 14,
        "toX": 26,
        "toY": 22
      },
      {
        "name": "Treasure Chamber",
        "description": "A small, secure room in the southeast corner containing a chest. Accessible only through the eastern maze, making it a high-value but risky objective.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 23,
        "fromY": 18,
        "toX": 26,
        "toY": 18
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (6,1)",
      "Multiple staircases at (13,5)-(18,7) and (13,6)-(18,8)",
      "Three doors at (5,8), (6,8), (7,8)",
      "Chest at (23,18)"
    ],
    "chokePoints": [
      "Triple door corridor at (5,8)-(7,8)",
      "Narrow corridors in western and eastern mazes",
      "Staircase landings in the main hall"
    ],
    "strategicConsiderations": [
      "Defending the throne chamber is critical; the triple door corridor is the main bottleneck for attackers.",
      "The main hall offers fast movement but is exposed to attacks from both sides.",
      "The maze-like lower regions allow for ambushes and flanking but can slow down movement.",
      "The treasure chamber is isolated and risky to reach, requiring control of the eastern maze.",
      "Pillars in the lower halls provide cover for both attackers and defenders."
    ],
    "givenName": "Royal Throne Room",
    "originalName": "CesarianCapitalAssassin",
    "description": "An indoor map featuring a grand throne room with intricate pathways and a treasure chamber.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Grand Throne Room",
        "description": "A large, ornate room with a throne at its center, pillars for cover, and multiple entrances. This is the primary objective area and likely the most defensible position on the map.",
        "terrainTypes": [
          "Floor",
          "Throne",
          "Pillar"
        ],
        "fromX": 13,
        "fromY": 2,
        "toX": 17,
        "toY": 6
      },
      {
        "name": "Central Pillared Hall",
        "description": "A wide hall with several pillars and stairs, connecting the entrance and side chambers to the throne room. Offers both cover and multiple routes for movement.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 3,
        "fromY": 2,
        "toX": 12,
        "toY": 6
      },
      {
        "name": "Western Treasure Chamber",
        "description": "A small, secure room containing a valuable chest, accessible through a door. Highly defensible and a secondary objective for treasure.",
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
        "name": "Northern Side Corridor",
        "description": "A narrow corridor along the north side of the map, providing flanking opportunities and access to the main hall.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 11,
        "toY": 1
      },
      {
        "name": "Southern Entrance Hall",
        "description": "The main entryway into the map, with stairs and pillars for cover. This is where most player units will begin and where reinforcements may appear.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar"
        ],
        "fromX": 1,
        "fromY": 10,
        "toX": 13,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (15,3)",
      "Chest at (4,7)",
      "Multiple stairs at (5,4), (11,5), (9,10), (9,11), (14,7), (15,7), (16,7), (17,5)",
      "Doors at (6,7), (6,7) (east and west sides)"
    ],
    "chokePoints": [
      "Door at (6,7) between the Western Treasure Chamber and Central Pillared Hall",
      "Narrow corridor at (7,0)-(11,1) in the Northern Side Corridor",
      "Entrances to the Grand Throne Room at (13,3), (14,4), (15,5), (16,6)"
    ],
    "strategicConsiderations": [
      "The Grand Throne Room is the most defensible area, with limited entrances and pillars for cover.",
      "The Central Pillared Hall is open but offers cover and multiple routes, making it a contested zone.",
      "The Western Treasure Chamber is isolated and easily defended once the door is closed.",
      "The Northern Side Corridor can be used for flanking but is narrow and vulnerable to blockades.",
      "The Southern Entrance Hall is the likely starting area and must be held to prevent enemy reinforcements from overwhelming the player."
    ],
    "givenName": "Royal Throne Room",
    "originalName": "Knights_Villagers_Bandits_8_(18_00_19_1A)__by_Aura_Wolf",
    "description": "An ornate indoor map featuring a throne room, treasure chamber, and various corridors.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Grand Entrance Hall",
        "description": "A large, open hall with pillars, serving as the main entry point to the fortress. Provides ample space for deployment and initial movement, but is exposed to attacks from multiple directions.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 14,
        "toX": 14,
        "toY": 16
      },
      {
        "name": "Southern Labyrinthine Corridor",
        "description": "A winding set of corridors and rooms with several staircases, connecting the entrance hall to the central and northern sections. Contains multiple doors and walls, creating natural choke points for defense.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 4,
        "toX": 10,
        "toY": 13
      },
      {
        "name": "Central Treasure Vault",
        "description": "A small, well-protected room containing a treasure chest. Accessible only through a narrow corridor, making it easy to defend but difficult to reach quickly.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 2,
        "fromY": 8,
        "toX": 3,
        "toY": 8
      },
      {
        "name": "Northern Pillared Gallery",
        "description": "A wide, open gallery with decorative pillars, providing both cover and sightlines. Connects to the upper labyrinth and is a key area for controlling movement between north and south.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 10,
        "toY": 2
      },
      {
        "name": "Upper Fortress Labyrinth",
        "description": "A complex maze of rooms and corridors in the upper part of the fortress, featuring multiple staircases and narrow passages. Offers many opportunities for ambushes and defensive stands.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 4,
        "fromY": 4,
        "toX": 14,
        "toY": 12
      },
      {
        "name": "Northeast Watch Room",
        "description": "A small, isolated room in the northeast corner, likely used for surveillance or as a guard post. Accessible only through a single corridor, making it easy to defend.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 11,
        "fromY": 0,
        "toX": 14,
        "toY": 3
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (3,8)",
      "Stairs at (4,5), (5,11), (10,10), (12,11)",
      "Doors at (1,3), (1,7)",
      "Pillars at (4,0), (10,0), (3,15), (7,15)"
    ],
    "chokePoints": [
      "Door at (1,3) separating northern gallery from southern labyrinth",
      "Door at (1,7) controlling access to the central treasure vault",
      "Narrow corridors at (5,4)-(5,6) and (5,8)-(5,10)",
      "Single-tile passages near (7,7) and (7,8)"
    ],
    "strategicConsiderations": [
      "The entrance hall is vulnerable to attacks from multiple directions; prioritize securing the southern corridors.",
      "The central treasure vault is easy to defend but can be cut off if the southern labyrinth is lost.",
      "Pillars in the northern gallery and entrance hall provide cover for ranged units.",
      "Staircases may be used for reinforcements or flanking maneuvers; control these to limit enemy mobility.",
      "Doors and narrow corridors create natural choke points—ideal for holding off larger enemy forces with a small defensive team.",
      "The northeast watch room is a strong defensive position but can be isolated if the upper labyrinth is breached."
    ],
    "givenName": "Fortress Labyrinth",
    "originalName": "Underground",
    "description": "A complex indoor map featuring narrow corridors and small rooms, designed like a maze with strategic chokepoints.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Castle Grounds",
        "description": "A fortified area at the top center of the map, enclosed by walls with a central gate at (4,2). Contains forts for defense and is a key defensive position.",
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
        "name": "Northwest Forest and Plains",
        "description": "A mix of forest and open plains in the northwest, providing cover and mobility for infantry and cavalry. Contains a fort at (1,3).",
        "terrainTypes": [
          "Forest",
          "Plain",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 2,
        "toY": 4
      },
      {
        "name": "Northeast Plateau",
        "description": "Elevated area with hills, mountains, and cliffs, accessible mainly to fliers. Contains a fort at (7,1) and forest patches for cover.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill",
          "Mountain",
          "Cliff",
          "Fort"
        ],
        "fromX": 6,
        "fromY": 0,
        "toX": 14,
        "toY": 5
      },
      {
        "name": "Central Crossroad",
        "description": "The main open area connecting the north, west, and east. Contains several forts and forest tiles, making it a contested zone for movement and control.",
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
        "name": "Western Village",
        "description": "A small village with houses and a central village tile at (4,11), surrounded by walls and forests. Provides healing and strategic value.",
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
        "name": "Eastern Village",
        "description": "A village area with a central village tile at (12,8), houses, and forest cover. Enclosed by walls to the west and south.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Village",
          "House",
          "Wall"
        ],
        "fromX": 11,
        "fromY": 8,
        "toX": 14,
        "toY": 11
      },
      {
        "name": "Southern Plains and Hills",
        "description": "Open southern area with plains, hills, and mountains. Provides open movement but is bordered by impassable mountains to the far south and east.",
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
      "Forts at (1,3), (7,1), (7,4)",
      "Village at (4,11)",
      "Village at (12,8)",
      "Houses at (10,10), (1,12), (10,10), (10,10)",
      "Mountain range at southern and eastern edges"
    ],
    "chokePoints": [
      "Castle Gate at (4,2)",
      "Narrow passage between cliffs at (5,6)-(6,6)",
      "Village entrances at (4,11) and (12,8)",
      "Wall gaps at (3,9)-(6,9) and (3,10)-(6,10)"
    ],
    "strategicConsiderations": [
      "The castle grounds are highly defensible due to walls and a single gate.",
      "The central crossroad is a key area for controlling movement between regions.",
      "Villages provide healing and are important to defend or seize.",
      "Cliffs and mountains restrict movement, favoring fliers and ranged units.",
      "Forts offer defensive bonuses and are ideal for holding key positions.",
      "Choke points at gates and village entrances can be used to stall or funnel enemy advances."
    ],
    "givenName": "Twin Villages Crossroad",
    "originalName": "Knights_Villagers_Bandits_1_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic outdoor map featuring two villages connected by roads, surrounded by forests and mountains, with a central castle and a cave entrance.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Grand Throne Room",
        "description": "A large, fortified room at the top center of the map containing the throne. This is the primary objective area, heavily defended and only accessible through narrow corridors and doors.",
        "terrainTypes": [
          "Floor",
          "Throne"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 16,
        "toY": 2
      },
      {
        "name": "Northern Approach Hall",
        "description": "A wide corridor leading up to the throne room, providing the main approach for attackers. Offers little cover but is broad, allowing for large-scale movement.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 12,
        "toY": 2
      },
      {
        "name": "Western Corridor",
        "description": "A narrow passage running along the west side, connecting the northern approach to the central and southern areas. Useful for flanking or sneaking units.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 0,
        "fromY": 3,
        "toX": 8,
        "toY": 6
      },
      {
        "name": "Eastern Corridor",
        "description": "A narrow eastern passage that allows access to the throne room and central areas. Can be used for flanking or reinforcement.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 17,
        "fromY": 2,
        "toX": 19,
        "toY": 6
      },
      {
        "name": "Central Pillar Hall",
        "description": "A large central hall with pillars for cover, connecting the north and south of the map. This area is key for controlling movement between regions.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 10,
        "fromY": 10,
        "toX": 16,
        "toY": 15
      },
      {
        "name": "Western Treasure Vault",
        "description": "A secure room in the southwest corner containing chests. Accessible only through a narrow entrance, making it easy to defend.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 1,
        "toY": 20
      },
      {
        "name": "Eastern Treasure Vault",
        "description": "A small treasure room in the southeast, containing chests. Isolated and easily defensible.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 21,
        "fromY": 19,
        "toX": 22,
        "toY": 19
      },
      {
        "name": "Southern Maze of Chambers",
        "description": "A complex network of rooms and corridors in the southern half of the map, containing several chests and multiple entrances. Offers many opportunities for ambushes and defensive stands.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 3,
        "fromY": 16,
        "toX": 19,
        "toY": 25
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (15,1)",
      "Chests at (0,16), (9,19), (8,19), (21,19), (0,20)",
      "Multiple stair tiles at (2,7)-(5,8), (22,5)-(25,8)",
      "Pillars at (1,11), (6,11), (15,14), (23,11), (15,14)"
    ],
    "chokePoints": [
      "Triple doors at (14,8)-(16,8) and (14,9)-(16,9)",
      "Narrow corridor entrances at (2,14), (2,15), (2,16), (2,17)",
      "Single-tile passages in treasure vaults"
    ],
    "strategicConsiderations": [
      "The throne room is heavily fortified and only accessible through narrow, easily-defended doors.",
      "Central pillar hall provides cover and is a key area for controlling movement between north and south.",
      "Treasure vaults are isolated and can be defended by a small number of units.",
      "Multiple stair tiles may allow for reinforcements or ambushes.",
      "Wide northern approach is vulnerable to area attacks but allows for massed assaults.",
      "Choke points at doors and narrow corridors are ideal for defensive stands or ambushes."
    ],
    "givenName": "Throne Room Siege",
    "originalName": "CesarianCapitalMercenaryArcanae",
    "description": "A fortified indoor map featuring a central throne room, surrounded by intricate corridors and treasure chambers.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northwest Coastal Plains and Village",
        "description": "A large, open area with a mix of plains and forests, featuring a house at (0,8) and a walled village at (3,8). The region is bordered by sea to the north and west, and cliffs to the east. The bridge at (7,9) provides a key crossing to the east.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Village",
          "Bridge"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 15,
        "toY": 9
      },
      {
        "name": "Western Central Plains",
        "description": "A broad stretch of plains and forests south of the northwest region, bounded by cliffs and walls. Contains a fort at (12,14) and a bridge at (0,15) leading further south.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Cliff",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 15,
        "toY": 15
      },
      {
        "name": "Southwest Market Road",
        "description": "A southern road lined with shops, including an armory at (1,16) and a vendor at (2,19). Multiple bridges (13,16), (4,17), (4,18) connect this region to the east and north.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Armory",
          "Vendor",
          "Bridge"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 15,
        "toY": 20
      },
      {
        "name": "Central River and Bridge Network",
        "description": "A network of bridges and plains crossing a river, connecting the western and eastern halves of the map. The bridges at (15,8), (16,8), and (7,9) are critical chokepoints.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Cliff",
          "Bridge"
        ],
        "fromX": 5,
        "fromY": 8,
        "toX": 16,
        "toY": 9
      },
      {
        "name": "Central Castle Courtyard",
        "description": "A fortified castle courtyard, accessible only through the gate at (11,12). Surrounded by walls, this is a key defensive position.",
        "terrainTypes": [
          "Plain",
          "Wall",
          "Gate"
        ],
        "fromX": 10,
        "fromY": 11,
        "toX": 12,
        "toY": 12
      },
      {
        "name": "Northeast Village and Fields",
        "description": "A walled village at (16,4) surrounded by open fields and forests. The area is protected by walls and is a valuable resource point.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Village",
          "Wall"
        ],
        "fromX": 15,
        "fromY": 2,
        "toX": 20,
        "toY": 5
      },
      {
        "name": "Eastern Central Plains",
        "description": "A large open area east of the central river, with bridges at (15,8), (16,8) providing access. Contains a fort at (12,14) and is bordered by cliffs and sea.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Cliff",
          "Bridge"
        ],
        "fromX": 16,
        "fromY": 6,
        "toX": 20,
        "toY": 15
      },
      {
        "name": "Southeast Homestead and Fields",
        "description": "A southeastern area with a house at (16,18), surrounded by plains and forests. Provides a safe haven and potential reinforcement point.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House"
        ],
        "fromX": 16,
        "fromY": 16,
        "toX": 20,
        "toY": 20
      }
    ],
    "keyPointsOfInterest": [
      "House at (0,8)",
      "Village at (3,8)",
      "Bridge at (7,9)",
      "Fort at (12,14)",
      "Armory at (1,16)",
      "Vendor at (2,19)",
      "Bridges at (13,16), (4,17), (4,18)",
      "Castle Gate at (11,12)",
      "Village at (16,4)",
      "House at (16,18)"
    ],
    "chokePoints": [
      "Bridge at (7,9)",
      "Bridges at (15,8), (16,8)",
      "Castle Gate at (11,12)",
      "Bridges at (13,16), (4,17), (4,18)"
    ],
    "strategicConsiderations": [
      "The central river and bridge network divides the map, making the bridges critical for movement and control.",
      "The castle courtyard is highly defensible, with only one accessible gate.",
      "Villages and houses provide resource and reinforcement points; securing them early is advantageous.",
      "The market road in the southwest offers access to shops and is a potential reinforcement route.",
      "Cliffs and walls create natural barriers, funneling movement through bridges and gates.",
      "Forts at (12,14) and (12,14) (east and west) offer healing and defensive bonuses.",
      "The southeast homestead is isolated but can serve as a reinforcement or escape point."
    ],
    "givenName": "River Crossing Battle",
    "originalName": "Mages_Mercenaries_4_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic map featuring multiple river crossings and fortified positions. The map is divided by rivers, with key structures like castles and villages scattered throughout.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Fortress Interior",
        "description": "The main interior of the fortress, featuring pillars for cover and stairs for vertical movement. This area is well-defended and serves as the stronghold's core.",
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
        "name": "Fortress Courtyard",
        "description": "An open area just outside the fortress walls, with some forest patches for cover. This courtyard is the main approach to the fortress and is vulnerable to ranged attacks from the walls.",
        "terrainTypes": [
          "Plain",
          "Forest"
        ],
        "fromX": 4,
        "fromY": 0,
        "toX": 8,
        "toY": 7
      },
      {
        "name": "Western Bridge Approach",
        "description": "The western approach to the central bridge, including the bridge itself and adjacent roads. This is a key crossing point over the river and a natural chokepoint.",
        "terrainTypes": [
          "Road",
          "Bridge",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 3,
        "toY": 4
      },
      {
        "name": "Central Riverbank and Cliffs",
        "description": "A rugged area of cliffs and sea tiles forming a natural barrier between the western and eastern halves of the map. Movement is highly restricted except at the bridge and a few narrow passes.",
        "terrainTypes": [
          "Cliff",
          "Sea",
          "Plain",
          "Forest"
        ],
        "fromX": 1,
        "fromY": 2,
        "toX": 7,
        "toY": 11
      },
      {
        "name": "Village and Southern Outskirts",
        "description": "A small village with adjacent roads and a fort, providing resources and a defensive position. This area is separated from the fortress by cliffs and sea.",
        "terrainTypes": [
          "Village",
          "Road",
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 12,
        "toY": 11
      },
      {
        "name": "Eastern Plains and Fort",
        "description": "Open plains with scattered forests and a fort, offering a staging ground for assaults on the fortress or defense against attackers from the west.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Road",
          "Fort"
        ],
        "fromX": 8,
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
      "Narrow fortress entrances at (9,0), (9,1), (9,2)",
      "Stairs at (12,7), (13,7), (14,7)",
      "Village entrance at (2,10)"
    ],
    "strategicConsiderations": [
      "The bridge is the primary crossing point and a major chokepoint; controlling it is vital for movement between the map's halves.",
      "The fortress interior is highly defensible, with limited entrances and cover from pillars.",
      "The cliffs and sea tiles restrict movement, funneling units into predictable paths.",
      "The village and fort in the south provide defensive bonuses and are key objectives for both sides.",
      "Open plains in the east allow for rapid movement but offer little cover, making units vulnerable to ranged attacks from the fortress walls."
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
        "description": "A large, open area with a mix of plains and forests, containing several forts and a house. This region is partially enclosed by walls to the east and is ideal for defensive positioning and unit deployment. The presence of forts and a house makes it a valuable stronghold.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort",
          "House",
          "Hill"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 12
      },
      {
        "name": "Central River and Bridge",
        "description": "A river running north-south through the center of the map, with two bridges (at (11,4) and (11,5)) providing the main crossing points. The river and surrounding cliffs create a natural barrier, making the bridges key choke points for movement and control.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Forest",
          "Cliff"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 12,
        "toY": 7
      },
      {
        "name": "Eastern Fortress Complex",
        "description": "A fortified area with multiple forts, walls, and a gate (at (19,4)), as well as a house and a cluster of cliffs. This region is highly defensible and serves as the main eastern stronghold, with limited access points.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort",
          "Cliff",
          "Gate",
          "Wall",
          "House"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 23,
        "toY": 12
      },
      {
        "name": "Northern Mountain Pass",
        "description": "A narrow, elevated region dominated by mountains and hills, providing high ground and limited movement. This pass is a strategic route for flanking or surprise attacks.",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Plain",
          "Cliff"
        ],
        "fromX": 16,
        "fromY": 0,
        "toX": 23,
        "toY": 2
      },
      {
        "name": "Southern Coastal Plains",
        "description": "A wide, open area along the southern edge of the map, featuring plains, forests, and several sea tiles. Contains forts and houses, making it important for reinforcements and rapid movement, especially for cavalry.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Sea",
          "Fort",
          "House"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 23,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "Bridge at (11,4)",
      "Bridge at (11,5)",
      "Gate at (2,7)",
      "Gate at (19,4)",
      "Forts at (6,2), (9,5), (14,5), (2,10), (6,10), (23,8), (23,10)",
      "House at (3,11)",
      "House at (20,10)"
    ],
    "chokePoints": [
      "Bridge at (11,4)",
      "Bridge at (11,5)",
      "Gate at (2,7)",
      "Gate at (19,4)",
      "Mountain pass at (16,0)-(23,2)"
    ],
    "strategicConsiderations": [
      "Controlling the bridges is crucial for movement between east and west.",
      "The gates and walls in the east and west restrict access, making them ideal for defense.",
      "The mountain pass in the north offers a flanking route but is slow to traverse.",
      "Southern plains allow for fast movement but are exposed to attacks from multiple directions.",
      "Forts and houses provide healing and defensive bonuses, making them valuable objectives."
    ],
    "givenName": "River Crossing Clash",
    "originalName": "Nobles_Evil_Doers_3_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic map featuring a central river with a bridge, surrounded by castles and villages. Ideal for tactical maneuvers and control of key points.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central River Crossing and Bridge",
        "description": "The only bridge across the central river, forming a critical chokepoint for movement between the north and south. Control of this area is vital for advancing or defending either side.",
        "terrainTypes": [
          "Plain",
          "River",
          "Bridge"
        ],
        "fromX": 6,
        "fromY": 8,
        "toX": 8,
        "toY": 8
      },
      {
        "name": "Northern Forested Approach",
        "description": "A large, continuous area of plains, forests, and hills north of the river. Provides ample cover for ambushes and defensive positioning before the river crossing.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill",
          "Thicket"
        ],
        "fromX": 3,
        "fromY": 1,
        "toX": 12,
        "toY": 7
      },
      {
        "name": "Southern Forested Approach",
        "description": "A broad area south of the river, with forests and hills for cover. This region is the main staging ground for units approaching the bridge from the south.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill",
          "Thicket"
        ],
        "fromX": 3,
        "fromY": 9,
        "toX": 12,
        "toY": 15
      },
      {
        "name": "Western Mountain and Cliff Barrier",
        "description": "Impassable mountains and cliffs forming a natural barrier along the western edge. The southern part transitions into sea, further restricting movement.",
        "terrainTypes": [
          "Mountain",
          "Cliff",
          "Sea"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 2,
        "toY": 17
      },
      {
        "name": "Eastern Mountain Wall",
        "description": "A continuous wall of mountains and cliffs on the eastern edge, preventing passage and funneling movement toward the central bridge.",
        "terrainTypes": [
          "Mountain",
          "Cliff"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 16,
        "toY": 17
      }
    ],
    "keyPointsOfInterest": [
      "Central Bridge at (8,8)",
      "Dense forests north and south of the river",
      "Hills providing high ground near (6,1) and (4,15)"
    ],
    "chokePoints": [
      "Central Bridge at (8,8)",
      "Narrow riverbanks at (7,8) and (9,8)"
    ],
    "strategicConsiderations": [
      "The central bridge is the only direct crossing, making it a prime target for defense or ambush.",
      "Forests and thickets on both sides of the river provide cover for ranged units and ambushers.",
      "Mountains and cliffs on the map edges restrict flanking, forcing most movement through the central area.",
      "Hills offer defensive bonuses and vision, especially near the approaches to the bridge.",
      "Controlling the bridge allows rapid reinforcement between north and south, while losing it can split forces."
    ],
    "givenName": "Mountain Pass Crossing",
    "originalName": "CaravanPath",
    "description": "A rugged outdoor map featuring a central river crossing surrounded by mountains and forests. The terrain is challenging, with strategic points for ambushes and defense.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central Fortified Village",
        "description": "A walled central village with defensive structures, including a 3x3 village block and surrounding walls. Acts as the main stronghold and is a key defensive and strategic point for both offense and defense.",
        "terrainTypes": [
          "Wall",
          "Village",
          "Plain"
        ],
        "fromX": 4,
        "fromY": 3,
        "toX": 9,
        "toY": 7
      },
      {
        "name": "Northern Mountain Barrier",
        "description": "A continuous stretch of impassable mountains forming a natural barrier along the northern edge of the map, restricting movement and funneling units toward the central pass.",
        "terrainTypes": [
          "Mountain"
        ],
        "fromX": 5,
        "fromY": 0,
        "toX": 17,
        "toY": 4
      },
      {
        "name": "Western Plains and Forts",
        "description": "A broad area of open plains with scattered forests, hills, and several forts and houses. Provides mobility and multiple approach vectors toward the central village.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort",
          "Hill",
          "House"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 4,
        "toY": 13
      },
      {
        "name": "Eastern Mountain Villages",
        "description": "A region of villages, houses, and forts nestled among the mountains and forests on the eastern side. Offers resources and defensive positions, with limited access due to surrounding mountains.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Village",
          "House",
          "Fort",
          "Hill"
        ],
        "fromX": 10,
        "fromY": 5,
        "toX": 17,
        "toY": 13
      },
      {
        "name": "Southern Forested Pass",
        "description": "A forested and hilly southern pass, providing concealment and alternate routes for flanking or retreat. The thicket and hills slow movement and offer defensive bonuses.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill",
          "Thicket"
        ],
        "fromX": 7,
        "fromY": 14,
        "toX": 17,
        "toY": 18
      }
    ],
    "keyPointsOfInterest": [
      "Central Village (5,5)",
      "Eastern Village (8,7)",
      "Forts at (3,0), (0,3), (13,10), (10,13)",
      "Houses at (3,7), (10,9), (6,10), (10,9)",
      "Dense Forest/Thicket at (8,17)"
    ],
    "chokePoints": [
      "Village wall entrances at (4,5), (7,5), (7,6), (7,7)",
      "Mountain pass at (4,6)-(6,6)",
      "Narrow forested southern pass at (7,16)-(9,17)"
    ],
    "strategicConsiderations": [
      "The central fortified village is the main defensive stronghold; controlling its entrances is key to holding the map.",
      "Northern mountains prevent direct movement, forcing units through the central or southern passes.",
      "Western plains allow for rapid movement and flanking but offer less cover.",
      "Eastern villages and forts provide defensive fallback positions and resource points.",
      "The southern forested pass is ideal for ambushes and flanking but is slower to traverse due to terrain."
    ],
    "givenName": "Mountain Village Pass",
    "originalName": "BanditPass",
    "description": "A rugged mountain pass with scattered villages and a central fortified town, surrounded by dense forests and steep cliffs.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central Oasis Lake",
        "description": "A large, continuous body of water at the center of the map, forming a natural barrier and limiting movement. Only fliers or units with special movement can cross directly.",
        "terrainTypes": [
          "Lake"
        ],
        "fromX": 7,
        "fromY": 2,
        "toX": 12,
        "toY": 4
      },
      {
        "name": "Northern Desert Plains",
        "description": "Expansive open plains with a fort and some forest cover, ideal for cavalry and fast movement. Provides access to the central oasis from the north.",
        "terrainTypes": [
          "Plain",
          "Fort",
          "Forest"
        ],
        "fromX": 1,
        "fromY": 0,
        "toX": 18,
        "toY": 3
      },
      {
        "name": "Western Village Compound",
        "description": "A walled village area on the west side of the oasis, offering defensive positions and a key objective.",
        "terrainTypes": [
          "Plain",
          "Village",
          "Wall"
        ],
        "fromX": 13,
        "fromY": 2,
        "toX": 15,
        "toY": 4
      },
      {
        "name": "Eastern Village Compound",
        "description": "A walled village area on the east side of the oasis, mirroring the western village and providing another strategic stronghold.",
        "terrainTypes": [
          "Plain",
          "Village",
          "Wall"
        ],
        "fromX": 13,
        "fromY": 2,
        "toX": 15,
        "toY": 4
      },
      {
        "name": "Southwestern Desert Approach",
        "description": "A broad area of open desert with scattered forests and a fort, forming the main southern approach to the oasis and villages.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 18,
        "toY": 14
      },
      {
        "name": "Southeastern Desert Approach",
        "description": "The southeastern expanse of desert, with a fort and some forest, providing a flanking route to the central oasis and villages.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 6,
        "fromY": 5,
        "toX": 24,
        "toY": 14
      }
    ],
    "keyPointsOfInterest": [
      "Central Oasis Lake (7,2)-(12,4)",
      "Western Village (14,4)",
      "Eastern Village (14,4)",
      "Forts at (2,2), (8,11), (21,7)",
      "Armories at (16,5), (16,5)",
      "Forest patches at (2,6), (8,9), (10,12), (23,5)"
    ],
    "chokePoints": [
      "Narrow land bridges north and south of the oasis lake",
      "Village walls at (13,2)-(15,4)",
      "Cliff corridors at (7,5)-(9,7) and (15,8)-(16,10)"
    ],
    "strategicConsiderations": [
      "The central oasis lake divides the map, forcing most units to take the north or south land bridges.",
      "Villages on either side of the oasis are highly defensible and key objectives.",
      "Forts and forests provide defensive bonuses and should be used to anchor lines or ambush.",
      "Cliffs and walls create natural funnels, making certain approaches predictable and easier to defend.",
      "Armories offer resupply and should be secured early.",
      "Cavalry and fliers have an advantage in the open desert, but movement is restricted by cliffs and the central lake."
    ],
    "givenName": "Desert Oasis Clash",
    "originalName": "RetreatDesert",
    "description": "A desert map featuring a central oasis surrounded by sand dunes and scattered structures.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northwestern Plains and Village",
        "description": "A broad stretch of plains with scattered houses and a forest edge, ideal for cavalry movement and initial deployment. Provides access to the vendor and central pass.",
        "terrainTypes": [
          "Plain",
          "House",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 10,
        "toY": 1
      },
      {
        "name": "Central Vendor Outpost",
        "description": "A small outpost centered around a vendor, surrounded by plains. Acts as a supply point and a minor choke between the northern and southern regions.",
        "terrainTypes": [
          "Plain",
          "Vendor"
        ],
        "fromX": 3,
        "fromY": 2,
        "toX": 8,
        "toY": 2
      },
      {
        "name": "Northeastern Cliffside and Village",
        "description": "A narrow area bordered by cliffs, with a house and open plains. Difficult to access except from the west, making it defensible.",
        "terrainTypes": [
          "Plain",
          "House",
          "Cliff"
        ],
        "fromX": 11,
        "fromY": 0,
        "toX": 14,
        "toY": 2
      },
      {
        "name": "Central Mountain Pass",
        "description": "A winding pass through the mountains, connecting north and south. Movement is restricted by mountains, creating natural choke points.",
        "terrainTypes": [
          "Plain",
          "Mountain"
        ],
        "fromX": 3,
        "fromY": 3,
        "toX": 10,
        "toY": 7
      },
      {
        "name": "Eastern Central Plains",
        "description": "A small open area east of the main pass, bordered by mountains. Provides a flanking route for agile units.",
        "terrainTypes": [
          "Plain",
          "Mountain"
        ],
        "fromX": 11,
        "fromY": 3,
        "toX": 14,
        "toY": 7
      },
      {
        "name": "Southern Plains and Village",
        "description": "A large southern plain with a house and forest patches, suitable for regrouping or launching attacks northward. Contains a house at (8,14).",
        "terrainTypes": [
          "Plain",
          "House",
          "Forest"
        ],
        "fromX": 7,
        "fromY": 8,
        "toX": 14,
        "toY": 14
      }
    ],
    "keyPointsOfInterest": [
      "Vendor at (6,2)",
      "House at (0,1)",
      "House at (8,1)",
      "House at (0,5)",
      "House at (8,14)"
    ],
    "chokePoints": [
      "Mountain pass between (5,3)-(7,7)",
      "Narrow entry to northeastern cliffside at (11,2)-(13,2)",
      "Southern entry to plains at (7,8)-(10,8)"
    ],
    "strategicConsiderations": [
      "The central mountain pass is the main route between north and south, making it a key defensive position.",
      "The vendor outpost is a valuable supply point and may attract both sides early.",
      "The northeastern cliffside is difficult to assault and can be used to anchor a flank.",
      "Southern plains offer mobility but are exposed to attacks from the mountain pass.",
      "Houses provide vision and minor defensive bonuses; controlling them can be advantageous.",
      "Movement is heavily restricted by mountains and cliffs, so flying units have a significant advantage."
    ],
    "givenName": "Mountain Pass Ambush",
    "originalName": "Mountains",
    "description": "A rugged mountain pass with strategic villages and a vendor, ideal for ambushes and tactical maneuvers.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Fortress Town",
        "description": "A fortified town with multiple buildings including houses, a vendor, an armory, a village, and a fort. The area is mostly plains with some forests for cover. It is enclosed to the east by a wall and to the south by a wall, with a village entrance at (2,8).",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Vendor",
          "Armory",
          "Village",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 10,
        "toY": 12
      },
      {
        "name": "Eastern Fortress Town",
        "description": "A fortified town on the eastern side, containing houses, a village, and a fort. The area is mostly plains with some forests and is separated from the central region by walls and sea tiles.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Village",
          "Fort"
        ],
        "fromX": 11,
        "fromY": 0,
        "toX": 14,
        "toY": 16
      },
      {
        "name": "Central Lake and Cliffs",
        "description": "A central region dominated by a large lake (sea tiles) and surrounded by cliffs, with a few forts and plains. This area acts as a natural barrier between the western and eastern towns, with limited crossing points.",
        "terrainTypes": [
          "Sea",
          "Cliff",
          "Plain",
          "Fort"
        ],
        "fromX": 6,
        "fromY": 3,
        "toX": 14,
        "toY": 11
      },
      {
        "name": "Northern Castle Approach",
        "description": "The northern approach to the castle, featuring a gate at (11,2) and walls to the east. This area is a key defensive position leading into the northern castle.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Wall",
          "Gate"
        ],
        "fromX": 4,
        "fromY": 0,
        "toX": 12,
        "toY": 2
      },
      {
        "name": "Southern Mountain Range",
        "description": "A rugged southern region with mountains, hills, and some plains and forests. Provides natural defense and limits movement, with a house at (6,14).",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Plain",
          "Forest",
          "House"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 10,
        "toY": 16
      }
    ],
    "keyPointsOfInterest": [
      "Vendor at (3,2)",
      "Armory at (3,4)",
      "Village at (2,8)",
      "Fort at (8,6)",
      "Fort at (10,8)",
      "Gate at (11,2)",
      "House at (5,1)",
      "House at (0,11)",
      "House at (6,14)",
      "Village at (11,14)"
    ],
    "chokePoints": [
      "Gate at (11,2)",
      "Walls at (1,6)-(3,7)",
      "Cliffs and sea tiles between central and eastern regions",
      "Village entrance at (2,8)"
    ],
    "strategicConsiderations": [
      "The central lake and cliffs create a strong natural barrier, forcing movement through limited passes.",
      "The gate at (11,2) is a critical defensive choke point for the northern castle approach.",
      "Both fortress towns are well-defended by walls and natural terrain, making direct assaults difficult.",
      "The southern mountain range restricts movement and can be used to funnel enemy units.",
      "Forts and villages provide healing and defensive bonuses, making them valuable for holding key positions.",
      "Sea and cliff tiles limit the mobility of non-flying units, emphasizing the importance of controlling bridges and passes."
    ],
    "givenName": "Twin Fortresses",
    "originalName": "Knights_Villagers_Bandits_12_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic map featuring two fortified towns, a central lake, and a northern castle. The terrain includes forests, mountains, and a winding road connecting key locations.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Plains and Village Approach",
        "description": "A large open area with roads and plains, scattered forests, and houses. The northwest contains a house and a village, making it a key area for both movement and defense. The roads provide fast movement, while the forests and houses offer cover and healing.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "House",
          "Village"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 12,
        "toY": 17
      },
      {
        "name": "Central Lake and Bridgeway",
        "description": "A central region dominated by lakes and some sea tiles, with narrow land bridges and roads crossing the water. This area acts as a natural choke point and is critical for controlling movement between the north and south of the map.",
        "terrainTypes": [
          "Lake",
          "Sea",
          "Plain",
          "Road",
          "Floor"
        ],
        "fromX": 3,
        "fromY": 3,
        "toX": 15,
        "toY": 6
      },
      {
        "name": "Eastern Village and Farmlands",
        "description": "A region with open plains, roads, and several houses and a village. The eastern edge is a key defensive position, with access to a village and multiple approach routes.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "House",
          "Village"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 19,
        "toY": 17
      },
      {
        "name": "Southern Road Network",
        "description": "A dense network of roads connecting the western, central, and eastern parts of the map. Contains houses, villages, and forests, making it a vital area for reinforcements and rapid movement.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest",
          "House",
          "Village"
        ],
        "fromX": 0,
        "fromY": 12,
        "toX": 19,
        "toY": 24
      },
      {
        "name": "Southwestern Lake and Coastal Outskirts",
        "description": "A region of lakes and sea tiles with some plains and floor tiles, forming the southwestern edge of the map. This area is less traversable but can be used for flanking or as a defensive fallback.",
        "terrainTypes": [
          "Lake",
          "Sea",
          "Plain",
          "Floor"
        ],
        "fromX": 0,
        "fromY": 18,
        "toX": 12,
        "toY": 20
      },
      {
        "name": "Southeastern Lake and Coastal Outskirts",
        "description": "A region of lakes and sea tiles with some plains and floor tiles, forming the southeastern edge of the map. Like the southwest, it is less traversable but can be used for flanking or as a defensive fallback.",
        "terrainTypes": [
          "Lake",
          "Sea",
          "Plain",
          "Floor"
        ],
        "fromX": 13,
        "fromY": 18,
        "toX": 19,
        "toY": 20
      }
    ],
    "keyPointsOfInterest": [
      "Village at (12,16)",
      "Village at (18,6)",
      "House at (1,12)",
      "House at (3,16)",
      "House at (19,13)"
    ],
    "chokePoints": [
      "Central bridgeways over lakes between (4,4)-(5,6) and (14,4)-(15,6)",
      "Narrow road at (7,14)-(8,14)",
      "Roads through wall gaps at (10,10)-(11,10) and (11,11)-(12,11)"
    ],
    "strategicConsiderations": [
      "Controlling the central bridgeways is vital for restricting enemy movement between north and south.",
      "Villages and houses provide healing and defensive bonuses; securing them early is advantageous.",
      "The southern road network allows for rapid reinforcement and flanking maneuvers.",
      "The lakes and sea tiles create natural barriers, funneling movement into predictable paths.",
      "Forests and houses offer cover for ambushes or defensive stands."
    ],
    "givenName": "Bridgeway Village",
    "originalName": "BacrunCity",
    "description": "A strategic map featuring multiple villages connected by bridges over a river, with defensive terrain and narrow pathways.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Forest Approach",
        "description": "A wooded and open area forming the western approach to the village, providing cover and multiple entry points for attackers. The road leads directly into the village's main square.",
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
        "name": "Central Village Square",
        "description": "The heart of the village, containing the main vendor, armory, and open gathering spaces. This area is highly accessible and serves as the main crossroads for movement between all other regions.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Vendor",
          "Armory",
          "Forest"
        ],
        "fromX": 11,
        "fromY": 0,
        "toX": 18,
        "toY": 16
      },
      {
        "name": "Northern Village Residences",
        "description": "A cluster of village homes and roads in the north, separated from the main square by walls. Accessible via the central square and provides defensive positions for villagers.",
        "terrainTypes": [
          "Village",
          "Plain",
          "Road",
          "Forest"
        ],
        "fromX": 12,
        "fromY": 1,
        "toX": 17,
        "toY": 3
      },
      {
        "name": "Eastern Coastal Outskirts",
        "description": "The eastern edge of the map, featuring coastal terrain, bridges, and a dock area. This region is critical for controlling access to the sea and is separated from the main village by walls and water.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Sea",
          "Lake",
          "Bridge",
          "Floor",
          "Barrel"
        ],
        "fromX": 19,
        "fromY": 0,
        "toX": 24,
        "toY": 22
      },
      {
        "name": "Southern Market and Ruins",
        "description": "A bustling southern area with market stalls, ruins, and additional village buildings. The region is partially enclosed by walls and features several points of interest, including a vendor and ruins for cover.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Ruins",
          "Village",
          "Vendor",
          "Forest"
        ],
        "fromX": 6,
        "fromY": 6,
        "toX": 18,
        "toY": 22
      }
    ],
    "keyPointsOfInterest": [
      "Vendor at (17,12)",
      "Armory at (1,14)",
      "Village at (16,1)",
      "Village at (12,8)",
      "Village at (2,11)",
      "Village at (9,13)",
      "Village at (16,17)",
      "House at (10,18)",
      "Bridges at (20,16), (21,16), (22,16), (20,17), (21,17), (22,17)",
      "Barrel at (23,14), (23,22)",
      "Stairs at (3,20), (4,20), (13,22), (14,22)"
    ],
    "chokePoints": [
      "Narrow road between walls at (12,2)-(17,2)",
      "Bridge cluster at (20,16)-(22,17)",
      "Wall-enclosed market entrance at (12,12)-(13,12)",
      "Ruins corridor at (7,7)-(8,8)",
      "Village gate at (16,1)"
    ],
    "strategicConsiderations": [
      "The Western Forest Approach offers cover for attackers but is open to flanking from the central square.",
      "The Central Village Square is highly exposed and must be defended from multiple directions; control of this area is key to holding the village.",
      "Northern Village Residences provide defensive positions and are somewhat isolated, making them vulnerable to being cut off.",
      "Eastern Coastal Outskirts are critical for controlling reinforcements from the sea and can be used for flanking maneuvers via the bridges.",
      "Southern Market and Ruins offer both cover and valuable resources, but the ruins create narrow corridors that can be used for ambushes or defense.",
      "Choke points at bridges and wall gaps should be held to prevent enemy breakthroughs.",
      "Vendors and armories are valuable for resupply and should be protected."
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
        "description": "A large, open hall with pillars and multiple staircases, forming the main entry and congregation area of the aqueduct. It is well-suited for large-scale battles and offers multiple access points to other regions.",
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
        "description": "A long, western corridor with pillars and some open plain tiles, providing a flanking route along the left side of the map. It connects to the Grand Northern Hall and the Southern Bridge.",
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
        "name": "Central Aqueduct Walkway",
        "description": "The main central region of the map, running north-south and featuring a mix of floor, pillars, and plain tiles. This area is the primary thoroughfare and is bordered by walls and waterways to the south.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Plain",
          "Stairs"
        ],
        "fromX": 8,
        "fromY": 7,
        "toX": 24,
        "toY": 15
      },
      {
        "name": "Eastern Hall and Gallery",
        "description": "A series of eastern rooms and corridors, including pillars and stairs, providing access to the far right side of the map. It is separated from the central walkway by walls and is accessible via narrow passages.",
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
        "description": "A prominent bridge spanning the southern waterway, connecting the central aqueduct to the southernmost platforms. This is a key chokepoint for movement between the north and south.",
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
        "description": "A small, isolated platform south of the main bridge, only accessible via the Southern Bridge. It is a potential defensive position or escape route.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 15,
        "fromY": 17,
        "toX": 16,
        "toY": 19
      },
      {
        "name": "Eastern Lower Platform",
        "description": "A lower platform in the southeast, accessible by stairs and bordered by water. It is separated from the rest of the map by walls and water, making it a defensible area.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 13,
        "fromY": 20,
        "toX": 16,
        "toY": 25
      },
      {
        "name": "Far Eastern Passage",
        "description": "A long, narrow passage running along the far eastern edge of the map, with multiple pillars and stairs. It connects the lower eastern platform to the upper eastern gallery.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 17,
        "fromY": 20,
        "toX": 31,
        "toY": 25
      }
    ],
    "keyPointsOfInterest": [
      "Multiple staircases throughout the map (e.g., 24,1; 13,2; 24,2; 20,10; 20,11; 22,11; 20,12; 11,24; 12,24; 11,25; 12,25; 16,22; 18,22)",
      "Bridges at (15,16) and (16,16)",
      "Numerous pillars for cover (e.g., 4,0; 8,0; 18,2; 21,5; 18,8; 12,10; 2,12; 6,12; 19,24; 15,25; 23,25)",
      "Transition from floor to water/sea/lake in the south (e.g., 14,16; 17,16; 25,12-31,13)",
      "Plain tiles interspersed in central and western regions"
    ],
    "chokePoints": [
      "Southern Bridge (15,16)-(16,16)",
      "Narrow corridors at (7,7)-(8,7) and (24,7)-(25,7)",
      "Staircase clusters (e.g., 24,1; 24,2; 13,2; 20,10; 20,11; 22,11; 20,12; 11,24; 12,24; 11,25; 12,25; 16,22; 18,22)",
      "Entrances to Eastern Hall (25,7)-(25,15)"
    ],
    "strategicConsiderations": [
      "The Grand Northern Hall is ideal for large-scale engagements and offers multiple routes for both offense and defense.",
      "The Southern Bridge is a critical chokepoint; controlling it restricts enemy movement between the north and south.",
      "Pillars and narrow corridors provide defensive cover and can be used to funnel enemies.",
      "The lower platforms (south and east) are isolated and defensible, making them good fallback or reinforcement points.",
      "Multiple staircases allow for rapid repositioning and potential ambushes.",
      "The central aqueduct walkway is the main thoroughfare and will likely see the heaviest fighting.",
      "Water and lake tiles in the south and east restrict movement, especially for non-flying units, and create natural barriers."
    ],
    "givenName": "Ancient Aqueduct",
    "originalName": "Nobles_Evil_Doers_8_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "A complex indoor structure featuring waterways, bridges, and chambers, suggesting an ancient aqueduct system.",
    "setting": "indoor"
  }
];