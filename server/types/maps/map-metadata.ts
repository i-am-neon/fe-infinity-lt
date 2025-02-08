import { z } from "zod";

export const MapRegionSchema = z.object({
  name: z.string(),
  terrainTypes: z.array(z.string()),
  fromX: z.number(),
  fromY: z.number(),
  toX: z.number(),
  toY: z.number(),
  description: z.string(),
});

export const MapMetadataSchema = z.object({
  distinctRegions: z
    .array(MapRegionSchema)
    .describe(
      "You must not have regions overlap. You can see a region as an area that's more or less enclosed by impassable or difficult terrain. For example, cliffs, walls, and water might enclose a region. Or, two regions might be divided by a dotting of forests or hills."
    ),
  keyPointsOfInterest: z.array(z.string()),
  chokePoints: z.array(z.string()),
  strategicConsiderations: z.array(z.string()),
  setting: z.enum(["indoor", "outdoor", "mixed indoor and outdoor"]),
});

export type MapRegion = z.infer<typeof MapRegionSchema>;
export type MapMetadata = z.infer<typeof MapMetadataSchema>;

