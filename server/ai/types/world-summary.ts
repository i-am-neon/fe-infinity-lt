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
  factions: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    })
  ),
});

export type WorldSummary = z.infer<typeof worldSummarySchema>;
