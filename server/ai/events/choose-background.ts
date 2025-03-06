import generateStructuredData from "../lib/generate-structured-data.ts";
import { z } from "zod";
import { AIEvent } from "@/ai/types/ai-event.ts";
import {
  BackgroundOptionsSchema,
  BackgroundOption,
} from "@/ai/types/background-option.ts";
import { testAIEventPrologueIntro } from "@/ai/test-data/events.ts";

const resultSchema = z.object({
  chosenBackground: BackgroundOptionsSchema,
});

export default async function chooseBackground(
  aiEvent: AIEvent
): Promise<BackgroundOption> {
  const systemMessage = `You are a Fire Emblem fangame background decider.
We have a list of possible backgrounds to choose from, enumerated in the set:
Arena, Bedroom, Black Background, Castle Ruins, Castle Sepia, Clearing, Deep Forest, Forest, Forest Dark, Grado Castle, Hill, House, Inside Castle, Plains, Ruins, Town, Town Sunset, Village, Village Gate.
Use the AIEvent as context to pick the most suitable background for this scene.
Output a JSON object { "chosenBackground": "OneOfTheBackgroundOptions" }. No additional commentary.

Ensure the background name matches exactly. You must ONLY choose from the set of options provided. No other backgrounds are allowed.`;

  const { chosenBackground } = await generateStructuredData({
    fnName: "chooseBackground",
    schema: resultSchema,
    systemMessage,
    prompt: JSON.stringify(aiEvent),
    model: "fast",
    temperature: 0,
  });

  return chosenBackground;
}

if (import.meta.main) {
  chooseBackground(testAIEventPrologueIntro).then((res) => {
    console.log("Chosen background:", res);
  });
}

