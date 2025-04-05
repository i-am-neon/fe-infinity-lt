const fs = require('fs');
const path = require('path');

/**
 * This script runs after electron-builder packs the application
 * It restores the original environment configuration
 */
module.exports = async function (context) {
    console.log('Running after-pack.js script...');

    try {
        // Restore the original .env file if it was backed up
        const serverDir = path.join(__dirname, '../../server');
        const envBackupPath = path.join(serverDir, '.env.bak');
        const envPath = path.join(serverDir, '.env');
        const envBuildPath = path.join(serverDir, '.env.build');

        // Restore from backup if it exists
        if (fs.existsSync(envBackupPath)) {
            console.log(`Restoring ${envBackupPath} to ${envPath}`);
            fs.copyFileSync(envBackupPath, envPath);

            // Remove the backup
            console.log(`Removing backup file ${envBackupPath}`);
            fs.unlinkSync(envBackupPath);
        }

        // Clean up build env file
        if (fs.existsSync(envBuildPath)) {
            console.log(`Removing build env file ${envBuildPath}`);
            fs.unlinkSync(envBuildPath);
        }

        console.log('Environment restoration complete.');

        // Add any other cleanup steps here

    } catch (error) {
        console.error('Error in after-pack script:', error);
        // Don't throw error here, as it would fail the build
        // Just log the error and continue
    }
}; 