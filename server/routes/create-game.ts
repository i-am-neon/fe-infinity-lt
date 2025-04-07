import chooseTopLevelMusic from "@/ai/choose-top-level-music.ts";
import genChapter, { ChapterGenerationProgressEvent } from "@/ai/gen-chapter.ts";
import genInitialGameIdea from "@/ai/gen-initial-game-idea.ts";
import genWorldSummary from "@/ai/gen-world-summary.ts";
import initializeProject from "@/game-engine-io/initialize-project.ts";
import writeChapter from "@/game-engine-io/write-chapter/write-chapter.ts";
import writeStubChapter from "@/game-engine-io/write-chapter/write-stub-chapter.ts";
import { getCurrentLogger, setCurrentLogger } from "@/lib/current-logger.ts";
import removeExistingGame from "@/lib/remove-existing-game.ts";
import runGame from "@/run-game.ts";
import { Game } from "@/types/game.ts";
import { insertGame } from "../db/games.ts";

// Game creation steps indices (matching the UI steps)
const GAME_CREATION_STEPS = {
  INITIALIZE_PROJECT: 0,
  CREATE_WORLD: 1,
  GENERATE_CHARACTERS: 2,
  DESIGN_WORLD_MAP: 3,
  CREATE_PLAYER_ARMY: 4,
  SETUP_CONDITIONS: 5,
  GENERATE_STORYLINE: 6,
  CREATE_FIRST_CHAPTER: 7,
  SETUP_GAME_FILES: 8,
  FINALIZE: 9
};

// In-memory store for game creation errors
const gameCreationErrors = new Map<string, string>();

// In-memory store for game creation progress
const gameCreationProgress = new Map<string, ChapterGenerationProgressEvent>();

// Expose method to get creation errors for other endpoints
export function getGameCreationError(gameNid: string): string | undefined {
  return gameCreationErrors.get(gameNid);
}

// Expose method to get creation progress for other endpoints
export function getGameCreationProgress(gameNid: string): ChapterGenerationProgressEvent | undefined {
  return gameCreationProgress.get(gameNid);
}

