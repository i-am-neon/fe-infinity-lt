import { TerrainType } from "@/types/maps/terrain-type.ts";

export interface TerrainCell {
  x: number;
  y: number;
  terrain: TerrainType;
}
