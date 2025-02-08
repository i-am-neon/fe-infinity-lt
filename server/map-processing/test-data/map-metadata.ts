import { MapMetadata } from "@/types/maps/map-metadata.ts";

export const ch1MapMetadata: MapMetadata = {
  distinctRegions: [
    {
      name: "Northern Plains",
      terrainTypes: ["Plain", "Forest", "Fort"],
      fromX: 0,
      fromY: 0,
      toX: 9,
      toY: 2,
      description:
        "This region provides open terrain for cavalry and fast-moving units. The fort offers a defensive position.",
    },
    {
      name: "Central Lake and Cliffs",
      terrainTypes: ["Lake", "Cliff"],
      fromX: 9,
      fromY: 0,
      toX: 14,
      toY: 3,
      description:
        "The lake and surrounding cliffs create a natural barrier, limiting movement and providing defensive advantages.",
    },
    {
      name: "Western Passage",
      terrainTypes: ["Plain", "Forest", "Cliff"],
      fromX: 0,
      fromY: 3,
      toX: 5,
      toY: 6,
      description:
        "A narrow passage with forest cover, ideal for ambushes and defensive maneuvers.",
    },
    {
      name: "Southern Plains",
      terrainTypes: ["Plain", "House", "Forest"],
      fromX: 5,
      fromY: 4,
      toX: 14,
      toY: 9,
      description:
        "A large open area with houses providing strategic points for defense or item acquisition.",
    },
    {
      name: "Mountain Range",
      terrainTypes: ["Mountain", "Fort"],
      fromX: 4,
      fromY: 7,
      toX: 9,
      toY: 9,
      description:
        "A formidable barrier that restricts movement, with a fort providing a strong defensive position.",
    },
  ],
  keyPointsOfInterest: [
    "Fort at (7,2)",
    "House at (10,4)",
    "House at (13,6)",
    "Fort at (7,7)",
  ],
  chokePoints: [
    "Gate at (2,2)",
    "Narrow passage between cliffs at (5,3)",
    "Mountain pass at (4,7)",
  ],
  strategicConsiderations: [
    "The Northern Plains are ideal for fast units to maneuver and engage enemies quickly.",
    "The Central Lake and Cliffs region should be used to control enemy movement and protect flanks.",
    "The Western Passage can be used for surprise attacks or to hold off advancing enemies.",
    "The Southern Plains offer flexibility for positioning and regrouping, with houses as potential resource points.",
    "The Mountain Range is a natural defensive line, with the fort providing a stronghold for ranged units.",
  ],
  setting: "outdoor",
};

export const ch2MapMetadata: MapMetadata = {
  distinctRegions: [
    {
      name: "Northern Plains and Forest",
      terrainTypes: ["Plain", "Forest"],
      fromX: 0,
      fromY: 0,
      toX: 2,
      toY: 3,
      description:
        "A mix of plains and forests providing cover and open areas for movement.",
    },
    {
      name: "Central Mountain Range",
      terrainTypes: ["Mountain"],
      fromX: 8,
      fromY: 0,
      toX: 10,
      toY: 3,
      description: "A range of mountains acting as a natural barrier.",
    },
    {
      name: "Western Village and Surroundings",
      terrainTypes: ["Plain", "Forest", "Village"],
      fromX: 0,
      fromY: 2,
      toX: 4,
      toY: 4,
      description:
        "A village surrounded by plains and forests, offering strategic value for defense and supply.",
    },
    {
      name: "Eastern Village and Surroundings",
      terrainTypes: ["Plain", "Forest", "Village"],
      fromX: 7,
      fromY: 2,
      toX: 11,
      toY: 4,
      description:
        "A village with surrounding plains and forests, providing strategic positioning for control.",
    },
    {
      name: "Southern Plains and Armory",
      terrainTypes: ["Plain", "Forest", "Armory"],
      fromX: 0,
      fromY: 5,
      toX: 5,
      toY: 7,
      description:
        "Open plains with an armory, crucial for resupplying and reinforcing troops.",
    },
    {
      name: "Southwestern Fort and Forest",
      terrainTypes: ["Plain", "Forest", "Fort"],
      fromX: 0,
      fromY: 8,
      toX: 5,
      toY: 10,
      description:
        "A fort surrounded by forests, offering a strong defensive position.",
    },
    {
      name: "Southeastern Fort and Forest",
      terrainTypes: ["Plain", "Forest", "Fort"],
      fromX: 6,
      fromY: 8,
      toX: 10,
      toY: 10,
      description:
        "A fort with nearby forests, providing a defensible location.",
    },
    {
      name: "Central Armory and Mountain",
      terrainTypes: ["Plain", "Mountain", "Armory"],
      fromX: 5,
      fromY: 7,
      toX: 7,
      toY: 9,
      description:
        "An armory located near mountains, serving as a strategic point for supply and defense.",
    },
    {
      name: "Eastern Plains and Forest",
      terrainTypes: ["Plain", "Forest"],
      fromX: 11,
      fromY: 4,
      toX: 14,
      toY: 9,
      description:
        "Expansive plains with patches of forest, offering mobility and cover.",
    },
    {
      name: "Southern Mountain Barrier",
      terrainTypes: ["Mountain"],
      fromX: 0,
      fromY: 11,
      toX: 14,
      toY: 14,
      description: "A formidable mountain range acting as a southern boundary.",
    },
  ],
  keyPointsOfInterest: [
    "Villages at (4,2) and (7,2)",
    "Armories at (5,7) and (5,7)",
    "Forts at (10,5) and (6,10)",
  ],
  chokePoints: [
    "Mountain passes at (8,0) to (10,3)",
    "Narrow path between forests at (0,5) to (5,7)",
  ],
  strategicConsiderations: [
    "Control the villages for supply and reinforcements.",
    "Utilize the forts for strong defensive positions.",
    "Armories are crucial for maintaining troop strength.",
    "Mountains and forests provide natural barriers and cover.",
  ],
  setting: "outdoor",
};

