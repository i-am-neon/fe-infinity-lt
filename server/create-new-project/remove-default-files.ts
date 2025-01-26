import removeWithinLtMaker from "../file-io/remove-within-lt-maker.ts";

export default async function removeDefaultFiles(
  newProjectNameEndingInDotLtProj: string
): Promise<void> {
  // events
  await removeWithinLtMaker({
    relativePath: `${newProjectNameEndingInDotLtProj}/game_data/events`,
    preserveDirectory: true,
  });

  // levels
  await removeWithinLtMaker({
    relativePath: `${newProjectNameEndingInDotLtProj}/game_data/levels`,
    preserveDirectory: true,
  });
}

