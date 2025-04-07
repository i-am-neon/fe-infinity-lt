import { ChapterGenerationProgressEvent } from "@/ai/gen-chapter.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import { chapterGenerationProgress } from "@/create-next-chapter.ts";

// Expose method to get test progress for other endpoints
export function getTestGenerationProgress(gameNid: string): ChapterGenerationProgressEvent | undefined {
    // Use the shared progress map from create-next-chapter.ts
    return chapterGenerationProgress.get(gameNid);
}

// Clear progress when done or on error
export function clearTestGenerationProgress(gameNid: string): void {
    chapterGenerationProgress.delete(gameNid);
}

export async function handleTestChapterGeneration(
    req: Request
): Promise<Response> {
    try {
        const { gameNid } = await req.json();
        if (!gameNid) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Missing gameNid",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const logger = getCurrentLogger();
        logger.info(`Starting test chapter generation simulation for ${gameNid}`);

        // Start the test generation process in the background
        chapterGenerationProgress.set(gameNid, {
            step: 0,
            message: "Initializing game engine..."
        });

        // Simulate progress with 2-second delays
        simulateProgress(gameNid);

        return new Response(
            JSON.stringify({
                success: true,
                message: "Test chapter generation started",
            }),
            {
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        const logger = getCurrentLogger();
        if (error instanceof Error) {
            logger.error("Error in handleTestChapterGeneration", {
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
            logger.error("Error in handleTestChapterGeneration", { error });
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

// Simulate progress with timeouts
async function simulateProgress(gameNid: string) {
    const logger = getCurrentLogger();
    const totalSteps = 17; // Total number of steps including initialization

    const steps = [
        // Initializing phase (first 4 steps)
        { step: 0, message: "Initializing game engine..." },
        { step: 1, message: "Loading game data..." },
        { step: 2, message: "Analyzing previous chapter..." },
        { step: 3, message: "Processing player choices..." },
        // Generation phase (remaining steps)
        { step: 4, message: "Generating chapter idea and storyline..." },
        { step: 5, message: "Creating new characters and assigning traits..." },
        { step: 6, message: "Selecting portraits for characters..." },
        { step: 7, message: "Composing battle music..." },
        { step: 8, message: "Writing dialogue for intro event..." },
        { step: 9, message: "Writing dialogue for outro event..." },
        { step: 10, message: "Selecting background scenes..." },
        { step: 11, message: "Creating the map layout..." },
        { step: 12, message: "Placing units on the battlefield..." },
        { step: 13, message: "Setting up special map interactions..." },
        { step: 14, message: "Writing recruitment conversations..." },
        { step: 15, message: "Creating boss battle dialogues..." },
        { step: 16, message: "Finalizing chapter assembly..." }
    ];

    try {
        for (let i = 0; i < steps.length; i++) {
            // Update progress
            chapterGenerationProgress.set(gameNid, steps[i]);
            logger.info(`Test generation progress: ${steps[i].message}`, { step: steps[i].step });

            // Wait 2 seconds between updates (faster than original 3 seconds)
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Mark as complete
        logger.info(`Test generation complete for ${gameNid}`);

        // Clear progress after a short delay to allow final state to be fetched
        setTimeout(() => {
            clearTestGenerationProgress(gameNid);
        }, 5000);
    } catch (error) {
        logger.error(`Error in simulateProgress for ${gameNid}`, { error });
        chapterGenerationProgress.set(gameNid, {
            step: 0,
            message: "Error in test simulation",
            error: true
        });

        // Clear progress after a delay
        setTimeout(() => {
            clearTestGenerationProgress(gameNid);
        }, 5000);
    }
} 