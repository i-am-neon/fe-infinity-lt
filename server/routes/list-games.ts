import { getAllGames } from "@/db/games.ts";

export async function handleListGames(_req: Request): Promise<Response> {
  try {
    const games = getAllGames();
    return new Response(JSON.stringify({ success: true, games }), {
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
      // fallback for truly unknown error shapes
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
  handleListGames(new Request("https://example.com")).then(async (res) => {
    console.log("handleListGames (main) responded with:", await res.json());
  });
}