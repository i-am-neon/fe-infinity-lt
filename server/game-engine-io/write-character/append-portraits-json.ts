import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import readOrCreateJSON from "@/game-engine-io/read-or-create-json.ts";

interface PortraitJsonEntry {
  nid: string;
  blinking_offset: [number, number];
  smiling_offset: [number, number];
  info_offset: number;
}

export async function appendPortraitsJson({
  projectNameEndingInDotLtProj,
  nid,
  blinkingOffset,
  smilingOffset,
}: {
  projectNameEndingInDotLtProj: string;
  nid: string;
  blinkingOffset: [number, number];
  smilingOffset: [number, number];
}): Promise<void> {
  const filePath = getPathWithinLtMaker(
    `${projectNameEndingInDotLtProj}/resources/portraits/portraits.json`
  );

  const newPortrait: PortraitJsonEntry = {
    nid,
    blinking_offset: blinkingOffset,
    smiling_offset: smilingOffset,
    info_offset: 0,
  };

  const [portraits, wasFallback] = await readOrCreateJSON<PortraitJsonEntry[]>(
    filePath,
    [newPortrait],
    filePath
  );

  if (!wasFallback) {
    if (!portraits.some((p) => p.nid === nid)) {
      portraits.push(newPortrait);
      await Deno.writeTextFile(filePath, JSON.stringify(portraits, null, 2));
    }
  }
}
