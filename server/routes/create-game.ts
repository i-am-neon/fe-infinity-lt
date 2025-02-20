import chooseTopLevelMusic from "@/ai/choose-top-level-music.ts";
import genInitialGameIdea from "@/ai/gen-initial-game-idea.ts";
import genWorldSummary from "@/ai/gen-world-summary.ts";
import { insertGame } from "@/db/games.ts";
import initializeProject from "@/game-engine-io/initialize-project.ts";
import writeChapter from "@/game-engine-io/write-chapter/write-chapter.ts";
import writeStubChapter from "@/game-engine-io/write-chapter/write-stub-chapter.ts";
import { setCurrentLogger } from "@/lib/current-logger.ts";
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

    // 1) remove existing game if it exists
    await removeExistingGame(projectName);

    // 2) initialize a new project
    const { projectNameEndingInDotLtProj, gameNid } = await initializeProject(
      projectName
    );
    setCurrentLogger({
      projectName: projectNameEndingInDotLtProj,
      chapterNumber: 0,
    });

    // 3) generate world summary & top-level music
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

    // 4) generate the initial game idea
    const initialGameIdea = await genInitialGameIdea({
      worldSummary,
      tone,
    });

    // 5) create the prologue (chapterNumber=0)
    const { chapter, usedPortraits, musicToCopy } = await genChapter({
      worldSummary,
      initialGameIdea,
      tone,
      chapterNumber: 0,
    });

    // 6) write the prologue to the LT files
    // also add top level musics
    await writeChapter({
      projectNameEndingInDotLtProj,
      chapter,
      music: [...topLevelMusics, ...musicToCopy],
    });

    // write a stub for chapter 1
    await writeStubChapter({
      projectNameEndingInDotLtProj,
      chapterNumber: 1,
      previousTilemapNid: chapter.tilemap.nid,
    });

    const newGame: Game = {
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

    insertGame(newGame);

    // run the game
    void runGame(projectNameEndingInDotLtProj);

    const responseBody = JSON.stringify({
      success: true,
      projectNameEndingInDotLtProj,
      gameNid,
    });
    return new Response(responseBody, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    const errBody = JSON.stringify({ success: false, error: msg });
    return new Response(errBody, {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

