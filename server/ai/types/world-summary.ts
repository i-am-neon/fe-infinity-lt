import { z } from "zod";

export const worldSummarySchema = z.object({
  worldName: z.string(),
  description: z.string(),
  geography: z.object({
    regions: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        relativeLocationInWorld: z.string(),
        notableLocations: z.array(
          z.object({
            name: z.string(),
            description: z.string(),
          })
        ),
      })
    ),
  }),
  history: z.string(),
  mythology: z.string().describe("How the world was created, gods, etc."),
  factions: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    })
  ),
});

export type WorldSummary = z.infer<typeof worldSummarySchema>;

