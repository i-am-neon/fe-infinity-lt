// This file provides a helper function to get the absolute path to lt-maker/
// whether the script is run from my-monorepo root or from /server.

import { join } from "node:path";

export function getLtMakerPath(): string {
  // 1) We'll get the current working directory
  const cwd = Deno.cwd();

  // 2) Check if we're already in the monorepo root by looking for lt-maker/ directly
  let candidate = join(cwd, "lt-maker");
  try {
    // Try reading the directory to confirm it exists
    Deno.statSync(candidate);
    return candidate; // If it worked, we just return the candidate
  } catch (_) {
    // If not found, we fallback to checking ../lt-maker
  }

  // 3) If the above fails, we assume we might be in the /server directory
  candidate = join(cwd, "..", "lt-maker");
  try {
    Deno.statSync(candidate);
    return candidate;
  } catch (err) {
    throw new Error(`Cannot find lt-maker directory. 
    Please ensure you are in my-monorepo root or /server.\n${err}`);
  }
}

/**
 * Returns the absolute path to a file or directory
 * within the lt-maker repo, given a relative path from lt-maker.
 * @param relPath - The path relative to lt-maker's root (e.g. "default.ltproj")
 * @returns The absolute path to that file or directory
 */
export function getPathWithinLtMaker(relPath: string): string {
  const ltMakerRoot = getLtMakerPath();
  return join(ltMakerRoot, relPath);
}

if (import.meta.main) {
  console.log(getPathWithinLtMaker("default.ltproj"));
}

