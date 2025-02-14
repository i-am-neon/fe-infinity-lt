import { testCharIdeaThorne } from "@/ai/test-data/character-ideas.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";
import {
  FE8Class,
  FE8ClassSchema,
  promotedClassDescriptions,
  PromotedFE8Classes,
  unpromotedClassDescriptions,
  UnpromotedFE8Classes,
} from "@/types/fe8-class.ts";
import { z } from "zod";

export interface DecideClassOptions {
  isPromoted: boolean;
  level: number;
  characterIdea: CharacterIdea;
}

const resultSchema = z.object({
  chosenClass: FE8ClassSchema,
});

export default async function decideCharacterClass({
  isPromoted,
  level,
  characterIdea,
}: DecideClassOptions): Promise<FE8Class> {
  const validClasses = isPromoted ? PromotedFE8Classes : UnpromotedFE8Classes;

  const systemMessage = `You are a Fire Emblem fangame class decider.
You will receive:
1) isPromoted: a boolean
2) level: the unit's level
3) a Fire Emblem character idea
4) a list of valid FE8 class options (they are either promoted or unpromoted).
Use the character idea to pick the best class from that list. Output only JSON: { "chosenClass": "ClassName" }, no quotes around the property but the class name is a string. Do not add commentary.`;

  const prompt = JSON.stringify({
    isPromoted,
    level,
    characterIdea,
    classOptions: validClasses,
    classDescriptions: isPromoted
      ? promotedClassDescriptions
      : unpromotedClassDescriptions,
  });

  const { chosenClass } = await generateStructuredData({
    fnName: "decideCharacterClass",
    schema: resultSchema,
    systemMessage,
    prompt,
    temperature: 0.3,
    model: "gpt-4o-mini",
  });

  return chosenClass;
}

if (import.meta.main) {
  decideCharacterClass({
    isPromoted: false,
    level: 5,
    characterIdea: testCharIdeaThorne,
  }).then((res) => console.log("Chosen class:", res));
}

