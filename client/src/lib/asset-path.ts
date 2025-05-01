/**
 * Check if we're running in Electron
 */
export function isElectron(): boolean {
    // Check if the window object and electron global exist
    return typeof window !== 'undefined' && !!window.electron;
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
        const electronPath = `asset://${cleanPath}`;
        return electronPath;
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

// Import the user asset path utility
import { getUserTitleImagePath } from './user-asset-path';

/**
 * Gets the title image path for a game
 * 
 * @param gameDirectory The game directory name (with or without .ltproj extension)
 * @returns The path to the title image
 */
export function getTitleImagePath(gameDirectory: string): string {
    // For user assets, we need to use a fallback approach since we can't make this function async
    // without changing all components that use it.
    // User assets will be loaded asynchronously after initial render

    // Trigger async load but don't wait for it
    getUserTitleImagePath(gameDirectory).then(userPath => {
        if (userPath) {
            // If we find a user asset, we'll update the image src dynamically via a custom event
            const event = new CustomEvent('user-asset-loaded', {
                detail: {
                    gameDirectory,
                    path: userPath
                }
            });
            window.dispatchEvent(event);
        }
    }).catch(err => {
        console.error(`Error fetching user asset: ${err}`);
    });

    // Return a standard path as the initial value
    const cleanName = gameDirectory.replace(/\.ltproj$/, "");
    const titleImagePath = getImagePath(`title-images/${cleanName}.png`);
    return titleImagePath;
} 