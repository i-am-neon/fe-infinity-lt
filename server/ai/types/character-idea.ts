import { z } from "zod";

export const CharacterIdeaSchema = z.object({
  name: z
    .string()
    .min(
      1,
      "Must be first name only and contain no spaces. That means no last names or titles ('King', 'Sir', etc are not allowed, just the first name.)."
    ),
  gender: z.union([z.literal("male"), z.literal("female")]),
  personality: z
    .string()
    .min(1, "Must be a 1-sentence personality description"),
  age: z.union([
    z.literal("child"),
    z.literal("young adult"),
    z.literal("mature adult"),
    z.literal("elderly"),
  ]),
  backstory: z.string().min(20, "Must be 4-5 sentences"),
  firstSeenAs: z.union([
    z.literal("ally"),
    z.literal("allied NPC"),
    z.literal("enemy non-boss"),
    z.literal("boss"),
  ]),
  physicalDescription: z
    .string()
    .describe("A physical description of the character"),
  inGameDescription: z
    .string()
    .describe(
      "very short one sentence description to be shown in-game, must not include the character's name, maximum 90 characters, just a handful of words"
    ),
  deathQuote: z
    .string()
    .describe(
      "What the character says when they die, 1-2 sentences. Must not include quotation marks."
    ),
});

export type CharacterIdea = z.infer<typeof CharacterIdeaSchema>;
