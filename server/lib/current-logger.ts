import { getLogger, Logger } from "@/lib/logger.ts";

let currentLogger: Logger | null = null;

export function setCurrentLogger({
  projectName,
  chapterNumber,
}: {
  projectName: string;
  chapterNumber?: number;
}): void {
  currentLogger = getLogger(projectName);
  if (chapterNumber !== undefined) {
    currentLogger.setChapterNumber(chapterNumber);
  }
}

export function getCurrentLogger(): Logger {
  if (!currentLogger) {
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

