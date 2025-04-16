import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import { getTerrainGridSize } from "./get-terrain-grid-size.ts";
import { ch4TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";

/**
 * List of base terrains that player units can be placed on
 */
const baseTerrains = [
    "Plain",
    "Forest",
    "Bridge",
    "Stairs",
    "Floor",
    "Road",
    "Pillar",
    "Barrel",
    "House",
    "Fort",
    "Gate",
    "Armory",
    "Vendor",
    "Village",
    "Throne",
];

/**
 * Checks if a tile is valid for player units (must be a base terrain)
 */
function isTileValidForPlayer(terrain: string): boolean {
    return baseTerrains.includes(terrain);
}

/**
 * Checks if a position is at least one square away from all existing positions
 * This includes diagonal spacing
 */
function isPositionSpaced(
    x: number,
    y: number,
    existingPositions: Array<{ x: number; y: number }>
): boolean {
    return !existingPositions.some((pos) => {
        const dx = Math.abs(x - pos.x);
        const dy = Math.abs(y - pos.y);
        // Return true if this position is adjacent or same as existing
        return dx <= 1 && dy <= 1;
    });
}

/**
 * Finds a valid tile near the given coordinates
 */
function findNearestValidTile(
    terrainGrid: TerrainGrid,
    startX: number,
    startY: number,
    existingPositions: Array<{ x: number; y: number }> = []
): { x: number; y: number } | null {
    const { width, height } = getTerrainGridSize(terrainGrid);

    // Clamp starting coordinates to grid bounds
    const x = Math.max(0, Math.min(startX, width - 1));
    const y = Math.max(0, Math.min(startY, height - 1));

    const startKey = `${x},${y}`;
    // Check if start position is already valid
    if (
        terrainGrid[startKey] &&
        isTileValidForPlayer(terrainGrid[startKey]) &&
        isPositionSpaced(x, y, existingPositions)
    ) {
        return { x, y };
    }

    // BFS to find nearest valid position
    const queue: Array<{ x: number; y: number }> = [{ x, y }];
    const visited = new Set<string>([startKey]);

    let idx = 0;
    while (idx < queue.length) {
        const current = queue[idx++];
        const key = `${current.x},${current.y}`;
        const terrain = terrainGrid[key];

        if (
            terrain &&
            isTileValidForPlayer(terrain) &&
            isPositionSpaced(current.x, current.y, existingPositions)
        ) {
            return current;
        }

        // Check adjacent tiles (including diagonals for more options)
        for (const [dx, dy] of [
            [0, 1], [1, 0], [0, -1], [-1, 0],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ]) {
            const nx = current.x + dx;
            const ny = current.y + dy;

            if (nx >= 0 && ny >= 0 && nx < width && ny < height) {
                const nKey = `${nx},${ny}`;
                if (!visited.has(nKey)) {
                    visited.add(nKey);
                    queue.push({ x: nx, y: ny });
                }
            }
        }
    }

    // No valid position found
    return null;
}

/**
 * Places player units on valid base terrains with proper spacing
 */
export default function getPlayerUnitPlacement({
    terrainGrid,
    numUnits,
    startX = 0,
    startY = 0,
}: {
    terrainGrid: TerrainGrid;
    numUnits: number;
    startX?: number;
    startY?: number;
}): Array<{ x: number; y: number }> {
    const positions: Array<{ x: number; y: number }> = [];
    const { width, height } = getTerrainGridSize(terrainGrid);

    // Clamp starting point to valid grid coordinates
    const x = Math.max(0, Math.min(startX, width - 1));
    const y = Math.max(0, Math.min(startY, height - 1));

    // Try to place first unit at or near starting position
    const firstPosition = findNearestValidTile(terrainGrid, x, y);
    if (firstPosition) {
        positions.push(firstPosition);
    } else {
        // If no valid starting position, search through the grid systematically
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const key = `${x},${y}`;
                if (terrainGrid[key] && isTileValidForPlayer(terrainGrid[key])) {
                    positions.push({ x, y });
                    break;
                }
            }
            if (positions.length > 0) break;
        }
    }

    // If still no valid position found, return empty array
    if (positions.length === 0) {
        return [];
    }

    // Place remaining units with proper spacing
    let attempts = 0;
    const maxAttempts = width * height * 2; // Prevent infinite loop

    while (positions.length < numUnits && attempts < maxAttempts) {
        attempts++;

        // Get the last placed position as reference point for the next one
        const lastPos = positions[positions.length - 1];

        // Try to place next unit near the last one
        const nextPosition = findNearestValidTile(
            terrainGrid,
            lastPos.x,
            lastPos.y,
            positions
        );

        if (nextPosition) {
            positions.push(nextPosition);
        } else {
            // If no position found near last unit, try a different starting point
            // This helps in cases where units need to be placed in separate regions
            const randomX = Math.floor(Math.random() * width);
            const randomY = Math.floor(Math.random() * height);

            const altPosition = findNearestValidTile(
                terrainGrid,
                randomX,
                randomY,
                positions
            );

            if (altPosition) {
                positions.push(altPosition);
            }
        }
    }

    return positions.slice(0, numUnits);
}

if (import.meta.main) {
    // Test the function with various numbers of units
    const test3Units = getPlayerUnitPlacement({
        terrainGrid: ch4TerrainGrid,
        numUnits: 3,
        startX: 1,
        startY: 1,
    });

    console.log("Placement for 3 units:", test3Units);

    const test8Units = getPlayerUnitPlacement({
        terrainGrid: ch4TerrainGrid,
        numUnits: 8,
        startX: 4,
        startY: 2,
    });

    console.log("Placement for 8 units:", test8Units);
} 