import { z } from "zod";
import { FE8ClassSchema } from "@/types/fe8-class.ts";

export const EnemyGenericUnitSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  class: FE8ClassSchema.optional(),
});

export type EnemyGenericUnit = z.infer<typeof EnemyGenericUnitSchema>;

export const BossCoordsSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
});
export type BossCoords = z.infer<typeof BossCoordsSchema>;

export const PlayerUnitStartCoordsSchema = z.array(
  z.object({
    x: z.number().int().min(0),
    y: z.number().int().min(0),
  })
);
export type PlayerUnitStartCoords = z.infer<typeof PlayerUnitStartCoordsSchema>;

export const GreenUnitSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  name: z.string().min(1),
  desc: z.string().min(1),
  class: FE8ClassSchema,
});

export type GreenUnit = z.infer<typeof GreenUnitSchema>;

