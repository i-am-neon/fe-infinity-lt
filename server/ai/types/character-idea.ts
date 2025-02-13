import { z } from "zod";

export const CharacterIdeaSchema = z.object({
  firstName: z
    .string()
    .describe(
      "The character's first name or nickname. Must be unique. Avoid these common names and variations on them: Eliara, Liora, Gareth, Lyra"
    ),
  fullName: z
    .string()
    .describe(
      "The character's full name, including title if any, given first name (which may be different from the firstName field which can also be their nickname), and last name."
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
    z.literal("ally").describe("Blue unit"),
    z.literal("allied NPC").describe("Green unit"),
    z.literal("enemy non-boss").describe("Red unit"),
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

