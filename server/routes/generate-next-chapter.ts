import createNextChapter from "@/create-next-chapter.ts";
import runGame from "@/run-game.ts";

export async function handleGenerateNextChapter(
  req: Request
): Promise<Response> {
  try {
    const { directory, gameNid } = await req.json();
    if (!directory || !gameNid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing directory or gameNid",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await createNextChapter({
      projectNameEndingInDotLtProj: directory,
      gameNid,
    });

    console.log("✅ generated next chapter. Running game...");

    await runGame(directory);

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
  const mockRequest = new Request("https://example.com/generate-next-chapter", {
    method: "POST",
    body: JSON.stringify({ directory: "_new.ltproj", gameNid: "new" }),
  });
  handleGenerateNextChapter(mockRequest).then(async (res) => {
    console.log("Response:", await res.json());
  });
}

