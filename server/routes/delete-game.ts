import removeWithinLtMaker from "@/file-io/remove-within-lt-maker.ts";
import { removeGameByNid } from "../db/games.ts";
import { getPathWithinClient } from "@/file-io/get-path-within-client.ts";

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

    // Remove from database
    removeGameByNid(nid);

    // Remove LT Maker files
    await removeWithinLtMaker({ relativePath: directory });

    // Remove title image from client
    try {
      // Get project name without .ltproj extension for image path
      const projectName = directory.replace(/\.ltproj$/, "");
      const titleImagePath = getPathWithinClient(`public/images/title-images/${projectName}.png`);

      // Check if file exists before attempting to delete
      const fileInfo = await Deno.stat(titleImagePath).catch(() => null);
      if (fileInfo && fileInfo.isFile) {
        await Deno.remove(titleImagePath);
      }
    } catch (imgError) {
      // Log but don't fail if image deletion fails
      console.error("Failed to delete title image:", imgError);
    }

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
