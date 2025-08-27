import { z } from "zod";

export const worldSummarySchema = z.object({
  worldName: z.string(),
  description: z.string(),
});

export type WorldSummary = z.infer<typeof worldSummarySchema>;

