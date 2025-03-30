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
    // Windows uses the embedded Python directly from the python_embed directory
    const pythonPath = path.join(app.getAppPath(), 'bin', 'python', 'python_embed', 'python.exe');
    if (fs.existsSync(pythonPath)) {
      logger.log('info', `Found Python at ${pythonPath}`);
      return pythonPath;
    }

    // Fallback to older location if not found
    const fallbackPath = path.join(app.getAppPath(), 'bin', 'python', 'python.exe');
    if (fs.existsSync(fallbackPath)) {
      logger.log('info', `Found Python at fallback location: ${fallbackPath}`);
      return fallbackPath;
    }

    throw new Error(`Bundled Python not found at: ${pythonPath} or ${fallbackPath}. Please ensure binaries are downloaded correctly.`);
  } else if (process.platform === 'darwin') {
    // For macOS, we'll use bundled Python with Wine
    // First check for the Python executable in the python_embed directory
    const pythonExePath = path.join(app.getAppPath(), 'bin', 'python', 'python_embed', 'python.exe');
    if (fs.existsSync(pythonExePath)) {
      logger.log('info', `Using bundled Python.exe with Wine for macOS: ${pythonExePath}`);
      return pythonExePath;
    }

    // Also try the legacy location path
    const legacyPythonExePath = path.join(app.getAppPath(), 'bin', 'python', 'python.exe');
    if (fs.existsSync(legacyPythonExePath)) {
      logger.log('info', `Using bundled Python.exe with Wine for macOS (legacy path): ${legacyPythonExePath}`);
      return legacyPythonExePath;
    }

    // Fall back to the wrapper script
    const bundledPythonPath = path.join(app.getAppPath(), 'bin', 'python', 'python');
    if (!fs.existsSync(bundledPythonPath)) {
      throw new Error(`Bundled Python not found at: ${bundledPythonPath}. Please ensure binaries are downloaded correctly.`);
    }
    logger.log('info', `Using bundled Python wrapper for macOS: ${bundledPythonPath}`);
    return bundledPythonPath;
  } else {
    // Linux also uses Wine with python command inside Wine environment
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

  // Set Python environment variables for site-packages and the LT maker path
  const pythonDir = path.join(app.getAppPath(), 'bin', 'python');
  const sitePackagesDir = path.join(pythonDir, 'Lib', 'site-packages');
  const pythonPath = process.env.PYTHONPATH || '';

  // Get the LT maker path for the Python path
  const ltMakerForPython = process.env.NODE_ENV === 'development'
    ? path.join(app.getAppPath(), '..', 'lt-maker-fork')
    : getLtMakerPath();

  // Ensure our site-packages directory and LT maker directory are in PYTHONPATH
  let updatedPythonPath = pythonPath;
  if (!pythonPath.includes(sitePackagesDir) || !pythonPath.includes(ltMakerForPython)) {
    // Add site-packages if needed
    updatedPythonPath = pythonPath ? `${sitePackagesDir}:${pythonPath}` : sitePackagesDir;
    // Add LT maker path if needed
    if (!updatedPythonPath.includes(ltMakerForPython)) {
      updatedPythonPath = `${ltMakerForPython}:${updatedPythonPath}`;
    }
  }

  // Build Wine environment
  const wineEnv = {
    ...process.env,
    WINEDEBUG: '-all', // Suppress Wine debug messages
    WINEDLLOVERRIDES: 'mscoree,mshtml=', // Avoid Wine trying to use Internet Explorer
    PYTHONPATH: updatedPythonPath,
    // Enable unbuffered output for Python
    PYTHONUNBUFFERED: '1',
    // Set Python home to our bundled Python
    PYTHONHOME: pythonDir
  };

  // Only set WINEPREFIX if we have a valid path
  if (winePrefix) {
    wineEnv.WINEPREFIX = winePrefix;
  }

  logger.log('info', `Python environment variables`, {
    PYTHONPATH: wineEnv.PYTHONPATH,
    PYTHONHOME: wineEnv.PYTHONHOME
  });

  return wineEnv;
}

