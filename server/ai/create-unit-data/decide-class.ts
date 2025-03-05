import { testCharIdeaThorne } from "@/ai/test-data/character-ideas.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";
import generateStructuredData from "../lib/generate-structured-data.ts";
import {
  FE8Class,
  FE8ClassSchema,
  FE8ClassDescriptionMap,
  PromotedFE8Classes,
  UnpromotedFE8Classes,
} from "@/types/fe8-class.ts";
import { isClassValidForGender } from "@/types/gender-locked-classes.ts";
import { z } from "zod";

export interface DecideClassOptions {
  isPromoted: boolean;
  level: number;
  characterIdea: CharacterIdea;
}

const resultSchema = z.object({
  chosenClass: FE8ClassSchema,
});

export default async function decideClass({
  isPromoted,
  level,
  characterIdea,
}: DecideClassOptions): Promise<FE8Class> {
  // Filter classes by promotion status and gender
  const promotionFilteredClasses = isPromoted
    ? PromotedFE8Classes
    : UnpromotedFE8Classes;
  const validClasses = promotionFilteredClasses.filter((cls) =>
    isClassValidForGender(cls, characterIdea.gender)
  );

  const classDescriptions = validClasses.reduce((acc, cls) => {
    acc[cls] = FE8ClassDescriptionMap[cls];
    return acc;
  }, {} as Record<FE8Class, string>);

  const systemMessage = `You are a Fire Emblem fangame class decider.
You will receive:
1) isPromoted: a boolean
2) level: the unit's level
3) a Fire Emblem character idea
4) a list of valid FE8 class options (they are either promoted or unpromoted, and filtered for gender compatibility).
Use the character idea to pick the best class from that list. Output only JSON: { "chosenClass": "ClassName" }, no quotes around the property but the class name is a string. Do not add commentary.`;

  const prompt = JSON.stringify({
    isPromoted,
    level,
    characterIdea,
    classOptions: validClasses,
    classDescriptions,
  });

  const { chosenClass } = await generateStructuredData({
    fnName: "decideCharacterClass",
    schema: resultSchema,
    systemMessage,
    prompt,
    temperature: 0.3,
    model: "fast",
  });

  return chosenClass;
}

if (import.meta.main) {
  decideClass({
    isPromoted: false,
    level: 5,
    characterIdea: testCharIdeaThorne,
  }).then((res) => console.log("Chosen class:", res));
}

