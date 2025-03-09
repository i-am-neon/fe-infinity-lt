import { Game } from "@/types/game.ts";
import { insertGame } from "@/db/games.ts";
import shortUuid from "@/lib/short-uuid.ts";

export async function handleAddMockGame(req: Request): Promise<Response> {
  try {
    // Generate a unique ID for the mock game
    const mockId = `mock-${shortUuid()}`;
    const projectName = `Mock Game ${mockId}`;
    const directory = `_${mockId}.ltproj`;

    // Create a simple mock game
    const mockGame: Game = {
      nid: mockId,
      title: projectName,
      directory,
      description: "This is a mock game for testing purposes",
      tone: "testing",
      chapters: [],
      characters: [],
      usedPortraits: [],
    };

    // Insert the mock game into the database
    insertGame(mockGame);

    return new Response(
      JSON.stringify({
        success: true,
        game: mockGame,
        message: "Mock game added successfully",
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Error adding mock game:", errorMsg);
    
    return new Response(
      JSON.stringify({ success: false, error: errorMsg }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

if (import.meta.main) {
  const mockRequest = new Request("https://example.com/add-mock-game", {
    method: "POST",
  });
  
  handleAddMockGame(mockRequest).then(async (response) => {
    console.log("Mock game added:", await response.json());
  });
}