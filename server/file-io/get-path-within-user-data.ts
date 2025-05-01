import { isElectronEnvironment } from "@/lib/env-detector.ts";
import { join } from "node:path";

/**
 * Gets the path to a file or directory within the user data directory.
 * This is used for storing user-specific files that need to persist across app updates.
 * 
 * @param relativePath Path relative to the user data directory
 * @returns The complete path within the user data directory
 */
export function getPathWithinUserData(relativePath: string): string {
    // Get user data directory from environment variable set by Electron
    if (isElectronEnvironment()) {
        const userDataPath = Deno.env.get("USER_DATA_DIR");
        if (userDataPath) {
            return join(userDataPath, relativePath);
        }
    }

    // Fallback for development or if environment variable isn't set
    // In development, we'll store "user data" in a directory at the root of the project
    return join(Deno.cwd(), "dev-user-data", relativePath);
}

/**
 * Gets the path to game assets within the user data directory.
 * 
 * @param relativePath Path relative to the game assets directory within user data
 * @returns The complete path to the game asset within user data
 */
export function getGameAssetPath(relativePath: string): string {
    return getPathWithinUserData(join("game-assets", relativePath));
}

/**
 * Gets the path to a game title image within the user data directory
 * 
 * @param gameNameWithoutExt The game name without .ltproj extension
 * @returns The complete path to the game title image within user data
 */
export function getGameTitleImagePath(gameNameWithoutExt: string): string {
    return getGameAssetPath(join("title-images", `${gameNameWithoutExt}.png`));
} 