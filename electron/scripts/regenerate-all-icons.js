/**
 * Comprehensive script to regenerate all application icons for all platforms
 * This ensures that icons are properly created for macOS, Windows, and Linux
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const electronDir = path.resolve(__dirname, '..');
const logoPath = path.join(electronDir, 'logo.png');
const outputIconsDir = path.join(electronDir, 'icons', 'icons');

console.log('Regenerating all application icons for all platforms...');

// Ensure source image exists
if (!fs.existsSync(logoPath)) {
  console.error(`Source image not found: ${logoPath}`);
  process.exit(1);
}

// Create output directories
const platforms = ['win', 'mac', 'png'];
platforms.forEach(platform => {
  const platformDir = path.join(outputIconsDir, platform);
  if (!fs.existsSync(platformDir)) {
    fs.mkdirSync(platformDir, { recursive: true });
  }
});

// Step 1: Generate icons using electron-icon-builder
console.log('Step 1: Using electron-icon-builder to generate base icons...');
try {
  execSync(`npx electron-icon-builder --input="${logoPath}" --output=icons`, {
    cwd: electronDir,
    stdio: 'inherit'
  });
} catch (error) {
  console.error('Failed to generate base icons:', error.message);
  console.log('Continuing with other icon generation methods...');
}

// Step 2: Generate a better Windows icon using our custom script
console.log('Step 2: Generating optimized Windows icon...');
try {
  execSync(`node "${path.join(__dirname, 'create-win-icon.js')}"`, {
    cwd: electronDir,
    stdio: 'inherit'
  });
} catch (error) {
  console.error('Failed to generate Windows icon:', error.message);
}

// Step 3: Ensure Windows resource files are created
console.log('Step 3: Creating Windows resource files...');
try {
  execSync(`node "${path.join(__dirname, 'prepare-windows-icons.js')}"`, {
    cwd: electronDir,
    stdio: 'inherit'
  });
} catch (error) {
  console.error('Failed to prepare Windows resources:', error.message);
}

// Step 4: Verify all required icon files exist
console.log('Step 4: Verifying icon files...');
const requiredIcons = [
  path.join(outputIconsDir, 'win', 'icon.ico'),
  path.join(outputIconsDir, 'mac', 'icon.icns'),
  path.join(outputIconsDir, 'png', '256x256.png')
];

const missingIcons = requiredIcons.filter(iconPath => !fs.existsSync(iconPath));
if (missingIcons.length > 0) {
  console.warn('Warning: Some icon files are missing:');
  missingIcons.forEach(icon => console.warn(`- ${icon}`));
} else {
  console.log('All required icon files are present');
}

console.log('\nIcon regeneration complete!');
console.log('You can now build your application with these icons:');
console.log('- For Windows: pnpm package:win');
console.log('- For macOS: pnpm package:mac');
console.log('- For Linux: pnpm package:linux');
console.log('\nIf you encounter issues with Windows icons, refer to WINDOWS-ICON-TROUBLESHOOTING.md');