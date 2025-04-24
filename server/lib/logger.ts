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
      try {
        this.stream.close();
      } catch (e) {
        console.error(`Error closing previous log stream: ${e}`);
      }
      this.stream = null;
    }

    try {
      // Ensure base log directory exists
      this.ensureDirectoryExists(this.baseLogDir);

      // Ensure project-specific directory exists
      const projectDir = join(this.baseLogDir, this.projectName);
      this.ensureDirectoryExists(projectDir);

      const fileName =
        this.chapterNumber !== null ? `${this.chapterNumber}.log` : `-.log`;
      const logFilePath = join(projectDir, fileName);

      console.log(`Opening log file: ${logFilePath}`);

      try {
        // First check if the file exists - in some cases on packaged apps
        // Deno might fail to detect if a directory exists
        try {
          Deno.statSync(logFilePath);
        } catch {
          // If file doesn't exist, make extra sure parent directory exists
          this.ensureDirectoryExists(projectDir);
        }

        this.stream = Deno.openSync(logFilePath, {
          write: true,
          create: true,
          append: true,
        });

        // Test write to verify the stream is working
        this.stream.writeSync(new TextEncoder().encode(
          JSON.stringify({ timestamp: new Date().toISOString(), message: "Log file opened" }) + "\n"
        ));
      } catch (fileError) {
        console.error(`Failed to open log file ${logFilePath}: ${fileError}`);

        // Try alternative approach for Electron packaged environment
        if (Deno.env.get("ELECTRON_LOG_DIR")) {
          try {
            // Create directory using alternative method
            const command = new Deno.Command("mkdir", {
              args: ["-p", projectDir],
            });
            const output = command.outputSync();
            console.log(`Directory creation result: ${output.code === 0 ? "success" : "failed"}`);

            // Try opening file again
            this.stream = Deno.openSync(logFilePath, {
              write: true,
              create: true,
              append: true,
            });
          } catch (alternativeError) {
            console.error(`Alternative approach failed: ${alternativeError}`);
          }
        }
      }
    } catch (error) {
      console.error(`Failed to open log file for ${this.projectName}:`, error);
      // Don't throw, just continue without logging to file
    }
  }

  // Helper method to ensure a directory exists with better error handling
  private ensureDirectoryExists(dirPath: string) {
    try {
      ensureDirSync(dirPath);
    } catch (error) {
      console.error(`Failed to create directory ${dirPath}: ${error}`);

      // Try alternative approach for Electron packaged environment
      if (Deno.env.get("ELECTRON_LOG_DIR")) {
        try {
          const command = new Deno.Command("mkdir", {
            args: ["-p", dirPath],
          });
          const output = command.outputSync();
          if (output.code !== 0) {
            console.error(`Failed to create directory using command line: ${dirPath}`);
          }
        } catch (alternativeError) {
          console.error(`Alternative directory creation failed: ${alternativeError}`);
        }
      }
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
        `[${level.toUpperCase()}] ${message} ${metadata ? JSON.stringify(metadata) : ""
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
          project: this.projectName,
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

        // If reopened successfully, try to write again
        if (this.stream) {
          const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message: `Retry after reopen: ${message}`,
            metadata: {
              ...metadata,
              project: this.projectName,
              chapter: this.chapterNumber !== null ? this.chapterNumber : "-",
              reopened: true,
            },
          };

          this.stream.writeSync(
            new TextEncoder().encode(JSON.stringify(logEntry, null, 2) + "\n")
          );
        }
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
    if (this.stream) {
      try {
        this.stream.close();
      } catch (error) {
        console.error(`Error closing log file: ${error}`);
      }
      this.stream = null;
    }
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
