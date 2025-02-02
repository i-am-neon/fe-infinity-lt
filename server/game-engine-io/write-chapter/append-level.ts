import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { Level } from "@/types/level.ts";
import readOrCreateJSON from "@/game-engine-io/read-or-create-json.ts";

export async function appendLevel({
  projectNameEndingInDotLtProj,
  newLevel,
}: {
  projectNameEndingInDotLtProj: string;
  newLevel: Partial<Level>;
}): Promise<void> {
  const filePath = getPathWithinLtMaker(
    `${projectNameEndingInDotLtProj}/game_data/levels.json`
  );

  if (!newLevel.nid || !newLevel.name) {
    throw new Error("New level requires nid and name");
  }

  const defaultLevel: Level = {
    nid: newLevel.nid,
    name: newLevel.name,
    tilemap: "Prologue",
    bg_tilemap: null,
    party: "Eirika",
    music: {
      player_phase: "Distant Roads",
      enemy_phase: "Shadow of the Enemy",
      other_phase: null,
      enemy2_phase: null,
      player_battle: "Attack",
      enemy_battle: "Defense",
      other_battle: null,
      enemy2_battle: null,
    },
    objective: {
      simple: "Defeat boss",
      win: "Defeat boss",
      loss: "Eirika dies",
    },
    roam: false,
    roam_unit: "Eirika",
    go_to_overworld: false,
    should_record: true,
    tags: [],
    units: [],
    regions: [],
    unit_groups: [],
    ai_groups: [],
  };

  const [levels, wasFallback] = await readOrCreateJSON<Level[]>(
    filePath,
    [defaultLevel],
    projectNameEndingInDotLtProj
  );

  if (wasFallback) {
    return;
  }

  if (levels.some((level) => level.nid === newLevel.nid)) {
    throw new Error(`Level with nid ${newLevel.nid} already exists`);
  }

  levels.push({ ...defaultLevel, ...newLevel });
  await Deno.writeTextFile(filePath, JSON.stringify(levels, null, 2));
}

if (import.meta.main) {
  appendLevel({
    projectNameEndingInDotLtProj: "_test.ltproj",
    newLevel: {
      nid: "test-level",
      name: "Test Level",
    },
  }).then(() => {
    console.log("Appended level successfully.");
  });
}

