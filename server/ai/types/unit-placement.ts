import { FirstSeenAsSchema } from "@/ai/types/character-idea.ts";
import { EnemyAIGroupSchema } from "@/ai/types/enemy-ai-group.ts";
import { FE8ClassSchema } from "@/types/fe8-class.ts";
import { z } from "zod";

export const EnemyGenericUnitSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  class: FE8ClassSchema.optional(),
  aiGroup: EnemyAIGroupSchema.default("Attack"),
});

export type EnemyGenericUnit = z.infer<typeof EnemyGenericUnitSchema>;

export type EnemyGenericUnitWithStartingItems = EnemyGenericUnit & {
  startingItems?: [string, boolean][]; // boolean is droppable
};

export const UnitCoordsSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
});

export type UnitCoords = z.infer<typeof UnitCoordsSchema>;

export const RecruitableUnitSchema = z.object({
  nid: z
    .string()
    .describe("should match the character's first name exactly as it appears"),
  firstSeenAs: FirstSeenAsSchema,
  coords: UnitCoordsSchema,
});

export type RecruitableUnit = z.infer<typeof RecruitableUnitSchema>;

