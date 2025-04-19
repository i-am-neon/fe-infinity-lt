import genGameIdea from "@/ai/gen-game-idea.ts";

/**
 * Handle POST /generate-story
 * Returns a generated game idea with title, description, and tone.
 */
export async function handleGenerateStory(req: Request): Promise<Response> {
  try {
    // parse optional inputs for generation/tweaking
    const body = (await req.json()) as {
      tags?: string[];
      blurb?: string;
      feedback?: string;
    };
    const { tags, blurb, feedback } = body;
    const idea = await genGameIdea({ tags, blurb, feedback });
    return new Response(
      JSON.stringify({
        success: true,
        title: idea.title,
        description: idea.description,
        tone: idea.tone,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}