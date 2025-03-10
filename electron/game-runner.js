const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');
const logger = require('./logger');

// Function to get Wine path from the local system
// NOTE: Wine is the exception - we use system Wine instead of bundled
function getWinePath() {
  if (process.platform === 'win32') {
    // On Windows, we don't need Wine
    return null;
  }

  try {
    // Check if wine is installed and accessible in PATH
    const { execSync } = require('child_process');
    
    // First check if wine is in PATH
    try {
      const winePath = execSync('which wine', { encoding: 'utf8' }).trim();
      console.log(`Found Wine in PATH: ${winePath}`);
      
      // Verify it's executable
      try {
        fs.accessSync(winePath, fs.constants.X_OK);
        return winePath;
      } catch (err) {
        console.error(`Wine binary found but not executable: ${winePath}`, err);
      }
    } catch (error) {
      console.error('Wine not found in PATH:', error.message);
    }

    // Check common locations on macOS
    if (process.platform === 'darwin') {
      const commonMacPaths = [
        '/usr/local/bin/wine',
        '/opt/homebrew/bin/wine',
        '/Applications/Wine Stable.app/Contents/Resources/wine/bin/wine',
        '/Applications/Wine Stable.app/Contents/MacOS/wine'
      ];
      
      for (const macPath of commonMacPaths) {
        if (fs.existsSync(macPath)) {
          console.log(`Found Wine at: ${macPath}`);
          return macPath;
        }
      }
    }

    // Check common locations on Linux
    if (process.platform === 'linux') {
      const commonLinuxPaths = [
        '/usr/bin/wine',
        '/usr/local/bin/wine'
      ];
      
      for (const linuxPath of commonLinuxPaths) {
        if (fs.existsSync(linuxPath)) {
          console.log(`Found Wine at: ${linuxPath}`);
          return linuxPath;
        }
      }
    }
    
    // If we get here, Wine is not installed
    const errorMsg = 'Wine is not installed or not found in PATH. Please install Wine to run the game.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  } catch (error) {
    console.error('Error checking for Wine:', error.message);
    throw new Error(`Wine is required but not found: ${error.message}`);
  }
}

// Get the LT maker path
function getLtMakerPath() {
  return path.join(app.getAppPath(), 'lt-maker-fork');
}

// Get path to Python
function getBundledPythonPath() {
  if (process.platform === 'win32') {
    // Windows uses the embedded Python directly
    const pythonPath = path.join(app.getAppPath(), 'bin', 'python', 'python.exe');
    if (!fs.existsSync(pythonPath)) {
      throw new Error(`Bundled Python not found at: ${pythonPath}. Please ensure binaries are downloaded correctly.`);
    }
    return pythonPath;
  } else if (process.platform === 'darwin') {
    // For macOS, use system Python
    try {
      // Check if python3 is installed and accessible
      const { execSync } = require('child_process');
      const pythonPath = execSync('which python3', { encoding: 'utf8' }).trim();
      logger.log('info', `Using system Python at: ${pythonPath}`);
      return pythonPath;
    } catch (error) {
      logger.log('error', 'System Python not found. Please install Python 3.');
      throw new Error('System Python (python3) not found. Please install Python 3 via Homebrew (brew install python).');
    }
  } else {
    // Linux still uses Wine with bundled Python
    // Return the Wine Python path (this is the path within the Wine environment)
    return 'python';
  }
}

