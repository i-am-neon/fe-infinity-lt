import chunkGridIntoQuadrants from "../lib/chunk-grid-into-quadrants.ts";
import {
  ch3TerrainGrid,
  ch4TerrainGrid,
} from "@/map-processing/test-data/terrain-grid.ts";

export const MAP_METADATA_EXAMPLES = `## Examples

### Example 1: Indoor Map

Given these map quadrants:
${JSON.stringify(chunkGridIntoQuadrants(ch3TerrainGrid), null, 2)}

The distinct regions are:
[
  {
      name: "Large Northern Treasure Room",
      terrainTypes: ["Floor", "Chest"],
      fromX: 5,
      fromY: 1,
      toX: 11,
      toY: 4,
      description:
        "A spacious room with multiple chests.",
  },
  {
      name: "Throne Room",
      terrainTypes: ["Floor", "Throne"],
      fromX: 13,
      fromY: 1,
      toX: 15,
      toY: 4,
      description:
        "Small room with a throne.",
  },
  {
      name: "Central East Stairs Room",
      terrainTypes: ["Floor", "Stairs"],
      fromX: 0,
      fromY: 4,
      toX: 3,
      toY: 5,
      description:
        "A room with stairs where reinforcements can appear. Leads to a locked door to the north at (2,3).",
  },
  {
      name: "Southeast Building Entrance Courtyard",
      terrainTypes: ["Road"],
      fromX: 0,
      fromY: 8,
      toX: 3,
      toY: 14,
      description:
        "Open courtyard leading to the entrance of the building. Provides a clear path for units to move through.",
  },
  {
      name: "Central Small Room",
      terrainTypes: ["Floor", "Pillar"],
      fromX: 5,
      fromY: 7,
      toX: 7,
      toY: 9,
      description:
        "Small defensible room with a pillar in the center, leading to a small chest room to the south through a locked door at (6,10)",
  },
  {
      name: "Small South Central Treasure Room",
      terrainTypes: ["Road", "Chest"],
      fromX: 5,
      fromY: 7,
      toX: 7,
      toY: 9,
      description:
        "Small room with one chest that is south of a locked door at (6,10).",
  },
  {
      name: "Eastern Store Room",
      terrainTypes: ["Floor", "Barrel"],
      fromX: 9,
      fromY: 7,
      toX: 15,
      toY: 11,
      description:
        "Large room with barrels for cover, leading to the throne room.",
  },
  {
      name: "Outside Yard",
      terrainTypes: ["Plain"],
      fromX: 9,
      fromY: 14,
      toX: 16,
      toY: 15,
      description:
        "Small yard in front of the building.",
    },
]

### Example 2: Outdoor Wilderness Map

Given these map quadrants:
${JSON.stringify(chunkGridIntoQuadrants(ch4TerrainGrid), null, 2)}

The distinct regions are:
[
  {
      name: "Large Northeast Field and Village",
      terrainTypes: ["Plain", "Forest", "Hill", "Village, "Road"],
      fromX: 0,
      fromY: 0,
      toX: 9,
      toY: 6,
      description:
        "Large field with patches of forests and hills for cover. A village is located in the northwest corner.",
  },
  {
      name: "Northwest Cliff Side Perch",
      terrainTypes: ["Plain", "Forest", "Cliff"],
      fromX: 10,
      fromY: 0,
      toX: 14,
      toY: 4,
      description:
        "A small patch of even terrain surrounded by impassable cliffs only accessibly by fliers.",
  },
  {
      name: "Central Bridge Over River",
      terrainTypes: ["Plain", "Forest", "Road", "River", "Bridge"],
      fromX: 7,
      fromY: 6,
      toX: 10,
      toY: 9,
      description:
        "A bridge over a river that divides the map. The bridge is a chokepoint for units crossing.",
  },
  {
      name: "Small Eastern Field",
      terrainTypes: ["Plain", "Forest", "Cliff", "River"],
      fromX: 11,
      fromY: 5,
      toX: 14,
      toY: 8,
      description:
        "A small field in between the river to its south and the cliffs to its north.",
  },
  {
      name: "Southeastern Village Surrounded by River",
      terrainTypes: ["Plain", "Forest", "Road", "River", "Village"],
      fromX: 0,
      fromY: 9,
      toX: 13,
      toY: 14,
      description:
        "A village surrounded by a river, accessible by a bridge to the west.",
  },
  {
      name: "Large Southern Field",
      terrainTypes: ["Plain", "Forest", "Road", "River"],
      fromX: 6,
      fromY: 10,
      toX: 14,
      toY: 14,
      description:
        "A large field with a lot of forests, surrounded by a river. Accessible by bridges to its north and west.",
  },
]
`;

