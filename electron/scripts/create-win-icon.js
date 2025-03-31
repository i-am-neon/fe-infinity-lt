/**
 * Script to create proper Windows icon files with all required resolutions
 * This script generates a multi-resolution .ico file suitable for Windows applications
 * 
 * Requires:
 * - sharp or ImageMagick (will attempt to use sharp first, then fall back to ImageMagick)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const electronDir = path.resolve(__dirname, '..');
const logoPath = path.join(electronDir, 'logo.png');
const outputIconPath = path.join(electronDir, 'icons', 'icons', 'win', 'icon.ico');
const tempDir = path.join(electronDir, 'temp_icons');

// Create temp directory if it doesn't exist
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Required icon sizes for Windows
const iconSizes = [16, 24, 32, 48, 64, 128, 256];

console.log('Creating Windows icon with all required resolutions...');

// Ensure source image exists
if (!fs.existsSync(logoPath)) {
  console.error(`Source image not found: ${logoPath}`);
  process.exit(1);
}

// Ensure output directories exist
const outputDir = path.dirname(outputIconPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Try to use sharp first (Node.js native image processing)
function createWithSharp() {
  console.log('Attempting to create icon using sharp...');
  
  try {
    // Install sharp if not present
    try {
      require.resolve('sharp');
    } catch (e) {
      console.log('Installing sharp...');
      execSync('npm install --no-save sharp', { stdio: 'inherit' });
    }
    
    const sharp = require('sharp');
    
    // Generate all required sizes
    const promises = iconSizes.map(size => {
      const outputPath = path.join(tempDir, `icon-${size}.png`);
      return sharp(logoPath)
        .resize(size, size)
        .toFile(outputPath)
        .then(() => outputPath);
    });
    
    // Wait for all resizing operations to complete
    Promise.all(promises)
      .then(outputPaths => {
        console.log('All sizes generated successfully');
        
        // Read all the images
        const imageBuffers = outputPaths.map(path => fs.readFileSync(path));
        
        try {
          // Use to-ico to create the ICO file
          const toIco = require('to-ico');
          toIco(imageBuffers).then(buffer => {
            fs.writeFileSync(outputIconPath, buffer);
            console.log(`Icon file created successfully at ${outputIconPath}`);
            
            // Clean up temp files
            outputPaths.forEach(filePath => fs.unlinkSync(filePath));
            fs.rmdirSync(tempDir);
          }).catch(err => {
            console.error('Failed to create ICO file:', err);
            createWithImageMagick(); // Fallback to ImageMagick
          });
        } catch (err) {
          console.error('Error with to-ico:', err);
          createWithImageMagick(); // Fallback to ImageMagick
        }
      })
      .catch(err => {
        console.error('Failed to generate icon sizes:', err);
        createWithImageMagick(); // Fallback to ImageMagick
      });
  } catch (error) {
    console.error('Error using sharp:', error.message);
    createWithImageMagick(); // Fallback to ImageMagick
  }
}

// Fallback to ImageMagick
function createWithImageMagick() {
  console.log('Falling back to ImageMagick for icon creation...');
  
  try {
    // Check if ImageMagick is installed
    execSync('convert -version', { stdio: 'ignore' });
    
    // Generate all required sizes
    iconSizes.forEach(size => {
      const outputPath = path.join(tempDir, `icon-${size}.png`);
      execSync(`convert "${logoPath}" -resize ${size}x${size} "${outputPath}"`, {
        stdio: 'inherit'
      });
    });
    
    // Create .ico file with all sizes
    const sizeArgs = iconSizes.map(size => 
      `"${path.join(tempDir, `icon-${size}.png`)}"`
    ).join(' ');
    
    execSync(`convert ${sizeArgs} "${outputIconPath}"`, {
      stdio: 'inherit'
    });
    
    console.log(`Icon file created successfully at ${outputIconPath}`);
    
    // Clean up temp files
    iconSizes.forEach(size => {
      const tempFile = path.join(tempDir, `icon-${size}.png`);
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    });
    fs.rmdirSync(tempDir);
  } catch (error) {
    console.error('Error using ImageMagick:', error.message);
    console.error('Failed to create Windows icon file. Please ensure ImageMagick is installed.');
    process.exit(1);
  }
}

// Start with Sharp and fall back to ImageMagick if needed
try {
  createWithSharp();
} catch (error) {
  console.error('Failed with Sharp, falling back to ImageMagick:', error.message);
  createWithImageMagick();
}