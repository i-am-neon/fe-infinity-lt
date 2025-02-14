import { Character } from "@/types/character/character.ts";
import writeCharacter from "@/game-engine-io/write-character/write-character.ts";
import {
  stubCharacterCedric,
  stubCharacterElara,
} from "@/test-data/stub-characters.ts";

export default async function writeCharacters({
  characters,
  projectNameEndingInDotLtProj,
}: {
  characters: Character[];
  projectNameEndingInDotLtProj: string;
}): Promise<void> {
  await Promise.all(
    characters.map((character) =>
      writeCharacter({ character, projectNameEndingInDotLtProj })
    )
  );
}

if (import.meta.main) {
  // Example usage
  const charList: Character[] = [stubCharacterCedric, stubCharacterElara];
  writeCharacters({
    characters: charList,
    projectNameEndingInDotLtProj: "_test.ltproj",
  }).then(() => {
    console.log("All characters written successfully.");
  });
}

