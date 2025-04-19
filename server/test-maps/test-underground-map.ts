import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { getDoorsForMap } from "../map-region-processing/get-doors-for-map.ts";
import { doorSprites } from "../map-region-processing/door-sprites.ts";

// Simplified map with only the base layer for initial testing
const mapData = {
    "nid": "Underground",
    "size": [15, 17],
    "autotile_fps": 29,
    "layers": [
        {
            "nid": "base",
            "visible": true,
            "foreground": false,
            "sprite_grid": {
                // Bottom door (problematic area)
                "1,6": ["1800191A", [8, 16]],
                "2,6": ["1800191A", [10, 13]],
                "1,7": ["1800191A", [2, 14]],
                "2,7": ["1800191A", [19, 24]],
                "1,8": ["1800191A", [2, 15]],
                "2,8": ["1800191A", [16, 24]],

                // Top door (detected correctly)
                "0,3": ["1800191A", [11, 13]],
                "1,3": ["1800191A", [0, 13]],
                "2,3": ["1800191A", [11, 13]],
                "0,4": ["1800191A", [18, 24]],
                "1,4": ["1800191A", [18, 24]],
                "2,4": ["1800191A", [18, 24]]
            },
            "terrain_grid": {} // truncated
        },
        {
            "nid": "Chest",
            "visible": true,
            "foreground": false,
            "sprite_grid": {
                "3,8": ["1800191A", [1, 0]]
            },
            "terrain_grid": {
                "3,8": "36"
            }
        },
        {
            "nid": "Bottom_Door",
            "visible": true,
            "foreground": false,
            "sprite_grid": {
                "1,6": ["1800191A", [8, 17]],
                "2,6": ["1800191A", [10, 13]],
                "1,7": ["1800191A", [18, 24]],
                "2,7": ["1800191A", [18, 24]],
                "1,8": ["1800191A", [11, 15]],
                "2,8": ["1800191A", [16, 24]]
            },
            "terrain_grid": {
                "1,6": "9",
                "2,6": "9",
                "1,7": "6",
                "2,7": "6",
                "1,8": "9",
                "2,8": "6"
            }
        },
        {
            "nid": "Top_Door",
            "visible": true,
            "foreground": false,
            "sprite_grid": {
                "0,3": ["1800191A", [13, 13]],
                "1,3": ["1800191A", [16, 24]],
                "2,3": ["1800191A", [12, 13]],
                "0,4": ["1800191A", [18, 24]],
                "1,4": ["1800191A", [17, 24]],
                "2,4": ["1800191A", [18, 24]]
            },
            "terrain_grid": {
                "0,3": "9",
                "1,3": "6",
                "2,3": "9",
                "0,4": "6",
                "1,4": "6",
                "2,4": "6"
            }
        }
    ],
    "tilesets": ["1800191A"]
};

// Debug function to check if sprites match door sprites
function checkDoorSpriteMatches() {
    console.log("Door sprites for tileset 1A:", JSON.stringify(doorSprites["1A"], null, 2));

    // Check bottom door area sprite coordinates
    const bottomDoorSprites = [
        { coord: "1,6", sprite: [8, 16] },
        { coord: "2,6", sprite: [10, 13] },
        { coord: "1,7", sprite: [2, 14] },
        { coord: "2,7", sprite: [19, 24] },
        { coord: "1,8", sprite: [2, 15] },
        { coord: "2,8", sprite: [16, 24] }
    ];

    // Check top door area sprite coordinates
    const topDoorSprites = [
        { coord: "0,3", sprite: [11, 13] },
        { coord: "1,3", sprite: [0, 13] },
        { coord: "2,3", sprite: [11, 13] },
        { coord: "0,4", sprite: [18, 24] },
        { coord: "1,4", sprite: [18, 24] },
        { coord: "2,4", sprite: [18, 24] }
    ];

    console.log("\nChecking Bottom Door sprites:");
    bottomDoorSprites.forEach(item => {
        const [x, y] = item.sprite;
        const matches = doorSprites["1A"].some(ds => ds.x === x && ds.y === y);
        console.log(`Coord ${item.coord} with sprite [${x}, ${y}] matches door sprite: ${matches}`);
    });

    console.log("\nChecking Top Door sprites:");
    topDoorSprites.forEach(item => {
        const [x, y] = item.sprite;
        const matches = doorSprites["1A"].some(ds => ds.x === x && ds.y === y);
        console.log(`Coord ${item.coord} with sprite [${x}, ${y}] matches door sprite: ${matches}`);
    });
}

async function runTest() {
    // First check sprite matches
    checkDoorSpriteMatches();

    // Then run the actual test with the map file
    const tempDir = await Deno.makeTempDir();
    const tempFilePath = join(tempDir, "Underground.json");
    await Deno.writeTextFile(tempFilePath, JSON.stringify(mapData, null, 2));

    try {
        console.log("\nTesting map with path:", tempFilePath);
        const doors = getDoorsForMap(tempFilePath);
        console.log("Found doors:", JSON.stringify(doors, null, 2));
    } finally {
        // Clean up
        await Deno.remove(tempFilePath);
        await Deno.remove(tempDir);
    }
}

if (import.meta.main) {
    runTest();
} 