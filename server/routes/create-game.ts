import genAndWritePrologue from "../gen-and-write-prologue.ts";
import runGame from "@/run-game.ts";
import { insertGame } from "@/db/games.ts";

export async function handleCreateGame(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as { title?: string; description?: string; tone?: string };
    if (!body.title || !body.description || !body.tone) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing title, description, or tone" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { gameNid, projectNameEndingInDotLtProj } = await genAndWritePrologue(
      body.title, body.description, body.tone
    );
    insertGame({
      nid: gameNid,
      title: body.title,
      directory: projectNameEndingInDotLtProj,
      description: body.description,
      tone: body.tone,
      chapters: [],
      characters: [],
    });

    // Run game without waiting
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
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      // fallback for truly unknown error shapes
      return new Response(
        JSON.stringify({ success: false, error: "Unknown error" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
}