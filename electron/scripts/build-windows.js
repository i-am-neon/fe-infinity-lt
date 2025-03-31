/**
 * Simple build script for Windows that handles the entire process
 * and works around code signing issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Determine if running on Windows
const isWindows = process.platform === 'win32';

console.log('=== FE Infinity Windows Build Tool ===');
console.log(`Running on: ${process.platform}`);

// Step 1: Build the client
console.log('\n1. Building React client...');
try {
  execSync('cd ../client && pnpm build', { stdio: 'inherit' });
  console.log('✅ Client build completed successfully');
} catch (error) {
  console.error('❌ Client build failed:', error.message);
  process.exit(1);
}

// Step 2: Prepare environment for Windows build
console.log('\n2. Preparing build environment...');

// Clean previous build
if (fs.existsSync('./release')) {
  console.log('Cleaning previous build files...');
  try {
    if (isWindows) {
      execSync('rmdir /s /q release', { stdio: 'inherit' });
    } else {
      execSync('rm -rf release', { stdio: 'inherit' });
    }
  } catch (error) {
    console.warn('Warning: Failed to clean previous build:', error.message);
  }
}

// Create a temporary config to override code signing
const tempConfigPath = path.join(os.tmpdir(), 'electron-builder.json');
const config = {
  appId: 'com.fe-infinity.app',
  productName: 'FE Infinity',
  win: {
    target: ['nsis'],
    icon: './icons/icons/win/icon.ico',
    signAndEditExecutable: false,
    publisherName: null,
    forceCodeSigning: false
  },
  nsis: {
    oneClick: true,
    perMachine: false,
    allowToChangeInstallationDirectory: false
  },
  directories: {
    output: 'release'
  },
  asar: true,
  asarUnpack: [
    'bin/**/*',
    '**/*.exe',
    '**/*.dll'
  ],
  extraResources: [
    {
      from: '../client/dist',
      to: 'client/dist'
    },
    {
      from: '../lt-maker-fork',
      to: 'lt-maker-fork',
      filter: ['**/*', '!__pycache__/**/*']
    },
    {
      from: '../server',
      to: 'server',
      filter: ['**/*', '!node_modules/**/*']
    }
  ]
};

// Write the config to a temporary file
fs.writeFileSync(tempConfigPath, JSON.stringify(config, null, 2));
console.log(`✅ Created temporary config at: ${tempConfigPath}`);

// Step 3: Run electron-builder with environment variables
console.log('\n3. Building Windows executable...');
process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'false';

try {
  execSync(`npx electron-builder --win --config ${tempConfigPath}`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      CSC_IDENTITY_AUTO_DISCOVERY: 'false'
    }
  });
  console.log('✅ Windows build completed successfully!');
  console.log('\nYou can find the installer in the release/ directory');
} catch (error) {
  console.error('❌ Windows build failed:', error.message);
  process.exit(1);
}

// Cleanup
try {
  fs.unlinkSync(tempConfigPath);
} catch (error) {
  // Ignore cleanup errors
}

console.log('\n🎉 Build process complete!');