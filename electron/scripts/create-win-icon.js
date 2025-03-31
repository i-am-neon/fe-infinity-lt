/**
 * Script to create a multi-resolution Windows icon file from a source image
 * This is critical for proper icon display in Windows applications
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');
const { createWriteStream } = require('fs');
const { Extract } = require('unzipper');

// Configuration
const electronDir = path.resolve(__dirname, '..');
const sourceImage = path.join(electronDir, 'logo.png'); // Default source image
const outputIcon = path.join(electronDir, 'icons', 'icons', 'win', 'icon.ico');
const resourceIcon = path.join(electronDir, 'resources', 'app.ico');
const tempDir = path.join(electronDir, 'temp');

// Create temp directory if it doesn't exist
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Create resources directory if it doesn't exist
if (!fs.existsSync(path.dirname(resourceIcon))) {
  fs.mkdirSync(path.dirname(resourceIcon), { recursive: true });
}

// Find best source image
function findSourceImage() {
  const possibleSources = [
    path.join(electronDir, 'logo.png'),
    path.join(electronDir, '..', 'client', 'public', 'vite.svg'),
    path.join(electronDir, '..', 'client', 'public', 'logo.png'),
    path.join(electronDir, 'icons', 'icons', 'png', '512x512.png'),
    path.join(electronDir, 'icons', 'icons', 'png', '256x256.png'),
    path.join(electronDir, 'icons', 'icons', 'png', '128x128.png')
  ];

  for (const source of possibleSources) {
    if (fs.existsSync(source)) {
      console.log(`Found source image: ${source}`);
      return source;
    }
  }

  console.warn('No suitable source image found. Please provide a logo.png file in the electron directory.');
  return null;
}

// Download a file from a URL
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url}...`);
    const file = createWriteStream(destPath);
    
    https.get(url, response => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded to ${destPath}`);
        resolve(destPath);
      });
      
      file.on('error', err => {
        fs.unlinkSync(destPath);
        reject(err);
      });
    }).on('error', err => {
      fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

// Extract a zip file
function extractZip(zipPath, destDir) {
  return new Promise((resolve, reject) => {
    console.log(`Extracting ${zipPath} to ${destDir}...`);
    fs.createReadStream(zipPath)
      .pipe(Extract({ path: destDir }))
      .on('close', () => {
        console.log('Extraction complete');
        resolve();
      })
      .on('error', err => {
        reject(err);
      });
  });
}

// Create a Windows icon using PowerShell
async function createWindowsIcon() {
  const source = findSourceImage();
  if (!source) {
    throw new Error('No source image found');
  }
  
  console.log('Creating multi-resolution Windows icon...');
  
  if (process.platform === 'win32') {
    // On Windows, we can use PowerShell directly
    try {
      const psScript = `
        # Create multi-resolution Windows icon
        $sourceImage = "${source.replace(/\\/g, '\\\\')}"
        $outputIcon = "${outputIcon.replace(/\\/g, '\\\\')}"
        $tempDir = "${tempDir.replace(/\\/g, '\\\\')}"
        
        # Create the temp directory if it doesn't exist
        if (-not (Test-Path $tempDir)) {
          New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
        }
        
        # Download the ImageMagick portable version if not installed
        $magickExe = "$tempDir\\magick.exe"
        if (-not (Test-Path $magickExe)) {
          Invoke-WebRequest -Uri "https://imagemagick.org/archive/binaries/ImageMagick-7.1.1-22-portable-Q16-HDRI-x64.zip" -OutFile "$tempDir\\imagemagick.zip"
          Expand-Archive -Path "$tempDir\\imagemagick.zip" -DestinationPath "$tempDir\\ImageMagick" -Force
          Copy-Item -Path "$tempDir\\ImageMagick\\magick.exe" -Destination $magickExe
        }
        
        # Create icons of different sizes
        $sizes = @(16, 32, 48, 64, 128, 256)
        $iconFiles = @()
        foreach ($size in $sizes) {
          $tempIconPath = "$tempDir\\icon_$size.png"
          & $magickExe convert $sourceImage -resize $size"x"$size $tempIconPath
          $iconFiles += $tempIconPath
        }
        
        # Combine into multi-resolution icon
        $iconFilesStr = $iconFiles -join " "
        & $magickExe convert $iconFilesStr $outputIcon
        
        # Copy to resources folder
        Copy-Item -Path $outputIcon -Destination "${resourceIcon.replace(/\\/g, '\\\\')}" -Force
        
        Write-Host "Created multi-resolution icon: $outputIcon"
      `;
      
      // Write the script to a file
      const psScriptPath = path.join(tempDir, 'create-icon.ps1');
      fs.writeFileSync(psScriptPath, psScript);
      
      // Execute the PowerShell script
      execSync(`powershell -ExecutionPolicy Bypass -File "${psScriptPath}"`, { stdio: 'inherit' });
      
      return true;
    } catch (error) {
      console.error('Error creating Windows icon:', error);
      throw error;
    }
  } else {
    // On non-Windows platforms, provide instructions
    console.log(`Cannot create Windows icon on ${process.platform}.`);
    console.log('Please create a multi-resolution Windows icon manually and place it at:');
    console.log(outputIcon);
    
    // Still copy the source image as icon for testing purposes
    if (fs.existsSync(source)) {
      try {
        fs.copyFileSync(source, outputIcon);
        fs.copyFileSync(source, resourceIcon);
        console.log(`Copied source image to icon locations for testing.`);
        console.log('NOTE: This is not a proper Windows icon and will not display correctly in Windows.');
      } catch (err) {
        console.error('Error copying source image:', err);
      }
    }
    
    return false;
  }
}

// Apply icon to executable using rcedit (Windows only)
async function applyIconToExecutable(exePath) {
  if (process.platform !== 'win32') {
    console.log('Cannot apply icon to executable on non-Windows platforms.');
    return false;
  }
  
  try {
    // Download rcedit if not available
    const rceditDir = path.join(tempDir, 'rcedit');
    const rceditPath = path.join(rceditDir, 'rcedit-x64.exe');
    
    if (!fs.existsSync(rceditPath)) {
      if (!fs.existsSync(rceditDir)) {
        fs.mkdirSync(rceditDir, { recursive: true });
      }
      
      await downloadFile(
        'https://github.com/electron/rcedit/releases/download/v1.1.1/rcedit-x64.exe',
        rceditPath
      );
    }
    
    // Apply the icon
    console.log(`Applying icon to ${exePath}...`);
    execSync(`"${rceditPath}" "${exePath}" --set-icon "${outputIcon}"`, { stdio: 'inherit' });
    
    console.log('Icon applied successfully.');
    return true;
  } catch (error) {
    console.error('Error applying icon to executable:', error);
    return false;
  }
}

// Main function
async function main() {
  try {
    await createWindowsIcon();
    
    if (process.argv.includes('--apply') && process.platform === 'win32') {
      // Check for executable path
      const exePathArg = process.argv.find(arg => arg.startsWith('--exe='));
      if (exePathArg) {
        const exePath = exePathArg.split('=')[1];
        if (fs.existsSync(exePath)) {
          await applyIconToExecutable(exePath);
        } else {
          console.error(`Executable not found at: ${exePath}`);
        }
      } else {
        console.log('No executable path provided with --exe parameter.');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in main function:', error);
    return false;
  }
}

// Run the script if called directly
if (require.main === module) {
  main().then(success => {
    if (success) {
      console.log('Windows icon creation completed successfully.');
      process.exit(0);
    } else {
      console.error('Windows icon creation failed.');
      process.exit(1);
    }
  }).catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

// Export functions
module.exports = {
  createWindowsIcon,
  applyIconToExecutable
};