/**
 * This script runs before the app is packed by electron-builder.
 * It ensures that all binary files are properly marked for unpacking from asar.
 */

const fs = require('fs');
const path = require('path');

/**
 * This script runs before electron-builder packs the application
 * It handles preparation tasks like setting up empty/example API keys instead of real ones
 */
module.exports = async function (context) {
  console.log('Running before-pack.js script...');

  try {
    // Copy .env.example to .env for the build
    const serverDir = path.join(__dirname, '../../server');
    const envExamplePath = path.join(serverDir, '.env.example');
    const envBuildPath = path.join(serverDir, '.env.build');

    // First check if the example file exists
    if (fs.existsSync(envExamplePath)) {
      console.log(`Copying ${envExamplePath} to ${envBuildPath}`);
      fs.copyFileSync(envExamplePath, envBuildPath);

      // Rename .env.build to .env for the build process
      const envPath = path.join(serverDir, '.env');

      // If there's an existing .env, back it up
      if (fs.existsSync(envPath)) {
        const envBackupPath = path.join(serverDir, '.env.bak');
        console.log(`Backing up ${envPath} to ${envBackupPath}`);
        fs.copyFileSync(envPath, envBackupPath);
      }

      // Now copy our build env to .env
      console.log(`Copying ${envBuildPath} to ${envPath}`);
      fs.copyFileSync(envBuildPath, envPath);

      console.log('Environment setup complete.');
    } else {
      console.warn(`Warning: ${envExamplePath} doesn't exist!`);
    }

    // Add any other preparation steps here

  } catch (error) {
    console.error('Error in before-pack script:', error);
    throw error;
  }
};