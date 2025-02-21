import { z } from "zod";
import { CharacterIdeaSchema } from "@/ai/types/character-idea.ts";

export const initialGameIdeaSchema = z.object({
  backstory: z
    .string()
    .describe(
      "The narrative backstory that sets the stage for the prologue chapter of the game."
    ),
  characterIdeas: z
    .array(CharacterIdeaSchema)
    // .min(2)
    .describe(
      "A list of character ideas for the characters that will appear in the prologue. This should NOT include a boss and should be 2-4+ characters. These are the only playable characters that will be available in the prologue."
    )
    .min(3),
  plotDirections: z
    .array(z.string())
    .describe("Potential plot directions or twists for the prologue."),
  additionalNotes: z
    .string()
    .optional()
    .describe(
      "Any additional notes or details important for establishing the prologue chapter."
    ),
});

export type InitialGameIdea = z.infer<typeof initialGameIdeaSchema>;

