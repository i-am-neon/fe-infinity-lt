import writeFileWithinLtMaker from "../../file-io/write-file-within-lt-maker.ts";
import addToOrderKeys from "../add-to-orderkeys.ts";

export default async function writeLevel({
  newProjectNameEndingInDotLtProj,
  chapterNumber,
}: {
  newProjectNameEndingInDotLtProj: string;
  chapterNumber: number;
}): Promise<void> {
  const levelJsonData = [
    {
      nid: chapterNumber,
      name: chapterNumber === 0 ? "Prologue" : `Chapter ${chapterNumber}`,
      tilemap: "Prologue",
      bg_tilemap: null,
      party: "Eirika",
      music: {
        player_phase: "Distant Roads",
        enemy_phase: "Shadow of the Enemy",
        other_phase: null,
        enemy2_phase: null,
        player_battle: "Attack",
        enemy_battle: "Defense",
        other_battle: null,
        enemy2_battle: null,
      },
      objective: {
        simple: "Defeat boss",
        win: "Defeat boss",
        loss: "Eirika dies",
      },
      roam: false,
      roam_unit: "Eirika",
      go_to_overworld: false,
      should_record: true,
      units: [],
      regions: [],
      unit_groups: [],
      ai_groups: [],
    },
  ];

  await addToOrderKeys({
    relativeDirPath: `${newProjectNameEndingInDotLtProj}/game_data/levels`,
    orderKey: chapterNumber.toString(),
  });
  await writeFileWithinLtMaker({
    relativePath: `${newProjectNameEndingInDotLtProj}/game_data/levels/${chapterNumber}.json`,
    text: JSON.stringify(levelJsonData, null, 2),
  });
}

