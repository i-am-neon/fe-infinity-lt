import { z } from "zod";

export const SceneBackgroundMetadataSchema = z.object({
  description: z.string().describe(
    "A one sentence description of the scene depicted in the image."
  ),
  setting: z.enum(['indoor', 'outdoor']),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'night']).optional(),
});

export type SceneBackgroundMetadata = z.infer<
  typeof SceneBackgroundMetadataSchema
>;