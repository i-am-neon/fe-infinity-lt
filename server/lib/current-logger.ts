import { getLogger, Logger } from "@/lib/logger.ts";

let currentLogger: Logger | null = null;

export function setCurrentProject(projectName: string): void {
  currentLogger = getLogger(projectName);
}

export function getCurrentLogger(): Logger {
  if (!currentLogger) {
    currentLogger = getLogger("-");
  }
  return currentLogger;
}

if (import.meta.main) {
  // Example usage: set the current project and then log an event.
  setCurrentProject("demo-project");
  const logger = getCurrentLogger();
  logger.info("Current project logger is now active", {
    project: "demo-project",
  });
}

