/**
 * Functions for running games in the Electron environment
 */

/**
 * Sends a request to Electron to run a game project using Wine
 */
export async function sendToElectron(
  projectNameEndingInDotLtProj: string
): Promise<void> {
  // First try direct Electron API if available
  if (typeof Deno.electronAPI !== "undefined" && Deno.electronAPI?.runGame) {
    try {
      await Deno.electronAPI.runGame(projectNameEndingInDotLtProj);
      console.log(
        `Game execution requested via direct Electron API: ${projectNameEndingInDotLtProj}`
      );
      return;
    } catch (error) {
      console.warn(
        "Direct Electron API failed, will try HTTP fallback:",
        error
      );
    }
  }

  // Fallback to HTTP request to Electron's game launcher endpoint (for dev mode)
  try {
    const response = await fetch("http://localhost:8989/run-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectPath: projectNameEndingInDotLtProj }),
    });

    if (!response.ok) {
      throw new Error(`HTTP request failed with status ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Unknown error");
    }

    console.log(
      `Game execution requested via HTTP: ${projectNameEndingInDotLtProj}`
    );
  } catch (error) {
    console.error("Failed to run game via HTTP:", error);
    throw new Error(
      `Could not communicate with Electron app: ${(error as Error).message}`
    );
  }
}

if (import.meta.main) {
  sendToElectron("_test.ltproj")
    .then(() => {
      console.log("Game launch requested");
    })
    .catch((err) => {
      console.error("Failed to launch game:", err);
    });
}
