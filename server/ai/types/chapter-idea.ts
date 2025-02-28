import { CharacterIdeaSchema } from "@/ai/types/character-idea.ts";
import { z } from "zod";
import { EnemyFactionSchema } from "@/ai/types/enemy-faction.ts";

export const ChapterIdeaSchema = z.object({
  title: z
    .string()
    .describe(
      "Title of the chapter. Should be unique, just a few words, and not include the chapter number (or 'Prologue')."
    ),
  intro: z.string().describe("Overview of the starting event of the chapter."),
  battle: z
    .string()
    .describe("Description of the starting situation of the battle."),
  outro: z.string().describe("Description of the ending event of the chapter."),
  boss: CharacterIdeaSchema.describe(
    "The boss of the chapter. This chaptacter's firstSeenAs must be 'boss'."
  ),
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
  enemyFaction: EnemyFactionSchema,
  endOfChapterChoice: z
    .object({
      displayText: z.string(),
      options: z
        .array(z.string())
        .min(2)
        .describe(
          "2-5 The options the player can choose from. These should be choices that will affect the story broadly. Options may NOT include attempting to recruit a certain character."
        ),
    })
    .describe(
      "The choice the player can make at the end of the chapter. This should follow the events of the outro and make sense with the storyline"
    ),
});

export type ChapterIdea = z.infer<typeof ChapterIdeaSchema>;

