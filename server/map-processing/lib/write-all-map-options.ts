import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";

export default function writeAllMapOptions(mapMetadatas: MapMetadata[]): void {
  const outputPath = getPathWithinServer("map-processing/all-map-options.ts");
  const outputContent = `import { MapMetadata } from "@/types/maps/map-metadata.ts";

  export const allMapOptions: MapMetadata[] = ${JSON.stringify(
    mapMetadatas,
    null,
    2
  )};`;

  Deno.writeTextFileSync(outputPath, outputContent);
}

if (import.meta.main) {
  writeAllMapOptions([
    {
      distinctRegions: [
        {
          name: "Western Village",
          description:
            "A quaint village located near a body of water, providing a peaceful retreat.",
          terrainTypes: ["Plain", "Wall", "Village", "Lake"],
          fromX: 0,
          fromY: 0,
          toX: 3,
          toY: 6,
        },
        {
          name: "Central Crossroads",
          description:
            "The main intersection of roads, serving as the hub of the map.",
          terrainTypes: ["Road", "Plain", "Forest"],
          fromX: 3,
          fromY: 0,
          toX: 11,
          toY: 9,
        },
        {
          name: "Eastern Castle",
          description:
            "A fortified castle, offering strategic advantage and protection.",
          terrainTypes: ["Wall", "Road", "Ruins", "Floor"],
          fromX: 11,
          fromY: 0,
          toX: 14,
          toY: 4,
        },
        {
          name: "Southern Vendor",
          description: "A small vendor area, ideal for purchasing supplies.",
          terrainTypes: ["Plain", "Road", "Armory"],
          fromX: 11,
          fromY: 5,
          toX: 14,
          toY: 9,
        },
        {
          name: "Northern Pathway",
          description:
            "A narrow path leading towards the northern edge of the map, flanked by trees.",
          terrainTypes: ["Road", "Plain", "Forest"],
          fromX: 0,
          fromY: 0,
          toX: 14,
          toY: 3,
        },
      ],
      keyPointsOfInterest: ["Village at (2,2)", "Armory at (13,7)"],
      chokePoints: [
        "Road intersection at (4,0)",
        "Narrow path between walls at (5,5)",
      ],
      strategicConsiderations: [
        "Control the Central Crossroads to dominate movement across the map.",
        "Utilize the Eastern Castle for defensive advantage.",
        "Secure the Southern Vendor for supply access.",
      ],
      givenName: "Crossroads of Commerce",
      originalName: "(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19",
      description:
        "A bustling outdoor map featuring a network of roads connecting key locations, including villages, a castle, and a vendor. The map is characterized by its strategic layout, with roads intersecting at a central point, surrounded by natural barriers like forests and water.",
      setting: "outdoor",
    },
    {
      distinctRegions: [
        {
          name: "Castle Entrance",
          description:
            "A fortified castle structure with a grand entrance, surrounded by walls and providing a defensive position.",
          terrainTypes: ["Wall", "Plain"],
          fromX: 0,
          fromY: 0,
          toX: 2,
          toY: 1,
        },
        {
          name: "Central Forest",
          description:
            "A dense forest area providing cover and strategic movement options, with a mix of plains and forests.",
          terrainTypes: ["Plain", "Forest"],
          fromX: 0,
          fromY: 2,
          toX: 6,
          toY: 9,
        },
        {
          name: "River Bridges",
          description:
            "Two wooden bridges crossing a flowing river, crucial for movement across the map and acting as chokepoints.",
          terrainTypes: ["River", "Bridge", "Plain"],
          fromX: 11,
          fromY: 2,
          toX: 12,
          toY: 5,
        },
        {
          name: "Eastern Riverbank",
          description:
            "A grassy area along the river, offering open space for maneuvering and bordered by cliffs and mountains.",
          terrainTypes: ["Plain", "River", "Cliff", "Mountain"],
          fromX: 11,
          fromY: 0,
          toX: 14,
          toY: 9,
        },
      ],
      keyPointsOfInterest: [
        "Castle at (0,0)",
        "Bridge at (11,2)",
        "Bridge at (12,5)",
      ],
      chokePoints: ["Bridge at (11,2)", "Bridge at (12,5)"],
      strategicConsiderations: [
        "The castle entrance provides a strong defensive position.",
        "The central forest offers cover and ambush opportunities.",
        "The bridges are crucial chokepoints for controlling movement across the river.",
        "The eastern riverbank allows for open maneuvering but is bordered by cliffs, limiting escape routes.",
      ],
      givenName: "Forest Crossing",
      originalName: "(7)Ch01_Diff_Tileset__by_Shin19",
      description:
        "A lush outdoor map featuring a castle, dense forests, and a river with bridges.",
      setting: "outdoor",
    },
  ]);
}

