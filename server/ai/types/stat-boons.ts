import { z } from "zod";
import { StatValues } from "@/types/character/unit-data.ts";

export const statKeySchema = z.enum([
    "HP", "STR", "MAG", "SKL", "SPD", "LCK", "DEF", "RES", "CON", "MOV"
]);

export type StatKey = z.infer<typeof statKeySchema>;

export const statBoonSchema = z.object({
    baseStatBoosts: z.array(
        z.object({
            stat: statKeySchema,
            value: z.number().int().positive().describe("Amount to boost the base stat by")
        })
    ).min(1).max(3).describe("1-3 stats to boost for the character's base stats"),

    growthRateBoosts: z.array(
        z.object({
            stat: statKeySchema,
            value: z.number().int().positive().describe("Percentage points to boost the growth rate by")
        })
    ).min(1).max(3).describe("1-3 stats to boost for the character's growth rates"),

    reasoning: z.string().describe("Brief explanation for why these stats were chosen based on the character concept and class")
});

export type StatBoon = z.infer<typeof statBoonSchema>; 