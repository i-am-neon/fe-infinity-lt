import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import initializeProject from "./game-engine-io/initialize-project.ts";
import writeChapter from "@/game-engine-io/write-chapter/write-chapter.ts";
import writeStubChapter from "@/game-engine-io/write-chapter/write-stub-chapter.ts";
import runGame from "@/run-game.ts";
import { stubPrologue } from "@/test-data/stubPrologue.ts";

serve(async (req: Request): Promise<Response> => {
  const url = new URL(req.url);

  console.log("url.pathname :>> ", url.pathname);

  if (req.method === "GET" && url.pathname === "/ping") {
    console.log("in ping");

    return new Response(JSON.stringify({ result: "Pong" }), {
      headers: { "Content-Type": "text/plain" },
    });
  }

  if (req.method === "POST" && url.pathname === "/create-game") {
    try {
      const body = (await req.json()) as { projectName?: string };
      if (!body.projectName) {
        return new Response(
          JSON.stringify({ success: false, error: "No projectName provided" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Create new project
      const { projectNameEndingInDotLtProj, gameNid } = await initializeProject(
        body.projectName
      );

      // Generate data for initial chapter

      // Modify project files
      await writeChapter({
        projectNameEndingInDotLtProj,
        chapter: stubPrologue,
      });

      await writeStubChapter({
        projectNameEndingInDotLtProj,
        chapterNumber: 1,
      });

      console.log("✅ Project created successfully! Running game...");

      // Run game
      await runGame(projectNameEndingInDotLtProj);

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

  // Default route
  return new Response("Not Found", { status: 404 });
});

