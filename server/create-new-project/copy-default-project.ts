import { getPathWithinLtMaker } from "../file-io/get-path-within-lt-maker.ts";
import { cp } from "node:fs/promises";

/**
 * Copies the default project to a new project
 * @param newProjectNameEndingInDotLtProj - eg. "my-project.ltproj"
 */
export async function copyDefaultProject(
  newProjectNameEndingInDotLtProj: string
) {
  const defaultPath = getPathWithinLtMaker("default.ltproj");
  const newPath = getPathWithinLtMaker(newProjectNameEndingInDotLtProj);
  await cp(defaultPath, newPath, { recursive: true });
  return newPath;
}

if (import.meta.main) {
  copyDefaultProject("_new").then((path) => {
    console.log(`Copied default project to: ${path}`);
  });
}

