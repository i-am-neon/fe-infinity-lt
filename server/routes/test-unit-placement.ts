import { allMapOptions } from "@/map-processing/all-map-options.ts";
import getTerrainGridFromMapName from "@/ai/level/unit-placement/get-terrain-grid-from-tilemap.ts";
import assembleUnitPlacement from "@/ai/level/unit-placement/assemble-unit-placement.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";

// Route to get all available map names
export async function handleGetMapsList(_req: Request): Promise<Response> {
    try {
        const mapNames = allMapOptions.map(map => ({
            originalName: map.originalName,
            givenName: map.givenName,
            setting: map.setting,
        }));

        return new Response(JSON.stringify({ maps: mapNames }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error(`Error getting maps list: ${error}`);
        return new Response(
            JSON.stringify({ error: "Failed to get maps list" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}

// Route to get terrain grid for a map
export async function handleGetTerrainGrid(req: Request): Promise<Response> {
    try {
        const url = new URL(req.url);
        const pathParts = url.pathname.split('/');
        const mapName = pathParts[pathParts.length - 1]; // Get the last part of the path

        if (!mapName) {
            return new Response(
                JSON.stringify({ error: "Map name is required" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        const terrainGrid = getTerrainGridFromMapName(mapName);

        return new Response(JSON.stringify({ terrainGrid }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error(`Error getting terrain grid: ${error}`);
        return new Response(
            JSON.stringify({ error: "Failed to get terrain grid" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}

// Route to test unit placement for a map
export async function handleUnitPlacement(req: Request): Promise<Response> {
    try {
        const body = await req.json();
        const { mapName } = body;

        if (!mapName) {
            return new Response(
                JSON.stringify({ error: "Map name is required" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        const mapMetadata = allMapOptions.find(m => m.originalName === mapName);

        if (!mapMetadata) {
            return new Response(
                JSON.stringify({ error: "Map not found" }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        // Mock chapter idea for testing
        const mockChapterIdea: ChapterIdea = {
            title: "Test Chapter",
            intro: "Introduction to the test chapter",
            battle: "The battle begins on a strategic field",
            outro: "The battle concludes successfully",
            boss: {
                backstory: "A test boss with a simple backstory",
                firstName: "Boss",
                fullName: "Test Boss",
                gender: "male",
                personality: "Aggressive and tactical",
                affinity: "Anima",
                classDirection: "Armored Knight",
                age: "mature adult",
                firstSeenAs: "boss",
                physicalDescription: "A tall, imposing figure in heavy armor",
                inGameDescription: "Tactical commander of the enemy forces",
                deathQuote: "How could I lose...",
            },
            enemyFaction: {
                nid: "test-faction",
                name: "Test Faction",
                desc: "A test faction for unit placement testing",
                icon_nid: "default_icon"
            },
            endOfChapterChoice: {
                displayText: "What will you do next?",
                options: ["Continue the fight", "Search for allies"]
            }
        };

        const terrainGrid = getTerrainGridFromMapName(mapName);

        const unitPlacement = await assembleUnitPlacement({
            terrainGrid,
            chapterIdea: mockChapterIdea,
            mapMetadata,
            chapterNumber: 1,
        });

        return new Response(
            JSON.stringify({
                terrainGrid,
                unitPlacement,
                mapMetadata,
            }),
            {
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (error) {
        console.error(`Error processing unit placement: ${error}`);
        return new Response(
            JSON.stringify({ error: "Failed to process unit placement" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
} 