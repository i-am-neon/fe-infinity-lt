import { z } from "zod";

const UnitPlacementSchema = z.object({
  unitType: z.string().describe("General type or role of the unit, e.g., Archer, Melee Guard, Brigand targeting village, Thief targeting chest"),
  x: z.number(),
  y: z.number(),
});

export const RegionSquadInfoSchema = z.object({
  regionName: z.string(),
  fromX: z.number(),
  fromY: z.number(),
  toX: z.number(),
  toY: z.number(),
  squadInfo: z.string().describe("General description of the squad strategy for this region."),
  numberOfGenericEnemies: z.number(),
  placement: z.array(UnitPlacementSchema).describe("Specific coordinates and type for each generic enemy unit in this region."),
});

export type RegionSquadInfo = z.infer<typeof RegionSquadInfoSchema>;
