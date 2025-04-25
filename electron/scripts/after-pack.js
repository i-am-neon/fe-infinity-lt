/**
 * afterPack hook for electron-builder
 * This script runs after the app is packed but before it's signed and compressed
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

module.exports = async function(context) {
  const { appOutDir, packager, electronPlatformName, arch } = context;
  
  console.log(`=== After Pack Hook (${electronPlatformName}) ===`);
  
  // Windows-specific icon handling
  if (electronPlatformName === 'win32') {
    try {
      console.log('Running Windows icon fix...');
      
      // Get the executable path
      const executableName = packager.executableName || 'FE Infinity';
      const exePath = path.join(appOutDir, `${executableName}.exe`);
      
      // Check if executable exists
      if (!fs.existsSync(exePath)) {
        console.error(`Executable not found at: ${exePath}`);
        return;
      }
      
      // Get icon path
      const iconPath = path.resolve(__dirname, '..', 'icons', 'icons', 'win', 'icon.ico');
      
      if (!fs.existsSync(iconPath)) {
        console.error(`Icon not found at: ${iconPath}`);
        return;
      }
      
      console.log(`Setting icon for: ${exePath}`);
      console.log(`Using icon: ${iconPath}`);
      
      // Try using rcedit via npx
      try {
        console.log('Using rcedit to set icon...');
        execSync(`npx rcedit "${exePath}" --set-icon "${iconPath}"`, {
          stdio: 'inherit'
        });
        console.log('Icon set successfully');
      } catch (rceditError) {
        console.error('Error using rcedit:', rceditError.message);
        console.error('Icon may not be applied correctly');
      }
    } catch (error) {
      console.error('Error in Windows icon processing:', error);
    }
  }
  
  console.log('=== After Pack Hook Complete ===');
}; 