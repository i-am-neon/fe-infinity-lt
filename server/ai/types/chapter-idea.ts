import { CharacterIdeaSchema } from "@/ai/types/character-idea.ts";
import { z } from "zod";

export const ChapterIdeaSchema = z.object({
  name: z
    .string()
    .describe(
      "Name of the chapter. Should be unique, just a few words, and not include the chapter number (or 'Prologue')."
    ),
  intro: z.string().describe("Overview of the starting event of the chapter."),
  battle: z
    .string()
    .describe("Description of the starting situation of the battle."),
  outro: z.string().describe("Description of the ending event of the chapter."),
  boss: CharacterIdeaSchema,
  newNonBattleCharacters: CharacterIdeaSchema.array()
    .optional()
    .describe(
      "New characters introduced in this chapter that do not participate in battle. For example, villagers, kings, or any other characters that are in the chapter scenes but not in the battle. It is possible to have them appear in future battles."
    ),
  newPlayableUnits: z
    .array(CharacterIdeaSchema)
    .optional()
    .describe(
      "New playable characters introduced in this chapter, if any. Includes units that start as player units, NPCs, or enemies but can be recruited."
    ),
});

export type ChapterIdea = z.infer<typeof ChapterIdeaSchema>;