export const ch3MapMetadata: MapMetadata = {
  distinctRegions: [
    {
      name: "Main Hall",
      terrainTypes: ["Floor", "Barrel", "Chest"],
      fromX: 1,
      fromY: 1,
      toX: 11,
      toY: 4,
      description:
        "Central area with multiple chests, providing strategic resources and a central position for defense or attack.",
    },
    {
      name: "Western Corridor",
      terrainTypes: ["Floor", "Stairs", "Road", "Pillar"],
      fromX: 0,
      fromY: 5,
      toX: 3,
      toY: 12,
      description:
        "A long corridor providing access to different parts of the map, with strategic choke points at doors and stairs.",
    },
    {
      name: "Eastern Corridor",
      terrainTypes: ["Floor", "Stairs", "Road", "Pillar"],
      fromX: 4,
      fromY: 5,
      toX: 7,
      toY: 12,
      description:
        "A parallel corridor to the Western Corridor, offering alternative routes and strategic positions.",
    },
    {
      name: "Throne Room",
      terrainTypes: ["Floor", "Throne"],
      fromX: 13,
      fromY: 1,
      toX: 15,
      toY: 3,
      description:
        "The throne room, a key objective for attackers and a critical defensive position.",
    },
    {
      name: "Southern Plains",
      terrainTypes: ["Plain", "Forest"],
      fromX: 9,
      fromY: 14,
      toX: 16,
      toY: 15,
      description:
        "Open area with plains and forest, providing mobility and cover for units.",
    },
  ],
  keyPointsOfInterest: ["Chests in Main Hall", "Throne in Throne Room"],
  chokePoints: ["Doors at (2,3) and (10,5)", "Stairs at (6,6) and (10,6)"],
  strategicConsiderations: [
    "Defend the Main Hall to control resources and central position.",
    "Use corridors for flanking maneuvers.",
    "Secure the Throne Room to prevent enemy victory.",
    "Utilize the Southern Plains for mobility and cover.",
  ],
  setting: "indoor",
};

