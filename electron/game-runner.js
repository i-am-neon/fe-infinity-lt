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
  // For packaged apps, use resourcesPath instead of app.getAppPath()
  // app.getAppPath() points to the asar file, but we need the Resources directory
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'lt-maker-fork');
  }
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
    // For macOS, try to find Python 3.11.x specifically (required by the game)
    try {
      const { execSync } = require('child_process');

      // Check for Python 3.11 in common Homebrew locations first
      const pythonLocations = [
        '/opt/homebrew/bin/python3.11',
        '/usr/local/bin/python3.11',
        '/opt/homebrew/bin/python3',
        '/usr/local/bin/python3'
      ];

      // First check if we can find Python 3.11 directly
      try {
        // Try to see if python3.11 is available
        const python311Path = execSync('which python3.11', { encoding: 'utf8' }).trim();
        logger.log('info', `Found Python 3.11 at: ${python311Path}`);
        return python311Path;
      } catch (specificVersionError) {
        logger.log('info', 'Python 3.11 not found in PATH, checking alternate locations');
      }

      // Check each location
      for (const pyLocation of pythonLocations) {
        if (fs.existsSync(pyLocation)) {
          try {
            // Verify version before using
            const versionOutput = execSync(`${pyLocation} --version`, { encoding: 'utf8' }).trim();
            logger.log('info', `Found Python at ${pyLocation}: ${versionOutput}`);

            // Use it if it's version 3.11 or higher
            if (versionOutput.includes('Python 3.11') || versionOutput.includes('Python 3.12')) {
              logger.log('info', `Using Python 3.11+: ${pyLocation}`);
              return pyLocation;
            }
          } catch (e) {
            logger.log('info', `Error checking Python version at ${pyLocation}: ${e.message}`);
          }
        }
      }

      // Fall back to system Python, but warn that it might not work if it's < 3.11
      const systemPythonPath = execSync('which python3', { encoding: 'utf8' }).trim();
      const versionOutput = execSync(`${systemPythonPath} --version`, { encoding: 'utf8' }).trim();
      logger.log('warn', `Using system Python: ${versionOutput} at ${systemPythonPath}`);
      logger.log('warn', 'Game requires Python 3.11+. If startup fails, please install Python 3.11+: brew install python@3.11');

      // If system Python version is < 3.10, show a clear error since we know TypeAlias won't work
      if (versionOutput.includes('Python 3.9') || versionOutput.includes('Python 3.8') ||
        versionOutput.includes('Python 3.7') || versionOutput.includes('Python 3.6')) {
        throw new Error(`Python ${versionOutput} is too old. The game requires Python 3.11+. Please install using: brew install python@3.11`);
      }

      return systemPythonPath;
    } catch (error) {
      logger.log('error', `Python error: ${error.message}`);
      throw new Error('Python 3.11+ is required but not found. Please install using: brew install python@3.11');
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
      // Add logging for app paths and environment
      const logger = require('./logger');
      logger.log('info', 'Running game with Wine', {
        projectPath: projectNameEndingInDotLtProj,
        appPath: app.getAppPath(),
        resourcesPath: process.resourcesPath,
        platform: process.platform,
        arch: process.arch
      });

      // Make sure we're using the correct path to lt-maker-fork
      const ltMakerPath = process.env.NODE_ENV === 'development'
        ? path.join(app.getAppPath(), '..', 'lt-maker-fork')
        : getLtMakerPath();

      // Log the paths for debugging
      logger.log('info', 'Path resolution for game launcher', {
        appPath: app.getAppPath(),
        ltMakerPath: ltMakerPath
      });

      // Verify the LT Maker directory exists
      if (!fs.existsSync(ltMakerPath)) {
        const errorMsg = `LT Maker directory not found at: ${ltMakerPath}`;
        logger.log('error', errorMsg);
        reject(new Error(errorMsg));
        return;
      }

      // On macOS, we use Wine
      if (process.platform === 'darwin' || process.platform === 'linux') {
        let winePath;
        try {
          winePath = getWinePath();
          logger.log('info', `Using Wine at: ${winePath}`);
        } catch (wineError) {
          logger.log('error', 'Fatal Wine error', { error: wineError.message });
          reject(wineError);
          return;
        }

        if (!winePath) {
          const error = new Error('Wine is not available');
          logger.log('error', 'Wine not available on system');
          reject(error);
          return;
        }

        // Normalize project path for Wine and ensure it uses forward slashes
        const normalizedProjectPath = projectNameEndingInDotLtProj.replace(/\\/g, '/');

        logger.log('info', `Running game with normalized path: ${normalizedProjectPath}`);

        // Check if metadata.json exists before running
        const metadataPath = path.join(ltMakerPath, normalizedProjectPath, 'metadata.json');
        if (!fs.existsSync(metadataPath)) {
          const errorMsg = `Game cannot run: metadata.json not found for ${normalizedProjectPath}`;
          logger.log('error', errorMsg, { metadataPath });
          reject(new Error(errorMsg));
          return;
        }

        // Get the environment for Python with Wine
        const pythonEnv = getWinePythonEnv();

        // Check Python path on macOS
        // Get the Python path - on macOS for packaged app we need to use system Python
        const pythonPath = getBundledPythonPath();
        logger.log('info', `Using Python path: ${pythonPath}`);

        // Log execution command for debugging
        const fullCommand = `${winePath} ${pythonPath} run_engine_for_project.py ${normalizedProjectPath}`;
        logger.log('info', `Executing command: ${fullCommand}`, {
          cwd: ltMakerPath,
          wineDebug: pythonEnv.WINEDEBUG,
          winePrefix: pythonEnv.WINEPREFIX
        });

        // Set a timeout to prevent indefinite hanging
        const timeout = 120000; // 2 minutes timeout (increased from 60s)
        const timeoutId = setTimeout(() => {
          logger.log('error', `Wine process timed out after ${timeout / 1000} seconds`);
          if (wineProcess && !wineProcess.killed) {
            logger.log('info', 'Killing Wine process due to timeout');
            wineProcess.kill();
          }
          resolve(); // Resolve anyway to prevent hanging UI
        }, timeout);

        // Enhanced Wine process - use direct Python command on macOS
        // Important: On macOS in packaged app, we need to use a different approach
        try {
          // Create shell script for running Wine
          const tempScriptPath = path.join(app.getPath('temp'), 'run-wine.sh');
          let scriptContent = `#!/bin/bash
cd "${ltMakerPath}"
export WINEDEBUG=${pythonEnv.WINEDEBUG || '-all'}
export WINEPREFIX=${pythonEnv.WINEPREFIX || '~/.wine'}
"${winePath}" "${pythonPath}" run_engine_for_project.py "${normalizedProjectPath}" 2>&1`;

          fs.writeFileSync(tempScriptPath, scriptContent);
          fs.chmodSync(tempScriptPath, 0o755);

          logger.log('info', `Created Wine wrapper script at ${tempScriptPath}`);
          logger.log('info', `Script content: ${scriptContent}`);

          // Launch with shell script - this helps with macOS path issues
          const wineProcess = spawn(
            '/bin/bash',
            [tempScriptPath],
            {
              detached: true,
              stdio: ['ignore', 'pipe', 'pipe']
            }
          );

          // Unref the child to allow the Node.js event loop to exit even if the process is still running
          wineProcess.unref();

          wineProcess.stdout.on('data', (data) => {
            const output = data.toString().trim();
            logger.log('info', `Game stdout: ${output}`);
          });

          wineProcess.stderr.on('data', (data) => {
            const output = data.toString().trim();
            logger.log('error', `Game stderr: ${output}`);
          });

          wineProcess.on('close', (code) => {
            clearTimeout(timeoutId);
            logger.log('info', `Game process closed with code ${code}`);
            if (code !== 0) {
              logger.log('error', `Wine process exited with non-zero code: ${code}`);
            }
            resolve();
          });

          wineProcess.on('error', (err) => {
            clearTimeout(timeoutId);
            logger.log('error', 'Failed to start game process', {
              error: err.message,
              code: err.code,
              path: tempScriptPath
            });
            reject(err);
          });
        } catch (spawnError) {
          clearTimeout(timeoutId);
          logger.log('error', 'Error spawning Wine process', {
            error: spawnError.message,
            stack: spawnError.stack
          });
          reject(spawnError);
        }
      } else {
        // On Windows, we run our bundled Python directly
        const pythonPath = getBundledPythonPath();
        logger.log('info', `Using bundled Python on Windows: ${pythonPath}`);

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
          const output = data.toString().trim();
          logger.log('info', `Game stdout: ${output}`);
        });

        pythonProcess.stderr.on('data', (data) => {
          const output = data.toString().trim();
          logger.log('error', `Game stderr: ${output}`);
        });

        pythonProcess.on('close', (code) => {
          logger.log('info', `Game process closed with code ${code}`);
          resolve();
        });

        pythonProcess.on('exit', (code) => {
          logger.log('info', `Game process exited with code ${code}`);
          resolve();
        });

        pythonProcess.on('error', (err) => {
          logger.log('error', 'Failed to start game process:', {
            error: err.message,
            stack: err.stack
          });
          reject(err);
        });

        // Resolve after a short delay to allow the game to start but not block UI
        setTimeout(() => {
          logger.log('info', 'Resolving Python process promise to unblock UI');
          resolve();
        }, 2000);
      }
    } catch (error) {
      const logger = require('./logger');
      logger.log('error', 'Unexpected error in runGameWithWine', {
        error: error.message,
        stack: error.stack
      });
      reject(error);
    }
  });
}

module.exports = {
  runGameWithWine
};