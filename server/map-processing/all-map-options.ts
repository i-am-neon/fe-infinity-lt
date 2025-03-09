import { MapMetadata } from "@/types/maps/map-metadata.ts";

  export const allMapOptions: MapMetadata[] = [
  {
    "distinctRegions": [
      {
        "name": "Central Castle Keep",
        "description": "The heart of the fortress, containing the throne room and stairs leading to strategic positions.",
        "terrainTypes": [
          "Floor",
          "Throne",
          "Stairs"
        ],
        "fromX": 2,
        "fromY": 0,
        "toX": 8,
        "toY": 4
      },
      {
        "name": "Northern Treasure Alcove",
        "description": "A small, isolated area with valuable chests, accessible via stairs and protected by walls.",
        "terrainTypes": [
          "Road",
          "Chest",
          "Stairs"
        ],
        "fromX": 17,
        "fromY": 0,
        "toX": 20,
        "toY": 4
      },
      {
        "name": "Eastern Village Square",
        "description": "A cluster of villages and armories providing resources and strategic points for defense and resupply.",
        "terrainTypes": [
          "Village",
          "Armory",
          "Road",
          "Wall"
        ],
        "fromX": 13,
        "fromY": 10,
        "toX": 20,
        "toY": 18
      },
      {
        "name": "Western Coliseum Grounds",
        "description": "An open area featuring an arena, surrounded by forests and walls, ideal for training and combat.",
        "terrainTypes": [
          "Arena",
          "Forest",
          "Road",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 15,
        "toX": 8,
        "toY": 21
      },
      {
        "name": "Southern Pathway",
        "description": "A winding road through forests and plains, connecting the southern entrance to the central areas.",
        "terrainTypes": [
          "Road",
          "Forest",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 22,
        "toX": 20,
        "toY": 27
      },
      {
        "name": "Central Courtyard",
        "description": "A large open area with roads and plains, providing mobility and access to various strategic points.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 20,
        "toY": 14
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (5,1)",
      "Treasure Chests at (18,1) and (20,1)",
      "Armories at (14,10) and (19,11)",
      "Arena at (6,16)",
      "Villages at (15,15), (19,15), (13,18), (1,18), (13,24), (1,24), (15,21), (19,21)"
    ],
    "chokePoints": [
      "Castle Gate at (4,8) and (5,8)",
      "Door at (17,3)",
      "Narrow roads near villages and armories"
    ],
    "strategicConsiderations": [
      "Control of the Central Castle Keep is crucial for defense and command.",
      "Securing the Northern Treasure Alcove early can provide valuable resources.",
      "Eastern Village Square offers critical resupply points and should be defended or captured strategically.",
      "Western Coliseum Grounds provide an excellent training area and defensive position.",
      "Southern Pathway is vital for mobility and reinforcement, making it a key area to control or disrupt enemy movements.",
      "Central Courtyard allows rapid movement across the map, making it essential for both offensive and defensive maneuvers."
    ],
    "givenName": "Fortress Approach",
    "originalName": "Chapter7OstiasRebellion_Diff_Tileset__by_Shin19",
    "description": "A fortified area with a central castle, surrounded by villages and a coliseum, featuring strategic pathways and defensive structures.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Treasure Chamber",
        "description": "A secluded room in the northwest corner containing a valuable chest, accessible through a door.",
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
        "fromX": 5,
        "fromY": 4,
        "toX": 15,
        "toY": 6
      },
      {
        "name": "Eastern Corridor",
        "description": "A narrow corridor on the eastern side, connecting the central hall to the Guardian Statues area.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 15,
        "toY": 4
      },
      {
        "name": "Guardian Statues",
        "description": "A defensive area with statues providing cover, located in the southeastern part of the map.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 10,
        "fromY": 11,
        "toX": 17,
        "toY": 13
      },
      {
        "name": "Mossy Entrance",
        "description": "The main entrance adorned with moss-covered stones, located at the southern edge of the map.",
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
        "name": "Overgrown Hallway",
        "description": "A corridor with dense vegetation creeping through the stone tiles, connecting the central hall to the Mossy Entrance.",
        "terrainTypes": [
          "Floor"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 4,
        "toY": 10
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (2,2) in the Treasure Chamber",
      "Stairs at (2,11)-(4,11) in the Mossy Entrance"
    ],
    "chokePoints": [
      "Door at (2,0) leading into the Treasure Chamber",
      "Narrow corridors connecting the Central Pillar Hall to other regions"
    ],
    "strategicConsiderations": [
      "The Central Pillar Hall is ideal for defensive positioning due to pillars providing cover.",
      "The Treasure Chamber is isolated and can be easily defended or trapped.",
      "The Mossy Entrance serves as a critical entry point and should be secured early.",
      "Guardian Statues area provides excellent defensive cover and should be approached cautiously."
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
        "description": "A large, open room with multiple entrances, pillars for cover, and stairs providing vertical mobility.",
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
        "name": "Left Wing",
        "description": "Interconnected rooms and corridors on the left side, featuring pillars and stairs for strategic positioning.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 9
      },
      {
        "name": "Right Wing",
        "description": "Mirrored layout of the Left Wing, with similar strategic opportunities, pillars, and stairs.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Plain"
        ],
        "fromX": 20,
        "fromY": 0,
        "toX": 26,
        "toY": 9
      },
      {
        "name": "Lower Passage",
        "description": "A narrow corridor at the bottom, connecting smaller rooms and providing tactical approaches.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 26,
        "toY": 11
      },
      {
        "name": "Upper Balcony",
        "description": "Elevated area offering a vantage point over the central chamber, accessible via stairs.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 9,
        "fromY": 2,
        "toX": 18,
        "toY": 4
      }
    ],
    "keyPointsOfInterest": [
      "Stairs at (10,3), (16,6), (19,2), (25,2), (25,3), (25,4), (16,9), (16,10)",
      "Pillars scattered throughout the Central Chamber and Wings for cover"
    ],
    "chokePoints": [
      "Narrow corridors at (8,4)-(11,4), (8,5)-(11,5), (8,6)-(11,6)",
      "Doorways and narrow passages between rooms"
    ],
    "strategicConsiderations": [
      "Control of the Central Chamber is crucial for mobility and positioning.",
      "Use pillars and stairs effectively for cover and vertical advantage.",
      "Secure choke points to control enemy movement and protect vulnerable units.",
      "Flanking maneuvers through the Left and Right Wings can disrupt enemy formations."
    ],
    "givenName": "Ancient Ruins",
    "originalName": "Nobles_Evil_Doers_6_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "A complex indoor map featuring multiple rooms and corridors, with a mix of open spaces and narrow pathways.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Village",
        "description": "A small village with several buildings including a vendor, armory, and house, providing resources and shelter.",
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
        "name": "Eastern Castle Courtyard",
        "description": "A fortified area with walls and a gate, serving as a strategic stronghold.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Wall",
          "Gate"
        ],
        "fromX": 15,
        "fromY": 4,
        "toX": 17,
        "toY": 6
      },
      {
        "name": "Central Mountain Range",
        "description": "A large, impassable mountain range dominating the center of the map, creating a natural barrier.",
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
        "name": "Northern Outpost",
        "description": "A small outpost with a fort located near the top of the map, offering a vantage point and defensive advantage.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 3
      },
      {
        "name": "Southern Pathway",
        "description": "A winding path leading through the southern part of the map, connecting key areas and providing mobility.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill"
        ],
        "fromX": 6,
        "fromY": 10,
        "toX": 18,
        "toY": 11
      },
      {
        "name": "Eastern Settlement",
        "description": "A small settlement with houses and a fort, providing strategic positions and resources.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Fort"
        ],
        "fromX": 14,
        "fromY": 9,
        "toX": 18,
        "toY": 11
      }
    ],
    "keyPointsOfInterest": [
      "Western Village at (2,7)",
      "Eastern Castle Gate at (16,6)",
      "Northern Fort at (5,1)",
      "Eastern Settlement Houses at (16,9) and (5,11)",
      "Vendor at (4,9)",
      "Armory at (1,10)"
    ],
    "chokePoints": [
      "Eastern Castle Gate at (16,6)",
      "Mountain passes around central mountain range"
    ],
    "strategicConsiderations": [
      "The central mountain range significantly restricts movement, making control of the few available passes crucial.",
      "The Western Village and Eastern Castle Courtyard provide essential resources and defensive positions, making them key objectives.",
      "The Northern Outpost offers a vantage point for ranged units, ideal for controlling the northern approaches.",
      "The Southern Pathway is vital for mobility and flanking maneuvers, but its openness makes it vulnerable to ambushes.",
      "Securing the Eastern Settlement can provide additional resources and a staging area for attacks on the Eastern Castle."
    ],
    "givenName": "Mountain Pass Clash",
    "originalName": "Knights_Villagers_Bandits_4_(01_00_38_03)__by_Aura_Wolf",
    "description": "A rugged outdoor map featuring a central mountain range dividing the battlefield, with villages and a castle on either side.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Throne Room",
        "description": "A grand room with a throne, serving as the main objective area. Highly defensible with limited entry points.",
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
        "name": "Upper Treasure Vault",
        "description": "A secure area containing multiple treasure chests, accessible through a locked door.",
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
        "name": "Central Maze Corridors",
        "description": "Complex network of winding corridors connecting various rooms, providing strategic mobility and chokepoints.",
        "terrainTypes": [
          "Floor",
          "Door",
          "Wall"
        ],
        "fromX": 7,
        "fromY": 7,
        "toX": 24,
        "toY": 16
      },
      {
        "name": "Lower Treasure Room",
        "description": "A small, isolated room with treasure chests, accessible from the maze corridors.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 4,
        "fromY": 20,
        "toX": 6,
        "toY": 23
      },
      {
        "name": "Entrance Hall",
        "description": "The main entrance to the fortress, leading directly into the maze corridors. Critical for controlling access.",
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
        "name": "Southern Cliffside",
        "description": "A rugged area with cliffs and limited accessibility, providing natural defensive advantages.",
        "terrainTypes": [
          "Cliff",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 25,
        "toX": 24,
        "toY": 31
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (9,1)",
      "Upper Treasure Vault chests at (27,4), (26,6), (27,8)",
      "Lower Treasure Room chests at (5,20), (5,23)",
      "Entrance Hall stairs at (11,25), (12,25), (18,0), (19,0), (26,20)"
    ],
    "chokePoints": [
      "Doors at (24,5), (26,10), (27,14), (7,20), (8,7), (9,7)"
    ],
    "strategicConsiderations": [
      "Control of the maze corridors is crucial for mobility and defense.",
      "The throne room is highly defensible but can be isolated if corridors are lost.",
      "Treasure rooms provide valuable resources but require careful planning to secure.",
      "Entrance hall is a critical area for controlling reinforcements and retreat paths.",
      "Southern cliffside offers natural defensive positions but limited mobility."
    ],
    "givenName": "Fortress Maze",
    "originalName": "Chapter12TheTrueEnemy_Fire_tileset_Minor_Changes__by_Shin19",
    "description": "A complex indoor fortress with winding corridors and treasure rooms.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Hall",
        "description": "A large indoor area with pillars and a chest, providing cover and valuable loot.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Chest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 16,
        "toY": 4
      },
      {
        "name": "Western Barracks",
        "description": "A fortified area with stairs and multiple rooms, ideal for defensive positioning.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 11,
        "toX": 3,
        "toY": 17
      },
      {
        "name": "Eastern Armory",
        "description": "A secured room containing a chest, accessible through a door, likely storing valuable items.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Door"
        ],
        "fromX": 17,
        "fromY": 8,
        "toX": 19,
        "toY": 13
      },
      {
        "name": "Central Courtyard",
        "description": "An open area with scattered trees, roads, and plains, providing mobility and strategic positioning.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Road",
          "Hill"
        ],
        "fromX": 4,
        "fromY": 5,
        "toX": 16,
        "toY": 13
      },
      {
        "name": "Southern Gate",
        "description": "A southern area with stairs and roads, serving as an entry point and strategic chokepoint.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Stairs"
        ],
        "fromX": 4,
        "fromY": 14,
        "toX": 9,
        "toY": 17
      },
      {
        "name": "Southeast Quarters",
        "description": "A fortified indoor area with multiple pillars and stairs, suitable for defensive maneuvers.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 10,
        "fromY": 14,
        "toX": 19,
        "toY": 17
      }
    ],
    "keyPointsOfInterest": [
      "Chest in Northern Hall (1,1)",
      "Chest in Eastern Armory (19,10)",
      "Multiple stairs providing access to different regions"
    ],
    "chokePoints": [
      "Door to Eastern Armory (19,12)",
      "Stairs leading to Western Barracks and Southeast Quarters"
    ],
    "strategicConsiderations": [
      "Northern Hall provides valuable loot and cover, making it a key area to control.",
      "Central Courtyard offers high mobility but limited cover, ideal for cavalry and ranged units.",
      "Eastern Armory is a critical area due to its valuable chest, requiring careful approach through the door chokepoint.",
      "Southern Gate and stairs are crucial for controlling access to the southern regions, making them important defensive positions."
    ],
    "givenName": "Fortress Courtyard",
    "originalName": "Knights_Villagers_Bandits_10_(3C_00_CE_3E)__by_Aura_Wolf",
    "description": "A fortified outdoor area surrounded by stone structures, featuring a central open space with scattered trees and pathways leading to various entrances.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Castle Stronghold",
        "description": "A heavily fortified castle with walls, gates, and mountains providing natural defense. Ideal for defensive positioning.",
        "terrainTypes": [
          "Wall",
          "Gate",
          "Mountain",
          "Hill",
          "Plain"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 16,
        "toY": 4
      },
      {
        "name": "Central River Crossing",
        "description": "A strategic river area with multiple bridges and forts, crucial for controlling movement across the map.",
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
        "toY": 12
      },
      {
        "name": "Western Village Area",
        "description": "A small village area providing resources and shelter, surrounded by plains and forests.",
        "terrainTypes": [
          "House",
          "Plain",
          "Forest",
          "River"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 4
      },
      {
        "name": "Eastern Village Area",
        "description": "A village area on the eastern side, offering supplies and refuge, surrounded by plains and forests.",
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
        "name": "Southern Coastal Lake",
        "description": "A large body of water at the southern edge, surrounded by cliffs, plains, and sea, providing limited access points.",
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
        "description": "A bustling town with multiple buildings including an armory, vendor, and village, connected by roads and bridges.",
        "terrainTypes": [
          "Village",
          "Armory",
          "Vendor",
          "Wall",
          "Bridge",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 18,
        "toX": 12,
        "toY": 22
      },
      {
        "name": "Mountain Range",
        "description": "A rugged mountain area providing natural defense, located near the top right, impassable except for flying units.",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Cliff"
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
      "Eastern Village House at (16,18)",
      "Southwestern Town Armory at (5,20)",
      "Southwestern Town Vendor at (11,20)",
      "Southwestern Town Village at (2,20)",
      "Multiple Forts along the Central River"
    ],
    "chokePoints": [
      "Bridges at (4,3), (4,4), (9,8), (10,8), (14,11), (15,11), (8,20), (8,21)",
      "Castle Gate at (8,3)"
    ],
    "strategicConsiderations": [
      "Control of the central river bridges is crucial for mobility and defense.",
      "The Northern Castle provides a strong defensive position but can be isolated if bridges are lost.",
      "Villages and towns offer valuable resources and should be protected or captured early.",
      "The Southern Coastal Lake limits movement, making the surrounding paths critical for maneuvering.",
      "Mountain Range provides natural barriers, useful for funneling enemy movements or protecting flanks."
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
        "description": "An open area with grass and pathways, providing ample space for maneuvering and combat.",
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
        "name": "Northern Gate",
        "description": "A fortified entrance area with defensive walls, providing a strategic entry point into the fortress.",
        "terrainTypes": [
          "Wall",
          "Plain"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 14,
        "toY": 4
      },
      {
        "name": "Western Chambers",
        "description": "Indoor rooms and corridors with pillars and stairs, suitable for defensive positioning and ambushes.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 8
      },
      {
        "name": "Eastern Chambers",
        "description": "Indoor rooms and corridors with pillars and stairs, mirroring the western chambers, ideal for defensive tactics.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs",
          "Wall"
        ],
        "fromX": 14,
        "fromY": 0,
        "toX": 20,
        "toY": 8
      },
      {
        "name": "Southern Hallway",
        "description": "A long corridor with multiple rooms and stairs, connecting to the central courtyard and storage rooms.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Stairs",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 14,
        "toX": 20,
        "toY": 20
      },
      {
        "name": "Storage Rooms",
        "description": "Rooms containing chests and supplies, valuable for acquiring items and resources.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 14,
        "toX": 6,
        "toY": 18
      },
      {
        "name": "Throne Room",
        "description": "A central room containing a throne, strategically important for controlling the fortress.",
        "terrainTypes": [
          "Floor",
          "Throne",
          "Wall"
        ],
        "fromX": 9,
        "fromY": 5,
        "toX": 11,
        "toY": 7
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (10,5)",
      "Chests in Storage Rooms at (0,14), (0,16), (0,18)",
      "Multiple staircases for reinforcements and mobility"
    ],
    "chokePoints": [
      "Door at (2,16)",
      "Narrow corridors in Western and Eastern Chambers",
      "Northern Gate entrance"
    ],
    "strategicConsiderations": [
      "Control of the Central Courtyard is crucial for mobility and positioning.",
      "Defending the Northern Gate and choke points can prevent enemy advancement.",
      "Utilizing indoor chambers for ambushes and defensive stands.",
      "Securing the Storage Rooms early can provide valuable resources."
    ],
    "givenName": "Fortress Courtyard",
    "originalName": "Nobles_Evil_Doers_11_(3C_00_68_3E)__by_Aura_Wolf",
    "description": "A fortified structure with a central courtyard surrounded by walls and buildings, featuring both indoor and outdoor areas.",
    "setting": "mixed indoor and outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Village",
        "description": "A small village area with a house and a vendor, providing cover and resources.",
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
        "toX": 5,
        "toY": 4
      },
      {
        "name": "Burning Village",
        "description": "A village under attack, indicated by a building on fire, creating urgency and a potential rescue scenario.",
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
      },
      {
        "name": "Central Bridges",
        "description": "Two parallel stone bridges crossing a wide river, crucial for controlling movement across the map.",
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
        "name": "Western Riverbank",
        "description": "The western side of the river, providing access to the central bridges and strategic positioning.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "Sea"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 6,
        "toY": 15
      },
      {
        "name": "Eastern Riverbank",
        "description": "The eastern side of the river, leading to the burning village and offering strategic positioning for attacks or defense.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Wall",
          "Sea",
          "Forest"
        ],
        "fromX": 9,
        "fromY": 5,
        "toX": 18,
        "toY": 15
      }
    ],
    "keyPointsOfInterest": [
      "Northern Village at (7,1)",
      "Burning Village at (15,3)",
      "Central Bridges at (7,7)-(8,12)"
    ],
    "chokePoints": [
      "Central Bridges at (7,7)-(8,12)",
      "Narrow roads leading to villages"
    ],
    "strategicConsiderations": [
      "Control of the central bridges is crucial for mobility and map control.",
      "The burning village presents an urgent objective, potentially requiring rapid deployment.",
      "The northern village provides resources and cover, making it valuable for defensive positioning.",
      "Riverbanks offer strategic positions for ranged units to control bridge access."
    ],
    "givenName": "Twin Bridges",
    "originalName": "Knights_Villagers_Bandits_11_(0E_00_72_10)__by_Aura_Wolf",
    "description": "A strategic map featuring two parallel bridges over a wide river, with key structures on either side.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Oasis Town",
        "description": "A small town with buildings, an armory, vendor, houses, and a village near a lake, providing resources and respite from the harsh desert.",
        "terrainTypes": [
          "Plain",
          "Road",
          "House",
          "Armory",
          "Vendor",
          "Lake",
          "Bridge",
          "Village"
        ],
        "fromX": 0,
        "fromY": 8,
        "toX": 7,
        "toY": 19
      },
      {
        "name": "Desert Fort",
        "description": "A strategically positioned fortress amidst cliffs and plains, providing defensive advantages and control over the surrounding area.",
        "terrainTypes": [
          "Plain",
          "Fort",
          "Cliff"
        ],
        "fromX": 8,
        "fromY": 0,
        "toX": 14,
        "toY": 4
      },
      {
        "name": "Central Plains",
        "description": "Expansive open plains with scattered forests, offering mobility but limited defensive cover.",
        "terrainTypes": [
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 18,
        "toY": 7
      },
      {
        "name": "Eastern Cliffside Path",
        "description": "A narrow path along cliffs, providing a natural barrier and strategic chokepoints.",
        "terrainTypes": [
          "Plain",
          "Cliff"
        ],
        "fromX": 14,
        "fromY": 0,
        "toX": 18,
        "toY": 10
      },
      {
        "name": "Fortified Wall",
        "description": "A series of walls and forts protecting the town from the desert, creating defensive chokepoints.",
        "terrainTypes": [
          "Wall",
          "Fort",
          "Plain"
        ],
        "fromX": 2,
        "fromY": 0,
        "toX": 8,
        "toY": 4
      },
      {
        "name": "Southern Lake Region",
        "description": "A region dominated by lakes and bridges, providing natural barriers and limited movement paths.",
        "terrainTypes": [
          "Lake",
          "Bridge",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 9,
        "toY": 19
      },
      {
        "name": "Southeastern Cliffs",
        "description": "Cliff-dominated area with limited access, providing strong defensive positions.",
        "terrainTypes": [
          "Cliff",
          "Plain"
        ],
        "fromX": 10,
        "fromY": 10,
        "toX": 18,
        "toY": 19
      }
    ],
    "keyPointsOfInterest": [
      "Armory at (0,10)",
      "Vendor at (6,11)",
      "Village at (1,18)",
      "Multiple Forts at strategic locations"
    ],
    "chokePoints": [
      "Bridge at (3,15)-(4,15)",
      "Narrow paths along cliffs",
      "Walls and forts creating chokepoints"
    ],
    "strategicConsiderations": [
      "Control of the Desert Fort provides significant defensive advantage.",
      "Oasis Town offers resources and should be defended or captured early.",
      "Utilize cliffs and walls to funnel enemy movements and create defensive positions.",
      "Southern Lake Region restricts movement, making bridges critical chokepoints."
    ],
    "givenName": "Desert Fortress",
    "originalName": "Mages_Mercenaries_3_(42_00_43_44)__by_Aura_Wolf",
    "description": "A vast desert landscape with scattered fortresses and a small oasis town, surrounded by sand dunes and cliffs.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Homestead",
        "description": "A small cluster of buildings including a village and vendor, surrounded by open plains and forests, providing cover and strategic vantage points.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Village",
          "Vendor",
          "Road"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 14,
        "toY": 5
      },
      {
        "name": "Central Pathway",
        "description": "An open road connecting various regions, flanked by plains and occasional forests, ideal for rapid troop movements.",
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
        "name": "Southern Village",
        "description": "A small village area with houses and open spaces, suitable for defensive setups and ambushes.",
        "terrainTypes": [
          "Village",
          "House",
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 14,
        "toY": 12
      },
      {
        "name": "Western Fortifications",
        "description": "Stone walls and structures providing strong defensive positions, including a village and house for strategic control.",
        "terrainTypes": [
          "Wall",
          "Village",
          "House",
          "Road",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 6
      },
      {
        "name": "Eastern Forest",
        "description": "Dense forested area offering concealment and tactical advantages, ideal for guerrilla tactics and ambushes.",
        "terrainTypes": [
          "Forest",
          "Plain",
          "Road"
        ],
        "fromX": 7,
        "fromY": 3,
        "toX": 14,
        "toY": 10
      }
    ],
    "keyPointsOfInterest": [
      "Northern Village at (11,1)",
      "Vendor at (14,5)",
      "Southern Village at (2,10)",
      "Armory at (14,11)",
      "Houses at (8,8) and (8,8)"
    ],
    "chokePoints": [
      "Central road at (6,6)",
      "Road intersections at (5,6) and (10,6)",
      "Narrow passages near walls at (2,4) and (3,4)"
    ],
    "strategicConsiderations": [
      "Utilize the central pathway for rapid troop movements but be cautious of ambushes from adjacent forests.",
      "Secure the Western Fortifications early to establish a strong defensive position.",
      "Control the Northern Homestead and Southern Village to maintain supply lines and strategic control points.",
      "Use the Eastern Forest for stealth and ambush tactics, especially against enemy units traversing the central pathway."
    ],
    "givenName": "Village Outskirts",
    "originalName": "Knights_Villagers_Bandits_6_(0E_00_72_10)__by_Aura_Wolf",
    "description": "A rural map featuring scattered buildings, open fields, and patches of forest, ideal for strategic maneuvers.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Main Courtyard",
        "description": "Central open area with stone flooring, pillars, and multiple access points. Ideal for defensive positioning and unit mobility.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 4,
        "fromY": 0,
        "toX": 12,
        "toY": 5
      },
      {
        "name": "Western Treasure Room",
        "description": "Small room containing a chest, accessible through a door. Provides valuable loot.",
        "terrainTypes": [
          "Floor",
          "Chest"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 2,
        "toY": 2
      },
      {
        "name": "Northern Staircase Corridor",
        "description": "Corridor with stairs leading to upper levels, providing strategic access for reinforcements.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 7,
        "fromY": 1,
        "toX": 8,
        "toY": 3
      },
      {
        "name": "Eastern Staircase Corridor",
        "description": "Corridor with stairs and pillars, providing cover and access to upper levels.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar"
        ],
        "fromX": 13,
        "fromY": 4,
        "toX": 14,
        "toY": 5
      },
      {
        "name": "Southern Entrance Hall",
        "description": "Entrance area with stairs and doors, serving as the main entry point to the fortress.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Door"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 1,
        "toY": 9
      },
      {
        "name": "Southern Staircase Room",
        "description": "Room with multiple staircases, providing strategic mobility and reinforcement points.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar"
        ],
        "fromX": 7,
        "fromY": 13,
        "toX": 9,
        "toY": 13
      },
      {
        "name": "Outer Grounds",
        "description": "Open outdoor area with plains and forests, providing limited cover and mobility.",
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
      "Multiple staircases at (7,1), (8,3), (13,4), (14,5), (7,13), (8,13), (9,13)",
      "Doors at (1,3), (0,7), (1,7)"
    ],
    "chokePoints": [
      "Door at (1,3) leading to Western Treasure Room",
      "Doors at (0,7) and (1,7) controlling access to Southern Entrance Hall"
    ],
    "strategicConsiderations": [
      "Control of the Main Courtyard is crucial for mobility and defense.",
      "Securing the Western Treasure Room early can provide valuable resources.",
      "Staircases are critical for reinforcement and flanking maneuvers; controlling these points can significantly impact battle outcomes.",
      "The Southern Entrance Hall serves as a primary entry point; defending or attacking this area effectively can determine the flow of battle."
    ],
    "givenName": "Fortress Entrance",
    "originalName": "Knights_Villagers_Bandits_7_(18_00_48_1A)__by_Aura_Wolf",
    "description": "A fortified indoor area with multiple rooms and corridors, featuring a central courtyard and various staircases leading to different sections.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Village",
        "description": "A small village area with houses providing refuge and resources, surrounded by plains and forests.",
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
        "name": "Northern Forest",
        "description": "Dense forest and thicket area ideal for ambushes and defensive positioning.",
        "terrainTypes": [
          "Forest",
          "Thicket",
          "Plain"
        ],
        "fromX": 6,
        "fromY": 0,
        "toX": 18,
        "toY": 5
      },
      {
        "name": "Central Mountain Range",
        "description": "A large impassable mountain range providing a natural barrier and strategic chokepoints.",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Plain"
        ],
        "fromX": 6,
        "fromY": 7,
        "toX": 11,
        "toY": 12
      },
      {
        "name": "Eastern Fort",
        "description": "A fortified structure with walls and a gate, providing a strong defensive position.",
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
        "name": "Southern Plains",
        "description": "Open grassy plains allowing for easy movement and maneuvering of units.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 23,
        "toY": 12
      },
      {
        "name": "Ruined Outpost",
        "description": "An area with ruins providing cover and strategic interest.",
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
        "name": "Eastern Cliffs",
        "description": "A cliffside area providing elevation advantage and limited access.",
        "terrainTypes": [
          "Cliff",
          "Plain",
          "Forest"
        ],
        "fromX": 21,
        "fromY": 2,
        "toX": 23,
        "toY": 4
      }
    ],
    "keyPointsOfInterest": [
      "Western Village houses at (2,2) and (0,9)",
      "Eastern Fort gate at (21,8)",
      "Ruins at (16,10)"
    ],
    "chokePoints": [
      "Central Mountain Range passes",
      "Eastern Fort gate at (21,8)"
    ],
    "strategicConsiderations": [
      "Utilize the dense forests and thickets for ambushes and defensive positioning.",
      "Control the Eastern Fort for a strong defensive advantage.",
      "Secure the Western Village early for resources and refuge.",
      "Use the Southern Plains for rapid unit movement and flanking maneuvers.",
      "Exploit the Central Mountain Range as a natural barrier to funnel enemy movements."
    ],
    "givenName": "Mountain Pass Ambush",
    "originalName": "Mages_Mercenaries_2_(01_00_38_03)__by_Aura_Wolf",
    "description": "A rugged outdoor map featuring a mix of forests, mountains, and a central fort, ideal for strategic ambushes.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Entrance Hall",
        "description": "The main entryway with wide steps leading into the temple, featuring open spaces and scattered vegetation.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Floor",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 8,
        "toY": 3
      },
      {
        "name": "Central Chamber",
        "description": "A large, open area with decorative pillars, intricate floor patterns, and multiple staircases leading to different levels.",
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
        "name": "Left Wing Corridor",
        "description": "A narrow passageway leading to smaller rooms, partially collapsed and filled with debris.",
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
        "description": "A mirrored passageway to the left wing, leading to additional chambers and a chest room.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Chest",
          "Stairs"
        ],
        "fromX": 11,
        "fromY": 11,
        "toX": 17,
        "toY": 15
      },
      {
        "name": "Flooded Passage",
        "description": "A waterlogged area with broken tiles, overgrown plants, and scattered pillars, making movement difficult.",
        "terrainTypes": [
          "Floor",
          "Plain",
          "Pillar"
        ],
        "fromX": 5,
        "fromY": 16,
        "toX": 17,
        "toY": 20
      },
      {
        "name": "Upper Balcony",
        "description": "An elevated platform overlooking the central chamber, accessible by stairs and containing a chest.",
        "terrainTypes": [
          "Floor",
          "Chest",
          "Stairs",
          "Door"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 17,
        "toY": 4
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (12,12)",
      "Chest at (17,2)",
      "Door at (17,4)",
      "Multiple staircases providing vertical mobility"
    ],
    "chokePoints": [
      "Door at (17,4)",
      "Narrow corridors in Left and Right Wing Corridors",
      "Staircases leading to Upper Balcony"
    ],
    "strategicConsiderations": [
      "Control of the central chamber is crucial for mobility and access to other regions.",
      "The upper balcony provides a strategic vantage point for ranged units.",
      "Flooded passage restricts movement, making it ideal for defensive positioning.",
      "Securing choke points like doors and narrow corridors can significantly impact enemy movement."
    ],
    "givenName": "Ruined Temple",
    "originalName": "Nobles_Evil_Doers_5_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "An ancient, crumbling temple with multiple chambers and corridors, surrounded by water and overgrown with vegetation.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Lakeside Village",
        "description": "A peaceful village area near a lake, enclosed by walls and natural barriers, providing a safe haven and potential recruitment opportunities.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Lake",
          "Village",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 2,
        "toX": 3,
        "toY": 6
      },
      {
        "name": "Central Crossroads",
        "description": "A strategic intersection of roads connecting various key locations, crucial for controlling movement and positioning.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 3,
        "fromY": 0,
        "toX": 10,
        "toY": 9
      },
      {
        "name": "Eastern Ruins",
        "description": "Ruined structures providing defensive cover and strategic positioning, ideal for ambushes or defensive stands.",
        "terrainTypes": [
          "Ruins",
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 10,
        "fromY": 0,
        "toX": 14,
        "toY": 4
      },
      {
        "name": "Southern Armory and Cliffside",
        "description": "An armory located near cliffs, offering resupply opportunities and a defensible position against attackers.",
        "terrainTypes": [
          "Armory",
          "Road",
          "Plain",
          "Cliff"
        ],
        "fromX": 11,
        "fromY": 7,
        "toX": 14,
        "toY": 8
      },
      {
        "name": "Eastern Village",
        "description": "A small village enclosed by walls, strategically positioned along a road, providing potential resources and recruitment.",
        "terrainTypes": [
          "Village",
          "Wall",
          "Road",
          "Plain"
        ],
        "fromX": 2,
        "fromY": 6,
        "toX": 4,
        "toY": 6
      },
      {
        "name": "Southern Plains",
        "description": "Open plains with scattered forests, suitable for cavalry maneuvers and open-field engagements.",
        "terrainTypes": [
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 14,
        "toY": 9
      }
    ],
    "keyPointsOfInterest": [
      "Western Village at (2,2)",
      "Eastern Village at (3,6)",
      "Armory at (13,7)",
      "Ruins at (11,1) to (13,1)"
    ],
    "chokePoints": [
      "Road at (4,0) near the wall",
      "Road at (8,4) near walls",
      "Road at (11,7) near the armory"
    ],
    "strategicConsiderations": [
      "The Central Crossroads is crucial for controlling movement across the map. Securing this area early can dictate the flow of battle.",
      "Villages offer potential recruitment or valuable items; securing them early can provide significant advantages.",
      "The Eastern Ruins provide excellent defensive cover and can be used to stage ambushes or defensive positions.",
      "The Southern Armory near cliffs is a defensible position and a valuable resupply point, making it a strategic target for both attackers and defenders.",
      "The open plains in the south allow for rapid movement and cavalry charges, but also leave units vulnerable to ranged attacks from forest cover."
    ],
    "givenName": "Crossroads of Commerce",
    "originalName": "(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19",
    "description": "A bustling outdoor map featuring a network of roads connecting key locations, including villages, a castle, and a vendor. The map is characterized by its strategic pathways and natural barriers.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Mountain Range",
        "description": "A vast, impassable mountain range dominating the northern part of the map, providing natural barriers and limiting movement.",
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
        "name": "Western Fort Ruins",
        "description": "Ruined fortifications providing defensive positions and cover, located near the northwest.",
        "terrainTypes": [
          "Ruins",
          "Wall",
          "Forest",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 4,
        "toY": 9
      },
      {
        "name": "Central River Crossing",
        "description": "A critical bridge and river area that serves as a chokepoint, connecting the northern and southern regions.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Forest"
        ],
        "fromX": 2,
        "fromY": 10,
        "toX": 13,
        "toY": 14
      },
      {
        "name": "Eastern Village and Cliffs",
        "description": "A small village area near cliffs and sea, providing resources and strategic positioning.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Cliff",
          "Sea"
        ],
        "fromX": 16,
        "fromY": 0,
        "toX": 19,
        "toY": 8
      },
      {
        "name": "Southwestern Castle Grounds",
        "description": "A fortified castle area with walls and ruins, offering strong defensive positions in the southwest.",
        "terrainTypes": [
          "Wall",
          "Ruins",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 5,
        "toY": 19
      },
      {
        "name": "Southeastern Fort and Gate",
        "description": "A fortified area with a gate and walls, strategically positioned to control the southeastern approach.",
        "terrainTypes": [
          "Wall",
          "Gate",
          "Plain",
          "Forest",
          "Fort"
        ],
        "fromX": 15,
        "fromY": 16,
        "toX": 19,
        "toY": 19
      },
      {
        "name": "Central Plains",
        "description": "Open plains and scattered forests providing maneuverability and tactical flexibility in the central area.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill"
        ],
        "fromX": 5,
        "fromY": 6,
        "toX": 15,
        "toY": 9
      },
      {
        "name": "Southern Riverlands",
        "description": "A region dominated by rivers and forests, providing natural barriers and defensive positions.",
        "terrainTypes": [
          "River",
          "Forest",
          "Plain"
        ],
        "fromX": 6,
        "fromY": 15,
        "toX": 14,
        "toY": 19
      }
    ],
    "keyPointsOfInterest": [
      "Western Fort Ruins",
      "Eastern Village",
      "Southwestern Castle Grounds",
      "Southeastern Fort and Gate",
      "Central River Crossing"
    ],
    "chokePoints": [
      "Central River Crossing bridge",
      "Southeastern Fort Gate",
      "Mountain passes in Northern Mountain Range"
    ],
    "strategicConsiderations": [
      "Control of the Central River Crossing is crucial for mobility between northern and southern regions.",
      "The Northern Mountain Range provides natural barriers, limiting enemy movement and creating defensive opportunities.",
      "The Eastern Village and Southwestern Castle Grounds offer valuable resources and defensive positions, making them key targets for control.",
      "The Southeastern Fort and Gate serve as critical defensive positions, controlling access to the southeastern region.",
      "Utilizing the terrain effectively, especially rivers and forests, can significantly impact battle outcomes."
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
        "description": "A grand, ornate room housing the throne, central to the castle's authority and defense.",
        "terrainTypes": [
          "Floor",
          "Throne",
          "Wall"
        ],
        "fromX": 8,
        "fromY": 0,
        "toX": 16,
        "toY": 4
      },
      {
        "name": "Central Corridor",
        "description": "A wide, central passageway connecting the throne room to various chambers and the entrance hall.",
        "terrainTypes": [
          "Floor",
          "Door",
          "Wall"
        ],
        "fromX": 7,
        "fromY": 4,
        "toX": 19,
        "toY": 8
      },
      {
        "name": "Left Chambers",
        "description": "A series of rooms on the left side, suitable for strategic positioning and storage.",
        "terrainTypes": [
          "Floor",
          "Door",
          "Wall",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 6,
        "toX": 6,
        "toY": 18
      },
      {
        "name": "Right Chambers",
        "description": "Rooms on the right side mirroring the left chambers, providing additional strategic options.",
        "terrainTypes": [
          "Floor",
          "Door",
          "Wall",
          "Pillar"
        ],
        "fromX": 20,
        "fromY": 6,
        "toX": 25,
        "toY": 18
      },
      {
        "name": "Entrance Hall",
        "description": "The main entryway into the castle, leading directly into the central corridor.",
        "terrainTypes": [
          "Floor",
          "Door",
          "Wall",
          "Stairs"
        ],
        "fromX": 7,
        "fromY": 18,
        "toX": 19,
        "toY": 23
      },
      {
        "name": "Outer Courtyard",
        "description": "An open area outside the castle, providing initial positioning and maneuvering space.",
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
      "Narrow corridors between chambers and central corridor"
    ],
    "strategicConsiderations": [
      "Control of the throne room is crucial for victory; it is well-defended and centrally located.",
      "The central corridor provides rapid movement but is vulnerable to ranged attacks from adjacent chambers.",
      "Left and right chambers offer defensive positions and opportunities for ambushes.",
      "Entrance hall is a critical area for controlling reinforcements and managing unit flow.",
      "Outer courtyard allows initial positioning and flanking maneuvers but is exposed to enemy attacks."
    ],
    "givenName": "Royal Throne Hall",
    "originalName": "Chapter6TheTrapIsSprung_More_Carpet__by_Shin19",
    "description": "A grand indoor castle map featuring a central throne room surrounded by multiple chambers and corridors.",
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
        "description": "A winding corridor connecting various parts of the fortress, featuring multiple stairs and pillars for cover.",
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
        "description": "The main entrance area leading into the fortress, providing initial access and strategic positioning.",
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
        "name": "Golden Chamber",
        "description": "A distinct room with a golden floor, possibly a throne room or important area, located in the eastern part of the fortress.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 16,
        "toY": 13
      },
      {
        "name": "Southern Courtyard",
        "description": "An open outdoor area with plains and forests, providing maneuverability and cover.",
        "terrainTypes": [
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 12,
        "toX": 16,
        "toY": 13
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (3,3)",
      "Multiple stairs at various locations for reinforcement and mobility",
      "Pillars scattered throughout for defensive cover"
    ],
    "chokePoints": [
      "Door at (3,1) leading to Treasure Alcove",
      "Narrow corridors and stairs throughout the Central Corridor"
    ],
    "strategicConsiderations": [
      "Control of the Central Corridor is crucial for mobility and reinforcement.",
      "Securing the Treasure Alcove early can provide valuable resources.",
      "The Golden Chamber is likely a key objective, requiring careful approach and defense.",
      "The Entrance Hall serves as a critical staging area for initial deployment and defense.",
      "Southern Courtyard offers open terrain for flanking maneuvers and ambushes."
    ],
    "givenName": "Fortress Labyrinth",
    "originalName": "Knights_Villagers_Bandits_9_(18_00_48_1A)__by_Aura_Wolf",
    "description": "A complex indoor fortress with winding corridors and strategic choke points.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central Throne Room",
        "description": "A grand room featuring a throne, pillars, and a chest, providing strategic defensive positions.",
        "terrainTypes": [
          "Floor",
          "Throne",
          "Pillar",
          "Chest"
        ],
        "fromX": 8,
        "fromY": 4,
        "toX": 16,
        "toY": 7
      },
      {
        "name": "Left Water Chamber",
        "description": "A chamber with water channels, stairs, and a treasure chest, offering limited mobility and defensive opportunities.",
        "terrainTypes": [
          "Floor",
          "Lake",
          "Chest",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 7,
        "toY": 8
      },
      {
        "name": "Lower Waterway",
        "description": "A complex network of water channels and stone pathways, challenging for mobility but rich in strategic chokepoints.",
        "terrainTypes": [
          "Floor",
          "Lake",
          "Stairs",
          "Chest"
        ],
        "fromX": 0,
        "fromY": 20,
        "toX": 12,
        "toY": 25
      },
      {
        "name": "Right Chamber",
        "description": "A smaller chamber with intricate flooring, pillars, and water access, suitable for ambushes and defensive setups.",
        "terrainTypes": [
          "Floor",
          "Lake",
          "Pillar",
          "Stairs"
        ],
        "fromX": 4,
        "fromY": 9,
        "toX": 16,
        "toY": 13
      },
      {
        "name": "Bottom Entrance Hall",
        "description": "The main entrance area with multiple pathways and stairs leading to other chambers, crucial for controlling map access.",
        "terrainTypes": [
          "Floor",
          "Stairs",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 14,
        "toX": 16,
        "toY": 19
      },
      {
        "name": "Upper Central Corridor",
        "description": "A corridor connecting various chambers, featuring pillars and stairs, important for mobility and quick access.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 16,
        "toY": 4
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (13,5)",
      "Chests at (5,7), (1,24), and (5,24)",
      "Multiple staircases providing vertical mobility"
    ],
    "chokePoints": [
      "Narrow passages near water channels",
      "Staircases at (2,4), (3,4), (4,4), (12,9), (13,9), (14,9), (11,17), (11,18)"
    ],
    "strategicConsiderations": [
      "Control of the Central Throne Room is crucial for defensive advantage.",
      "Water channels significantly restrict movement, making them ideal for defensive setups.",
      "Staircases provide critical mobility and reinforcement routes, making their control essential.",
      "Treasure chests offer valuable resources, incentivizing control of their locations."
    ],
    "givenName": "Ancient Temple Chambers",
    "originalName": "Nobles_Evil_Doers_1_(18_00_19_1A)__by_Aura_Wolf",
    "description": "A complex indoor map featuring interconnected chambers with water channels and treasure chests.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Western Castle Courtyard",
        "description": "A fortified area with walls and a gate, providing strong defensive capabilities and control over the western side.",
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
        "name": "Northern Village Area",
        "description": "A village area with houses and resources, strategically important for gathering supplies and positioning.",
        "terrainTypes": [
          "Village",
          "House",
          "Plain",
          "Forest"
        ],
        "fromX": 4,
        "fromY": 0,
        "toX": 10,
        "toY": 2
      },
      {
        "name": "Central River Crossing",
        "description": "A critical bridge over the river, serving as the main crossing point and a potential chokepoint.",
        "terrainTypes": [
          "Bridge",
          "River",
          "Plain"
        ],
        "fromX": 5,
        "fromY": 5,
        "toX": 7,
        "toY": 7
      },
      {
        "name": "Eastern Shoreline",
        "description": "A scenic shoreline along the eastern edge, providing a natural boundary and limiting movement.",
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
        "name": "Southern Village and Market",
        "description": "A southern area with a village, armory, vendor, and houses, offering resources and strategic positioning.",
        "terrainTypes": [
          "Village",
          "Armory",
          "Vendor",
          "House",
          "Plain",
          "Forest"
        ],
        "fromX": 4,
        "fromY": 9,
        "toX": 12,
        "toY": 12
      },
      {
        "name": "Northwestern Cliffs and Forest",
        "description": "A rugged area with cliffs and forests, providing natural defensive positions and limited mobility.",
        "terrainTypes": [
          "Cliff",
          "Forest",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 3,
        "toY": 2
      }
    ],
    "keyPointsOfInterest": [
      "Western Castle Gate at (3,4)",
      "Northern Village at (10,2)",
      "Central Bridge at (6,6) and (7,6)",
      "Southern Village at (11,10)",
      "Armories and Vendors at (5,9), (5,11), and (4,11)"
    ],
    "chokePoints": [
      "Central Bridge at (6,6) and (7,6)",
      "Western Castle Gate at (3,4)"
    ],
    "strategicConsiderations": [
      "Control of the central bridge is crucial for mobility and defense.",
      "The western castle provides a strong defensive position and should be secured early.",
      "The northern and southern villages offer valuable resources and should be contested.",
      "The eastern shoreline limits movement, making it a natural boundary for defensive strategies.",
      "Utilize the cliffs and forests in the northwest for ambushes and defensive positioning."
    ],
    "givenName": "River Crossing",
    "originalName": "Knights_Villagers_Bandits_2_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic map featuring a central river with a bridge, surrounded by villages and a castle. Ideal for tactical maneuvers and defense.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Central Fortress",
        "description": "A fortified structure with a throne room and treasure chest, serving as the main defensive position.",
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
        "name": "Northern Village",
        "description": "A small village area with houses, providing potential resources or allies.",
        "terrainTypes": [
          "Village",
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 8,
        "fromY": 0,
        "toX": 12,
        "toY": 3
      },
      {
        "name": "Western Armory and Village",
        "description": "An armory and village area providing weapons, supplies, and potential allies.",
        "terrainTypes": [
          "Armory",
          "Village",
          "Road",
          "Plain",
          "Forest",
          "House"
        ],
        "fromX": 0,
        "fromY": 8,
        "toX": 4,
        "toY": 19
      },
      {
        "name": "Southern Village and Vendor",
        "description": "A village area with houses and a vendor, offering additional support or items.",
        "terrainTypes": [
          "Village",
          "Vendor",
          "Road",
          "Plain",
          "Forest",
          "House"
        ],
        "fromX": 5,
        "fromY": 16,
        "toX": 15,
        "toY": 19
      },
      {
        "name": "Eastern Pathway",
        "description": "A clear path leading towards the fortress, ideal for advancing troops.",
        "terrainTypes": [
          "Road",
          "Plain",
          "Forest"
        ],
        "fromX": 12,
        "fromY": 0,
        "toX": 15,
        "toY": 15
      },
      {
        "name": "Forest Outskirts",
        "description": "Dense forest areas providing cover and strategic ambush points.",
        "terrainTypes": [
          "Forest",
          "Plain",
          "Road"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 7,
        "toY": 7
      }
    ],
    "keyPointsOfInterest": [
      "Central Fortress with throne room and chest",
      "Northern Village",
      "Western Armory",
      "Southern Village with Vendor",
      "Eastern Pathway"
    ],
    "chokePoints": [
      "Door at (12,13) leading into the Central Fortress",
      "Door at (14,9) within the Central Fortress",
      "Narrow roads leading to the fortress from the east and west"
    ],
    "strategicConsiderations": [
      "Central Fortress is highly defensible; controlling it is crucial for victory.",
      "Villages and armory provide essential resources and should be secured early.",
      "Eastern Pathway offers a direct route to the fortress but is vulnerable to ambushes from the Forest Outskirts.",
      "Use the Forest Outskirts for ambushes and defensive positioning.",
      "Southern Village and Vendor can provide critical support items; secure them to maintain supply lines."
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
        "description": "A fortified area at the top left corner, enclosed by walls, providing a strong defensive position.",
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
        "name": "Northern Hills",
        "description": "Elevated terrain providing defensive advantages and visibility over the surrounding plains.",
        "terrainTypes": [
          "Hill",
          "Plain"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 10,
        "toY": 1
      },
      {
        "name": "Mountain Barrier",
        "description": "Impassable mountainous terrain forming a natural barrier at the top right corner.",
        "terrainTypes": [
          "Mountain"
        ],
        "fromX": 12,
        "fromY": 0,
        "toX": 14,
        "toY": 1
      },
      {
        "name": "Central Forest",
        "description": "Dense forested area providing cover and strategic movement options, ideal for ambushes and defensive maneuvers.",
        "terrainTypes": [
          "Forest",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 2,
        "toX": 7,
        "toY": 8
      },
      {
        "name": "Open Plains",
        "description": "Expansive open area suitable for cavalry charges and large-scale engagements, offering minimal cover.",
        "terrainTypes": [
          "Plain"
        ],
        "fromX": 8,
        "fromY": 2,
        "toX": 10,
        "toY": 8
      },
      {
        "name": "River Crossing",
        "description": "A river running vertically with two bridges, crucial for movement between the eastern and western sides of the map.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain"
        ],
        "fromX": 11,
        "fromY": 0,
        "toX": 13,
        "toY": 9
      },
      {
        "name": "Southern Cliffs",
        "description": "Impassable cliffs at the southern edge, limiting movement and providing natural defensive positions.",
        "terrainTypes": [
          "Cliff"
        ],
        "fromX": 10,
        "fromY": 8,
        "toX": 12,
        "toY": 9
      }
    ],
    "keyPointsOfInterest": [
      "Castle Entrance at top left corner",
      "Two bridges at (11,2) and (12,5) for river crossing",
      "Mountain barrier at top right corner",
      "Southern cliffs providing natural defense"
    ],
    "chokePoints": [
      "Bridges at (11,2) and (12,5)",
      "Narrow passages through the Central Forest"
    ],
    "strategicConsiderations": [
      "Control of the bridges is crucial for mobility and map control.",
      "The Central Forest provides excellent cover for ambushes and defensive setups.",
      "The Castle Entrance offers a strong defensive position but can be isolated if bridges are lost.",
      "Southern cliffs and mountain barriers limit movement, making positioning and control of open areas vital."
    ],
    "givenName": "Forest Crossing",
    "originalName": "(7)Ch01_Diff_Tileset__by_Shin19",
    "description": "A lush outdoor map featuring a mix of forested areas and open plains, with a river running through the right side, crossed by two bridges.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Mountain Pass",
        "description": "A narrow, mountainous region providing strategic high ground and limited mobility.",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Forest",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 19,
        "toY": 4
      },
      {
        "name": "Western Village Area",
        "description": "A small village area with houses and a fort, offering defensive positions and resources.",
        "terrainTypes": [
          "House",
          "Fort",
          "Plain",
          "Forest",
          "Mountain"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 8,
        "toY": 9
      },
      {
        "name": "Eastern Village Area",
        "description": "A village area on the eastern side, providing supplies and shelter, surrounded by mountains and cliffs.",
        "terrainTypes": [
          "House",
          "Fort",
          "Plain",
          "Forest",
          "Mountain",
          "Cliff"
        ],
        "fromX": 9,
        "fromY": 5,
        "toX": 19,
        "toY": 9
      },
      {
        "name": "Central Crossroads",
        "description": "The central intersection of paths, crucial for controlling movement and strategic positioning.",
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
        "name": "Southern Cliff Barrier",
        "description": "Steep cliffs and mountains forming a natural barrier, significantly limiting movement and providing defensive advantages.",
        "terrainTypes": [
          "Cliff",
          "Mountain",
          "Hill",
          "Forest",
          "Sea"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 19,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "Western Village Houses (1,8) and (15,8)",
      "Eastern Village House (15,8)",
      "Forts at (3,8) and (18,5)",
      "Central Crossroads"
    ],
    "chokePoints": [
      "Northern Mountain Pass",
      "Central Crossroads",
      "Southern Cliff Barrier"
    ],
    "strategicConsiderations": [
      "Control of the Central Crossroads is crucial for mobility and map control.",
      "Northern Mountain Pass provides high ground advantage but limited mobility.",
      "Villages offer resources and defensive positions, making them valuable targets.",
      "Southern cliffs and mountains create natural defensive barriers, limiting enemy approaches."
    ],
    "givenName": "Mountain Crossroads",
    "originalName": "Knights_Villagers_Bandits_5_(01_00_38_03)__by_Aura_Wolf",
    "description": "A rugged outdoor map featuring a central crossroads surrounded by mountains and villages.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Treasure Chamber",
        "description": "A secluded room in the northeast containing a valuable chest, accessible through narrow corridors.",
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
        "name": "Central Pillared Hall",
        "description": "A large central hall with decorative pillars, providing cover and strategic positioning.",
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
        "name": "Northern Corridor",
        "description": "A narrow corridor connecting the central hall to the treasure chamber, featuring a locked door.",
        "terrainTypes": [
          "Floor",
          "Door"
        ],
        "fromX": 6,
        "fromY": 2,
        "toX": 12,
        "toY": 4
      },
      {
        "name": "Western Entrance Hall",
        "description": "The main entrance area in the west, leading directly into the central hall and other passages.",
        "terrainTypes": [
          "Floor",
          "Stairs"
        ],
        "fromX": 1,
        "fromY": 1,
        "toX": 4,
        "toY": 5
      },
      {
        "name": "Southern Winding Passage",
        "description": "A complex, winding passage in the southern area, connecting multiple rooms and featuring several stairs and doors.",
        "terrainTypes": [
          "Floor",
          "Door",
          "Stairs"
        ],
        "fromX": 1,
        "fromY": 9,
        "toX": 13,
        "toY": 14
      },
      {
        "name": "Eastern Side Chambers",
        "description": "A series of smaller rooms and corridors on the eastern side, providing alternate routes and strategic positions.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Door"
        ],
        "fromX": 11,
        "fromY": 5,
        "toX": 14,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "Treasure chest at (12,2)",
      "Multiple staircases at (4,5), (7,5), (3,9), (5,13), (5,14)",
      "Locked doors at (7,4), (12,4), (4,12)"
    ],
    "chokePoints": [
      "Door at (7,4) leading to the northern corridor",
      "Door at (12,4) near the treasure chamber",
      "Door at (4,12) in the southern passage"
    ],
    "strategicConsiderations": [
      "Control of the central hall is crucial for mobility and defense.",
      "The treasure chamber is isolated and easily defensible, making it a key objective.",
      "The southern winding passage offers multiple routes for flanking and ambushes.",
      "Eastern side chambers provide alternate paths and potential ambush points."
    ],
    "givenName": "Labyrinthine Chambers",
    "originalName": "Alusq_FE8_0A009B0C_in_the_dark__by_FEU",
    "description": "A complex indoor map with winding corridors and multiple rooms, featuring a mix of open spaces and narrow passages.",
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
          "Door"
        ],
        "fromX": 0,
        "fromY": 18,
        "toX": 22,
        "toY": 23
      },
      {
        "name": "Central Courtyard",
        "description": "An open area within the fortress, surrounded by walls and narrow pathways. Ideal for defensive positioning and controlling movement.",
        "terrainTypes": [
          "Floor",
          "Plain",
          "Wall",
          "Pillar",
          "Chest",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 12,
        "toX": 22,
        "toY": 17
      },
      {
        "name": "Northern Lake",
        "description": "A large body of water providing a natural barrier to the northeast, limiting movement and creating strategic chokepoints.",
        "terrainTypes": [
          "Sea",
          "Cliff",
          "Forest"
        ],
        "fromX": 13,
        "fromY": 0,
        "toX": 22,
        "toY": 5
      },
      {
        "name": "Western Ruins",
        "description": "Crumbling structures and pathways leading to the fortress, surrounded by forest. Offers cover and ambush opportunities.",
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
        "name": "Eastern Pathway",
        "description": "A narrow path leading from the forest to the fortress, bordered by trees and thickets. Ideal for ambushes and controlled movement.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Thicket"
        ],
        "fromX": 13,
        "fromY": 6,
        "toX": 22,
        "toY": 11
      },
      {
        "name": "Southern Forest Edge",
        "description": "A forested area at the southern edge of the fortress, providing cover and strategic positioning for flanking maneuvers.",
        "terrainTypes": [
          "Forest",
          "Plain",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 6,
        "toX": 12,
        "toY": 11
      }
    ],
    "keyPointsOfInterest": [
      "Chest at (7,20)",
      "Stairs at (9,12) and (18,21)",
      "Door at (7,18)",
      "Ruins at (16,1)"
    ],
    "chokePoints": [
      "Door at (7,18)",
      "Narrow pathways around Central Courtyard",
      "Eastern Pathway bordered by thickets"
    ],
    "strategicConsiderations": [
      "Control of the Fortress Entrance is crucial for initial positioning and reinforcements.",
      "Central Courtyard provides strong defensive positions but can be vulnerable to ranged attacks from surrounding walls.",
      "Northern Lake and cliffs limit movement, making flying units valuable for mobility.",
      "Western Ruins and Eastern Pathway offer opportunities for ambushes and controlled engagements.",
      "Southern Forest Edge allows for flanking maneuvers and surprise attacks."
    ],
    "givenName": "Ruined Fortress and Lake",
    "originalName": "Nobles_Evil_Doers_7_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "A map featuring a large ruined fortress surrounded by a forest and a lake. The fortress is divided into multiple sections with narrow pathways and open courtyards. The lake to the northeast adds a natural barrier.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Mountain Castle",
        "description": "A heavily fortified castle surrounded by mountains and walls, providing excellent defensive capabilities.",
        "terrainTypes": [
          "Mountain",
          "Wall",
          "Gate",
          "Plain",
          "Forest"
        ],
        "fromX": 2,
        "fromY": 0,
        "toX": 16,
        "toY": 8
      },
      {
        "name": "Central River Crossing",
        "description": "A strategic area with multiple bridges crossing a central river, crucial for controlling movement across the map.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 12,
        "toX": 25,
        "toY": 17
      },
      {
        "name": "Eastern Riverside Village",
        "description": "A village near the river, providing resources and a strategic foothold for controlling the eastern side of the map.",
        "terrainTypes": [
          "Village",
          "Plain",
          "Forest",
          "River"
        ],
        "fromX": 26,
        "fromY": 0,
        "toX": 34,
        "toY": 9
      },
      {
        "name": "Southern Open Plains",
        "description": "Expansive plains with scattered forests and hills, ideal for flexible troop movements and positioning.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill"
        ],
        "fromX": 0,
        "fromY": 18,
        "toX": 25,
        "toY": 34
      },
      {
        "name": "Western Mountain Fort",
        "description": "A fortified area near mountains, providing a strong defensive position and control over the western approach.",
        "terrainTypes": [
          "Fort",
          "Mountain",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 8,
        "toY": 17
      },
      {
        "name": "Island Fortress",
        "description": "A strategically positioned fortress on an island in the river, accessible only by bridges, offering significant defensive advantages.",
        "terrainTypes": [
          "Fort",
          "River",
          "Bridge",
          "Plain"
        ],
        "fromX": 22,
        "fromY": 8,
        "toX": 28,
        "toY": 13
      },
      {
        "name": "Southeastern Coastal Village",
        "description": "A coastal village providing resources and strategic positioning near cliffs and the sea.",
        "terrainTypes": [
          "Village",
          "Plain",
          "Cliff",
          "Sea"
        ],
        "fromX": 26,
        "fromY": 9,
        "toX": 34,
        "toY": 18
      }
    ],
    "keyPointsOfInterest": [
      "Northern Mountain Castle Gate at (6,6)",
      "Eastern Riverside Village at (33,9)",
      "Island Fortress at (24,8)",
      "Western Mountain Fort at (8,8)",
      "Southeastern Coastal Village at (33,9)",
      "Armory at (25,4)",
      "Vendor at (26,5)"
    ],
    "chokePoints": [
      "Bridges at (23,6), (23,7), (11,16), (27,12), (27,13)",
      "Gates at (6,6), (8,25), (30,4), (28,18)"
    ],
    "strategicConsiderations": [
      "Control of the central river bridges is crucial for mobility and map dominance.",
      "The Northern Mountain Castle and Island Fortress provide strong defensive positions that can be difficult to assault directly.",
      "The open plains in the south allow for rapid troop movements but offer limited defensive cover.",
      "Villages and armories provide essential resources and should be secured early to maintain a strategic advantage.",
      "Choke points such as bridges and gates can be effectively used to control enemy movements and set up defensive ambushes."
    ],
    "givenName": "Riverland Convergence",
    "originalName": "Snakey1_FE8_01003803_Many_Castles__by_FEU",
    "description": "A map featuring a central river with multiple bridges, surrounded by castles and villages. The terrain includes mountains, forests, and open plains, providing strategic opportunities for movement and defense.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Grand Entrance",
        "description": "The main entryway into the fortress, heavily fortified with walls and stairs, providing strategic defensive positions.",
        "terrainTypes": [
          "Wall",
          "Stairs",
          "Floor"
        ],
        "fromX": 4,
        "fromY": 0,
        "toX": 11,
        "toY": 2
      },
      {
        "name": "Left Corridor",
        "description": "A narrow passageway on the left side of the fortress, featuring multiple stairs and doors, ideal for controlled movement and defense.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Door",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 3,
        "toX": 6,
        "toY": 8
      },
      {
        "name": "Right Corridor",
        "description": "A narrow passageway on the right side of the fortress, mirroring the left corridor with stairs and doors, suitable for strategic positioning.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Door",
          "Stairs"
        ],
        "fromX": 9,
        "fromY": 3,
        "toX": 15,
        "toY": 8
      },
      {
        "name": "Central Courtyard",
        "description": "An open central area within the fortress, featuring pillars and open floor space, providing access to multiple corridors and strategic points.",
        "terrainTypes": [
          "Floor",
          "Pillar"
        ],
        "fromX": 5,
        "fromY": 3,
        "toX": 10,
        "toY": 5
      },
      {
        "name": "Outer Grounds",
        "description": "Expansive grassy plains surrounding the fortress, offering open space for maneuvering and potential flanking routes.",
        "terrainTypes": [
          "Plain"
        ],
        "fromX": 0,
        "fromY": 17,
        "toX": 15,
        "toY": 18
      },
      {
        "name": "Southern Plains",
        "description": "Open plains located just outside the fortress walls, providing ample space for unit deployment and movement.",
        "terrainTypes": [
          "Plain"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 15,
        "toY": 16
      }
    ],
    "keyPointsOfInterest": [
      "Central gate at the Grand Entrance",
      "Multiple staircases providing vertical mobility",
      "Doors acting as choke points in corridors"
    ],
    "chokePoints": [
      "Doors at (7,6) and (8,6) connecting corridors to the central courtyard",
      "Doors at (3,9) and (12,9) controlling access to the southern plains"
    ],
    "strategicConsiderations": [
      "Utilize the narrow corridors and doors to control enemy movement and create defensive choke points.",
      "The central courtyard provides a strategic hub for quick access to various parts of the fortress.",
      "The outer grounds and southern plains offer opportunities for flanking and positioning ranged units effectively.",
      "Staircases can be used for rapid repositioning and surprise attacks or retreats."
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
        "toY": 4
      },
      {
        "name": "Central Plaza",
        "description": "A central open area with roads connecting various parts of the map, ideal for mobility and strategic positioning.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "Wall",
          "Village"
        ],
        "fromX": 0,
        "fromY": 5,
        "toX": 17,
        "toY": 9
      },
      {
        "name": "Eastern Homestead",
        "description": "A solitary house surrounded by open terrain and forests, providing a strategic vantage point.",
        "terrainTypes": [
          "Plain",
          "Road",
          "Forest",
          "House",
          "Wall"
        ],
        "fromX": 14,
        "fromY": 0,
        "toX": 17,
        "toY": 5
      },
      {
        "name": "Southern Fortifications",
        "description": "A fortified area with walls, stairs, and narrow passages, ideal for defensive strategies.",
        "terrainTypes": [
          "Wall",
          "Road",
          "Stairs",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 17,
        "toY": 14
      },
      {
        "name": "Western Pathway",
        "description": "A path connecting the northern village to the central plaza, featuring roads and forests for cover.",
        "terrainTypes": [
          "Road",
          "Forest",
          "Plain",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 5,
        "toY": 9
      }
    ],
    "keyPointsOfInterest": [
      "Armory at (2,2)",
      "Vendor at (16,3)",
      "Villages at (6,5), (10,8)",
      "Houses at (11,4), (2,8)"
    ],
    "chokePoints": [
      "Narrow passages near walls at (10,3)-(12,3), (10,4)-(12,4)",
      "Stairs at (6,13)-(7,13), (6,13)-(7,13), (17,13)"
    ],
    "strategicConsiderations": [
      "Control of the Northern Village provides access to valuable resources and cover.",
      "Central Plaza is crucial for mobility and connecting different map regions.",
      "Eastern Homestead offers a strategic vantage point for ranged units.",
      "Southern Fortifications are ideal for defensive setups, especially around stairs and narrow passages.",
      "Western Pathway is essential for quick movement between the northern and central areas, with forests providing cover."
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
        "description": "A grand room housing the throne, central to the map's strategic importance.",
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
        "name": "Treasure Chamber",
        "description": "A secure chamber containing a valuable chest, accessible through a locked door.",
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
        "description": "A wide, central corridor connecting various rooms and strategic points.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 11,
        "toY": 6
      },
      {
        "name": "Side Corridor",
        "description": "A narrow passageway providing alternative routes and tactical positioning.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 3,
        "toX": 5,
        "toY": 6
      },
      {
        "name": "Entrance Hall",
        "description": "The initial entry area, crucial for initial positioning and early engagements.",
        "terrainTypes": [
          "Floor",
          "Pillar",
          "Stairs"
        ],
        "fromX": 0,
        "fromY": 10,
        "toX": 13,
        "toY": 12
      }
    ],
    "keyPointsOfInterest": [
      "Throne at (15,3)",
      "Treasure Chest at (4,7)",
      "Multiple staircases at (2,11), (5,4), (9,10), (11,5), (14,7), (15,7), (16,7), (17,5)"
    ],
    "chokePoints": [
      "Door at (6,7) leading to Treasure Chamber",
      "Narrow passages in Side Corridor and near Entrance Hall"
    ],
    "strategicConsiderations": [
      "Control of the Throne Room is essential for victory; it is well-defended and difficult to breach.",
      "The Treasure Chamber offers valuable items but is guarded by a locked door, making it a risky but rewarding target.",
      "Main Corridor provides mobility and quick access to various map areas, making it crucial for controlling unit movement.",
      "Side Corridor and Entrance Hall offer alternative routes for flanking and surprise attacks, but their narrowness can lead to bottlenecks."
    ],
    "givenName": "Royal Throne Room",
    "originalName": "Knights_Villagers_Bandits_8_(18_00_19_1A)__by_Aura_Wolf",
    "description": "An ornate indoor map featuring a throne room, treasure chamber, and various corridors.",
    "setting": "indoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Castle",
        "description": "A fortified castle with walls and a gate, providing strong defensive positions and control over the northern area.",
        "terrainTypes": [
          "Wall",
          "Gate",
          "Fort",
          "Plain"
        ],
        "fromX": 3,
        "fromY": 0,
        "toX": 7,
        "toY": 2
      },
      {
        "name": "Western City",
        "description": "A bustling city area with houses, a village, and roads, offering resources and strategic positioning.",
        "terrainTypes": [
          "House",
          "Village",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 5,
        "toY": 12
      },
      {
        "name": "Eastern City",
        "description": "A vibrant city area with houses, villages, and roads, mirroring the western city and providing strategic resources.",
        "terrainTypes": [
          "House",
          "Village",
          "Plain",
          "Forest"
        ],
        "fromX": 10,
        "fromY": 8,
        "toX": 14,
        "toY": 11
      },
      {
        "name": "Central Villages",
        "description": "Scattered villages and forts providing resources and shelter, strategically located between the cities and the castle.",
        "terrainTypes": [
          "Village",
          "Fort",
          "Plain",
          "Forest"
        ],
        "fromX": 4,
        "fromY": 4,
        "toX": 10,
        "toY": 8
      },
      {
        "name": "Mountain Pass",
        "description": "A rugged mountainous area with cliffs and mountains, offering strategic high ground and limited access points.",
        "terrainTypes": [
          "Mountain",
          "Cliff",
          "Hill",
          "Forest"
        ],
        "fromX": 8,
        "fromY": 0,
        "toX": 14,
        "toY": 4
      },
      {
        "name": "Southern Pathway",
        "description": "A road leading southward, connecting the cities and providing access to other regions, with open plains and scattered forests.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill",
          "Mountain"
        ],
        "fromX": 0,
        "fromY": 13,
        "toX": 14,
        "toY": 14
      }
    ],
    "keyPointsOfInterest": [
      "Northern Castle Gate at (4,2)",
      "Western City Village at (4,11)",
      "Eastern City Village at (12,8)",
      "Central Fort at (7,4)",
      "Mountain Pass with cliffs and mountains"
    ],
    "chokePoints": [
      "Northern Castle Gate at (4,2)",
      "Mountain Pass cliffs and narrow paths",
      "Walls around Eastern and Western Cities"
    ],
    "strategicConsiderations": [
      "Northern Castle provides strong defensive positions; controlling it is crucial for map dominance.",
      "Cities offer resources and reinforcements; securing them early can provide a significant advantage.",
      "Mountain Pass offers high ground advantage but limited mobility; ideal for ranged units.",
      "Central Villages are key for maintaining supply lines and unit recovery.",
      "Southern Pathway is open and vulnerable; careful positioning and scouting are essential to avoid ambushes."
    ],
    "givenName": "Twin Cities and Castle Approach",
    "originalName": "Knights_Villagers_Bandits_1_(01_00_02_03)__by_Aura_Wolf",
    "description": "A map featuring two prominent cities connected by roads, with a central castle and surrounding villages. The terrain includes forests, mountains, and a cave entrance.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Coastal Plains",
        "description": "Open plains and forests along the northern coast, bordered by cliffs and sea. Provides limited mobility and defensive positions.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Cliff",
          "Sea"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 20,
        "toY": 4
      },
      {
        "name": "Western Village Area",
        "description": "A village and house surrounded by walls and cliffs, accessible via bridges. Important for resources and unit recruitment.",
        "terrainTypes": [
          "Village",
          "House",
          "Wall",
          "Bridge",
          "Plain",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 6,
        "toX": 4,
        "toY": 9
      },
      {
        "name": "Central Castle Grounds",
        "description": "Central area featuring a castle with walls and gates, providing strong defensive positions and strategic control.",
        "terrainTypes": [
          "Wall",
          "Gate",
          "Plain",
          "Cliff"
        ],
        "fromX": 10,
        "fromY": 11,
        "toX": 12,
        "toY": 12
      },
      {
        "name": "Eastern Village Enclave",
        "description": "A village enclosed by walls and cliffs, accessible by bridges. Key area for securing resources and strategic positioning.",
        "terrainTypes": [
          "Village",
          "Wall",
          "Bridge",
          "Plain",
          "Cliff"
        ],
        "fromX": 15,
        "fromY": 2,
        "toX": 17,
        "toY": 4
      },
      {
        "name": "Southern Plains and Fort",
        "description": "Open plains with a fort providing defensive bonuses. Important for controlling southern access routes.",
        "terrainTypes": [
          "Plain",
          "Fort",
          "Cliff",
          "Bridge"
        ],
        "fromX": 0,
        "fromY": 14,
        "toX": 20,
        "toY": 16
      },
      {
        "name": "Southeastern Merchant Area",
        "description": "Area containing an armory, vendor, and houses, providing essential supplies and equipment.",
        "terrainTypes": [
          "Armory",
          "Vendor",
          "House",
          "Plain",
          "Cliff",
          "Bridge"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 20,
        "toY": 20
      },
      {
        "name": "River Network",
        "description": "Extensive network of rivers and bridges creating natural barriers and chokepoints throughout the map.",
        "terrainTypes": [
          "Sea",
          "Bridge",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 20,
        "toY": 20
      }
    ],
    "keyPointsOfInterest": [
      "Western Village at (3,8)",
      "Eastern Village at (16,4)",
      "Central Castle Gate at (11,12)",
      "Southern Fort at (12,14)",
      "Armory at (1,16)",
      "Vendor at (2,19)",
      "House at (16,18)"
    ],
    "chokePoints": [
      "Bridges at (7,9), (15,8), (16,8), (13,16), (4,17), (4,18)",
      "Castle Gate at (11,12)"
    ],
    "strategicConsiderations": [
      "Control of bridges is crucial for mobility and defense, as they serve as natural chokepoints.",
      "Securing villages early provides valuable resources and potential unit recruitment.",
      "The central castle offers strong defensive positions and should be prioritized for control.",
      "Southern fort and merchant area provide essential supplies and equipment, making them key strategic targets.",
      "Utilize cliffs and sea as natural barriers to limit enemy movement and protect vulnerable units."
    ],
    "givenName": "Riverland Crossroads",
    "originalName": "Mages_Mercenaries_4_(01_00_02_03)__by_Aura_Wolf",
    "description": "A map featuring a network of rivers and bridges connecting various strategic points, including villages and a central castle.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Fortress Courtyard",
        "description": "An open area within the fortress walls, providing defensive positions and access to interior rooms.",
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
        "name": "Fortress Entrance",
        "description": "The main entrance to the fortress, heavily fortified with walls and stairs for strategic defense.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Stairs"
        ],
        "fromX": 9,
        "fromY": 0,
        "toX": 15,
        "toY": 7
      },
      {
        "name": "Northern Plains",
        "description": "Open plains and forests providing cover and mobility, bordered by cliffs and walls.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 8,
        "toY": 5
      },
      {
        "name": "Western Cliffside",
        "description": "A rugged area with cliffs and forests, providing natural defensive positions.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 6,
        "toX": 6,
        "toY": 9
      },
      {
        "name": "Riverside Path",
        "description": "A winding path along the river, including a bridge crossing, crucial for mobility and control.",
        "terrainTypes": [
          "Road",
          "Bridge",
          "Plain"
        ],
        "fromX": 0,
        "fromY": 6,
        "toX": 12,
        "toY": 11
      },
      {
        "name": "Southern Coastal Area",
        "description": "A coastal region with cliffs and sea, limiting movement and providing strategic chokepoints.",
        "terrainTypes": [
          "Sea",
          "Cliff",
          "Forest",
          "Plain"
        ],
        "fromX": 4,
        "fromY": 6,
        "toX": 9,
        "toY": 11
      },
      {
        "name": "Eastern Fortified Road",
        "description": "A road leading to a fort, providing strategic control and defensive advantage.",
        "terrainTypes": [
          "Road",
          "Fort",
          "Forest",
          "Plain"
        ],
        "fromX": 10,
        "fromY": 8,
        "toX": 15,
        "toY": 10
      }
    ],
    "keyPointsOfInterest": [
      "Fortress Entrance",
      "Bridge at (0,2)",
      "Stairs at (9,2) and (12,7)",
      "Fort at (12,10)"
    ],
    "chokePoints": [
      "Bridge at (0,2)",
      "Entrance stairs at (9,2)",
      "Narrow road leading to fort at (12,10)"
    ],
    "strategicConsiderations": [
      "Control of the bridge and fortress entrance is crucial for mobility and defense.",
      "The cliffs and forests provide natural defensive positions, ideal for ranged units.",
      "The fort at (12,10) offers a strong defensive position and should be prioritized for control.",
      "The riverside path is essential for quick troop movements and flanking maneuvers."
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
        "description": "A fortified area with walls and a gate, providing strong defensive positions. Contains forests and plains for tactical maneuvers.",
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
        "name": "Eastern Fortress Area",
        "description": "A heavily fortified area with walls, cliffs, and a gate. Offers strong defensive positions and limited access points.",
        "terrainTypes": [
          "Plain",
          "Cliff",
          "Wall",
          "Gate",
          "Fort"
        ],
        "fromX": 18,
        "fromY": 2,
        "toX": 23,
        "toY": 5
      },
      {
        "name": "Central River Crossing",
        "description": "A strategic river with bridges, serving as critical choke points for controlling movement across the map.",
        "terrainTypes": [
          "River",
          "Bridge",
          "Plain"
        ],
        "fromX": 8,
        "fromY": 0,
        "toX": 11,
        "toY": 6
      },
      {
        "name": "Northern Villages and Hills",
        "description": "A region with scattered forts, forests, hills, and cliffs, providing cover and strategic vantage points.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Hill",
          "Fort",
          "Cliff"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 17,
        "toY": 4
      },
      {
        "name": "Southern Coastal Plains",
        "description": "Open plains and forests near the coast, offering open movement and limited cover. Contains houses and forts for strategic control.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Sea",
          "House",
          "Fort"
        ],
        "fromX": 0,
        "fromY": 9,
        "toX": 23,
        "toY": 12
      },
      {
        "name": "Eastern Mountain Barrier",
        "description": "Impassable mountains forming a natural barrier, restricting movement and providing strategic defensive positions.",
        "terrainTypes": [
          "Mountain"
        ],
        "fromX": 18,
        "fromY": 0,
        "toX": 23,
        "toY": 1
      }
    ],
    "keyPointsOfInterest": [
      "Western Castle Gate at (2,7)",
      "Eastern Fortress Gate at (19,4)",
      "Central Bridges at (11,4) and (11,5)",
      "Forts at (6,2), (14,1), (9,5), (14,5), (23,4), (23,8), (2,10), (6,10), (10,5)",
      "Houses at (3,11) and (20,10)"
    ],
    "chokePoints": [
      "Western Castle Gate at (2,7)",
      "Eastern Fortress Gate at (19,4)",
      "Central Bridges at (11,4) and (11,5)"
    ],
    "strategicConsiderations": [
      "Control of the central bridges is crucial for mobility and map control.",
      "The Western Castle and Eastern Fortress provide strong defensive positions and should be prioritized for defense or assault.",
      "The Northern Villages and Hills offer advantageous terrain for ranged units and ambushes.",
      "Southern Coastal Plains allow for rapid movement but offer limited cover, making units vulnerable to ranged attacks.",
      "The Eastern Mountain Barrier restricts movement, funneling units through limited paths and creating natural defensive positions."
    ],
    "givenName": "River Crossing Clash",
    "originalName": "Nobles_Evil_Doers_3_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic map featuring a central river with bridges, surrounded by castles and villages. The terrain includes forests, mountains, and plains, offering diverse tactical opportunities.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Castle",
        "description": "A heavily fortified castle with defensive walls and a gate, providing strong defensive positions.",
        "terrainTypes": [
          "Wall",
          "Gate",
          "Plain",
          "Forest",
          "Cliff"
        ],
        "fromX": 10,
        "fromY": 0,
        "toX": 12,
        "toY": 2
      },
      {
        "name": "Western Fortress Town",
        "description": "A fortified town featuring an armory, vendor, and houses, providing resources and defensive positions.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "House",
          "Vendor",
          "Armory",
          "Wall"
        ],
        "fromX": 0,
        "fromY": 0,
        "toX": 6,
        "toY": 6
      },
      {
        "name": "Eastern Fortress Town",
        "description": "A fortified town with a fort and houses, strategically positioned near the sea.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Fort",
          "House",
          "Wall",
          "Sea"
        ],
        "fromX": 8,
        "fromY": 4,
        "toX": 14,
        "toY": 8
      },
      {
        "name": "Central Lake",
        "description": "A large body of water providing natural barriers and strategic chokepoints.",
        "terrainTypes": [
          "Sea",
          "Plain",
          "Fort"
        ],
        "fromX": 9,
        "fromY": 6,
        "toX": 14,
        "toY": 10
      },
      {
        "name": "Southern Mountain Pass",
        "description": "A mountainous area with hills and mountains, providing natural defensive positions and limited mobility.",
        "terrainTypes": [
          "Mountain",
          "Hill",
          "Plain",
          "Forest"
        ],
        "fromX": 0,
        "fromY": 14,
        "toX": 4,
        "toY": 16
      },
      {
        "name": "Northern Road",
        "description": "A winding road connecting the northern castle to the central areas, providing mobility and strategic access.",
        "terrainTypes": [
          "Plain",
          "Forest",
          "Cliff"
        ],
        "fromX": 7,
        "fromY": 0,
        "toX": 9,
        "toY": 5
      },
      {
        "name": "Central Forest Path",
        "description": "A forested area with paths leading through, providing cover and strategic ambush opportunities.",
        "terrainTypes": [
          "Forest",
          "Plain"
        ],
        "fromX": 4,
        "fromY": 7,
        "toX": 8,
        "toY": 12
      },
      {
        "name": "Southern Village",
        "description": "A small village located in the southern area, providing resources and strategic value.",
        "terrainTypes": [
          "Village",
          "Plain",
          "Wall"
        ],
        "fromX": 2,
        "fromY": 8,
        "toX": 3,
        "toY": 8
      },
      {
        "name": "Southeastern Village",
        "description": "A village located in the southeastern corner, providing resources and strategic value.",
        "terrainTypes": [
          "Village",
          "Plain",
          "Wall"
        ],
        "fromX": 11,
        "fromY": 14,
        "toX": 12,
        "toY": 14
      }
    ],
    "keyPointsOfInterest": [
      "Northern Castle Gate",
      "Western Fortress Town Armory and Vendor",
      "Eastern Fortress Town Fort",
      "Central Lake Forts",
      "Southern and Southeastern Villages"
    ],
    "chokePoints": [
      "Northern Castle Gate",
      "Central Lake area",
      "Mountain Pass in the south"
    ],
    "strategicConsiderations": [
      "Control of the Northern Castle provides a strong defensive position and access to the northern road.",
      "Western and Eastern Fortress Towns offer resources and defensive positions, crucial for maintaining control of the map.",
      "Central Lake area provides natural barriers and chokepoints, ideal for defensive strategies.",
      "Southern Mountain Pass limits mobility, making it a strategic area for ambushes and defensive setups.",
      "Villages provide resources and should be secured early to gain strategic advantages."
    ],
    "givenName": "Twin Fortresses",
    "originalName": "Knights_Villagers_Bandits_12_(01_00_02_03)__by_Aura_Wolf",
    "description": "A strategic map featuring two fortified towns, a central lake, and a northern castle, connected by winding roads and surrounded by forests and mountains.",
    "setting": "outdoor"
  },
  {
    "distinctRegions": [
      {
        "name": "Northern Chambers",
        "description": "A series of enclosed rooms and corridors with limited access points, providing defensive positions and strategic control.",
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
        "description": "A wide water channel running horizontally through the center of the map, acting as a natural barrier and strategic chokepoint.",
        "terrainTypes": [
          "Sea",
          "Lake",
          "Bridge"
        ],
        "fromX": 0,
        "fromY": 16,
        "toX": 31,
        "toY": 17
      },
      {
        "name": "Southern Passage",
        "description": "A narrow corridor running parallel to the central waterway, providing access to the lower sections and strategic mobility.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Stairs",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 18,
        "toX": 31,
        "toY": 25
      },
      {
        "name": "Eastern Reservoir",
        "description": "A large water-filled area with stone platforms, located at the far right of the map, providing limited access and defensive advantage.",
        "terrainTypes": [
          "Sea",
          "Lake",
          "Wall"
        ],
        "fromX": 25,
        "fromY": 12,
        "toX": 31,
        "toY": 24
      },
      {
        "name": "Western Alcoves",
        "description": "Small, enclosed spaces with limited access, located at the far left of the map, ideal for defensive positioning and ambushes.",
        "terrainTypes": [
          "Floor",
          "Wall",
          "Pillar"
        ],
        "fromX": 0,
        "fromY": 7,
        "toX": 7,
        "toY": 15
      },
      {
        "name": "Central Courtyard",
        "description": "Open area with scattered pillars and plain terrain, providing maneuverability and strategic positioning.",
        "terrainTypes": [
          "Floor",
          "Plain",
          "Pillar"
        ],
        "fromX": 8,
        "fromY": 7,
        "toX": 24,
        "toY": 15
      }
    ],
    "keyPointsOfInterest": [
      "Central Waterway bridges at (15,16) and (16,16)",
      "Multiple staircases providing vertical mobility",
      "Eastern Reservoir platforms",
      "Western Alcoves for defensive positioning"
    ],
    "chokePoints": [
      "Bridges over the Central Waterway",
      "Narrow corridors in the Northern Chambers",
      "Entrances to the Eastern Reservoir"
    ],
    "strategicConsiderations": [
      "Control of the Central Waterway bridges is crucial for mobility and defense.",
      "Northern Chambers offer strong defensive positions but limited escape routes.",
      "Eastern Reservoir provides defensive advantage but limited maneuverability.",
      "Western Alcoves are ideal for ambushes and defensive setups.",
      "Southern Passage allows for strategic flanking and quick access to other regions."
    ],
    "givenName": "Ancient Aqueduct",
    "originalName": "Nobles_Evil_Doers_8_(6C_00_A3_6E)__by_Aura_Wolf",
    "description": "A complex indoor map featuring a network of waterways and stone structures, creating a maze-like environment.",
    "setting": "indoor"
  }
];