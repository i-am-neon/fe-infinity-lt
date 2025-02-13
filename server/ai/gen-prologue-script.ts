import { z } from "zod";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";
import {
  testInitialGameIdea,
  testTone,
  testWorldSummary,
} from "@/ai/test-data/initial.ts";

export const prologueScriptSchema = z
  .string()
  .max(700, "Limit to 1 paragraph")
  .describe(
    "Short introduction describing the setting and main characters, no more than a paragraph."
  );

export type PrologueScript = z.infer<typeof prologueScriptSchema>;

export default async function genPrologueScript({
  worldSummary,
  initialGameIdea,
  tone,
}: {
  worldSummary: WorldSummary;
  initialGameIdea: InitialGameIdea;
  tone: string;
}): Promise<PrologueScript> {
  const systemMessage = `You are a Fire Emblem Fangame Prologue Script Writer! The user provides a world summary and an initial game idea. Write a short introduction that is no more than a paragraph, describing the setting and the main characters. Keep it under 700 characters.`;

  const { prologueScript } = await generateStructuredData({
    fnName: "genPrologueScript",
    systemMessage,
    prompt: `World Summary: ${JSON.stringify(
      worldSummary,
      null,
      2
    )}\nGame Idea: ${JSON.stringify(initialGameIdea, null, 2)}\nTone: ${tone}`,
    schema: z.object({ prologueScript: prologueScriptSchema }),
    temperature: 0.7,
  });
  return prologueScript;
}

if (import.meta.main) {
  genPrologueScript({
    worldSummary: testWorldSummary,
    initialGameIdea: testInitialGameIdea,
    tone: testTone,
  }).then((res) => console.log(JSON.stringify(res, null, 2)));
}

