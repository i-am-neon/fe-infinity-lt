import { getChapterGenerationProgress } from "@/create-next-chapter.ts";
import { getGameCreationProgress } from "@/routes/create-game.ts";
import { getTestGenerationProgress } from "@/routes/test-chapter-generation.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";

/**
 * API endpoint to get the current progress of chapter generation for a specific game
 */
export async function handleGetChapterGenerationProgress(
    req: Request
): Promise<Response> {
    try {
        const url = new URL(req.url);
        const gameNid = url.searchParams.get("gameNid");

        if (!gameNid) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Missing gameNid parameter",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // First check if there's test progress
        const testProgress = getTestGenerationProgress(gameNid);
        if (testProgress) {
            return new Response(
                JSON.stringify({
                    success: true,
                    progress: testProgress,
                }),
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // If no test progress, check for real progress
        const progress = getChapterGenerationProgress(gameNid);

        return new Response(
            JSON.stringify({
                success: true,
                progress: progress || { step: 0, message: "Not started" },
            }),
            {
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        const logger = getCurrentLogger();
        if (error instanceof Error) {
            logger.error("Error in handleGetChapterGenerationProgress", {
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
            logger.error("Error in handleGetChapterGenerationProgress", { error });
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

/**
 * API endpoint to get the current progress of game creation for a specific game
 */
export async function handleGetGameCreationProgress(
    req: Request
): Promise<Response> {
    try {
        const url = new URL(req.url);
        const gameNid = url.searchParams.get("gameNid");

        if (!gameNid) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Missing gameNid parameter",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const progress = getGameCreationProgress(gameNid);

        return new Response(
            JSON.stringify({
                success: true,
                progress: progress || { step: 0, message: "Not started" },
            }),
            {
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        const logger = getCurrentLogger();
        if (error instanceof Error) {
            logger.error("Error in handleGetGameCreationProgress", {
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
            logger.error("Error in handleGetGameCreationProgress", { error });
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