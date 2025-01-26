import {
  getLtMakerPath,
  getPathWithinLtMaker,
} from "@/file-io/get-path-within-lt-maker.ts";
import writeFileWithinLtMaker from "@/file-io/write-file-within-lt-maker.ts";
import runPythonScript from "@/lib/run-python-script.ts";
import { sluggify } from "@/lib/sluggify.ts";

export default async function initializeProject(projectName: string) {
  const initProjectScriptPath = getPathWithinLtMaker("create_new_project.py");
  const newProjectNameEndingInDotLtProj = `_${sluggify(projectName)}.ltproj`;
  const gameNid = "_" + sluggify(projectName);
  // python initialize_new_project.py <nid> <title> <lt_project_base_path> <new_project_relative_path>
  await runPythonScript({
    pathToPythonScript: initProjectScriptPath,
    args: [
      sluggify(projectName),
      projectName,
      getLtMakerPath(),
      newProjectNameEndingInDotLtProj,
    ],
  });

  // Empty levels.json and events.json
  await writeFileWithinLtMaker({
    relativePath: `${newProjectNameEndingInDotLtProj}/game_data/levels.json`,
    text: "[]",
  });
  await writeFileWithinLtMaker({
    relativePath: `${newProjectNameEndingInDotLtProj}/game_data/events.json`,
    text: "[]",
  });
  return {
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    gameNid,
  };
}

if (import.meta.main) {
  await initializeProject("My Project");
}