export const ch4MapMetadata: MapMetadata = {
  distinctRegions: [
    {
      name: "Northwest Forest and Hill Area",
      terrainTypes: ["Forest", "Hill", "Plain"],
      fromX: 0,
      fromY: 0,
      toX: 6,
      toY: 7,
      description:
        "A dense forest area with hills providing cover and elevation. Ideal for ambushes and defensive positioning.",
    },
    {
      name: "Central Village and Road",
      terrainTypes: ["Village", "Road", "Plain"],
      fromX: 7,
      fromY: 0,
      toX: 9,
      toY: 6,
      description:
        "A small village surrounded by roads, providing a strategic point for supply and movement.",
    },
    {
      name: "Northeast Cliff and Forest",
      terrainTypes: ["Cliff", "Forest", "Plain"],
      fromX: 10,
      fromY: 0,
      toX: 14,
      toY: 4,
      description:
        "A cliffside area with forest cover, offering a vantage point and defensive advantage.",
    },
    {
      name: "Central River and Bridge",
      terrainTypes: ["River", "Bridge", "Plain", "Forest"],
      fromX: 3,
      fromY: 8,
      toX: 10,
      toY: 10,
      description:
        "A river crossing with a bridge, serving as a critical chokepoint for movement between the northern and southern parts of the map.",
    },
    {
      name: "Southwest Village and Road",
      terrainTypes: ["Village", "Road", "Plain", "Forest"],
      fromX: 0,
      fromY: 9,
      toX: 4,
      toY: 14,
      description:
        "A village area with roads, providing a strategic location for control and movement.",
    },
    {
      name: "Southeast Forest and Plain",
      terrainTypes: ["Forest", "Plain", "Road"],
      fromX: 5,
      fromY: 11,
      toX: 14,
      toY: 14,
      description:
        "A large open area with forest patches, suitable for maneuvering and flanking.",
    },
  ],
  keyPointsOfInterest: [
    "Village at (8,2)",
    "Village at (1,11)",
    "Bridge at (9,7)",
  ],
  chokePoints: ["Bridge at (9,7)", "River crossing at (4,9)"],
  strategicConsiderations: [
    "The bridge at (9,7) is a key chokepoint for controlling movement across the river.",
    "The villages provide strategic points for resupply and reinforcement.",
    "The cliff area in the northeast offers a defensive advantage with high ground.",
  ],
  setting: "outdoor",
};

export const ch5MapMetadata: MapMetadata = {
  distinctRegions: [
    {
      name: "Northern Plains and Roads",
      terrainTypes: ["Plain", "Road"],
      fromX: 0,
      fromY: 0,
      toX: 10,
      toY: 5,
      description:
        "A large open area with plains and roads, providing easy movement for units. The roads facilitate quick travel across the region.",
    },
    {
      name: "Central Forest and Walls",
      terrainTypes: ["Forest", "Wall"],
      fromX: 0,
      fromY: 5,
      toX: 10,
      toY: 10,
      description:
        "A dense forest area surrounded by walls, offering cover and defensive positions. The walls create natural barriers, making it a strategic point for defense.",
    },
    {
      name: "Southern Residential Area",
      terrainTypes: ["House", "Road"],
      fromX: 0,
      fromY: 10,
      toX: 10,
      toY: 15,
      description:
        "A residential area with houses and roads, providing shelter and potential resources. The roads allow for efficient movement between houses.",
    },
    {
      name: "Eastern Vendor and Stairs",
      terrainTypes: ["Vendor", "Stairs", "Road"],
      fromX: 10,
      fromY: 0,
      toX: 14,
      toY: 5,
      description:
        "An area with a vendor and stairs, offering strategic advantages for trade and elevation. The roads connect this area to the rest of the map.",
    },
    {
      name: "Southeastern Forest and Plains",
      terrainTypes: ["Forest", "Plain"],
      fromX: 10,
      fromY: 5,
      toX: 14,
      toY: 10,
      description:
        "A mix of forest and plains, providing both cover and open space for maneuvering. The forest offers defensive positions.",
    },
    {
      name: "Southwestern Wall and Road Network",
      terrainTypes: ["Wall", "Road"],
      fromX: 0,
      fromY: 15,
      toX: 10,
      toY: 20,
      description:
        "A network of walls and roads, creating a complex area for strategic movement and defense. The walls provide natural barriers.",
    },
    {
      name: "Eastern Plains and Roads",
      terrainTypes: ["Plain", "Road"],
      fromX: 10,
      fromY: 10,
      toX: 14,
      toY: 15,
      description:
        "Open plains with roads, facilitating quick movement and offering a clear path for units.",
    },
    {
      name: "Southern Forest and Plains",
      terrainTypes: ["Forest", "Plain"],
      fromX: 10,
      fromY: 15,
      toX: 14,
      toY: 20,
      description:
        "A southern area with a mix of forest and plains, providing both cover and open space for tactical maneuvers.",
    },
  ],
  keyPointsOfInterest: [
    "Vendor at (6,10)",
    "Stairs at (10,14)",
    "Stairs at (9,14)",
    "Armory at (2,1)",
    "House at (5,1)",
    "House at (5,6)",
    "House at (12,10)",
    "House at (12,19)",
  ],
  chokePoints: [
    "Walls surrounding the Central Forest",
    "Roads leading to the Vendor area",
    "Stairs at (10,14) and (9,14)",
  ],
  strategicConsiderations: [
    "Defend the Central Forest for cover and control of the area.",
    "Use the roads for quick movement across the map.",
    "Control the Vendor area for trade advantages.",
    "Utilize the stairs for elevation and strategic positioning.",
  ],
  setting: "outdoor",
};

