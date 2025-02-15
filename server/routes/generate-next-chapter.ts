import createNextChapter from "@/create-next-chapter.ts";
import runGame from "@/run-game.ts";
import {
  getCurrentLogger,
  setCurrentLoggerProject,
} from "@/lib/current-logger.ts";

export async function handleGenerateNextChapter(
  req: Request
): Promise<Response> {
  try {
    const { directory, gameNid } = await req.json();
    setCurrentLoggerProject(directory);
    const logger = getCurrentLogger();
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
    const logger = getCurrentLogger();
    if (error instanceof Error) {
      logger.error("Error in handleGenerateNextChapter", {
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
      logger.error("Error in handleGenerateNextChapter", { error });
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

