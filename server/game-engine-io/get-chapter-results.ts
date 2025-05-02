// File: server/get-chapter-results.ts

import runPythonScript from "@/lib/run-python-script.ts";
import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { getHighestSaveNumber } from "@/game-engine-io/get-highest-save-number.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";

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
  const logger = getCurrentLogger();
  const savePrefix = `${gameNid}-preload-${levelNid}`;
  const highestSaveIndex = getHighestSaveNumber(savePrefix);
  const savePath = getPathWithinLtMaker(
    `saves/${savePrefix}-${highestSaveIndex}.p`
  );

  const { output, error } = await runPythonScript({
    pathToPythonScript: getPathWithinLtMaker("get_chapter_results.py"),
    args: [savePath],
  });

  logger.info("get_chapter_results.py results", {
    output,
    error,
  });

  if (error) {
    console.error("Error from Python script:", error);
    throw new Error(error);
  }

  let results: ChapterResults = { lastChoice: "", deadCharacters: [] };

  try {
    // Split the output into lines to find the JSON data
    const lines = output.split('\n');

    // The output might contain multiple lines with the actual JSON at the end
    // Find the line that starts with a JSON object
    const jsonLines = lines.filter(line => line.trim().startsWith('{') && line.trim().endsWith('}'));
    const lastJsonLine = jsonLines.length > 0 ? jsonLines[jsonLines.length - 1].trim() : lines[lines.length - 1].trim();

    // logger.info("Parsing JSON line", { jsonLine: lastJsonLine });

    // parse the JSON line
    const parsed = JSON.parse(lastJsonLine);

    // lastChoice is a string
    const lastChoice: string = parsed.last_choice ?? "";

    // Throw if lastChoice is empty string, null, or undefined
    if (!lastChoice) {
      console.error("Failed to get last choice from save file:", savePath);
      throw new Error(`No choice data found in save file. This could mean the game data was not properly saved or the save file is corrupted. Raw data: ${lastJsonLine}`);
    }

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
  // levelNid must be for the stub chapter
  getChapterResults({ gameNid: "revenant-oath", levelNid: "1" })
    .then((res) => {
      console.log("Last Choice:", res.lastChoice);
      console.log("Dead Characters:", res.deadCharacters);
    })
    .catch((err) => {
      console.error("Failed to get chapter results:", err);
    });
}

