import { TerrainGrid } from "@/types/maps/terrain-grid.ts";
import { getTerrainGridSize } from "./get-terrain-grid-size.ts";
import { ch4TerrainGrid } from "@/map-processing/test-data/terrain-grid.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";

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
 * Checks if a position is already occupied
 */
function isPositionOccupied(
    x: number,
    y: number,
    existingPositions: Array<{ x: number; y: number }>
): boolean {
    return existingPositions.some(pos => pos.x === x && pos.y === y);
}

/**
 * Checks if a position is within the specified boundary
 */
function isWithinBoundary(
    x: number,
    y: number,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
): boolean {
    return x >= fromX && x <= toX && y >= fromY && y <= toY;
}

/**
 * Finds a valid tile near the given coordinates within boundary constraints
 */
function findNearestValidTile(
    terrainGrid: TerrainGrid,
    x: number,
    y: number,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    existingPositions: Array<{ x: number; y: number }> = [],
    requireSpacing: boolean = true
): { x: number; y: number } | null {
    const startKey = `${x},${y}`;
    // Check if start position is already valid
    if (
        terrainGrid[startKey] &&
        isTileValidForPlayer(terrainGrid[startKey]) &&
        !isPositionOccupied(x, y, existingPositions) &&
        (!requireSpacing || isPositionSpaced(x, y, existingPositions))
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
            !isPositionOccupied(current.x, current.y, existingPositions) &&
            (!requireSpacing || isPositionSpaced(current.x, current.y, existingPositions))
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

            if (isWithinBoundary(nx, ny, fromX, fromY, toX, toY)) {
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
 * Finds any valid unoccupied position within the boundary
 */
function findAnyValidPosition(
    terrainGrid: TerrainGrid,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    existingPositions: Array<{ x: number; y: number }>
): { x: number; y: number } | null {
    // Scan the entire boundary for any valid position
    for (let y = fromY; y <= toY; y++) {
        for (let x = fromX; x <= toX; x++) {
            const key = `${x},${y}`;
            if (
                terrainGrid[key] &&
                isTileValidForPlayer(terrainGrid[key]) &&
                !isPositionOccupied(x, y, existingPositions)
            ) {
                return { x, y };
            }
        }
    }
    return null;
}

/**
 * Counts valid placement tiles within boundary
 */
function countValidTiles(
    terrainGrid: TerrainGrid,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
): number {
    let count = 0;
    for (let y = fromY; y <= toY; y++) {
        for (let x = fromX; x <= toX; x++) {
            const key = `${x},${y}`;
            if (terrainGrid[key] && isTileValidForPlayer(terrainGrid[key])) {
                count++;
            }
        }
    }
    return count;
}

/**
 * Returns all valid tiles for player unit placement within the specified boundary
 */
export default function getPlayerUnitPlacement({
    terrainGrid,
    fromX,
    fromY,
    toX,
    toY,
}: {
    terrainGrid: TerrainGrid;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
}): Array<{ x: number; y: number }> {
    const logger = getCurrentLogger();
    const validPositions: Array<{ x: number; y: number }> = [];

    // Scan the entire boundary for valid positions
    for (let y = fromY; y <= toY; y++) {
        for (let x = fromX; x <= toX; x++) {
            const key = `${x},${y}`;
            if (terrainGrid[key] && isTileValidForPlayer(terrainGrid[key])) {
                validPositions.push({ x, y });
            }
        }
    }

    logger.info(`Found ${validPositions.length} valid tiles for player unit placement within boundary`, {
        boundaryFrom: { x: fromX, y: fromY },
        boundaryTo: { x: toX, y: toY },
    });

    return validPositions;
}

if (import.meta.main) {
    // Test with boundary constraints
    const testBoundary = getPlayerUnitPlacement({
        terrainGrid: ch4TerrainGrid,
        fromX: 0,
        fromY: 0,
        toX: 5,
        toY: 5,
    });

    console.log(`Found ${testBoundary.length} valid tiles within boundary (0,0)-(5,5):`, testBoundary);

    // Test with another boundary
    const testAnotherBoundary = getPlayerUnitPlacement({
        terrainGrid: ch4TerrainGrid,
        fromX: 0,
        fromY: 2,
        toX: 3,
        toY: 6,
    });

    console.log(`Found ${testAnotherBoundary.length} valid tiles within boundary (0,2)-(3,6):`, testAnotherBoundary);
} 