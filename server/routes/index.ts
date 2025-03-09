import { handlePing } from "@/routes/ping.ts";
import { handleCreateGame } from "@/routes/create-game.ts";

export async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // Process the request and get the response
  let response: Response;

  if (req.method === "GET" && url.pathname === "/ping") {
    // "Ping" route
    response = await handlePing();
  } else if (req.method === "GET" && url.pathname === "/games") {
    const { handleListGames } = await import("./list-games.ts");
    response = await handleListGames(req);
  } else if (req.method === "GET" && /^\/games\/[^/]+$/.test(url.pathname)) {
    // GET /games/<nid> for a single game
    const { handleGetGame } = await import("./get-game.ts");
    response = await handleGetGame(req);
  } else if (req.method === "GET" && url.pathname === "/test-similarity-search") {
    // Test similarity search route
    const { handleTestSimilaritySearch } = await import("./test-similarity-search.ts");
    response = await handleTestSimilaritySearch(req);
  } else if (req.method === "POST" && url.pathname === "/create-game") {
    // "Create Game" route
    response = await handleCreateGame(req);
  } else if (req.method === "POST" && url.pathname === "/add-mock-game") {
    // Add mock game route
    const { handleAddMockGame } = await import("./add-mock-game.ts");
    response = await handleAddMockGame(req);
  } else if (req.method === "POST" && url.pathname === "/run-game") {
    const { handleRunGame } = await import("./run-game.ts");
    response = await handleRunGame(req);
  } else if (req.method === "POST" && url.pathname === "/generate-next-chapter") {
    const { handleGenerateNextChapter } = await import(
      "./generate-next-chapter.ts"
    );
    response = await handleGenerateNextChapter(req);
  } else if (req.method === "POST" && url.pathname === "/delete-game") {
    const { handleDeleteGame } = await import("./delete-game.ts");
    response = await handleDeleteGame(req);
  } else {
    // Default route
    response = new Response("Not Found", { status: 404 });
  }

  // Get the existing headers from the response
  const headers = new Headers(response.headers);
  
  // Add CORS headers to the response
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  // Return a new response with the same body, status, and updated headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

if (import.meta.main) {
  // Example usage for local testing
  const request = new Request("https://example.com/ping", { method: "GET" });
  handleRequest(request).then(async (res) => {
    console.log("Test route responded with:", await res.text());
  });
}