// Get Wine Python environment variables
function getWinePythonEnv() {
  if (process.platform === 'win32') {
    return process.env;
  }

  // For macOS and Linux, set up Wine environment variables
  let winePrefix;

  // Try user's default Wine prefix first
  const userWinePrefix = path.join(require('os').homedir(), '.wine');
  if (fs.existsSync(userWinePrefix)) {
    winePrefix = userWinePrefix;
    console.log(`Using existing Wine prefix: ${winePrefix}`);
  } else {
    // Fall back to app directory but ensure it exists
    const appWinePrefix = path.join(app.getAppPath(), 'wine_prefix');
    try {
      // Create directory if it doesn't exist
      if (!fs.existsSync(appWinePrefix)) {
        fs.mkdirSync(appWinePrefix, { recursive: true });
        console.log(`Created Wine prefix directory: ${appWinePrefix}`);
      }
      winePrefix = appWinePrefix;
    } catch (error) {
      // Use temp directory as last resort
      const tempWinePrefix = path.join(require('os').tmpdir(), 'fe_infinity_wine');
      try {
        if (!fs.existsSync(tempWinePrefix)) {
          fs.mkdirSync(tempWinePrefix, { recursive: true });
        }
        winePrefix = tempWinePrefix;
        console.log(`Using temporary Wine prefix: ${winePrefix}`);
      } catch (tempError) {
        // If all else fails, use null and let Wine choose its default
        winePrefix = null;
        console.warn('Could not create Wine prefix directory, using default');
      }
    }
  }

  // Build Wine environment
  const wineEnv = {
    ...process.env,
    WINEDEBUG: '-all', // Suppress Wine debug messages
    WINEDLLOVERRIDES: 'mscoree,mshtml=', // Avoid Wine trying to use Internet Explorer
    // Ensure Python can find installed packages in user's site-packages
    PYTHONPATH: process.env.PYTHONPATH || '',
  };

  // Only set WINEPREFIX if we have a valid path
  if (winePrefix) {
    wineEnv.WINEPREFIX = winePrefix;
  }

  return wineEnv;
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
        let winePath;
        try {
          winePath = getWinePath();
        } catch (wineError) {
          console.error('Fatal Wine error:', wineError.message);
          reject(wineError);
          return;
        }

        if (!winePath) {
          const error = new Error('Wine is not available');
          console.error('Fatal Wine error:', error.message);
          reject(error);
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

        // Get the bundled Python environment
        const pythonEnv = getWinePythonEnv();

        console.log('Using local Python with Wine on macOS');
        
        // Set a timeout to prevent indefinite hanging
        const timeout = 60000; // 60 seconds timeout
        const timeoutId = setTimeout(() => {
          console.error(`Wine process timed out after ${timeout/1000} seconds`);
          if (wineProcess && !wineProcess.killed) {
            console.log('Killing Wine process due to timeout');
            wineProcess.kill();
          }
          resolve(); // Resolve anyway to prevent hanging UI
        }, timeout);
        
        // Log the command before executing
        console.log(`Executing Wine command: ${winePath} ${getBundledPythonPath()} run_engine_for_project.py ${normalizedProjectPath}`);
        console.log(`Working directory: ${ltMakerPath}`);
        console.log(`Wine environment variables: WINEDEBUG=${pythonEnv.WINEDEBUG || 'not set'}, WINEPREFIX=${pythonEnv.WINEPREFIX || 'not set'}`);
        
        // Detach process to prevent it from blocking electron
        const wineProcess = spawn(
          winePath,
          [
            getBundledPythonPath(),
            'run_engine_for_project.py',
            normalizedProjectPath
          ],
          {
            cwd: ltMakerPath,
            env: pythonEnv,
            detached: true, // Detach the process from Electron
            stdio: ['ignore', 'pipe', 'pipe'] // Keep stdio pipes for logging
          }
        );
        
        // Unref the child to allow the Node.js event loop to exit even if the process is still running
        wineProcess.unref();

        wineProcess.stdout.on('data', (data) => {
          const output = data.toString().trim();
          console.log(`Game stdout: ${output}`);
        });

        wineProcess.stderr.on('data', (data) => {
          const output = data.toString().trim();
          console.error(`Game stderr: ${output}`);
        });

        wineProcess.on('close', (code) => {
          clearTimeout(timeoutId); // Clear the timeout
          console.log(`Game process closed with code ${code}`);
          resolve(); // Always resolve to prevent hanging
        });

        wineProcess.on('exit', (code) => {
          clearTimeout(timeoutId); // Clear the timeout
          console.log(`Game process exited with code ${code}`);
          resolve(); // Always resolve to prevent hanging
        });

        wineProcess.on('error', (err) => {
          clearTimeout(timeoutId); // Clear the timeout
          console.error('Failed to start game process:', err);

          // Provide more helpful error message about bundled Wine
          if (err.code === 'ENOENT') {
            const errorMessage = `Bundled Wine executable failed to run.
This is likely due to a missing or corrupted Wine installation in the application bundle.
Please contact support or reinstall the application.

Error details: ${err.message}`;
            console.error(errorMessage);
            reject(new Error(errorMessage));
          } else {
            console.error('Wine execution error:', err.message);
            reject(err);
          }
        });
        
        // Resolve after a short delay to allow the game to start but not block UI
        setTimeout(() => {
          console.log('Resolving Wine process promise to unblock UI');
          resolve();
        }, 2000);
      } else {
        // On Windows, we run our bundled Python directly
        const pythonPath = getBundledPythonPath();
        console.log(`Using bundled Python: ${pythonPath}`);

        const pythonProcess = spawn(
          pythonPath,
          [
            'run_engine_for_project.py',
            projectNameEndingInDotLtProj
          ],
          {
            cwd: ltMakerPath,
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe']
          }
        );
        
        // Unref the child to allow the Node.js event loop to exit
        pythonProcess.unref();

        pythonProcess.stdout.on('data', (data) => {
          console.log(`Game stdout: ${data.toString().trim()}`);
        });

        pythonProcess.stderr.on('data', (data) => {
          console.error(`Game stderr: ${data.toString().trim()}`);
        });

        pythonProcess.on('close', (code) => {
          console.log(`Game process closed with code ${code}`);
          resolve();
        });

        pythonProcess.on('exit', (code) => {
          console.log(`Game process exited with code ${code}`);
          resolve();
        });

        pythonProcess.on('error', (err) => {
          console.error('Failed to start game process:', err);
          reject(err);
        });
        
        // Resolve after a short delay to allow the game to start but not block UI
        setTimeout(() => {
          console.log('Resolving Python process promise to unblock UI');
          resolve();
        }, 2000);
      }
    } catch (error) {
      console.error('Unexpected error in runGameWithWine:', error);
      reject(error);
    }
  });
}

module.exports = {
  runGameWithWine
};