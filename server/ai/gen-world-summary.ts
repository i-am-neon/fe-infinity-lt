import { WorldSummary, worldSummarySchema } from "@/ai/types/world-summary.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";
import {
  testGameDescription,
  testGameName,
  testTone,
} from "./test-data/prologue.ts";

export default function genWorldSummary({
  gameName,
  gameDescription,
  tone,
}: {
  gameName: string;
  gameDescription: string;
  tone: string;
}): Promise<WorldSummary> {
  const systemMessage = `You are a Fire Emblem Fangame World Builder!

Your task is to create a detailed, unique, and inventive world and storyline for a Fire Emblem fangame,
ensuring it is original and distinct from existing games. The user will provide a few words
describing the general direction of the world or storyline they envision.

Based on their input, generate a rich and immersive setting tailored to their vision.

In your response, you must return these sections:

- World Description
- Geography with a breakdown of each region
- Overview of world history/mythology
- Factions: list the world's factions/nations/societies

Notes:
- The name of the world must not be "Aetheria" or anything similar. Choose something unique!
- The world will be used in a Fire Emblem 8 engine. It should not be similar to any existing Fire Emblem game, but it should be feasible within the constraints of the engine. This means:
  - No futuristic settings
  - No new forms of magic or weapons
  - All characters must be human
  - The only available mounts are horses, pegasi, and wyverns
`;

  return generateStructuredData<WorldSummary>({
    fnName: "genWorldSummary",
    systemMessage,
    prompt: `Game Name: ${gameName}
Game Description: ${gameDescription}
Game Tone: ${tone}`,
    schema: worldSummarySchema,
    temperature: 1,
  });
}

if (import.meta.main) {
  genWorldSummary({
    gameName: testGameName,
    gameDescription: testGameDescription,
    tone: testTone,
  }).then((summary) => console.log(JSON.stringify(summary, null, 2)));
}

