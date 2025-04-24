import { join } from "node:path";

/**
 * Returns the absolute path to a file or directory
 * within the /client directory, given a relative path.
 */
export function getClientPath(): string {
    const cwd = Deno.cwd();
    let candidate = join(cwd, "client");
    try {
        Deno.statSync(candidate);
        return candidate;
    } catch (_) {
        // If that fails, try going one directory up
    }

    candidate = join(cwd, "..", "client");
    try {
        Deno.statSync(candidate);
        return candidate;
    } catch (err) {
        throw new Error(
            `Cannot find "client" directory. Please ensure you are in the monorepo root or /server.\n${err}`
        );
    }
}

export function getPathWithinClient(relPath: string): string {
    return join(getClientPath(), relPath);
}

if (import.meta.main) {
    console.log(getPathWithinClient("public/images/title-images"));
} 