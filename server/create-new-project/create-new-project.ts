import { copyDefaultProject } from "./copy-default-project.ts";
import removeDefaultFiles from "./remove-default-files.ts";

export default async function createNewProject(
  newProjectName: string
): Promise<string> {
  const newProjectNameEndingInDotLtProj = `${newProjectName}.ltproj`;
  await copyDefaultProject(newProjectNameEndingInDotLtProj);
  await removeDefaultFiles(newProjectNameEndingInDotLtProj);

  return newProjectNameEndingInDotLtProj;
}

