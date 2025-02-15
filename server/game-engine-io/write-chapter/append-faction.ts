import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import readOrCreateJSON from "@/game-engine-io/read-or-create-json.ts";
import { EnemyFaction } from "@/ai/types/enemy-faction.ts";

export interface FactionData extends EnemyFaction {
  icon_index: [number, number];
}

export default async function appendFaction({
  projectNameEndingInDotLtProj,
  faction,
}: {
  projectNameEndingInDotLtProj: string;
  faction: EnemyFaction;
}): Promise<void> {
  const filePath = getPathWithinLtMaker(
    `${projectNameEndingInDotLtProj}/game_data/factions.json`
  );

  const [factions, wasFallback] = await readOrCreateJSON<FactionData[]>(
    filePath,
    [],
    projectNameEndingInDotLtProj
  );

  // If a faction with the same nid already exists, do nothing
  if (factions.some((f) => f.nid === faction.nid)) {
    return;
  }

  factions.push({ ...faction, icon_index: [0, 0] });
  await Deno.writeTextFile(filePath, JSON.stringify(factions, null, 2));
}

if (import.meta.main) {
  const exampleFaction: FactionData = {
    nid: "BanditRaiders",
    name: "Bandit Raiders",
    desc: "Rough bandits from the mountains.",
    icon_nid: "BanditEmblem",
    icon_index: [0, 0],
  };
  appendFaction({
    projectNameEndingInDotLtProj: "_revenant-oath.ltproj",
    faction: exampleFaction,
  }).then(() => console.log("Appended faction successfully."));
}

