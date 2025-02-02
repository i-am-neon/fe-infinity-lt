import { deleteSuspendSave } from "@/game-engine-io/delete-suspend-save.ts";
import getCurrentChapterNumber from "@/game-engine-io/get-current-chapter-number.ts";
import { removeLastEvent } from "@/game-engine-io/write-chapter/remove-last-event.ts";
import { removeLastLevel } from "@/game-engine-io/write-chapter/remove-last-level.ts";
import writeChapter from "@/game-engine-io/write-chapter/write-chapter.ts";
import writeStubChapter from "@/game-engine-io/write-chapter/write-stub-chapter.ts";
import { stubCh1Events, stubCh1Level } from "@/test-data/stub-ch1.ts";
import { Chapter } from "@/types/chapter.ts";

export default async function createNextChapter({
  projectNameEndingInDotLtProj,
  gameNid,
}: {
  projectNameEndingInDotLtProj: string;
  gameNid: string;
}): Promise<void> {
  const nextChapterNumber = await getCurrentChapterNumber(
    projectNameEndingInDotLtProj
  ).then((currentChapterNumber) => currentChapterNumber + 1);

  // const chapterResults = await getChapterResults({
  //   gameNid,
  //   levelNid: nextChapterNumber.toString(),
  // });
  // console.log("chapterResults :>> ", chapterResults);
  // Use chapter results in data generation

  const nextChapter: Chapter = {
    number: nextChapterNumber,
    title: `Chapter ${nextChapterNumber}`,
    level: stubCh1Level,
    characters: [],
    events: stubCh1Events,
  };

  // Delete stub level and event, and suspend save from stub chapter
  await removeLastLevel(projectNameEndingInDotLtProj);
  await removeLastEvent(projectNameEndingInDotLtProj);
  await deleteSuspendSave();

  await writeChapter({ projectNameEndingInDotLtProj, chapter: nextChapter });

  await writeStubChapter({
    projectNameEndingInDotLtProj,
    chapterNumber: nextChapterNumber + 1,
  });
}

if (import.meta.main) {
  await createNextChapter({
    projectNameEndingInDotLtProj: "_new.ltproj",
    gameNid: "new",
  });
}

