import copyFileToLtMaker from "@/file-io/copy-file-to-lt-maker.ts";
import { Character } from "@/types/character/character.ts";
import { stubCharacterCedric } from "@/test-data/stub-characters.ts";

export default async function writeCharacter({
  character,
  projectNameEndingInDotLtProj,
}: {
  character: Character;
  projectNameEndingInDotLtProj: string;
}): Promise<void> {
  // Add portrait file
  await copyFileToLtMaker({
    filePathInServer: `assets/portraits/${character.portraitMetadata.originalName}.png`,
    ltMakerSubdirectory: `${projectNameEndingInDotLtProj}/resources/portraits`,
  });
  // Update potraits.json with blinking and smiling offsets
  // Append to units.json
}

if (import.meta.main) {
  await writeCharacter({
    character: stubCharacterCedric,
    projectNameEndingInDotLtProj: "_echoes-of-the-forsaken.ltproj",
  });
}

