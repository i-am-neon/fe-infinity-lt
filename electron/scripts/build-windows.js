/**
 * Comprehensive Windows build script
 * This script handles the entire Windows build process, including icon generation and fixing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== FE Infinity Windows Build Process ===');

// Configuration
const electronDir = path.resolve(__dirname, '..');
const iconPath = path.join(electronDir, 'icons', 'icons', 'win', 'icon.ico');

// Step 1: Ensure all necessary dependencies are installed
console.log('\nStep 1: Installing dependencies...');
try {
  execSync('pnpm install', {
    cwd: electronDir,
    stdio: 'inherit'
  });
} catch (error) {
  console.error('Failed to install dependencies:', error.message);
  process.exit(1);
}

// Step 2: Build the client application
console.log('\nStep 2: Building client application...');
try {
  execSync('pnpm build:client', {
    cwd: electronDir,
    stdio: 'inherit'
  });
} catch (error) {
  console.error('Failed to build client:', error.message);
  process.exit(1);
}

// Step 3: Verify the client build
console.log('\nStep 3: Verifying client build...');
try {
  execSync('pnpm verify-client-build', {
    cwd: electronDir,
    stdio: 'inherit'
  });
} catch (error) {
  console.error('Client build verification failed:', error.message);
  process.exit(1);
}

// Step 4: Generate and prepare icons
console.log('\nStep 4: Preparing application icons...');
try {
  // Check if the icon exists
  if (!fs.existsSync(iconPath)) {
    console.log('Icon not found, regenerating all icons...');
    execSync('pnpm regenerate-icons', {
      cwd: electronDir,
      stdio: 'inherit'
    });
  } else {
    console.log('Icon found, preparing Windows resources...');
    execSync('node scripts/prepare-windows-icons.js', {
      cwd: electronDir,
      stdio: 'inherit'
    });
  }
} catch (error) {
  console.error('Failed to prepare icons:', error.message);
  // Continue anyway, this isn't critical
  console.log('Continuing build process with default icons...');
}

// Step 5: Build the Windows application
console.log('\nStep 5: Building Windows application...');
try {
  execSync('cross-env CSC_IDENTITY_AUTO_DISCOVERY=false electron-builder --win --config.win.signAndEditExecutable=false --config.win.forceCodeSigning=false', {
    cwd: electronDir,
    stdio: 'inherit'
  });
} catch (error) {
  console.error('Windows build failed:', error.message);
  process.exit(1);
}

// Step 6: Fix the Windows icon post-build
console.log('\nStep 6: Applying icon fix post-build...');
try {
  execSync('node scripts/fix-windows-icon.js', {
    cwd: electronDir,
    stdio: 'inherit'
  });
} catch (error) {
  console.error('Icon fix failed:', error.message);
  console.log('The application may still work, but the icon might not appear correctly.');
}

console.log('\n=== Windows Build Process Complete ===');
console.log('Check the release directory for your Windows application:');
console.log(`${path.join(electronDir, 'release')}`);
console.log('\nReminder: When running on Windows, you may need to clear the icon cache:');
console.log('1. Run: ie4uinit.exe -ClearIconCache');
console.log('2. Or restart Windows Explorer');