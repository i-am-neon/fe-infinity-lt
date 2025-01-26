import writeFileWithinLtMaker from "../../file-io/write-file-within-lt-maker.ts";
import addToOrderKeys from "../add-to-orderkeys.ts";

export default async function writeEvents({
  newProjectNameEndingInDotLtProj,
  chapterNumber,
}: {
  newProjectNameEndingInDotLtProj: string;
  chapterNumber: number;
}): Promise<void> {
  const eventsJsonData = [
    {
      name: "Intro",
      trigger: "level_start",
      level_nid: "0",
      condition: "True",
      commands: [],
      only_once: false,
      priority: 20,
      _source: [],
    },
  ];

  const eventName = `${chapterNumber.toString()}_Intro`;
  await addToOrderKeys({
    relativeDirPath: `${newProjectNameEndingInDotLtProj}/game_data/events`,
    orderKey: eventName,
  });
  await writeFileWithinLtMaker({
    relativePath: `${newProjectNameEndingInDotLtProj}/game_data/events/${eventName}.json`,
    text: JSON.stringify(eventsJsonData, null, 2),
  });
}

