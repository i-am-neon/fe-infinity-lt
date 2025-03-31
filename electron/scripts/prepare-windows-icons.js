/**
 * Script to ensure Windows icons are properly set up for the application
 * This should be run before packaging the app for Windows
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Preparing Windows app icon resources...');

// Paths
const electronDir = path.resolve(__dirname, '..');
const iconPath = path.join(electronDir, 'icons', 'icons', 'win', 'icon.ico');
const resourcePath = path.join(electronDir, 'resources');

// Ensure the Windows icon exists
if (!fs.existsSync(iconPath)) {
  console.error(`Error: Icon file not found at ${iconPath}`);
  console.log('Generating icon from source...');
  
  try {
    // First try our custom icon generator (more reliable for Windows)
    const createWinIconScript = path.join(__dirname, 'create-win-icon.js');
    if (fs.existsSync(createWinIconScript)) {
      console.log('Using custom Windows icon generator...');
      execSync(`node ${createWinIconScript}`, {
        cwd: electronDir,
        stdio: 'inherit'
      });
    } else {
      // Fallback to electron-icon-builder
      console.log('Falling back to electron-icon-builder...');
      execSync('npx electron-icon-builder --version', { stdio: 'ignore' });
      
      // Source SVG
      const svgSource = path.join(electronDir, '..', 'client', 'public', 'vite.svg');
      
      if (fs.existsSync(svgSource)) {
        console.log(`Generating icons from ${svgSource}...`);
        execSync(`npx electron-icon-builder --input=${svgSource} --output=icons`, {
          cwd: electronDir,
          stdio: 'inherit'
        });
        console.log('Icons generated successfully');
      } else {
        console.error(`Source SVG not found at ${svgSource}`);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('Failed to generate icons:', error.message);
    process.exit(1);
  }
}

// Create Windows resources directory if it doesn't exist
if (!fs.existsSync(resourcePath)) {
  fs.mkdirSync(resourcePath, { recursive: true });
  console.log(`Created resources directory at ${resourcePath}`);
}

// Copy the icon to resources directory for direct access by electron-builder
try {
  const resourceIconPath = path.join(resourcePath, 'icon.ico');
  fs.copyFileSync(iconPath, resourceIconPath);
  console.log(`Copied icon to ${resourceIconPath}`);
} catch (error) {
  console.error('Failed to copy icon to resources directory:', error.message);
}

// Create a Windows resource file for the executable
const resourceFile = path.join(resourcePath, 'app.rc');
const resourceFileContent = `
IDI_ICON1 ICON "icon.ico"
`;

try {
  fs.writeFileSync(resourceFile, resourceFileContent);
  console.log(`Created Windows resource file at ${resourceFile}`);
} catch (error) {
  console.error('Failed to create resource file:', error.message);
}

// Create a manifest file for the application
const manifestFile = path.join(resourcePath, 'app.manifest');
const manifestContent = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0">
  <assemblyIdentity version="1.0.0.0" processorArchitecture="*" name="FE.Infinity.App" type="win32"/>
  <description>FE Infinity - Fire Emblem AI Game</description>
  <dependency>
    <dependentAssembly>
      <assemblyIdentity type="win32" name="Microsoft.Windows.Common-Controls" version="6.0.0.0" processorArchitecture="*" publicKeyToken="6595b64144ccf1df" language="*"/>
    </dependentAssembly>
  </dependency>
  <compatibility xmlns="urn:schemas-microsoft-com:compatibility.v1">
    <application>
      <!-- Windows 10 and 11 -->
      <supportedOS Id="{8e0f7a12-bfb3-4fe8-b9a5-48fd50a15a9a}"/>
      <!-- Windows 8.1 -->
      <supportedOS Id="{1f676c76-80e1-4239-95bb-83d0f6d0da78}"/>
      <!-- Windows 8 -->
      <supportedOS Id="{4a2f28e3-53b9-4441-ba9c-d69d4a4a6e38}"/>
      <!-- Windows 7 -->
      <supportedOS Id="{35138b9a-5d96-4fbd-8e2d-a2440225f93a}"/>
    </application>
  </compatibility>
  <trustInfo xmlns="urn:schemas-microsoft-com:asm.v3">
    <security>
      <requestedPrivileges>
        <requestedExecutionLevel level="asInvoker" uiAccess="false"/>
      </requestedPrivileges>
    </security>
  </trustInfo>
</assembly>
`;

try {
  fs.writeFileSync(manifestFile, manifestContent);
  console.log(`Created Windows manifest file at ${manifestFile}`);
} catch (error) {
  console.error('Failed to create manifest file:', error.message);
}

console.log('Windows icon resources prepared successfully');