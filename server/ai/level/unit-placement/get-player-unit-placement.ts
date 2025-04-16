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
 * Places player units on valid base terrains within specified boundary
 * If space is too limited, it will place units adjacent to each other
 */
export default function getPlayerUnitPlacement({
    terrainGrid,
    numUnits,
    fromX,
    fromY,
    toX,
    toY,
}: {
    terrainGrid: TerrainGrid;
    numUnits: number;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
}): Array<{ x: number; y: number }> {
    const positions: Array<{ x: number; y: number }> = [];

    // Determine if we have enough space to maintain spacing
    const validTileCount = countValidTiles(terrainGrid, fromX, fromY, toX, toY);

    // If there aren't enough valid tiles for the number of units, return fewer units
    if (validTileCount < numUnits) {
        numUnits = validTileCount;
    }

    const canMaintainSpacing = validTileCount >= numUnits * 9; // Rough estimate: each unit needs a 3x3 area

    // Find a good starting position within the boundary (center of the region)
    const centerX = Math.floor((fromX + toX) / 2);
    const centerY = Math.floor((fromY + toY) / 2);

    // Try to place first unit near the center of the boundary
    const firstPosition = findNearestValidTile(
        terrainGrid,
        centerX,
        centerY,
        fromX,
        fromY,
        toX,
        toY,
        [],
        canMaintainSpacing
    );

    if (firstPosition) {
        positions.push(firstPosition);
    } else {
        // If no valid position near center, search through the boundary area systematically
        const anyPosition = findAnyValidPosition(
            terrainGrid,
            fromX,
            fromY,
            toX,
            toY,
            positions
        );

        if (anyPosition) {
            positions.push(anyPosition);
        }
    }

    // If still no valid position found, return empty array
    if (positions.length === 0) {
        return [];
    }

    // Place remaining units
    let attempts = 0;
    const maxAttempts = (toX - fromX + 1) * (toY - fromY + 1) * 2; // Prevent infinite loop

    while (positions.length < numUnits && attempts < maxAttempts) {
        attempts++;

        // Get the last placed position as reference point for the next one
        const lastPos = positions[positions.length - 1];

        // Try to place next unit near the last one with spacing if possible
        let nextPosition = findNearestValidTile(
            terrainGrid,
            lastPos.x,
            lastPos.y,
            fromX,
            fromY,
            toX,
            toY,
            positions,
            canMaintainSpacing
        );

        // If no position found with spacing, try without spacing
        if (!nextPosition && canMaintainSpacing) {
            nextPosition = findNearestValidTile(
                terrainGrid,
                lastPos.x,
                lastPos.y,
                fromX,
                fromY,
                toX,
                toY,
                positions,
                false
            );
        }

        if (nextPosition) {
            positions.push(nextPosition);
        } else {
            // Try a random position within boundary
            const randomX = fromX + Math.floor(Math.random() * (toX - fromX + 1));
            const randomY = fromY + Math.floor(Math.random() * (toY - fromY + 1));

            const altPosition = findNearestValidTile(
                terrainGrid,
                randomX,
                randomY,
                fromX,
                fromY,
                toX,
                toY,
                positions,
                false // At this point, just try to place it anywhere valid
            );

            if (altPosition) {
                positions.push(altPosition);
            } else {
                // Try harder - scan the entire area for any remaining valid position
                const lastResort = findAnyValidPosition(
                    terrainGrid,
                    fromX,
                    fromY,
                    toX,
                    toY,
                    positions
                );

                if (lastResort) {
                    positions.push(lastResort);
                } else {
                    // If we can't find any more valid positions, stop
                    break;
                }
            }
        }
    }

    return positions.slice(0, numUnits);
}

if (import.meta.main) {
    // Test with boundary constraints
    const testBoundary = getPlayerUnitPlacement({
        terrainGrid: ch4TerrainGrid,
        numUnits: 3,
        fromX: 0,
        fromY: 0,
        toX: 5,
        toY: 5,
    });

    console.log("Placement within boundary (0,0)-(5,5):", testBoundary);

    // Test with tight boundary to demonstrate adjacent placement
    const testTightBoundary = getPlayerUnitPlacement({
        terrainGrid: ch4TerrainGrid,
        numUnits: 8,
        fromX: 0,
        fromY: 2,
        toX: 3,
        toY: 6,
    });

    console.log("Placement in tight boundary (0,2)-(3,6):", testTightBoundary);
} 