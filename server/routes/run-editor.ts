import runEditor from "@/run-editor.ts";

export async function handleRunEditor(req: Request): Promise<Response> {
  try {
    let projectName: string | null = null;

    // Check if a project name was provided in the request
    if (req.method === "POST") {
      try {
        const requestData = await req.json();
        if (requestData.projectName) {
          projectName = requestData.projectName;
          console.log(`Project name provided: ${projectName}`);
        }
      } catch (e) {
        // No JSON body or invalid JSON - continue without a project name
      }
    }

    // Run the editor with or without a project
    await runEditor(projectName || undefined);

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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectName: "testing_proj"
    }),
  });
  handleRunEditor(mockRequest).then(async (res) => {
    console.log("Response:", await res.json());
  });
}