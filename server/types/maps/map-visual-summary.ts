import { z } from "zod";

export const MapVisualSummarySchema = z.object({
  name: z
    .string()
    .describe(
      "A literal, concise name for the map. The name should directly reflect the map's content, do not use vague story-related names."
    ),
  description: z.string().describe("A brief description of the map."),
  regions: z.array(
    z.object({
      name: z.string().describe("A concise name for the region."),
      description: z.string().describe("A brief description of the region."),
      location: z
        .string()
        .describe(
          "The general location of the region. For example, 'top center' or 'bottom right' or 'center right' or 'bottom center right'."
        ),
    })
  ),
});

export type MapVisualSummary = z.infer<typeof MapVisualSummarySchema>;

