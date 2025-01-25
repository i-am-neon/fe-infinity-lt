import { copyDefaultProject } from "./copy-default-project.ts";

export default async function createNewProject(
  newProjectName: string
): Promise<void> {
  const newProjectNameEndingInDotLtProj = `${newProjectName}.ltproj`;
  await copyDefaultProject(newProjectNameEndingInDotLtProj);
}

