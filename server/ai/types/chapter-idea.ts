import { z } from "zod";
import { CharacterIdeaSchema } from "@/ai/types/character-idea.ts";

export const ChapterIdeaSchema = z.object({
  intro: z.string().describe("Overview of the starting event of the chapter."),
  battle: z
    .string()
    .describe("Description of the starting situation of the battle."),
  outro: z.string().describe("Description of the ending event of the chapter."),
  boss: CharacterIdeaSchema,
  newPlayableUnits: z
    .array(CharacterIdeaSchema)
    .optional()
    .describe(
      "New playable characters introduced in this chapter, if any. Includes units that start as player units, NPCs, or enemies but can be recruited."
    ),
});

export type ChapterIdea = z.infer<typeof ChapterIdeaSchema>;

