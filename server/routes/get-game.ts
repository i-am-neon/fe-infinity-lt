import { getGameByNid } from "@/db-sqlite/games.ts";
import { getGameCreationError } from "./create-game.ts";

export async function handleGetGame(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    // Extract nid from the path: /games/<nid>
    const parts = url.pathname.split("/");
    const nid = parts[parts.length - 1];

    if (!nid) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing game nid" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const game = getGameByNid(nid);
    if (!game) {
      return new Response(
        JSON.stringify({ success: false, error: "No game found for that nid" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    // Check if there was an error during game creation
    const creationError = getGameCreationError(nid);

    return new Response(
      JSON.stringify({
        success: true,
        game,
        creationError
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
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

if (import.meta.main) {
  // Example usage for local testing
  const mockRequest = new Request("https://example.com/games/test-game", {
    method: "GET",
  });
  handleGetGame(mockRequest).then(async (res) => {
    console.log("handleGetGame (main) responded with:", await res.json());
  });
}