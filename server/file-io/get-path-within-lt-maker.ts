// This file provides a helper function to get the absolute path to lt-maker/
// whether the script is run from my-monorepo root or from /server.

import { join, dirname, resolve } from "node:path";
import { isElectronEnvironment } from "@/lib/env-detector.ts";

let cachedLtMakerPath: string | null = null;

export function getLtMakerPath(): string {
  // Return cached path if available
  if (cachedLtMakerPath) {
    return cachedLtMakerPath;
  }

  const debugPaths: string[] = [];
  const cwd = Deno.cwd();
  debugPaths.push(`Current working directory: ${cwd}`);

  // Check if we're running in Electron environment
  if (isElectronEnvironment()) {
    debugPaths.push("Running in Electron environment");

    // First check environment variables which are most reliable in Electron
    const ltMakerEnvPath = Deno.env.get("LT_MAKER_PATH");
    if (ltMakerEnvPath) {
      try {
        // Make sure the path exists and is a directory
        const stat = Deno.statSync(ltMakerEnvPath);
        if (stat.isDirectory) {
          console.log(`[Path Resolver] Found lt-maker-fork from environment variable: ${ltMakerEnvPath}`);
          cachedLtMakerPath = ltMakerEnvPath;
          return ltMakerEnvPath;
        }
      } catch (e) {
        console.warn(`[Path Resolver] LT_MAKER_PATH environment variable exists but points to invalid path: ${ltMakerEnvPath}`);
      }
    }

    // Try multiple approaches to find lt-maker-fork
    const possiblePaths = [
      // From app root env var
      Deno.env.get("ELECTRON_APP_ROOT")
        ? join(Deno.env.get("ELECTRON_APP_ROOT")!, "lt-maker-fork")
        : null,

      // From server directory env var
      Deno.env.get("SERVER_DIR")
        ? join(dirname(Deno.env.get("SERVER_DIR")!), "lt-maker-fork")
        : null,

      // Based on CWD - go up until we find lt-maker-fork
      join(cwd, "lt-maker-fork"),
      join(cwd, "..", "lt-maker-fork"),
      join(cwd, "..", "..", "lt-maker-fork"),

      // Windows-specific absolute paths for debugging
      Deno.build.os === "windows" 
        ? join(cwd.split("server")[0], "lt-maker-fork") 
        : null,

      // macOS-specific paths
      "/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork",
    ].filter(Boolean) as string[];

    // Try each path
    for (const path of possiblePaths) {
      debugPaths.push(`Trying path: ${path}`);
      try {
        const stat = Deno.statSync(path);
        if (stat.isDirectory) {
          console.log(`[Path Resolver] Found lt-maker-fork at: ${path}`);
          console.log(
            `[Path Resolver] Search path sequence: ${debugPaths.join(" -> ")}`
          );
          cachedLtMakerPath = path;
          return path;
        }
      } catch (e) {
        // Continue to next path
      }
    }

    // Last resort - hardcoded paths based on platform
    const lastResortPath = Deno.build.os === "windows"
      ? "C:\\Users\\tommy\\OneDrive\\Documents\\Dev\\fe-infinity-lt\\lt-maker-fork"
      : "/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork";
      
    console.warn(
      `[Path Resolver] Failed to find lt-maker-fork directory automatically. Using platform-specific hardcoded path: ${lastResortPath}`
    );
    console.warn(
      `[Path Resolver] Search path sequence: ${debugPaths.join(" -> ")}`
    );

    try {
      const stat = Deno.statSync(lastResortPath);
      if (stat.isDirectory) {
        cachedLtMakerPath = lastResortPath;
        return lastResortPath;
      }
    } catch (e) {
      // Fall through to error below
    }
  }

  // Original path resolution logic for non-Electron environments
  debugPaths.push("Trying standard path resolution");

  // 1) Check if we're already in the monorepo root
  let candidate = join(cwd, "lt-maker-fork");
  debugPaths.push(`Checking: ${candidate}`);
  try {
    const stat = Deno.statSync(candidate);
    if (stat.isDirectory) {
      cachedLtMakerPath = candidate;
      return candidate;
    }
  } catch (_) {
    // If not found, continue to next check
  }

  // 2) Try one directory up
  candidate = join(cwd, "..", "lt-maker-fork");
  debugPaths.push(`Checking: ${candidate}`);
  try {
    const stat = Deno.statSync(candidate);
    if (stat.isDirectory) {
      cachedLtMakerPath = candidate;
      return candidate;
    }
  } catch (_) {
    // If not found, continue to next check
  }

  // Error with detailed log
  const errorMsg = `Cannot find lt-maker directory. Search path sequence: ${debugPaths.join(
    " -> "
  )}`;
  console.error(errorMsg);
  throw new Error(errorMsg);
}

/**
 * Returns the absolute path to a file or directory
 * within the lt-maker repo, given a relative path from lt-maker.
 * @param relPath - The path relative to lt-maker's root (e.g. "default.ltproj")
 * @returns The absolute path to that file or directory
 */
export function getPathWithinLtMaker(relPath: string): string {
  const ltMakerRoot = getLtMakerPath();
  
  // Normalize path separators for the platform
  const normalizedRelPath = Deno.build.os === "windows" 
    ? relPath.replace(/\//g, "\\") 
    : relPath.replace(/\\/g, "/");
    
  const fullPath = join(ltMakerRoot, normalizedRelPath);

  // Log path being accessed when in Electron environment for debugging
  if (isElectronEnvironment()) {
    console.log(`[Path Resolver] Accessing: ${fullPath}`);
  }

  return fullPath;
}

/**
 * Given a relative path from the lt-maker directory, 
 * returns the relative path that would work from the current working directory.
 * This is useful for running Python scripts that need to be executed in context.
 */
export function getRelativePathFromCwd(relPathFromLtMaker: string): string {
  const ltMakerRoot = getLtMakerPath();
  const cwd = Deno.cwd();
  
  // Get absolute path of the target file
  const absTargetPath = join(ltMakerRoot, relPathFromLtMaker);
  
  // Get the relative path from cwd to the target
  let relativePath;
  
  try {
    // Use relative path only if we're somewhere within/near the lt-maker directory
    if (cwd.includes('fe-infinity-lt')) {
      relativePath = Deno.build.os === "windows"
        ? absTargetPath.replace(ltMakerRoot + "\\", "") // For Windows
        : absTargetPath.replace(ltMakerRoot + "/", "");  // For Unix
    } else {
      // If completely unrelated directories, use absolute path
      relativePath = absTargetPath;
    }
  } catch (e) {
    console.warn(`Failed to create relative path, using absolute: ${e}`);
    relativePath = absTargetPath;
  }
  
  return relativePath;
}

// Check parent directories exist and create them if needed
export function ensureParentDirsExist(filePath: string): void {
  const dirPath = dirname(filePath);
  try {
    Deno.mkdirSync(dirPath, { recursive: true });
  } catch (e) {
    console.error(`Failed to create directory: ${dirPath}`, e);
    throw e;
  }
}

if (import.meta.main) {
  const path = getPathWithinLtMaker("default.ltproj");
  console.log(`Path resolved to: ${path}`);
  try {
    const stat = Deno.statSync(path);
    console.log(`Path exists: ${stat.isDirectory ? "directory" : "file"}`);
  } catch (e) {
    console.error(`Path does not exist: ${path}`);
  }
}
