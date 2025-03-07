import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { ensureDirSync } from "jsr:@std/fs";
import { join } from "jsr:@std/path";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogOptions {
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
}

export class Logger {
  private baseLogDir: string;
  private projectName: string;
  private chapterNumber: number | null = null;
  private stream: Deno.FsFile | null = null;

  constructor(projectName: string) {
    this.projectName = projectName || "-";

    // Use Electron log directory if available, otherwise use server path
    const electronLogDir = Deno.env.get("ELECTRON_LOG_DIR");
    this.baseLogDir = electronLogDir
      ? join(electronLogDir, "game_logs")
      : getPathWithinServer("_logs");

    console.log(
      `Logger initialized for project '${projectName}' using base log directory: ${this.baseLogDir}`
    );

    this.openLogFile();
  }

  private openLogFile() {
    if (this.stream) {
      this.stream.close();
      this.stream = null;
    }

    try {
      // Ensure base log directory exists
      ensureDirSync(this.baseLogDir);

      // Ensure project-specific directory exists
      const projectDir = join(this.baseLogDir, this.projectName);
      ensureDirSync(projectDir);

      const fileName =
        this.chapterNumber !== null ? `${this.chapterNumber}.log` : `-.log`;
      const logFilePath = join(projectDir, fileName);

      console.log(`Opening log file: ${logFilePath}`);

      this.stream = Deno.openSync(logFilePath, {
        write: true,
        create: true,
        append: true,
      });
    } catch (error) {
      console.error(`Failed to open log file for ${this.projectName}:`, error);
      // Don't throw, just continue without logging to file
    }
  }

  public setChapterNumber(chapter: number | null) {
    this.chapterNumber = chapter;
    this.openLogFile();
  }

  private writeLog({ level, message, metadata }: LogOptions) {
    if (!this.stream) {
      // If stream isn't available, at least log to console
      console.log(
        `[${level.toUpperCase()}] ${message} ${
          metadata ? JSON.stringify(metadata) : ""
        }`
      );
      return;
    }

    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        metadata: {
          ...metadata,
          chapter: this.chapterNumber !== null ? this.chapterNumber : "-",
        },
      };

      this.stream.writeSync(
        new TextEncoder().encode(JSON.stringify(logEntry, null, 2) + "\n")
      );
    } catch (error) {
      console.error(`Failed to write to log file: ${(error as Error).message}`);

      // Try to reopen the log file
      try {
        this.openLogFile();
      } catch (reopenError) {
        console.error(
          `Failed to reopen log file: ${(reopenError as Error).message}`
        );
      }
    }
  }

  debug(message: string, metadata?: Record<string, unknown>) {
    this.writeLog({ level: "debug", message, metadata });
  }

  info(message: string, metadata?: Record<string, unknown>) {
    this.writeLog({ level: "info", message, metadata });
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    this.writeLog({ level: "warn", message, metadata });
  }

  error(message: string, metadata?: Record<string, unknown>) {
    this.writeLog({ level: "error", message, metadata });
  }

  close() {
    this.stream?.close();
    this.stream = null;
  }
}

const globalLoggerMap = new Map<string, Logger>();

export function getLogger(projectName: string): Logger {
  let logger = globalLoggerMap.get(projectName);
  if (!logger) {
    logger = new Logger(projectName);
    globalLoggerMap.set(projectName, logger);
  }
  return logger;
}

export function closeLogger(projectName: string) {
  const logger = globalLoggerMap.get(projectName);
  if (logger) {
    logger.close();
    globalLoggerMap.delete(projectName);
  }
}

if (import.meta.main) {
  const logger = getLogger("demo-project");
  logger.setChapterNumber(0);
  logger.info("Hello from the logger in main", { greeting: true });
  logger.debug("Some debug info", { debug: "details" });
  logger.error("Simulating an error", { code: 500 });
  logger.setChapterNumber(1);
  logger.info("Now on chapter 1", { example: "someValue" });
  logger.close();
  console.log("Finished logging in demo-project logger.");
}
