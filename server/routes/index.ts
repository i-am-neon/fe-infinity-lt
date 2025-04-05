import { handlePing } from "@/routes/ping.ts";
import { handleCreateGame } from "@/routes/create-game.ts";
import { Context } from "https://deno.land/x/oak@v12.6.1/context.ts";
import { Status } from "https://deno.land/std@0.192.0/http/http_status.ts";
import { setApiKey } from "@/lib/api-key-manager.ts";

// Process API keys from the request
async function processApiKeys(ctx: Context, next: () => Promise<unknown>) {
  try {
    // Only process POST/PUT requests that might contain API key data
    if (ctx.request.method === "POST" || ctx.request.method === "PUT") {
      const body = await ctx.request.body().value;

      // Check if the request includes API keys
      if (body && typeof body === "object") {
        // Handle OpenAI API key
        if (body.openaiApiKey && typeof body.openaiApiKey === "string") {
          setApiKey("openai", body.openaiApiKey);
          // Remove the API key from the request body to prevent logging
          delete body.openaiApiKey;
        }

        // Handle Anthropic API key
        if (body.anthropicApiKey && typeof body.anthropicApiKey === "string") {
          setApiKey("anthropic", body.anthropicApiKey);
          // Remove the API key from the request body to prevent logging
          delete body.anthropicApiKey;
        }
      }
    }
  } catch (error) {
    console.error("Error processing API keys:", error);
    // Continue even if API key processing fails
  }

  await next();
}

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

  // Process API keys from query parameters for GET/HEAD requests
  if (req.method === "GET" || req.method === "HEAD") {
    try {
      // Check for API key in URL query parameters
      const openaiApiKey = url.searchParams.get("openaiApiKey");

      if (openaiApiKey) {
        if (openaiApiKey.trim() === '') {
          // If empty string is passed, treat as reset request
          setApiKey('');
        } else {
          setApiKey(openaiApiKey);
        }

        // Remove the parameter to avoid exposing the key in logs
        url.searchParams.delete("openaiApiKey");
      }
    } catch (error) {
      console.error("Error processing API key from query parameters:", error);
      // Continue even if processing fails
    }
  }

  // Process API key for POST/PUT requests
  if (req.method === "POST" || req.method === "PUT") {
    try {
      // Clone the request to avoid consuming the body
      const reqClone = req.clone();
      const contentType = req.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const body = await reqClone.json();

        // Check for and process API key
        if (body && typeof body === "object") {
          // Handle OpenAI API key
          if ("openaiApiKey" in body) {
            const openaiApiKey = body.openaiApiKey;
            if (typeof openaiApiKey === "string") {
              if (openaiApiKey.trim() === '') {
                // If empty string is passed, treat as reset request
                setApiKey('');
              } else {
                setApiKey(openaiApiKey);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error processing API key:", error);
      // Continue even if processing fails
    }
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
  } else if (req.method === "POST" && url.pathname === "/test-api-key") {
    // Test OpenAI API key route
    const { handleTestApiKey } = await import("./test-api-key.ts");
    response = await handleTestApiKey(req);
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
  } else if (req.method === "POST" && url.pathname === "/run-editor") {
    const { handleRunEditor } = await import("./run-editor.ts");
    response = await handleRunEditor(req);
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