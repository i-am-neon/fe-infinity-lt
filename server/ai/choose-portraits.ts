import choosePortrait from "@/ai/choose-portrait.ts";
import {
  testCharIdeaAislin,
  testCharIdeaThorne,
} from "@/ai/test-data/character-ideas.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";

export async function choosePortraits({
  characterIdeas,
  usedPortraits,
}: {
  characterIdeas: Array<CharacterIdea>;
  usedPortraits: string[];
}): Promise<Record<string, string>> {
  const result: Record<string, string> = {};

  for (const character of characterIdeas) {
    const chosenPortraitName = await choosePortrait({
      characterIdea: character,
      usedPortraits,
    });
    usedPortraits.push(chosenPortraitName);
    result[character.firstName] = chosenPortraitName;
  }

  return result;
}

if (import.meta.main) {
  choosePortraits({
    characterIdeas: [testCharIdeaAislin, testCharIdeaThorne],
    usedPortraits: [],
  }).then(console.log);
}

