import appendTilemap from "@/game-engine-io/write-chapter/append-tilemap.ts";
import appendTilesetData from "@/game-engine-io/write-chapter/append-tileset-data.ts";
import { Chapter } from "@/types/chapter.ts";
import { appendEvents } from "@/game-engine-io/write-chapter/append-events.ts";
import { appendLevel } from "@/game-engine-io/write-chapter/append-level.ts";
import writeCharacters from "@/game-engine-io/write-character/write-characters.ts";
import { copyMusicAndUpdateJson } from "@/game-engine-io/write-chapter/copy-music.ts";
import { copyBackgroundsAndUpdateJson } from "@/game-engine-io/write-chapter/copy-backgrounds.ts";
import appendFaction from "@/game-engine-io/write-chapter/append-faction.ts";

export default async function writeChapter({
  projectNameEndingInDotLtProj,
  chapter,
  music,
}: {
  projectNameEndingInDotLtProj: string;
  chapter: Chapter;
  music: string[];
}): Promise<void> {
  // If chapter.enemyFaction is defined, append it to factions.json
  if (chapter.enemyFaction) {
    await appendFaction({
      projectNameEndingInDotLtProj,
      faction: chapter.enemyFaction,
    });
  }

  await appendLevel({
    projectNameEndingInDotLtProj,
    newLevel: chapter.level,
  });
  await appendEvents({
    projectNameEndingInDotLtProj,
    newEvents: chapter.events,
  });
  await appendTilemap({
    projectNameEndingInDotLtProj,
    chapterNumber: chapter.number,
    tilemap: chapter.tilemap,
  });
  await appendTilesetData({
    projectNameEndingInDotLtProj,
    mapNid: chapter.tilemap.nid,
  });
  await writeCharacters({
    characters: chapter.newCharacters,
    projectNameEndingInDotLtProj,
  });
  await copyMusicAndUpdateJson({ projectNameEndingInDotLtProj, music });
  // Copy any scene backgrounds and update panoramas.json
  if (chapter.sceneBackgrounds && chapter.sceneBackgrounds.length > 0) {
    await copyBackgroundsAndUpdateJson({
      projectNameEndingInDotLtProj,
      backgrounds: chapter.sceneBackgrounds,
    });
  }
}

