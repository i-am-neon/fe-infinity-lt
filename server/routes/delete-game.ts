import removeWithinLtMaker from "@/file-io/remove-within-lt-maker.ts";
import { removeGameByNid } from "../db/games.ts";

export async function handleDeleteGame(req: Request): Promise<Response> {
  try {
    const { nid, directory } = await req.json();
    if (!nid || !directory) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing nid or directory",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    removeGameByNid(nid);
    await removeWithinLtMaker({ relativePath: directory });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
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
  const mockRequest = new Request("https://example.com/delete-game", {
    method: "POST",
    body: JSON.stringify({ nid: "test-game", directory: "_test-game.ltproj" }),
  });
  handleDeleteGame(mockRequest).then(async (res) => {
    console.log("handleDeleteGame responded with:", await res.json());
  });
}
