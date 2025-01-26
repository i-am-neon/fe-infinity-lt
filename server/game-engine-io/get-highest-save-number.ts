import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";

export function getHighestSaveNumber(prefix: string): number {
  const files = Deno.readDirSync(getPathWithinLtMaker("saves"));
  let maxNum = -1;

  for (const file of files) {
    const match = file.name.match(new RegExp(`^${prefix}-(\\d+)\\.p(meta)?$`));
    if (match) {
      maxNum = Math.max(maxNum, parseInt(match[1]));
    }
  }

  if (maxNum === -1) {
    throw new Error(`No save files found with prefix ${prefix}`);
  }

  return maxNum;
}

if (import.meta.main) {
  console.log(getHighestSaveNumber("new-preload-1"));
}

