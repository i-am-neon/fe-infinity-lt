import { CharacterIdeaSchema } from "@/ai/types/character-idea.ts";

export const NonBattleCharacterIdeaSchema = CharacterIdeaSchema.omit({
  affinity: true,
  classDirection: true,
  firstSeenAs: true,
  inGameDescription: true,
  deathQuote: true,
}).describe(
  "New characters introduced in this chapter that do not participate in battle. For example, villagers, kings, or any other characters that are in the chapter scenes but not in the battle."
);

