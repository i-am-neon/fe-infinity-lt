import { z } from "zod";

export const PortraitMetadataSchema = z.object({
  originalName: z
    .string()
    .describe("not including .png or the path to the file."),
  gender: z.union([z.literal("male"), z.literal("female")]),
  age: z.union([
    z.literal("child"),
    z.literal("young adult"),
    z.literal("mature adult"),
    z.literal("elderly"),
  ]),
  hairColor: z.string(),
  eyeColor: z.string(),
  vibe: z
    .string()
    .describe("A three-word description of the character's vibe."),
  clothing: z.string(),
  smilingOffset: z.tuple([z.number(), z.number()]),
  blinkingOffset: z.tuple([z.number(), z.number()]),
  headgear: z.string().optional(),
  facialHair: z.string().optional(),
  accessories: z.string().optional().describe("e.g. eye wear, jewelry, etc."),
});

export type PortraitMetadata = z.infer<typeof PortraitMetadataSchema>;