// Run a game using appropriate Python environment based on platform
async function runGame(projectNameEndingInDotLtProj) {
  return new Promise((resolve, reject) => {
    try {
      // Add logging for app paths and environment
      const logger = require('./logger');
      logger.log('info', `Running game on platform: ${process.platform}`, {
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

      // Enhanced platform detection logging
      logger.log('info', `Platform detection: process.platform = ${process.platform}`);

      // On macOS or Linux, we always use Wine
      if (process.platform === 'darwin' || process.platform === 'linux') {
        logger.log('info', 'Using Wine-based execution path for macOS/Linux');
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

        // Use a direct approach with Wine and a simple command
        const pythonExe = path.join(app.getAppPath(), 'bin', 'python', 'python.exe');
        logger.log('info', `Using Python executable with Wine: ${pythonExe}`);

        // Create a temporary Windows batch file to run the game
        const tempBatchPath = path.join(require('os').tmpdir(), 'run_game.bat');

        // Function to convert Unix path to Wine-compatible Windows path
        const toWinePath = (unixPath) => {
          // First try to convert absolute paths that should be accessible via Z: drive
          if (unixPath.startsWith('/')) {
            return 'Z:' + unixPath.replace(/\//g, '\\');
          }
          // Otherwise just convert slashes
          return unixPath.replace(/\//g, '\\');
        };

        // Get the Wine-compatible path to the run_engine_for_project.py script
        const ltMakerWinePath = toWinePath(ltMakerPath);

        // Get the path to the actual Python executable in the bundled environment
        const bundledPythonExe = path.join(app.getAppPath(), 'bin', 'python', 'python_embed', 'python.exe');
        // Convert Python executable path to Wine path format
        const pythonWineExe = toWinePath(bundledPythonExe);

        // Create a simple batch file to run the game without dependency checks
        // Use a different approach with a script file instead of command line
        const pythonScriptPath = path.join(require('os').tmpdir(), 'run_game.py');
        const pythonWineScriptPath = toWinePath(pythonScriptPath);

        // Create a Python script file that will run the game
        const pythonScriptContent = `
import sys
import os

# Add LT Maker to Python path
sys.path.insert(0, r'${ltMakerWinePath}')
os.environ['PYTHONPATH'] = r'${ltMakerWinePath}' + os.pathsep + os.environ.get('PYTHONPATH', '')

# Import and run the game
import run_engine_for_project
run_engine_for_project.main('${normalizedProjectPath}')
`;

        // Write the Python script to a file
        fs.writeFileSync(pythonScriptPath, pythonScriptContent);

        // Create a simple batch file that just calls Python with the script file
        const batchContent = `@echo off
cd /d "${ltMakerWinePath}"
set PYTHONPATH=${ltMakerWinePath}

REM Debug information
echo Python executable: "${pythonWineExe}"
echo Python script: "${pythonWineScriptPath}"
echo Current directory: %cd%

REM Check if Python executable exists
if exist "${pythonWineExe}" (
    echo Python executable found
) else (
    echo Python executable NOT found
)

REM Check if the Python script exists
if exist "${pythonWineScriptPath}" (
    echo Python script found
) else (
    echo Python script NOT found
)

REM Create a simplified script inline
echo import sys > run_game_simple.py
echo import os >> run_game_simple.py
echo sys.path.insert(0, r'${ltMakerWinePath}') >> run_game_simple.py
echo os.environ['PYTHONPATH'] = r'${ltMakerWinePath}' + os.pathsep + os.environ.get('PYTHONPATH', '') >> run_game_simple.py
echo import run_engine_for_project >> run_game_simple.py
echo run_engine_for_project.main('${normalizedProjectPath}') >> run_game_simple.py

REM Run the game with proper Python configuration
echo Starting game engine...
"${pythonWineExe}" run_game_simple.py
`;
        fs.writeFileSync(tempBatchPath, batchContent);
        logger.log('info', `Created temporary batch file: ${tempBatchPath}`);
        logger.log('info', `Batch file content: ${batchContent}`);

        // Log execution command for debugging
        const fullCommand = `${winePath} cmd /c ${tempBatchPath}`;
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
          // Create an improved shell script for running Wine with the batch file
          const tempScriptPath = path.join(app.getPath('temp'), 'run-wine.sh');

          // Convert Unix paths to Wine paths
          const wineTempBatchPath = tempBatchPath.replace(/^\//g, 'Z:\\').replace(/\//g, '\\');

          // Convert the batch file path to a DOS path that Wine can understand
          // Wine uses Z: drive to map to the Unix root directory
          const wineBatchPath = tempBatchPath.startsWith('/')
            ? `Z:${tempBatchPath.replace(/\//g, '\\')}`
            : tempBatchPath.replace(/\//g, '\\');

          let scriptContent = `#!/bin/bash
# Run Wine with the enhanced batch file that installs dependencies
cd "${ltMakerPath}"
export WINEDEBUG=${pythonEnv.WINEDEBUG || '-all'}
export WINEPREFIX=${pythonEnv.WINEPREFIX || '~/.wine'}

# Set Python environment variables
export PYTHONIOENCODING=utf-8
export PYTHONUNBUFFERED=1

# Debug info to help diagnose path issues
echo "Running Wine with batch file at: ${tempBatchPath}"
echo "Wine executable: ${winePath}"
echo "Wine batch path: ${wineBatchPath}"

# Make sure the batch file is accessible to Wine
ls -la "${tempBatchPath}"

# Run Wine with cmd to execute the batch file using Wine's Z: drive mapping for absolute paths
"${winePath}" cmd /c "${wineBatchPath}" 2>&1`;

          fs.writeFileSync(tempScriptPath, scriptContent);
          fs.chmodSync(tempScriptPath, 0o755);

          logger.log('info', `Created Wine wrapper script at ${tempScriptPath}`);
          logger.log('info', `Script content: ${scriptContent}`);

          // Launch with shell script - this helps with macOS path issues
          logger.log('info', `Running wine wrapper at: ${tempScriptPath}`);

          // Log the command we're about to execute
          logger.log('info', `Executing: /bin/bash ${tempScriptPath}`);

          const wineProcess = spawn(
            '/bin/bash',
            [tempScriptPath],
            {
              cwd: ltMakerPath,
              detached: false, // Changed to false to ensure we capture all output
              stdio: ['ignore', 'pipe', 'pipe'],
              env: pythonEnv
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
        logger.log('info', 'Using Windows-native execution path - no Wine needed');

        // Get the Python path and verify it exists
        const pythonPath = getBundledPythonPath();
        logger.log('info', `Using bundled Python on Windows: ${pythonPath}`);

        // Verify the Python executable exists with explicit check
        if (!fs.existsSync(pythonPath)) {
          const errorMsg = `Critical error: Python executable not found at ${pythonPath}`;
          logger.log('error', errorMsg);
          reject(new Error(errorMsg));
          return;
        }

        logger.log('info', `Python executable found at ${pythonPath} - verified`);

        // Skip dependency checks at runtime - they should be installed during download-binaries
        logger.log('info', 'Starting game directly without dependency checks');

        // Now run the game with proper PYTHONPATH setup to ensure modules can be found
        logger.log('info', 'Starting game with improved Python environment setup');

        // Use -c to run Python with enhanced environment setup
        const pythonProcess = spawn(
          pythonPath,
          [
            '-c',
            `import sys, os; sys.path.insert(0, r'${ltMakerPath}'); os.environ['PYTHONPATH'] = r'${ltMakerPath}' + os.pathsep + os.environ.get('PYTHONPATH', ''); import run_engine_for_project; run_engine_for_project.main('${projectNameEndingInDotLtProj}')`
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

// Prepare Python environment by pre-installing dependencies
async function preparePythonEnvironment() {
  return new Promise((resolve, reject) => {
    logger.log('info', 'Preparing Python environment by pre-installing dependencies...');

    // Skip on non-Windows platforms for now - we'll handle macOS with Wine at runtime
    if (process.platform !== 'win32') {
      logger.log('info', 'Skipping dependency pre-installation on non-Windows platform');
      resolve();
      return;
    }

    const pythonPath = getBundledPythonPath();
    const ltMakerPath = process.env.NODE_ENV === 'development'
      ? path.join(app.getAppPath(), '..', 'lt-maker-fork')
      : getLtMakerPath();

    const installDepsPath = path.join(app.getAppPath(), 'bin', 'python', 'install_dependencies.py');

    try {
      // Run synchronously to wait for dependencies to be installed
      const { spawn } = require('child_process');
      const depProcess = spawn(pythonPath, [installDepsPath], {
        cwd: ltMakerPath,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let stdoutData = '';
      let stderrData = '';

      depProcess.stdout.on('data', (data) => {
        const output = data.toString().trim();
        stdoutData += output + '\n';
        logger.log('info', `Python dependency installer: ${output}`);
      });

      depProcess.stderr.on('data', (data) => {
        const output = data.toString().trim();
        stderrData += output + '\n';
        logger.log('error', `Python dependency installer error: ${output}`);
      });

      depProcess.on('close', (code) => {
        if (code === 0) {
          logger.log('info', 'Python dependencies pre-installed successfully');
          resolve();
        } else {
          logger.log('warn', `Python dependency pre-installation exited with code ${code}`);
          // Resolve anyway since we'll retry at runtime
          resolve();
        }
      });

      depProcess.on('error', (err) => {
        logger.log('error', `Failed to start Python dependency installer: ${err.message}`);
        // Resolve anyway since we'll retry at runtime
        resolve();
      });
    } catch (error) {
      logger.log('error', `Error during Python dependency pre-installation: ${error.message}`);
      // Resolve anyway since we'll retry at runtime
      resolve();
    }
  });
}

// Alias for backward compatibility
const runGameWithWine = runGame;

// Run a Python script with appropriate environment setup
async function runPythonScript(scriptPath) {
  return new Promise((resolve, reject) => {
    try {
      logger.log('info', `Running Python script: ${scriptPath}`);
      
      // Make sure we're using the correct path to lt-maker-fork
      const ltMakerPath = process.env.NODE_ENV === 'development'
        ? path.join(app.getAppPath(), '..', 'lt-maker-fork')
        : getLtMakerPath();
      
      // Get the directory of the script
      const scriptDir = path.dirname(scriptPath);
      
      // On macOS or Linux, we need to use Wine
      if (process.platform === 'darwin' || process.platform === 'linux') {
        logger.log('info', 'Using Wine to run Python script on macOS/Linux');
        let winePath;
        try {
          winePath = getWinePath();
          logger.log('info', `Using Wine at: ${winePath}`);
        } catch (wineError) {
          logger.log('error', 'Fatal Wine error', { error: wineError.message });
          reject(wineError);
          return;
        }
        
        // Get the environment for Python with Wine
        const pythonEnv = getWinePythonEnv();
        
        // Use similar approach as runGame
        logger.log('info', `Running Python script with Wine: ${scriptPath}`);
        
        // Get the script name from the path
        const scriptName = path.basename(scriptPath);
        
        // Launch with shell command
        const wineProcess = spawn(
          winePath,
          ['python', scriptName],
          {
            cwd: scriptDir,
            detached: false,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: pythonEnv
          }
        );
        
        wineProcess.stdout.on('data', (data) => {
          const output = data.toString().trim();
          logger.log('info', `Python script stdout: ${output}`);
        });
        
        wineProcess.stderr.on('data', (data) => {
          const output = data.toString().trim();
          logger.log('error', `Python script stderr: ${output}`);
        });
        
        wineProcess.on('close', (code) => {
          logger.log('info', `Python script process closed with code ${code}`);
          if (code !== 0) {
            logger.log('error', `Wine process exited with non-zero code: ${code}`);
            reject(new Error(`Python script exited with code ${code}`));
          } else {
            resolve();
          }
        });
        
        wineProcess.on('error', (err) => {
          logger.log('error', 'Failed to start Python script process', {
            error: err.message,
            code: err.code,
            path: scriptPath
          });
          reject(err);
        });
      } else {
        // On Windows, we run Python directly
        logger.log('info', 'Running Python script on Windows');
        
        // Get the Python path
        const pythonPath = getBundledPythonPath();
        logger.log('info', `Using bundled Python on Windows: ${pythonPath}`);
        
        // Verify the Python executable exists
        if (!fs.existsSync(pythonPath)) {
          const errorMsg = `Python executable not found at ${pythonPath}`;
          logger.log('error', errorMsg);
          reject(new Error(errorMsg));
          return;
        }
        
        // Run the Python script
        const pythonProcess = spawn(
          pythonPath,
          [scriptPath],
          {
            cwd: scriptDir,
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: {
              ...process.env,
              PYTHONUNBUFFERED: '1'
            }
          }
        );
        
        // Unref the child to allow the Node.js event loop to exit
        pythonProcess.unref();
        
        pythonProcess.stdout.on('data', (data) => {
          const output = data.toString().trim();
          logger.log('info', `Python script stdout: ${output}`);
        });
        
        pythonProcess.stderr.on('data', (data) => {
          const output = data.toString().trim();
          logger.log('error', `Python script stderr: ${output}`);
        });
        
        pythonProcess.on('close', (code) => {
          logger.log('info', `Python script process closed with code ${code}`);
          if (code !== 0) {
            logger.log('error', `Python process exited with non-zero code: ${code}`);
            reject(new Error(`Python script exited with code ${code}`));
          } else {
            resolve();
          }
        });
        
        pythonProcess.on('error', (err) => {
          logger.log('error', 'Failed to start Python script process', {
            error: err.message,
            stack: err.stack
          });
          reject(err);
        });
      }
    } catch (error) {
      logger.log('error', 'Unexpected error in runPythonScript', {
        error: error.message,
        stack: error.stack
      });
      reject(error);
    }
  });
}

module.exports = {
  runGame,
  runGameWithWine, // Keeping for backward compatibility
  preparePythonEnvironment,
  runPythonScript
};