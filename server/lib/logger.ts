import { join } from "jsr:@std/path";
import { ensureDirSync } from "jsr:@std/fs";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogOptions {
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
}

export class Logger {
  private baseLogDir: string;
  private projectName: string;
  private stream: Deno.FsFile | null = null;

  constructor(projectName: string) {
    this.projectName = projectName;
    this.baseLogDir = getPathWithinServer("logs");
    ensureDirSync(this.baseLogDir);
    const logFilePath = join(this.baseLogDir, `${projectName}.log`);
    this.stream = Deno.openSync(logFilePath, {
      write: true,
      create: true,
      append: true,
    });
  }

  private writeLog({ level, message, metadata }: LogOptions) {
    if (!this.stream) return;
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata: metadata ?? {},
    };
    this.stream.writeSync(
      new TextEncoder().encode(JSON.stringify(logEntry, null, 2) + "\n")
    );
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
  logger.info("Hello from the logger in main", { greeting: true });
  logger.debug("Some debug info", { debug: "details" });
  logger.error("Simulating an error", { code: 500 });
  logger.close();
  console.log("Finished logging in demo-project logger.");
}

