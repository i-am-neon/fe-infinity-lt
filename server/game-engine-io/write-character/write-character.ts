import copyFileToLtMaker from "@/file-io/copy-file-to-lt-maker.ts";
import { appendPortraitsJson } from "@/game-engine-io/write-character/append-portraits-json.ts";
import { appendUnit } from "@/game-engine-io/write-character/append-units.ts";
import { stubCharacterCedric } from "@/test-data/stub-characters.ts";
import { Character } from "@/types/character/character.ts";

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
    newFileName: `${character.unitData.nid}.png`,
  });

  await appendPortraitsJson({
    projectNameEndingInDotLtProj,
    nid: character.unitData.nid,
    blinkingOffset: character.portraitMetadata.blinkingOffset,
    smilingOffset: character.portraitMetadata.smilingOffset,
  });

  // Append to units.json
  await appendUnit({
    projectNameEndingInDotLtProj,
    unitData: character.unitData,
  });
}

if (import.meta.main) {
  await writeCharacter({
    character: stubCharacterCedric,
    projectNameEndingInDotLtProj: "_echoes-of-the-forsaken.ltproj",
  });
}

