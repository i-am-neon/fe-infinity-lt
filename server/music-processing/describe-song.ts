import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

export default async function describeSong() {
  const { response } = await generateText({
    model: openai("gpt-4o-audio-preview"),
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "What is the audio saying?" },
          {
            type: "file",
            mimeType: "audio/mpeg",
            data: Deno.readFileSync(
              getPathWithinServer("assets/test/fodlan-winds-short.mp3")
            ),
          },
        ],
      },
    ],
  });
  return response.messages[0].content[0];
}

if (import.meta.main) {
  console.log(await describeSong());
}

