/**
 * Interface for Electron's userAsset API
 */
interface ElectronUserAssetAPI {
    getUserAssetPath?: (assetPath: string) => Promise<string>;
    hasUserAsset?: (assetPath: string) => Promise<boolean>;
    [key: string]: unknown;
}

/**
 * Check if we're running in Electron and the userAssets API is available
 */
export function isElectron(): boolean {
    // Check if the window object and electron global exist
    const hasElectron = typeof window !== 'undefined' && !!window.electron;

    if (hasElectron) {
        // Check if the userAssets API exists
        const hasUserAssetsAPI = !!(window as Window & {
            electron?: { userAssets?: ElectronUserAssetAPI }
        })?.electron?.userAssets;

        return hasUserAssetsAPI;
    }

    return false;
}

/**
 * Check if we have access to the Electron API for user assets
 */
function hasElectronUserAssetAPI(): boolean {
    return isElectron();
}

/**
 * Gets the path to a game title image stored in user data
 * This returns a promise that resolves to the image path or undefined
 * 
 * @param gameDirectory The game directory name (with or without .ltproj extension)
 * @returns Promise that resolves to the path to the title image or undefined
 */
export async function getUserTitleImagePath(gameDirectory: string): Promise<string | undefined> {
    // Remove .ltproj extension if present
    const cleanName = gameDirectory.replace(/\.ltproj$/, "");

    // If in Electron and the API is available, use it
    if (hasElectronUserAssetAPI()) {
        const electronAPI = (window as Window & { electron?: { userAssets?: ElectronUserAssetAPI } })?.electron?.userAssets;
        if (electronAPI?.getUserAssetPath && electronAPI?.hasUserAsset) {
            const assetPath = `game-assets/title-images/${cleanName}.png`;
            // Check if the file exists first
            try {
                const exists = await electronAPI.hasUserAsset(assetPath);

                if (exists) {
                    const assetUrl = await electronAPI.getUserAssetPath(assetPath);
                    return assetUrl;
                }
            } catch (error) {
                console.error(`Error checking user asset: ${assetPath}`, error);
            }
        }
    }

    // If not in Electron or API not available, return undefined
    return undefined;
} 