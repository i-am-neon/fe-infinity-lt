const fs = require('fs');
const path = require('path');
const { ipcMain, app } = require('electron');
const logger = require('./logger');

/**
 * Gets the user assets directory within the user data directory
 * @returns {string} Path to the user assets directory
 */
function getUserAssetsDir() {
    const userDataPath = app.getPath('userData');
    const assetsDir = path.join(userDataPath, 'game-assets');

    // Ensure the directory exists
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
        logger.log('info', `Created user assets directory at: ${assetsDir}`);
    }

    return assetsDir;
}

/**
 * Gets the title images directory within the user assets directory
 * @returns {string} Path to the title images directory
 */
function getTitleImagesDir() {
    const assetsDir = getUserAssetsDir();
    const titleImagesDir = path.join(assetsDir, 'title-images');

    // Ensure the directory exists
    if (!fs.existsSync(titleImagesDir)) {
        fs.mkdirSync(titleImagesDir, { recursive: true });
        logger.log('info', `Created title images directory at: ${titleImagesDir}`);
    }

    return titleImagesDir;
}

/**
 * Lists all files in the user assets directory for debugging
 */
function logAllUserAssets() {
    try {
        const assetsDir = getUserAssetsDir();
        logger.log('info', `Listing all files in user assets directory: ${assetsDir}`);

        const listFilesRecursively = (dir, prefix = '') => {
            const files = fs.readdirSync(dir);

            files.forEach(file => {
                const fullPath = path.join(dir, file);
                const relativePath = path.join(prefix, file);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    logger.log('info', `Directory: ${relativePath}/`);
                    listFilesRecursively(fullPath, relativePath);
                } else {
                    logger.log('info', `File: ${relativePath} (${stat.size} bytes)`);
                }
            });
        };

        listFilesRecursively(assetsDir);
    } catch (error) {
        logger.log('error', `Error listing user assets: ${error.message}`);
    }
}

/**
 * Registers IPC handlers for user assets related functionality
 */
function registerUserAssetsHandlers() {
    // Handler to get the full path to a user asset
    ipcMain.handle('user-assets:get-path', (_, assetPath) => {
        try {
            const fullPath = path.join(app.getPath('userData'), assetPath);
            const exists = fs.existsSync(fullPath);

            logger.log('info', `Resolving user asset path: ${assetPath} to ${fullPath} (exists: ${exists})`);

            // User assets are served via custom protocol
            return `user-asset://${assetPath}`;
        } catch (error) {
            logger.log('error', `Error getting user asset path for ${assetPath}`, { error: error.message });
            throw error;
        }
    });

    // Handler to check if a user asset exists
    ipcMain.handle('user-assets:has-asset', (_, assetPath) => {
        try {
            const fullPath = path.join(app.getPath('userData'), assetPath);
            const exists = fs.existsSync(fullPath);

            // logger.log('info', `Checking if user asset exists: ${assetPath} (${exists ? 'exists' : 'does not exist'})`);

            if (exists) {
                // If it exists, log the file size for debugging
                const stats = fs.statSync(fullPath);
                // logger.log('info', `Asset file size: ${stats.size} bytes`);
            } else {
                // If it doesn't exist, list all title images to help debug
                const titleImagesDir = getTitleImagesDir();
                if (fs.existsSync(titleImagesDir)) {
                    const files = fs.readdirSync(titleImagesDir);
                    // logger.log('info', `Available title images: ${files.join(', ') || 'none'}`);
                }
            }

            return exists;
        } catch (error) {
            logger.log('error', `Error checking if user asset exists for ${assetPath}`, { error: error.message });
            return false;
        }
    });

    logger.log('info', 'Registered user assets handlers');
}

/**
 * Registers the user-asset protocol for loading user assets
 * @param {Electron.Protocol} protocol - Electron protocol module
 */
function registerUserAssetProtocol(protocol) {
    protocol.registerFileProtocol('user-asset', (request, callback) => {
        try {
            const url = request.url.replace(/^user-asset:\/\//, '');
            const decodedUrl = decodeURI(url).replace(/\/+$/, '');
            const filePath = path.join(app.getPath('userData'), decodedUrl);

            logger.log('info', `User asset request: ${decodedUrl}, resolved to ${filePath}`);

            if (fs.existsSync(filePath)) {
                // Check if file is readable
                fs.accessSync(filePath, fs.constants.R_OK);
                return callback({ path: filePath });
            } else {
                logger.log('error', `User asset not found: ${filePath}`);
                return callback({ error: -6 }); // FILE_NOT_FOUND
            }
        } catch (error) {
            logger.log('error', `Error handling user asset request: ${request.url}`, { error: error.message });
            return callback({ error: -2 }); // FAILED
        }
    });

    logger.log('info', 'Registered user-asset:// protocol');
}

module.exports = {
    getUserAssetsDir,
    getTitleImagesDir,
    logAllUserAssets,
    registerUserAssetsHandlers,
    registerUserAssetProtocol
}; 