/**
 * Post-installation Windows icon fix script
 * This script is automatically included in the app package and can be run manually if needed
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get paths
const appDir = path.dirname(process.execPath);
const resourcesDir = path.join(appDir, '..', 'resources');
const iconPath = path.join(resourcesDir, 'app.ico');
const executablePath = process.execPath;

console.log('Windows Icon Fix Tool');
console.log('=====================');
console.log(`Application directory: ${appDir}`);
console.log(`Resources directory: ${resourcesDir}`);
console.log(`Icon path: ${iconPath}`);
console.log(`Executable path: ${executablePath}`);

// Check if the icon exists
if (!fs.existsSync(iconPath)) {
  console.error('ERROR: Icon file not found!');
  process.exit(1);
}

// Check if we can access the executable
try {
  fs.accessSync(executablePath, fs.constants.W_OK);
  console.log('Executable has write permissions. Proceeding...');
} catch (error) {
  console.error('ERROR: Cannot write to executable file. Try running as administrator.');
  process.exit(1);
}

// Try to use rcedit if available
try {
  const rceditPath = path.join(resourcesDir, 'app.asar.unpacked', 'tools', 'rcedit-x64.exe');
  
  if (fs.existsSync(rceditPath)) {
    console.log(`Found rcedit at: ${rceditPath}`);
    console.log('Applying icon with rcedit...');
    
    execSync(`"${rceditPath}" "${executablePath}" --set-icon "${iconPath}"`, {
      stdio: 'inherit'
    });
    
    console.log('Icon applied successfully!');
  } else {
    console.log('rcedit not found, trying Resource Hacker...');
    
    // Try to use Resource Hacker if available
    const resourceHackerSetupPath = path.join(appDir, 'reshacker_setup.exe');
    
    // Download Resource Hacker if not present
    if (!fs.existsSync(resourceHackerSetupPath)) {
      console.log('Downloading Resource Hacker...');
      execSync('powershell -Command "Invoke-WebRequest -Uri \'http://www.angusj.com/resourcehacker/reshacker_setup.exe\' -OutFile \'reshacker_setup.exe\'"', {
        cwd: appDir,
        stdio: 'inherit'
      });
    }
    
    // Install Resource Hacker silently
    console.log('Installing Resource Hacker...');
    execSync(`"${resourceHackerSetupPath}" /VERYSILENT /SUPPRESSMSGBOXES /DIR="${appDir}\\ResourceHacker"`, {
      stdio: 'inherit'
    });
    
    // Use Resource Hacker to change the icon
    const resourceHackerPath = path.join(appDir, 'ResourceHacker', 'ResourceHacker.exe');
    
    if (fs.existsSync(resourceHackerPath)) {
      console.log('Applying icon with Resource Hacker...');
      execSync(`"${resourceHackerPath}" -open "${executablePath}" -save "${executablePath}" -action addoverwrite -res "${iconPath}" -mask ICONGROUP,1,1033`, {
        stdio: 'inherit'
      });
      console.log('Icon applied successfully!');
    } else {
      console.error('ERROR: Could not find Resource Hacker after installation');
      process.exit(1);
    }
  }
  
  // Clear icon cache
  console.log('Clearing Windows icon cache...');
  execSync('ie4uinit.exe -ClearIconCache', { stdio: 'inherit' });
  execSync('ie4uinit.exe -show', { stdio: 'inherit' });
  
  console.log('\nIcon has been successfully applied to the application!');
  console.log('You may need to restart your computer for the changes to take effect.');
  
} catch (error) {
  console.error('ERROR:', error.message);
  process.exit(1);
} 