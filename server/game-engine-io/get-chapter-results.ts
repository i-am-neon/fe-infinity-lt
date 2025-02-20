// File: server/get-chapter-results.ts

import runPythonScript from "@/lib/run-python-script.ts";
import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { getHighestSaveNumber } from "@/game-engine-io/get-highest-save-number.ts";

export type ChapterResults = {
  lastChoice: string;
  deadCharacters: string[]; // list of character names who died eg [ "Lute", "O'Neill" ]
};

export default async function getChapterResults({
  gameNid,
  levelNid,
}: {
  gameNid: string;
  levelNid: string;
}): Promise<ChapterResults> {
  const savePrefix = `${gameNid}-preload-${levelNid}`;
  const highestSaveIndex = await getHighestSaveNumber(savePrefix);
  const savePath = getPathWithinLtMaker(
    `saves/${savePrefix}-${highestSaveIndex}.p`
  );

  const { output, error } = await runPythonScript({
    pathToPythonScript: getPathWithinLtMaker("get_chapter_results.py"),
    args: [savePath],
  });
  if (error) {
    console.error("Error from Python script:", error);
    throw new Error(error);
  }

  // engine might print extra lines, so split on newline, parse last line
  const lines = output.trim().split("\n");
  const lastLine = lines[lines.length - 1].trim();

  let results: ChapterResults = { lastChoice: "", deadCharacters: [] };

  try {
    // parse the final JSON line
    const parsed = JSON.parse(lastLine);

    // lastChoice is a string
    const lastChoice: string = parsed.last_choice ?? "";

    // kills is originally an array of objects with {killee: string}
    // we only want the "killee" strings in final output
    const kills = Array.isArray(parsed.kills)
      ? parsed.kills.map((killObj: any) => killObj.killee)
      : [];

    results = { lastChoice, deadCharacters: kills };
  } catch (jsonErr) {
    console.error("Could not parse JSON from Python script:", jsonErr);
  }

  return results;
}

if (import.meta.main) {
  getChapterResults({ gameNid: "_the-grand-tourney", levelNid: "0" })
    .then((res) => {
      console.log("Last Choice:", res.lastChoice);
      console.log("Dead Characters:", res.deadCharacters);
    })
    .catch((err) => {
      console.error("Failed to get chapter results:", err);
    });
}

