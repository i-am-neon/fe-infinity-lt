import choosePortrait from "@/ai/choose-portrait.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";

export async function choosePortraits(characterIdeas: CharacterIdea[]): Promise<Record<string, string>> {
  const usedPortraits: string[] = [];
  const result: Record<string, string> = {};

  for (const characterIdea of characterIdeas) {
    const chosenPortraitName = await choosePortrait({
      characterIdea,
      usedPortraits,
    });
    usedPortraits.push(chosenPortraitName);
    result[characterIdea.firstName] = chosenPortraitName;
  }

  return result;
}
