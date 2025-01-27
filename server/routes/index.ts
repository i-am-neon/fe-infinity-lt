import { handlePing } from "./ping.ts";
import { handleCreateGame } from "./create-game.ts";

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

  if (req.method === "POST" && url.pathname === "/create-game") {
    // "Create Game" route
    return await handleCreateGame(req);
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
