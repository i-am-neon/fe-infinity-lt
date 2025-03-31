/**
 * Script to bypass NSIS signing by patching the temporary build files
 * Run this before building with electron-builder to completely bypass signing
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Common locations for winCodeSign
const winCodeSignPaths = [
  path.join(os.homedir(), 'AppData', 'Local', 'electron-builder', 'Cache', 'winCodeSign'),
  path.join(os.tmpdir(), 'electron-builder-winCodeSign')
];

// Function to check if winCodeSign is already present
function findWinCodeSignPath() {
  for (const basePath of winCodeSignPaths) {
    if (fs.existsSync(basePath)) {
      // Look for version folders inside
      try {
        const entries = fs.readdirSync(basePath);
        for (const entry of entries) {
          const fullPath = path.join(basePath, entry);
          if (fs.statSync(fullPath).isDirectory()) {
            return fullPath;
          }
        }
      } catch (err) {
        console.log(`Error reading ${basePath}:`, err.message);
      }
    }
  }
  return null;
}

// Create a dummy winCodeSign folder
function createDummyWinCodeSign() {
  // Create a dummy winCodeSign path in temp directory
  const dummyPath = path.join(os.tmpdir(), 'electron-builder-winCodeSign', 'dummy');
  
  try {
    fs.mkdirSync(dummyPath, { recursive: true });
    console.log(`Created dummy winCodeSign folder: ${dummyPath}`);
    
    // Create a simple README file to explain what this is
    const readmePath = path.join(dummyPath, 'README.txt');
    fs.writeFileSync(readmePath, 'This is a dummy winCodeSign folder created to bypass code signing for Windows builds.\n');
    
    // Create a dummy bin folder
    const binPath = path.join(dummyPath, 'windows', 'bin');
    fs.mkdirSync(binPath, { recursive: true });
    
    // Create a dummy sign.exe that does nothing
    const signExePath = path.join(binPath, 'sign.exe');
    fs.writeFileSync(signExePath, 'This is a dummy file, not a real executable');
    
    console.log('Dummy winCodeSign environment set up successfully');
    return dummyPath;
  } catch (err) {
    console.error('Failed to create dummy winCodeSign environment:', err);
    return null;
  }
}

// Main function
function main() {
  // Check if Windows - only needed on Windows
  if (process.platform !== 'win32') {
    console.log('This script is only needed on Windows platform');
    return;
  }
  
  console.log('Checking for winCodeSign...');
  
  const existingPath = findWinCodeSignPath();
  if (existingPath) {
    console.log(`Found existing winCodeSign at: ${existingPath}`);
    console.log('Attempting to patch...');
    
    // The simplest approach is to create a dummy sign.exe that doesn't actually sign
    const signExePath = path.join(existingPath, 'windows', 'bin', 'sign.exe');
    
    if (fs.existsSync(signExePath)) {
      console.log(`Found sign.exe at ${signExePath}`);
      
      // Backup the original
      try {
        fs.renameSync(signExePath, `${signExePath}.original`);
        console.log('Backed up original sign.exe');
        
        // Create a dummy sign.exe
        fs.writeFileSync(signExePath, 'MZ DUMMY SIGN.EXE');
        console.log('Created dummy sign.exe to bypass signing');
      } catch (err) {
        console.error('Error while patching sign.exe:', err);
      }
    } else {
      console.log(`sign.exe not found at expected location: ${signExePath}`);
      createDummyWinCodeSign();
    }
  } else {
    console.log('winCodeSign not found in cache, creating dummy...');
    createDummyWinCodeSign();
  }
  
  console.log('Bypassing NSIS signing completed');
}

// Run the script if executed directly
if (require.main === module) {
  main();
}

module.exports = main;