import choosePortrait from "@/ai/choose-portrait.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";
import { NonBattleCharacterIdea } from "@/ai/types/non-battle-character-idea.ts";
import {
  testCharIdeaAislin,
  testNonBattleCharLyander,
} from "@/ai/test-data/character-ideas.ts";

export async function choosePortraits(
  characterIdeas: Array<CharacterIdea | NonBattleCharacterIdea>
): Promise<Record<string, string>> {
  const usedPortraits: string[] = [];
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
  choosePortraits([testCharIdeaAislin, testNonBattleCharLyander]).then(
    console.log
  );
}