export async function handleCreateGame(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as {
      title?: string;
      description?: string;
      tone?: string;
    };
    if (!body.title || !body.description || !body.tone) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing title, description, or tone",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const projectName = body.title;
    const description = body.description;
    const tone = body.tone;

    // 1) remove existing game if it exists, initialize project to get gameNid
    await removeExistingGame(projectName);
    const { projectNameEndingInDotLtProj, gameNid } = await initializeProject(
      projectName
    );

    // Setup logger first so we can log progress
    setCurrentLogger({
      projectName: projectNameEndingInDotLtProj,
      chapterNumber: 0,
    });
    const logger = getCurrentLogger();

    // Set initial progress
    gameCreationProgress.set(gameNid, {
      step: GAME_CREATION_STEPS.INITIALIZE_PROJECT,
      message: "Initializing project..."
    });
    logger.info(`Game creation progress: Initializing project (step ${GAME_CREATION_STEPS.INITIALIZE_PROJECT})`);

    // Insert a minimal game record so that the DB definitely has the game
    const partialGame: Game = {
      nid: gameNid,
      title: projectName,
      directory: projectNameEndingInDotLtProj,
      description,
      chapters: [],
      characters: [],
      tone,
      usedPortraits: [],
    };
    insertGame(partialGame);

    // 2) respond now that we have a minimal record
    const quickResponse = new Response(
      JSON.stringify({
        success: true,
        gameNid,
        message:
          "Initial game record created. Generation tasks are continuing in the background.",
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // 3) run the rest of the tasks in the background
    (async () => {
      const startTime = Date.now();
      try {
        // Generate world summary
        gameCreationProgress.set(gameNid, {
          step: GAME_CREATION_STEPS.CREATE_WORLD,
          message: "Creating game world..."
        });
        logger.info(`Game creation progress: Creating game world (step ${GAME_CREATION_STEPS.CREATE_WORLD})`);

        const worldSummary = await genWorldSummary({
          gameName: projectName,
          gameDescription: description,
          tone,
        });

        // Design world map / select music
        gameCreationProgress.set(gameNid, {
          step: GAME_CREATION_STEPS.DESIGN_WORLD_MAP,
          message: "Designing world map..."
        });
        logger.info(`Game creation progress: Designing world map (step ${GAME_CREATION_STEPS.DESIGN_WORLD_MAP})`);

        const topLevelMusics = await chooseTopLevelMusic({
          projectNameEndingInDotLtProj,
          gameDescription: description,
          tone,
        });

        // Generate storyline / initial game idea
        gameCreationProgress.set(gameNid, {
          step: GAME_CREATION_STEPS.GENERATE_STORYLINE,
          message: "Generating storyline..."
        });
        logger.info(`Game creation progress: Generating storyline (step ${GAME_CREATION_STEPS.GENERATE_STORYLINE})`);

        const initialGameIdea = await genInitialGameIdea({
          worldSummary,
          tone,
        });

        // Setup initial conditions before chapter creation
        gameCreationProgress.set(gameNid, {
          step: GAME_CREATION_STEPS.SETUP_CONDITIONS,
          message: "Setting up initial conditions..."
        });
        logger.info(`Game creation progress: Setting up initial conditions (step ${GAME_CREATION_STEPS.SETUP_CONDITIONS})`);

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create the first chapter (prologue)
        gameCreationProgress.set(gameNid, {
          step: GAME_CREATION_STEPS.CREATE_FIRST_CHAPTER,
          message: "Creating first chapter..."
        });
        logger.info(`Game creation progress: Creating first chapter (step ${GAME_CREATION_STEPS.CREATE_FIRST_CHAPTER})`);

        const { chapter, usedPortraits, musicToCopy } = await genChapter({
          worldSummary,
          initialGameIdea,
          tone,
          chapterNumber: 0,
          onProgress: (progress) => {
            // For chapter generation, we're still in the CREATE_FIRST_CHAPTER step
            // but we can update the message to reflect the sub-step progress
            gameCreationProgress.set(gameNid, {
              step: GAME_CREATION_STEPS.CREATE_FIRST_CHAPTER,
              message: progress.message || "Creating first chapter..."
            });
            logger.info(`Game creation progress: Still creating first chapter - ${progress.message} (step ${GAME_CREATION_STEPS.CREATE_FIRST_CHAPTER})`);
          },
        });

        // Set up game files
        gameCreationProgress.set(gameNid, {
          step: GAME_CREATION_STEPS.SETUP_GAME_FILES,
          message: "Setting up game files..."
        });
        logger.info(`Game creation progress: Setting up game files (step ${GAME_CREATION_STEPS.SETUP_GAME_FILES})`);

        // write the prologue to LT
        await writeChapter({
          projectNameEndingInDotLtProj,
          chapter,
          music: [...topLevelMusics, ...musicToCopy],
        });

        // write a stub for the next chapter
        await writeStubChapter({
          projectNameEndingInDotLtProj,
          chapterNumber: 1,
          previousTilemapNid: chapter.tilemap.nid,
        });

        // Finalize game creation
        gameCreationProgress.set(gameNid, {
          step: GAME_CREATION_STEPS.FINALIZE,
          message: "Finalizing game creation..."
        });
        logger.info(`Game creation progress: Finalizing game creation (step ${GAME_CREATION_STEPS.FINALIZE})`);

        // The minimal record is already inserted. Let's update it now that we have full data.
        const updatedGame: Game = {
          nid: gameNid,
          title: projectName,
          directory: projectNameEndingInDotLtProj,
          description,
          chapters: [chapter],
          characters: chapter.newCharacters,
          tone,
          usedPortraits,
          worldSummary,
          initialGameIdea,
        };
        insertGame(updatedGame);

        const duration = Date.now() - startTime;
        logger.info("New Game Created", { newGame: updatedGame, duration });

        // Wait a moment before clearing progress to ensure UI captures completion
        setTimeout(() => {
          // Clear the progress to indicate completion
          gameCreationProgress.delete(gameNid);
          logger.info(`Game creation progress cleared for ${gameNid}`);
        }, 5000);

        runGame(projectNameEndingInDotLtProj);
      } catch (err) {
        const logger = getCurrentLogger();
        const errorMsg = err instanceof Error ? err.message : String(err);
        logger.error("Error creating game", { error: errorMsg });

        // Set error flag in progress
        gameCreationProgress.set(gameNid, {
          step: 0,
          message: errorMsg,
          error: true
        });

        // Store error in memory map for retrieval
        gameCreationErrors.set(gameNid, errorMsg);
      }
    })();

    return quickResponse;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

