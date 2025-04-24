import { getLogger, Logger } from "@/lib/logger.ts";

let currentLogger: Logger | null = null;

/**
 * Normalizes the project name to be safe for use in file paths
 * by removing problematic characters.
 */
function normalizeProjectName(name: string): string {
  // Remove any risky characters, leaving alphanumeric, dash, underscore, and period
  let normalized = name.replace(/[^a-zA-Z0-9\-_.]/g, "_");

  // Ensure it doesn't start with problematic characters
  normalized = normalized.replace(/^[.\-_]+/, "");

  // If empty after normalization, provide a fallback
  if (!normalized) {
    normalized = "unnamed_project";
  }

  return normalized;
}

export function setCurrentLogger({
  projectName,
  chapterNumber,
}: {
  projectName: string;
  chapterNumber?: number;
}): void {
  // Normalize project name to be safely used in file paths
  const normalizedName = normalizeProjectName(projectName);

  console.log(`Setting current logger for project: ${projectName} (normalized to: ${normalizedName})`);

  currentLogger = getLogger(normalizedName);
  if (chapterNumber !== undefined) {
    console.log(`Setting chapter number: ${chapterNumber}`);
    currentLogger.setChapterNumber(chapterNumber);
  }
}

export function getCurrentLogger(): Logger {
  if (!currentLogger) {
    console.log("No current logger set, using default (-) logger");
    currentLogger = getLogger("-");
  }
  return currentLogger;
}

if (import.meta.main) {
  // Example usage: set the current project and then log an event.
  setCurrentLogger({ projectName: "demo-project" });
  const logger = getCurrentLogger();
  logger.info("Current project logger is now active", {
    project: "demo-project",
  });
}

