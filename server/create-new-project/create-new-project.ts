import { copyDefaultProject } from "./copy-default-project.ts";
import removeDefaultFiles from "./remove-default-files.ts";

export default async function createNewProject(
  newProjectName: string
): Promise<void> {
  const newProjectNameEndingInDotLtProj = `${newProjectName}.ltproj`;
  await copyDefaultProject(newProjectNameEndingInDotLtProj);
  await removeDefaultFiles(newProjectNameEndingInDotLtProj);
}

