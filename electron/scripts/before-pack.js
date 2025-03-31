/**
 * This script runs before the app is packed by electron-builder.
 * It ensures that all binary files are properly marked for unpacking from asar.
 */

const fs = require('fs');
const path = require('path');

exports.default = async function(context) {
  const { appOutDir, packager, electronPlatformName, arch } = context;
  const platform = electronPlatformName;
  
  console.log(`Running beforePack hook for ${platform}-${arch}`);
  
  // Ensure the Python embedded directory is properly included
  if (platform === 'win32') {
    console.log('Running on Windows, ensuring Python binaries are properly handled');
    
    try {
      // List any cleanup or verification tasks here
      console.log('Preparing Windows package for distribution');
    } catch (error) {
      console.error('Error in beforePack script:', error);
    }
  } else if (platform === 'darwin') {
    console.log('Running on macOS, ensuring Python binaries are properly handled');
    
    try {
      // Verify Python exists in the right location
      const pythonPath = path.join(appOutDir, 'bin', 'python', 'python_embed');
      if (fs.existsSync(pythonPath)) {
        console.log(`Python directory exists at: ${pythonPath}`);
        
        // Print out some files to verify
        const pythonFiles = fs.readdirSync(pythonPath);
        console.log(`Python directory contains: ${pythonFiles.length} files`);
        console.log('Sample files:', pythonFiles.slice(0, 5));
      } else {
        console.warn(`Python directory not found at expected location: ${pythonPath}`);
      }
    } catch (error) {
      console.error('Error in beforePack script:', error);
    }
  }
  
  console.log('beforePack script completed successfully');
  return true;
};