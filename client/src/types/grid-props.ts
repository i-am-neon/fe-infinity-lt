import { TerrainType } from "./terrain-type";

export interface Unit {
    x: number;
    y: number;
    class?: string;
    name?: string;
    isBoss?: boolean;
    isPlayer?: boolean;
    isGreen?: boolean;
    aiGroup?: string;
    startingItems?: string[];
}

export interface GridProps {
    terrainGrid: Record<string, TerrainType>;
    units?: Unit[];
}

export interface MapInfo {
    originalName: string;
    givenName: string;
    setting: string;
} 