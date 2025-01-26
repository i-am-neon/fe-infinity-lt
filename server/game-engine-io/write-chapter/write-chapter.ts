import writeLevel from "./write-level.ts";

export default async function writeChapter({
  newProjectNameEndingInDotLtProj,
  chapterNumber,
}: {
  newProjectNameEndingInDotLtProj: string;
  chapterNumber: number;
}): Promise<void> {
  await writeLevel({ newProjectNameEndingInDotLtProj, chapterNumber });

  // write event...
}

