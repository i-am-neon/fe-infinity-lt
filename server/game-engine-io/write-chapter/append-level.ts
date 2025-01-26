import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { Level } from "@/types/game-engine/level.ts";

export async function appendLevel({
  projectNameEndingInDotLtProj,
  newLevel,
}: {
  projectNameEndingInDotLtProj: string;
  newLevel: Partial<Level>;
}): Promise<void> {
  try {
    const filePath = getPathWithinLtMaker(
      `${projectNameEndingInDotLtProj}/game_data/levels.json`
    );
    const content = await Deno.readTextFile(filePath);
    const levels: Level[] = JSON.parse(content);

    if (!newLevel.nid || !newLevel.title) {
      throw new Error("New level requires nid and name");
    }

    if (levels.some((level) => level.nid === newLevel.nid)) {
      throw new Error(`Level with nid ${newLevel.nid} already exists`);
    }

    const defaultLevel: Level = {
      nid: newLevel.nid,
      title: newLevel.title,
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

    levels.push({ ...defaultLevel, ...newLevel });
    await Deno.writeTextFile(filePath, JSON.stringify(levels, null, 2));
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await Deno.writeTextFile(
        projectNameEndingInDotLtProj,
        JSON.stringify([newLevel], null, 2)
      );
      return;
    }
    throw error;
  }
}

if (import.meta.main) {
  await appendLevel({
    projectNameEndingInDotLtProj: "_new.ltproj",
    newLevel: {
      nid: "test",
      title: "Test",
    },
  });
}

