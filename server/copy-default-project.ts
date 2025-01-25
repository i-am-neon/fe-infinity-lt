import { getPathWithinLtMaker } from "./path-utils.ts";
import { cp } from "node:fs/promises";

export async function copyDefaultProject(newProjectName: string) {
  const defaultPath = getPathWithinLtMaker("default.ltproj");
  const newPath = getPathWithinLtMaker(`${newProjectName}.ltproj`);
  await cp(defaultPath, newPath, { recursive: true });
  return newPath;
}

if (import.meta.main) {
  copyDefaultProject("new").then((path) => {
    console.log(`Copied default project to: ${path}`);
  });
}
