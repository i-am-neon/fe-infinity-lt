import { z } from "zod";

export const RegionSquadInfoSchema = z.object({
  regionName: z.string(),
  fromX: z.number(),
  fromY: z.number(),
  toX: z.number(),
  toY: z.number(),
  squadInfo: z.string(),
  numberOfGenericEnemies: z.number(),
});

export type RegionSquadInfo = z.infer<typeof RegionSquadInfoSchema>;
