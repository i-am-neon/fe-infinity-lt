// Define the Electron process interface
interface ElectronProcess {
    versions: {
        electron?: string;
        [key: string]: string | undefined;
    };
}

/**
 * Detect if we're running in an Electron environment
 */
export function isElectron(): boolean {
    return typeof window !== 'undefined' &&
        (window as Window & { process?: ElectronProcess })?.process?.versions?.electron !== undefined;
}

/**
 * Utility function to get the correct path for an asset in both 
 * development and production/electron environments
 * 
 * @param path The relative path to the asset (without leading slash)
 * @returns The correct path to use in the current environment
 */
export function getAssetPath(path: string): string {
    // Remove any leading slash
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;

    // In Electron, use our custom protocol
    if (isElectron()) {
        return `asset://${cleanPath}`;
    }

    // For non-Electron environments (development or production web)
    return `./${cleanPath}`;
}

/**
 * Gets the correct path for an image in the public directory
 * 
 * @param imagePath The path within the public/images directory (without leading slash)
 * @returns The correct image path to use in the current environment
 */
export function getImagePath(imagePath: string): string {
    return getAssetPath(`images/${imagePath}`);
}

/**
 * Gets the title image path for a game
 * 
 * @param gameDirectory The game directory name (with or without .ltproj extension)
 * @returns The path to the title image
 */
export function getTitleImagePath(gameDirectory: string): string {
    // Remove .ltproj extension if present
    const cleanName = gameDirectory.replace(/\.ltproj$/, "");
    return getImagePath(`title-images/${cleanName}.png`);
} 