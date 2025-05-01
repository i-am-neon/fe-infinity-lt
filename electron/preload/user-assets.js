const { contextBridge, ipcRenderer } = require('electron');

// First, check if electron has already been exposed by another preload script
const getExistingElectronObject = () => {
    try {
        // This is a safe way to check if the electron object exists in the window
        return window.electron || {};
    } catch (e) {
        console.log('[User Assets API] No existing electron object found');
        return {};
    }
};

// Get existing electron API if available
const existingElectron = getExistingElectronObject();

// Log what's already available
console.log('[User Assets API] Existing electron API properties:', Object.keys(existingElectron));

/**
 * Exposes user asset related functionality to the renderer process
 * Use a separate method to expose the API to avoid conflicts
 */
contextBridge.exposeInMainWorld('electron', {
    // First, spread existing properties
    ...existingElectron,

    // Then add our userAssets API
    userAssets: {
        /**
         * Gets the full path to a user asset
         * @param {string} assetPath - Path relative to the user assets directory
         * @returns {Promise<string>} Full path to the user asset
         */
        getUserAssetPath: async (assetPath) => {
            console.log(`[User Assets API] Getting path for: ${assetPath}`);
            try {
                const result = await ipcRenderer.invoke('user-assets:get-path', assetPath);
                console.log(`[User Assets API] Path resolved to: ${result}`);
                return result;
            } catch (error) {
                console.error(`[User Assets API] Error getting path for ${assetPath}:`, error);
                throw error;
            }
        },

        /**
         * Checks if a user asset exists
         * @param {string} assetPath - Path relative to the user assets directory
         * @returns {Promise<boolean>} Whether the user asset exists
         */
        hasUserAsset: async (assetPath) => {
            console.log(`[User Assets API] Checking if asset exists: ${assetPath}`);
            try {
                const result = await ipcRenderer.invoke('user-assets:has-asset', assetPath);
                console.log(`[User Assets API] Asset exists check for ${assetPath}: ${result}`);
                return result;
            } catch (error) {
                console.error(`[User Assets API] Error checking if asset exists for ${assetPath}:`, error);
                return false;
            }
        }
    }
});

// Verify the API after exposure to confirm it's available
console.log('[User Assets API] Preload script executed, checking exposed API');

// Wait a short moment and try to check what was actually exposed
setTimeout(() => {
    try {
        const exposedAPI = window.electron?.userAssets;
        if (exposedAPI) {
            console.log('[User Assets API] Successfully exposed API, methods available:', Object.keys(exposedAPI));
        } else {
            console.error('[User Assets API] Failed to expose userAssets API! electron object:', window.electron);
        }
    } catch (error) {
        console.error('[User Assets API] Error checking exposed API:', error);
    }
}, 100); 