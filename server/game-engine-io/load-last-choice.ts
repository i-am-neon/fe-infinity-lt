import runPythonScript from "@/lib/run-python-script.ts";
import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";

export default async function loadLastChoice({
  gameNid,
  levelNid,
}: {
  gameNid: string;
  levelNid: string;
}): Promise<string> {
  const savePath = getPathWithinLtMaker(
    `saves/${gameNid}-preload-${levelNid}-0.p`
  );
  const { output, error } = await runPythonScript({
    pathToPythonScript: getPathWithinLtMaker("load_last_choice.py"),
    args: [savePath],
  });
  if (error) {
    console.error("Error from Python script:", error);
    throw new Error(error); // Or return "" if you prefer.
  }
  // 'output' now should contain only the last_choice string or empty.
  return output.trim();
}

if (import.meta.main) {
  loadLastChoice({ gameNid: "new", levelNid: "chapter_1" })
    .then((lastChoice) => {
      console.log("Last Choice is:", lastChoice);
    })
    .catch((err) => {
      console.error("Failed to load last choice:", err);
    });
}
