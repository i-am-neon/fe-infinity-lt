// Define the Electron process interface
interface ElectronProcess {
    versions: {
        electron?: string;
        [key: string]: string | undefined;
    };
}

/**
 * Interface for Electron's exposed API
 */
interface ElectronAPI {
    fileExists?: (path: string) => boolean;
    [key: string]: unknown;
}

/**
 * Detect if we're running in an Electron environment
 * Uses multiple detection methods for reliability
 */
export function isElectron(): boolean {
    // Check multiple Electron presence indicators
    const checks = [
        // Check process.versions.electron (traditional method)
        typeof window !== 'undefined' &&
        !!(window as Window & { process?: ElectronProcess })?.process?.versions?.electron,

        // Check for window.electronAPI that would be injected by preload scripts
        typeof window !== 'undefined' && !!(window as Window & { electronAPI?: ElectronAPI })?.electronAPI,

        // Check for Electron in the user agent (might not be reliable in all versions)
        typeof navigator !== 'undefined' &&
        (navigator.userAgent.indexOf('Electron') >= 0)
    ];

    // Consider it Electron if ANY check passes
    const isElectronEnv = checks.some(check => !!check);

    console.log(`[Electron Detection] isElectron checks:`, checks);
    console.log(`[Electron Detection] Final result: ${isElectronEnv}`);

    if (isElectronEnv) {
        console.log('[Electron Detection] Running in Electron environment', {
            process: (window as Window & { process?: ElectronProcess })?.process?.versions,
            electronAPI: !!(window as Window & { electronAPI?: ElectronAPI })?.electronAPI,
            userAgent: navigator.userAgent
        });
    }

    return isElectronEnv;
}

/**
 * Check if we have access to the Electron API for checking file existence
 */
function hasElectronFs(): boolean {
    return isElectron() && !!(window as Window & { electronAPI?: ElectronAPI })?.electronAPI?.fileExists;
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
        console.log(`[Asset Path Debug] Using Electron path: ${electronPath} for ${cleanPath}`);

        // Check if the file exists in Electron if the API is available
        if (hasElectronFs()) {
            try {
                const electronAPI = (window as Window & { electronAPI?: ElectronAPI })?.electronAPI;
                if (electronAPI?.fileExists) {
                    const exists = electronAPI.fileExists(cleanPath);
                    console.log(`[Asset Path Debug] File exists check for ${cleanPath}: ${exists}`);
                }
            } catch (err) {
                console.error(`[Asset Path Debug] Error checking if file exists:`, err);
            }
        }

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
    const path = getAssetPath(`images/${imagePath}`);
    console.log(`[Image Path Debug] Resolving image: ${imagePath} to: ${path}, isElectron: ${isElectron()}`);
    return path;
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
    const titleImagePath = getImagePath(`title-images/${cleanName}.png`);
    console.log(`[Title Image Debug] Game directory: ${gameDirectory}, Clean name: ${cleanName}, Path: ${titleImagePath}`);
    return titleImagePath;
} 