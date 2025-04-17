import { z } from "zod";

export const SceneBackgroundMetadataSchema = z.object({
  description: z.string().describe(
    "A one sentence description of the scene depicted in the image."
  ),
  setting: z.enum(['indoor', 'outdoor']),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'night']).optional().describe('MUST be one of: morning, afternoon, evening, night.'),
  weather: z.string().optional().describe('A one-word description of the weather conditions in the scene, only if outdoor.'),
});

export type SceneBackgroundMetadata = z.infer<
  typeof SceneBackgroundMetadataSchema
>;

export type SceneBackgroundMetadataWithFileName = {
  fileName: string;
} & SceneBackgroundMetadata;