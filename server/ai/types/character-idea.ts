import { AffinitySchema } from "@/types/character/affinity.ts";
import { z } from "zod";

export const FirstSeenAsSchema = z
  .union([
    z.literal("ally").describe('starts as a blue unit - a playable character that starts in the player\'s party'),
    z.literal("allied NPC").describe('starts as a green unit - a non-playable character that fights alongside the player'),
    z.literal("enemy non-boss").describe('starts as a red unit - a non-playable character that starts in the enemy\'s party'),
    z.literal("boss").describe('The chapter\'s enemy boss'),
    z.literal("non-playable character").describe("Choose this when the character is part of the `newNonBattleCharacters` of the chapter idea"),
  ])
  .describe("the type of unit the character is first seen as");

export type FirstSeenAs = z.infer<typeof FirstSeenAsSchema>;

export const CharacterIdeaSchema = z
  .object({
    firstName: z
      .string()
      .describe(
        "The character's first name or nickname. Must be unique. Avoid these common names and variations on them: Eliara, Liora, Gareth, Lyra, Kaelin, Kael"
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
    affinity: AffinitySchema,
    classDirection: z
      .string()
      .describe(
        "The general idea of the character's class, using Fire Emblem Sacred Stones classes. This does not decide if they are promoted or not, so keep it vague. For example, 'Dark Magic User' or 'Bow User' or 'Pegasus Rider' or 'Horse Mounted'."
      ),
    age: z.union([
      z.literal("child"),
      z.literal("young adult"),
      z.literal("mature adult"),
      z.literal("elderly"),
    ]),
    backstory: z.string().min(20, "Must be 4-5 sentences"),
    firstSeenAs: FirstSeenAsSchema,
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
  })
  .describe("The idea for a new character. Must be human.");

export type CharacterIdea = z.infer<typeof CharacterIdeaSchema>;

