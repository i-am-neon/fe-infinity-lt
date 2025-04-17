import createNextChapter, { getChapterGenerationProgress, chapterGenerationProgress } from "@/create-next-chapter.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import runGame from "@/run-game.ts";
import { getGameByNid, insertGame } from "../db/games.ts";

export async function handleGenerateNextChapter(
  req: Request
): Promise<Response> {
  try {
    const { directory, gameNid } = await req.json();
    if (!directory || !gameNid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing directory or gameNid",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const existingGame = getGameByNid(gameNid);
    if (!existingGame) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No game found for that nid",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const quickResponse = new Response(
      JSON.stringify({
        success: true,
        gameNid,
        message:
          "Generating next chapter in the background. You can retrieve the updated game soon.",
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    (async () => {
      const startTime = Date.now();
      try {
        await createNextChapter({
          projectNameEndingInDotLtProj: directory,
          gameNid,
        });

        // Update the DB with the newly appended chapters
        insertGame(existingGame);

        const logger = getCurrentLogger();
        const duration = Date.now() - startTime;
        logger.info("Next chapter generation completed", {
          directory,
          gameNid,
          duration,
        });
        runGame(directory)
      } catch (err) {
        console.error("Error in background next chapter creation:", err);
        // Update the progress state with error information so the client can detect it
        chapterGenerationProgress.set(gameNid, {
          step: -1,
          message: `Error: ${err instanceof Error ? err.message : "Failed to generate next chapter"}`,
          error: true
        });
      }
    })();

    return quickResponse;
  } catch (error: unknown) {
    const logger = getCurrentLogger();
    if (error instanceof Error) {
      logger.error("Error in handleGenerateNextChapter", {
        error: error.message,
      });
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      logger.error("Error in handleGenerateNextChapter", { error });
      return new Response(
        JSON.stringify({ success: false, error: "Unknown error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
}
