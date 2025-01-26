import {
  getLtMakerPath,
  getPathWithinLtMaker,
} from "@/file-io/get-path-within-lt-maker.ts";
import writeFileWithinLtMaker from "@/file-io/write-file-within-lt-maker.ts";
import runPythonScript from "@/lib/run-python-script.ts";

export default async function createNewProject(projectName: string) {
  const initProjectScriptPath = getPathWithinLtMaker("create_new_project.py");
  const newProjectNameEndingInDotLtProj = projectName + ".ltproj";
  // python initialize_new_project.py <nid> <title> <lt_project_base_path> <new_project_relative_path>
  await runPythonScript({
    pathToPythonScript: initProjectScriptPath,
    args: ["2", projectName, getLtMakerPath(), newProjectNameEndingInDotLtProj],
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
  return newProjectNameEndingInDotLtProj;
}

if (import.meta.main) {
  await createNewProject("_new");
}

