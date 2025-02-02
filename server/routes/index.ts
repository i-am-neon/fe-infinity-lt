import { handlePing } from "@/routes/ping.ts";
import { handleCreateGame } from "@/routes/create-game.ts";

export async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (req.method === "GET" && url.pathname === "/ping") {
    // "Ping" route
    return handlePing();
  }

  if (req.method === "GET" && url.pathname === "/games") {
    const { handleListGames } = await import("./list-games.ts");
    return handleListGames(req);
  }

  // GET /games/<nid> for a single game
  if (req.method === "GET" && /^\/games\/[^/]+$/.test(url.pathname)) {
    const { handleGetGame } = await import("./get-game.ts");
    return handleGetGame(req);
  }

  if (req.method === "POST" && url.pathname === "/create-game") {
    // "Create Game" route
    return await handleCreateGame(req);
  }

  if (req.method === "POST" && url.pathname === "/run-game") {
    const { handleRunGame } = await import("./run-game.ts");
    return await handleRunGame(req);
  }

  if (req.method === "POST" && url.pathname === "/generate-next-chapter") {
    const { handleGenerateNextChapter } = await import(
      "./generate-next-chapter.ts"
    );
    return await handleGenerateNextChapter(req);
  }

  if (req.method === "POST" && url.pathname === "/delete-game") {
    const { handleDeleteGame } = await import("./delete-game.ts");
    return await handleDeleteGame(req);
  }

  // Default route
  return new Response("Not Found", { status: 404 });
}

if (import.meta.main) {
  // Example usage for local testing
  const request = new Request("https://example.com/ping", { method: "GET" });
  handleRequest(request).then(async (res) => {
    console.log("Test route responded with:", await res.text());
  });
}

