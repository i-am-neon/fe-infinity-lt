import choosePortrait from "@/ai/choose-portrait.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";

export async function choosePortraits(characterIdeas: CharacterIdea[]) {
  const usedPortraits: string[] = []; // Since we're creating the prologue, no portraits have been used
  for (const characterIdea of characterIdeas) {
    const chosenPortraitName = await choosePortrait({
      characterIdea,
      usedPortraits,
    });
    usedPortraits.push(chosenPortraitName);
  }
  return usedPortraits;
}

