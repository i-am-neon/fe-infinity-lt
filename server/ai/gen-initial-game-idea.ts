import { WorldSummary } from "@/ai/types/world-summary.ts";
import {
  initialGameIdeaSchema,
  InitialGameIdea,
} from "@/ai/types/initial-game-idea.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";
import { testTone, testWorldSummary } from "@/ai/test-data/initial.ts";

export default function genInitialGameIdea({
  worldSummary,
  tone,
}: {
  worldSummary: WorldSummary;
  tone: string;
}): Promise<InitialGameIdea> {
  const systemMessage = `You are a Fire Emblem Fangame Prologue Story Generator!

Your task is to craft a detailed story idea for the prologue chapter of a Fire Emblem fangame based on the provided world summary.
Take into account the world setting, geography, history, and factions to create a compelling narrative start.
In your response, include:
- A narrative backstory that sets the stage for the game.
- A list of character ideas for the characters that will appear in the prologue. Use the format specified in the CharacterIdea schema. You must include at least 2 characters.
- Potential plot directions or twists that could define the prologue.
- Any additional notes or details that would be important for establishing the tone and setup of the game.

Requirements that MUST be met:
- You must include at least 2 character ideas. Anything less will result in an error.`;

  const prompt = `World Summary: ${JSON.stringify(
    worldSummary,
    null,
    2
  )}\nTone: ${tone}`;

  return generateStructuredData<InitialGameIdea>({
    fnName: "genInitialGameIdea",
    schema: initialGameIdeaSchema,
    systemMessage,
    prompt,
    temperature: 0.8,
  });
}

if (import.meta.main) {
  genInitialGameIdea({
    worldSummary: testWorldSummary,
    tone: testTone,
  }).then((idea) => {
    console.log(JSON.stringify(idea, null, 2));
  });
}

