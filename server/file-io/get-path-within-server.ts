import { join } from "node:path";

/**
 * Returns the absolute path to a file or directory
 * within the /server directory, given a relative path.
 */
export function getServerPath(): string {
  const cwd = Deno.cwd();
  let candidate = join(cwd, "server");
  try {
    Deno.statSync(candidate);
    return candidate;
  } catch (_) {
    // If that fails, try going one directory up
  }

  candidate = join(cwd, "..", "server");
  try {
    Deno.statSync(candidate);
    return candidate;
  } catch (err) {
    throw new Error(
      `Cannot find "server" directory. Please ensure you are in the monorepo root or /server.\n${err}`
    );
  }
}

export function getPathWithinServer(relPath: string): string {
  return join(getServerPath(), relPath);
}

if (import.meta.main) {
  console.log(getPathWithinServer("db/connection.ts"));
}