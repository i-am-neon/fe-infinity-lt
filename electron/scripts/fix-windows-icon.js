/**
 * Script to fix Windows application icon after the build process
 * This script uses rcedit to directly modify the Windows executable's icon
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get paths
const electronDir = path.resolve(__dirname, '..');
const iconPath = path.join(electronDir, 'icons', 'icons', 'win', 'icon.ico');
const releaseDir = path.join(electronDir, 'release', 'win-unpacked');
const exePath = path.join(releaseDir, 'FE Infinity.exe');
const nsisDirPath = path.join(electronDir, 'release', 'win-ia32-unpacked');
const nsisExePath = path.join(nsisDirPath, 'FE Infinity.exe');

console.log('Fixing Windows application icon post-build...');

// Check if the icon file exists
if (!fs.existsSync(iconPath)) {
  console.error(`Error: Icon file not found at ${iconPath}`);
  process.exit(1);
}

// Install rcedit if not present
try {
  console.log('Checking for rcedit...');
  execSync('npx rcedit --version', { stdio: 'ignore' });
} catch (error) {
  console.log('Installing rcedit...');
  execSync('npm install --no-save rcedit', { stdio: 'inherit' });
}

// Function to fix icon for a given executable path
function fixIcon(exePath) {
  if (fs.existsSync(exePath)) {
    console.log(`Fixing icon for ${exePath}...`);
    try {
      execSync(`npx rcedit "${exePath}" --set-icon "${iconPath}"`, {
        cwd: electronDir,
        stdio: 'inherit'
      });
      console.log(`Successfully applied icon to ${exePath}`);
      return true;
    } catch (error) {
      console.error(`Failed to apply icon to ${exePath}:`, error.message);
      return false;
    }
  } else {
    console.log(`Executable not found at ${exePath}`);
    return false;
  }
}

// Try to fix icon in both possible locations
let success = false;

if (fs.existsSync(releaseDir)) {
  success = fixIcon(exePath) || success;
}

if (fs.existsSync(nsisDirPath)) {
  success = fixIcon(nsisExePath) || success;
}

// Also check for NSIS installer if generated
const installerPattern = /FE Infinity-Setup-.*\.exe$/;
const releaseFiles = fs.readdirSync(path.join(electronDir, 'release'));
const installerFile = releaseFiles.find(file => installerPattern.test(file));

if (installerFile) {
  const installerPath = path.join(electronDir, 'release', installerFile);
  success = fixIcon(installerPath) || success;
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