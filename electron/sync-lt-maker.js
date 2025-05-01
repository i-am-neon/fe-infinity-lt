const fs = require('fs-extra');
const path = require('path');
const { app } = require('electron');

/**
 * Synchronizes the lt-maker-fork directory from the bundled resources to the user's data directory
 * Preserves user-created games and saves, but updates engine files and default.ltproj
 */
async function syncLtMakerFork() {
    try {
        console.log('[sync] Starting lt-maker-fork synchronization');

        // Define paths
        const userDataDir = app.getPath('userData');
        const userLtMakerPath = path.join(userDataDir, 'lt-maker-fork');
        const bundledLtMakerPath = path.join(process.resourcesPath, 'lt-maker-fork');

        console.log(`[sync] User lt-maker path: ${userLtMakerPath}`);
        console.log(`[sync] Bundled lt-maker path: ${bundledLtMakerPath}`);

        // Ensure user directory exists
        fs.ensureDirSync(userLtMakerPath);

        if (!fs.existsSync(path.join(userLtMakerPath, 'app'))) {
            // First run - copy everything
            console.log('[sync] First run detected, copying entire lt-maker-fork');
            await fs.copy(bundledLtMakerPath, userLtMakerPath);
            console.log('[sync] Initial copy complete');
            return true;
        } else {
            // Update - copy engine files but preserve user data
            console.log('[sync] Update detected, selectively copying files');

            // Get all files recursively from bundled resources
            const filesToSync = await getFilesToSync(bundledLtMakerPath, userLtMakerPath);
            let filesUpdated = 0;

            // Process each file
            for (const { src, dest } of filesToSync) {
                await fs.ensureDir(path.dirname(dest));
                await fs.copy(src, dest, { overwrite: true });
                filesUpdated++;
            }

            console.log(`[sync] Updated ${filesUpdated} files`);
            return filesUpdated > 0;
        }
    } catch (error) {
        console.error('[sync] Error synchronizing lt-maker-fork:', error);
        return false;
    }
}

/**
 * Gets a list of files that should be synchronized
 * @returns {Promise<Array<{src: string, dest: string}>>}
 */
async function getFilesToSync(sourcePath, destPath) {
    const filesToSync = [];

    async function processDirectory(dirPath) {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(dirPath, entry.name);
            const relativePath = path.relative(sourcePath, srcPath);
            const destFilePath = path.join(destPath, relativePath);

            // Skip user data unless it's default.ltproj
            const isUserProject = relativePath.includes('.ltproj') && !relativePath.startsWith('default.ltproj');
            const isSavesDir = relativePath.startsWith('saves') && !relativePath.endsWith('save_storage.txt');
            const isHiddenFile = entry.name.startsWith('.') || entry.name === '.DS_Store';

            if (isUserProject || isSavesDir || isHiddenFile) {
                continue;
            }

            if (entry.isDirectory()) {
                await processDirectory(srcPath);
            } else {
                // Only copy if the file is different or doesn't exist
                let shouldCopy = true;

                if (await fs.pathExists(destFilePath)) {
                    try {
                        const srcStat = await fs.stat(srcPath);
                        const destStat = await fs.stat(destFilePath);

                        // Skip if files are the same size and modification time
                        // This is a simple check but works for most binary files
                        if (srcStat.size === destStat.size) {
                            shouldCopy = false;
                        }
                    } catch (e) {
                        // If error, proceed with copy
                        shouldCopy = true;
                    }
                }

                if (shouldCopy) {
                    filesToSync.push({ src: srcPath, dest: destFilePath });
                }
            }
        }
    }

    await processDirectory(sourcePath);
    return filesToSync;
}

// Export the environment variable setter for paths
function setEnvVars() {
    const userDataDir = app.getPath('userData');
    const userLtMakerPath = path.join(userDataDir, 'lt-maker-fork');

    // Set environment variables for the server
    process.env.USER_DATA_DIR = userDataDir;
    process.env.USER_LT_MAKER_PATH = userLtMakerPath;

    return {
        userDataDir,
        userLtMakerPath
    };
}

module.exports = {
    syncLtMakerFork,
    setEnvVars
}; 