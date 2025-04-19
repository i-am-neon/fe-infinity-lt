import { z } from "zod";

export const gameIdeaSchema = z.object({
  title: z.string().describe("The title of the game."),
  description: z.string().describe("A brief description of the game."),
  tone: z.string().describe("The tone or style of the game."),
});

export type GameIdea = z.infer<typeof gameIdeaSchema>;