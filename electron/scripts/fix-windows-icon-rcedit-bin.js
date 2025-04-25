/**
 * Script to fix Windows application icon using rcedit-x64
 * This includes downloading and using the rcedit binary directly
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');
const { createWriteStream } = require('fs');
const { exec } = require('child_process');

// Configuration
const electronDir = path.resolve(__dirname, '..');
const iconPath = path.join(electronDir, 'icons', 'icons', 'win', 'icon.ico');
const releaseDir = path.join(electronDir, 'release', 'win-unpacked');
const exePath = path.join(releaseDir, 'FE Infinity.exe');
const rceditUrl = 'https://github.com/electron/rcedit/releases/download/v1.1.1/rcedit-x64.exe';
const rceditPath = path.join(electronDir, 'tools', 'rcedit-x64.exe');

// Retry configuration
const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // 2 seconds

console.log('Fixing Windows application icon with rcedit binary...');

// Check if the icon file exists
if (!fs.existsSync(iconPath)) {
  console.error(`Error: Icon file not found at ${iconPath}`);
  process.exit(1);
}

// Create tools directory if it doesn't exist
const toolsDir = path.dirname(rceditPath);
if (!fs.existsSync(toolsDir)) {
  fs.mkdirSync(toolsDir, { recursive: true });
}

// Sleep function for delays
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to download rcedit if not present
function downloadRcedit() {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(rceditPath)) {
      console.log('rcedit binary already exists');
      return resolve();
    }

    console.log(`Downloading rcedit from ${rceditUrl}...`);
    const file = createWriteStream(rceditPath);
    
    https.get(rceditUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download rcedit: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log('rcedit download complete');
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(rceditPath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Function to copy icon to app.asar.unpacked for reference
function copyIconToUnpacked(exePath) {
  try {
    // Determine the resources directory
    const resourcesDir = path.dirname(path.dirname(exePath)) + '/resources';
    const unpacked = path.join(resourcesDir, 'app.asar.unpacked');
    const unpackedResources = path.join(unpacked, 'resources');
    
    // Create directories if they don't exist
    if (!fs.existsSync(unpackedResources)) {
      fs.mkdirSync(unpackedResources, { recursive: true });
    }
    
    // Copy the icon
    const destIcon = path.join(unpackedResources, 'icon.ico');
    fs.copyFileSync(iconPath, destIcon);
    console.log(`Copied icon to ${destIcon} for reference by the Windows icon fix script`);
    
    // Create the Windows icon fix batch file
    const batchFile = path.join(unpacked, 'fix-icon.bat');
    const winIconFixPath = path.join(electronDir, 'scripts', 'windows-icon-fix.bat');
    
    if (fs.existsSync(winIconFixPath)) {
      fs.copyFileSync(winIconFixPath, batchFile);
      console.log(`Copied Windows icon fix script to ${batchFile}`);
    }
  } catch (error) {
    console.error('Failed to copy icon to unpacked directory:', error.message);
  }
}

// Function to fix icon for a given executable path with retries
async function fixIcon(exePath) {
  if (!fs.existsSync(exePath)) {
    console.log(`Executable not found at ${exePath}`);
    return false;
  }
  
  console.log(`Fixing icon for ${exePath}...`);
  
  try {
    // Make sure we have rcedit
    await downloadRcedit();
    
    // Copy icon to app.asar.unpacked for reference
    copyIconToUnpacked(exePath);
    
    // Try to apply the icon with retries
    let success = false;
    let attempt = 1;
    let lastError = null;
    
    while (!success && attempt <= MAX_RETRIES) {
      try {
        // Run rcedit
        console.log(`Running rcedit with icon ${iconPath} (attempt ${attempt}/${MAX_RETRIES})`);
        execSync(`"${rceditPath}" "${exePath}" --set-icon "${iconPath}"`, {
          cwd: electronDir,
          stdio: 'inherit'
        });
        
        console.log(`Successfully applied icon to ${exePath} on attempt ${attempt}`);
        success = true;
      } catch (error) {
        lastError = error;
        const isAccessDenied = error.message.includes('Access is denied') || 
                               error.message.includes('permission denied');
        
        if (isAccessDenied && attempt < MAX_RETRIES) {
          console.log(`Access denied (attempt ${attempt}/${MAX_RETRIES}). Waiting ${RETRY_DELAY/1000} seconds before retrying...`);
          await sleep(RETRY_DELAY);
          attempt++;
        } else {
          throw error;
        }
      }
    }
    
    // Create a README file explaining how to fix the icon on Windows
    const readmePath = path.join(path.dirname(exePath), 'FIX-ICON-README.txt');
    const readmeContent = `
FE Infinity Icon Fix Instructions
================================

If the application icon appears as the default Electron icon, you can fix it by:

1. Right-click on 'fix-icon.bat' in the installation directory's 'resources/app.asar.unpacked' folder
2. Select "Run as administrator"
3. Follow the on-screen instructions

This will update the application icon and clear the Windows icon cache.

Alternatively, you can:
1. Clear the Windows icon cache manually:
   - Press Win+R, type "ie4uinit.exe -ClearIconCache" and hit Enter
   - Press Win+R, type "ie4uinit.exe -show" and hit Enter
   - Restart Windows Explorer or reboot your computer

2. If the icon still doesn't appear, try reinstalling the application
`;
    fs.writeFileSync(readmePath, readmeContent);
    
    return success;
  } catch (error) {
    console.error(`Failed to apply icon to ${exePath}:`, error.message);
    return false;
  }
}

// Main execution
async function main() {
  let success = false;
  
  // Try to fix icon in the standard location
  if (fs.existsSync(releaseDir)) {
    success = await fixIcon(exePath);
  } else {
    console.log(`Release directory not found at ${releaseDir}`);
    
    // Look for the executable in other possible locations
    const possiblePaths = [
      path.join(electronDir, 'release', 'win-ia32-unpacked', 'FE Infinity.exe'),
      path.join(electronDir, 'out', 'FE Infinity-win32-x64', 'FE Infinity.exe'),
      path.join(electronDir, 'out', 'FE Infinity-win32-ia32', 'FE Infinity.exe')
    ];
    
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        success = await fixIcon(possiblePath) || success;
      }
    }
  }
  
  // Wait a moment before trying the installer file to give it time to be released
  console.log("Waiting 5 seconds before attempting to process installer files...");
  await sleep(5000);
  
  // Also check for NSIS installer if generated
  const installerPattern = /FE Infinity-Setup-.*\.exe$/;
  const releaseFiles = fs.readdirSync(path.join(electronDir, 'release'));
  const installerFile = releaseFiles.find(file => installerPattern.test(file));
  
  if (installerFile) {
    const installerPath = path.join(electronDir, 'release', installerFile);
    success = await fixIcon(installerPath) || success;
  }
  
  if (!success) {
    console.error('Failed to apply icon to any executable. Icon may not appear correctly.');
    process.exit(1);
  } else {
    console.log('Windows application icon fixed successfully!');
    console.log('Note: You may need to clear the Windows icon cache for changes to appear.');
    console.log('To clear the icon cache on Windows:');
    console.log('1. Run: ie4uinit.exe -ClearIconCache');
    console.log('2. Or restart Windows Explorer');
  }
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});