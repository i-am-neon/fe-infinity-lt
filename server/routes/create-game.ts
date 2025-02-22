import chooseTopLevelMusic from "@/ai/choose-top-level-music.ts";
import genInitialGameIdea from "@/ai/gen-initial-game-idea.ts";
import genWorldSummary from "@/ai/gen-world-summary.ts";
import { insertGame } from "@/db/games.ts";
import initializeProject from "@/game-engine-io/initialize-project.ts";
import writeChapter from "@/game-engine-io/write-chapter/write-chapter.ts";
import writeStubChapter from "@/game-engine-io/write-chapter/write-stub-chapter.ts";
import { getCurrentLogger, setCurrentLogger } from "@/lib/current-logger.ts";
import removeExistingGame from "@/lib/remove-existing-game.ts";
import runGame from "@/run-game.ts";
import { Game } from "@/types/game.ts";
import genChapter from "@/ai/gen-chapter.ts";

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
        setCurrentLogger({
          projectName: projectNameEndingInDotLtProj,
          chapterNumber: 0,
        });
        const logger = getCurrentLogger();

        // generate world summary & top-level music
        const worldSummary = await genWorldSummary({
          gameName: projectName,
          gameDescription: description,
          tone,
        });
        const topLevelMusics = await chooseTopLevelMusic({
          projectNameEndingInDotLtProj,
          gameDescription: description,
          tone,
        });

        // generate the initial game idea
        const initialGameIdea = await genInitialGameIdea({
          worldSummary,
          tone,
        });

        // create the prologue
        const { chapter, usedPortraits, musicToCopy } = await genChapter({
          worldSummary,
          initialGameIdea,
          tone,
          chapterNumber: 0,
        });

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

        // optional runGame
        runGame(projectNameEndingInDotLtProj);
      } catch (err) {
        console.error("Error in background game creation:", err);
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
