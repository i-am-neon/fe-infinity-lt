import { getGameByNid, insertGame } from "@/db/games.ts";
import createNextChapter, { chapterGenerationProgress } from "@/create-next-chapter.ts";
import { removeStubLevel } from "@/game-engine-io/write-chapter/remove-stub-level.ts";
import { removeStubEvent } from "@/game-engine-io/write-chapter/remove-stub-event.ts";
import { deleteSuspendSave } from "@/game-engine-io/delete-suspend-save.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import { removeLastLevel } from "@/game-engine-io/write-chapter/remove-level.ts";
import { removeEventsByLevelNid } from "@/game-engine-io/write-chapter/remove-events.ts";
import runGame from "@/run-game.ts";

/**
 * POST /regenerate-current-chapter
 * Pops the last chapter and re-creates it in background.
 */
export async function handleRegenerateCurrentChapter(req: Request): Promise<Response> {
  try {
    const { directory, gameNid } = await req.json();
    if (!directory || !gameNid) {
      return new Response(JSON.stringify({ success: false, error: "Missing directory or gameNid" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const logger = getCurrentLogger();
    logger.info("Regenerating current chapter", {
      directory,
      gameNid,
    });

    const existing = getGameByNid(gameNid);
    if (!existing || existing.chapters.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "No chapter to regenerate" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get the level nid before removing the chapter
    const lastChapter = existing.chapters[existing.chapters.length - 1];
    const levelNid = lastChapter.level.nid;

    // Remove the level entry from levels.json
    await removeLastLevel({
      projectNameEndingInDotLtProj: directory,
      gameNid,
    });

    // Remove events associated with this level
    await removeEventsByLevelNid({
      projectNameEndingInDotLtProj: directory,
      levelNid,
    });

    // Remove last chapter from game data
    existing.chapters.pop();
    insertGame(existing);

    // Clean up stub & suspend-save
    await removeStubLevel(directory);
    await removeStubEvent(directory);
    deleteSuspendSave();

    // Clear any previous progress
    chapterGenerationProgress.delete(gameNid);

    // Kick off background re-generation
    (async () => {
      try {
        await createNextChapter({
          projectNameEndingInDotLtProj: directory,
          gameNid,
        });
        runGame(directory);
      } catch (err) {
        const logger = getCurrentLogger();
        logger.error("Error regenerating chapter", { error: err instanceof Error ? err.message : err });
        chapterGenerationProgress.set(gameNid, {
          step: -1,
          message: `Error: ${err instanceof Error ? err.message : "Failed to regenerate chapter"}`,
          error: true,
        });
      }
    })();

    return new Response(JSON.stringify({
      success: true,
      gameNid,
      message: "Regenerating current chapter"
    }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}