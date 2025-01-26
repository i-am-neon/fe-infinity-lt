import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import createNewProject from "./game-engine-io/create-new-project.ts";

serve(async (req: Request): Promise<Response> => {
  const url = new URL(req.url);

  console.log("url.pathname :>> ", url.pathname);

  if (req.method === "GET" && url.pathname === "/ping") {
    console.log("in ping");

    return new Response(JSON.stringify({ result: "Pong" }), {
      headers: { "Content-Type": "text/plain" },
    });
  }

  if (req.method === "POST" && url.pathname === "/createGame") {
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

      const { projectNameEndingInDotLtProj, gameNid } = await createNewProject(
        body.projectName
      );

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

