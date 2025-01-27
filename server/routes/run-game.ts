import runGame from "@/run-game.ts";

export async function handleRunGame(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as { directory?: string };
    if (!body?.directory) {
      return new Response(
        JSON.stringify({ success: false, error: "No directory provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await runGame(body.directory);

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
  // Example usage
  const mockRequest = new Request("https://example.com/run-game", {
    method: "POST",
    body: JSON.stringify({ directory: "_new.ltproj" }),
  });
  handleRunGame(mockRequest).then(async (res) => {
    console.log("Response:", await res.json());
  });
}