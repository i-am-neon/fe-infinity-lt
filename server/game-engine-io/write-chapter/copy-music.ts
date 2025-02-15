import copyFileToLtMaker from "@/file-io/copy-file-to-lt-maker.ts";
import readOrCreateJSON from "@/game-engine-io/read-or-create-json.ts";
import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";

export async function copyMusicAndUpdateJson({
  projectNameEndingInDotLtProj,
  music,
}: {
  projectNameEndingInDotLtProj: string;
  music: string[];
}): Promise<void> {
  const relativeMusicDir = `${projectNameEndingInDotLtProj}/resources/music`;
  const musicDir = getPathWithinLtMaker(relativeMusicDir);
  const musicJsonPath = `${musicDir}/music.json`;

  const [musicData, wasFallback] = await readOrCreateJSON<
    [string, boolean, boolean][]
  >(musicJsonPath, [], musicJsonPath);

  for (const trackName of music) {
    const sourceFilePath = `assets/music/ogg/${trackName}.ogg`;
    await copyFileToLtMaker({
      filePathInServer: sourceFilePath,
      ltMakerSubdirectory: relativeMusicDir,
      newFileName: `${trackName}.ogg`,
    });

    if (!musicData.some((entry) => entry[0] === trackName)) {
      musicData.push([trackName, false, false]);
    }
  }

  if (!wasFallback) {
    await Deno.writeTextFile(musicJsonPath, JSON.stringify(musicData, null, 2));
  }
}

if (import.meta.main) {
  // Quick test
  copyMusicAndUpdateJson({
    projectNameEndingInDotLtProj: "_revenant-oath.ltproj",
    music: ["alls-well", "march-of-the-marauders"],
  }).then(() => console.log("Music copy & JSON update done."));
}

