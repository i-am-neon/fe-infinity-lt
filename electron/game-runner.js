const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

// Get path to bundled Wine or use system Wine
function getWinePath() {
  // In production, use bundled Wine
  if (process.env.NODE_ENV === 'production') {
    if (process.platform === 'darwin') {
      return path.join(app.getAppPath(), 'bin', 'wine', 'bin', 'wine');
    } else if (process.platform === 'linux') {
      return path.join(app.getAppPath(), 'bin', 'wine', 'bin', 'wine');
    } else {
      // On Windows, we don't need Wine
      return null;
    }
  }
  
  // In development, try to find Wine in common locations
  if (process.platform === 'darwin') {
    // Try using 'which' to find wine
    try {
      const { execSync } = require('child_process');
      const winePath = execSync('which wine', { encoding: 'utf8' }).trim();
      
      // Verify wine actually works
      try {
        execSync(`${winePath} --version`, { stdio: 'ignore' });
        console.log(`Verified working Wine at: ${winePath}`);
        return winePath;
      } catch (e) {
        console.warn(`Found Wine at ${winePath} but it appears non-functional`);
      }
    } catch (e) {
      // which command failed, continue to path checking
    }
    
    // Check common macOS Wine installation paths
    const commonPaths = [
      '/usr/local/bin/wine',
      '/opt/homebrew/bin/wine',
      '/Applications/Wine Stable.app/Contents/Resources/wine/bin/wine',
      '/usr/bin/wine',
      path.join(require('os').homedir(), '.wine/bin/wine')
    ];
    
    // Check if any of these paths exist and are executable
    for (const winePath of commonPaths) {
      try {
        if (fs.existsSync(winePath) && fs.accessSync(winePath, fs.constants.X_OK) === undefined) {
          // Try to verify it works
          try {
            const { execSync } = require('child_process');
            execSync(`${winePath} --version`, { stdio: 'ignore' });
            console.log(`Verified working Wine at: ${winePath}`);
            return winePath;
          } catch (e) {
            console.warn(`Found Wine at ${winePath} but it appears non-functional`);
          }
        }
      } catch (e) {
        // Ignore errors, just continue checking
      }
    }
    
    console.warn('Wine not found in common locations or not functional. Trying default "wine" command');
  }
  
  // Fallback to assuming it's in PATH
  return 'wine';
}

// Get the LT maker path
function getLtMakerPath() {
  return path.join(app.getAppPath(), 'lt-maker-fork');
}

// Run a game using Wine and Python
async function runGameWithWine(projectNameEndingInDotLtProj) {
  return new Promise((resolve, reject) => {
    try {
        // Make sure we're using the correct path to lt-maker-fork
        const ltMakerPath = process.env.NODE_ENV === 'development'
          ? path.join(app.getAppPath(), '..', 'lt-maker-fork')
          : getLtMakerPath();
        
        // Log the paths for debugging
        console.log(`App path: ${app.getAppPath()}`);
        console.log(`Actual lt-maker path: ${ltMakerPath}`);
        
        // Verify the LT Maker directory exists
        if (!fs.existsSync(ltMakerPath)) {
          console.error(`LT Maker directory not found at: ${ltMakerPath}`);
          reject(new Error(`LT Maker directory not found at: ${ltMakerPath}`));
          return;
        }
      
      // On macOS, we use Wine
      if (process.platform === 'darwin' || process.platform === 'linux') {
        const winePath = getWinePath();
        
        if (!winePath) {
          reject(new Error('Wine is not available'));
          return;
        }
        
        // Normalize project path for Wine and ensure it uses forward slashes
        const normalizedProjectPath = projectNameEndingInDotLtProj.replace(/\\/g, '/');
        
        console.log(`Running game with Wine: ${normalizedProjectPath}`);
        console.log(`LT Maker path: ${ltMakerPath}`);
        
        // Check if metadata.json exists before running
        const metadataPath = path.join(ltMakerPath, normalizedProjectPath, 'metadata.json');
        if (!fs.existsSync(metadataPath)) {
          console.error(`Error: metadata.json not found at ${metadataPath}`);
          reject(new Error(`Game cannot run: metadata.json not found for ${normalizedProjectPath}`));
          return;
        }
        
        const wineProcess = spawn(
          winePath,
          [
            'python',
            'run_engine_for_project.py',
            normalizedProjectPath
          ],
          {
            cwd: ltMakerPath,
            env: {
              ...process.env,
              WINEDEBUG: '-all', // Reduce Wine debug output
              WINEDLLOVERRIDES: 'mscoree,mshtml=',  // Prevent Wine from showing error dialogs
              WINEPREFIX: process.env.WINEPREFIX || `${require('os').homedir()}/.wine`,  // Use consistent Wine prefix
            }
          }
        );
        
        wineProcess.stdout.on('data', (data) => {
          console.log(`Game stdout: ${data}`);
        });
        
        wineProcess.stderr.on('data', (data) => {
          console.error(`Game stderr: ${data}`);
        });
        
        wineProcess.on('close', (code) => {
          if (code === 0) {
            console.log(`Game process exited with code ${code}`);
            resolve();
          } else {
            console.error(`Game process exited with code ${code}`);
            reject(new Error(`Game exited with code ${code}`));
          }
        });
        
        wineProcess.on('error', (err) => {
          console.error('Failed to start game process:', err);
          
          // Provide more helpful error message if Wine is not installed
          if (err.code === 'ENOENT') {
            const errorMessage = `Wine is not installed or not found in PATH.
Please install Wine on your Mac using:
brew install --cask wine-stable
or
brew install --cask --no-quarantine wine-stable

After installation, you may need to run:
brew link --overwrite wine-stable

Make sure Wine is working by running:
wine --version
from your terminal.`;
            console.error(errorMessage);
            reject(new Error(errorMessage));
          } else {
            reject(err);
          }
        });
      } else {
        // On Windows, we run Python directly
        const pythonProcess = spawn(
          'python',
          [
            'run_engine_for_project.py',
            projectNameEndingInDotLtProj
          ],
          {
            cwd: ltMakerPath
          }
        );
        
        pythonProcess.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Game exited with code ${code}`));
          }
        });
        
        pythonProcess.on('error', (err) => {
          reject(err);
        });
      }
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  runGameWithWine
};