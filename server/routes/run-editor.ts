import { join } from "node:path";
import { gameRunner } from "@/lib/game-runner.ts";
import { getLtMakerPath } from "@/file-io/get-path-within-lt-maker.ts";

export async function handleRunEditor(_req: Request): Promise<Response> {
  try {
    const ltMakerPath = getLtMakerPath();
    const editorPythonPath = join(ltMakerPath, "run_editor.py");

    console.log(`Attempting to run LT Maker editor from: ${editorPythonPath}`);
    
    // Run the Python script to start the editor
    await gameRunner.runPythonScript(editorPythonPath);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error running LT Maker editor:", error);
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
  const mockRequest = new Request("https://example.com/run-editor", {
    method: "POST"
  });
  handleRunEditor(mockRequest).then(async (res) => {
    console.log("Response:", await res.json());
  });
}