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
  // First check if we have a user data path set by sync-lt-maker.js
  if (process.env.USER_LT_MAKER_PATH) {
    const userLtMakerPath = process.env.USER_LT_MAKER_PATH;
    try {
      if (fs.existsSync(userLtMakerPath)) {
        logger.log('info', `Using lt-maker-fork from user data directory: ${userLtMakerPath}`);
        return userLtMakerPath;
      }
    } catch (e) {
      logger.log('warn', `Error accessing user lt-maker-fork path: ${e.message}`);
    }
  }

  // Fall back to bundled resources path
  if (app.isPackaged) {
    const resourcePath = path.join(process.resourcesPath, 'lt-maker-fork');
    logger.log('info', `Falling back to bundled lt-maker-fork path: ${resourcePath}`);
    return resourcePath;
  }

  // In development mode
  const devPath = path.join(app.getAppPath(), 'lt-maker-fork');
  logger.log('info', `Using development lt-maker-fork path: ${devPath}`);
  return devPath;
}

// Get path to Python with better error handling and fallbacks
function getBundledPythonPath() {
  // In Electron, properly handle asar vs asar.unpacked paths
  // Create possible Python paths, accounting for asar packaging
  const appPath = app.getAppPath();
  let basePaths = [];

  if (appPath.includes('app.asar')) {
    // In packaged app, binaries must be in .unpacked directory
    const unpackedPath = appPath.replace('app.asar', 'app.asar.unpacked');

    // Always prioritize unpacked paths, as binaries like Python cannot be executed from inside asar
    logger.log('info', `App is packaged. Using app.asar.unpacked paths for binaries: ${unpackedPath}`);

    basePaths = [
      // First try unpacked path (which should be correct in production)
      unpackedPath,
      // Then try resources dir directly
      process.resourcesPath,
      // Last resort - try extracting from asar at runtime
      path.join(process.resourcesPath, 'app.asar.unpacked')
    ];
  } else {
    // In dev mode
    basePaths = [
      // First try the app directory directly
      appPath,
      // Then try going one level up (common in dev setups)
      path.join(appPath, '..')
    ];
  }

  logger.log('info', `Base paths for Python search: ${JSON.stringify(basePaths)}`);

  if (process.platform === 'win32') {
    // Windows - build a list of all possible Python paths
    const possiblePaths = [];

    // Add special paths for packaged Windows apps
    if (app.isPackaged) {
      // For packaged apps on Windows, we need more sophisticated path handling
      const resourcesDir = process.resourcesPath;

      // Try the direct path to the bin directory in resources first
      possiblePaths.push(
        path.join(resourcesDir, 'bin', 'python', 'python_embed', 'python.exe'),
        path.join(resourcesDir, 'bin', 'python', 'python.exe')
      );

      // Then try the unpacked version
      const appUnpackedDir = app.getAppPath().replace('app.asar', 'app.asar.unpacked');
      possiblePaths.push(
        path.join(appUnpackedDir, 'bin', 'python', 'python_embed', 'python.exe'),
        path.join(appUnpackedDir, 'bin', 'python', 'python.exe')
      );

      // Also try some alternative locations (just in case)
      possiblePaths.push(
        path.join(resourcesDir, 'app.asar.unpacked', 'bin', 'python', 'python_embed', 'python.exe'),
        path.join(resourcesDir, 'app.asar.unpacked', 'bin', 'python', 'python.exe')
      );

      logger.log('info', `Windows packaged app - checking special Python locations: ${JSON.stringify(possiblePaths.slice(0, 4))}`);
    } else {
      // For development, use the standard paths
      for (const basePath of basePaths) {
        possiblePaths.push(
          path.join(basePath, 'bin', 'python', 'python_embed', 'python.exe'),
          path.join(basePath, 'bin', 'python', 'python.exe')
        );
      }
    }

    // Add system Python as last resort
    possiblePaths.push("python.exe");

    logger.log('info', `Searching for Python in paths: ${JSON.stringify(possiblePaths)}`);

    // Try each path
    for (const pythonPath of possiblePaths) {
      try {
        // For system Python, we can't use fs.existsSync
        if (pythonPath === "python.exe") {
          logger.log('info', `Attempting to use system Python: ${pythonPath}`);

          // In packaged app, do a final check in a standard Windows Python install location
          if (app.isPackaged) {
            try {
              const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
              const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';

              const possibleWindowsPaths = [
                path.join(programFiles, 'Python311', 'python.exe'),
                path.join(programFilesX86, 'Python311', 'python.exe'),
                path.join(programFiles, 'Python310', 'python.exe'),
                path.join(programFilesX86, 'Python310', 'python.exe'),
                path.join(programFiles, 'Python39', 'python.exe'),
                path.join(programFilesX86, 'Python39', 'python.exe')
              ];

              for (const pyPath of possibleWindowsPaths) {
                if (fs.existsSync(pyPath)) {
                  logger.log('info', `Found Python in standard Windows location: ${pyPath}`);
                  return pyPath;
                }
              }
            } catch (e) {
              // Ignore errors in extra checks
            }
          }

          return pythonPath;
        }

        if (fs.existsSync(pythonPath)) {
          logger.log('info', `Found Python at ${pythonPath}`);
          // Verify it's executable (on Windows this is less important)
          try {
            fs.accessSync(pythonPath, fs.constants.F_OK);
            logger.log('info', `Python at ${pythonPath} exists and is readable`);
          } catch (accessErr) {
            logger.log('warn', `Python at ${pythonPath} exists but may not be readable: ${accessErr.message}`);
          }
          return pythonPath;
        }
      } catch (error) {
        logger.log('warn', `Error checking Python path ${pythonPath}: ${error.message}`);
      }
    }

    // If using packaged app, provide a more informative error
    if (app.isPackaged) {
      const errorMsg = `Python not found in bundled application or system. Please ensure Python is installed.`;
      logger.log('error', errorMsg);
      throw new Error(errorMsg);
    }

    // If we reach here and none of the paths worked, log a detailed error but return system Python
    logger.log('warn', `Bundled Python not found at expected locations. Attempting to use system Python.`);
    return "python.exe";

  } else if (process.platform === 'darwin') {
    // For macOS, we'll use bundled Python with Wine
    // Build a list of all possible Python paths
    const possiblePaths = [];

    // Add all combinations of paths
    for (const basePath of basePaths) {
      possiblePaths.push(
        path.join(basePath, 'bin', 'python', 'python_embed', 'python.exe'),
        path.join(basePath, 'bin', 'python', 'python.exe'),
        path.join(basePath, 'bin', 'python', 'python')
      );
    }

    // Add system Python as last resort
    possiblePaths.push("python");

    logger.log('info', `Searching for Python in paths: ${JSON.stringify(possiblePaths)}`);

    // Try each path
    for (const pythonPath of possiblePaths) {
      try {
        // For system Python, we can't use fs.existsSync
        if (pythonPath === "python") {
          logger.log('info', `Attempting to use system Python: ${pythonPath}`);
          return pythonPath;
        }

        if (fs.existsSync(pythonPath)) {
          logger.log('info', `Found Python at ${pythonPath}`);
          // Verify it's executable for non-system paths
          if (!pythonPath.includes("python.exe")) {
            try {
              fs.accessSync(pythonPath, fs.constants.X_OK);
              logger.log('info', `Python at ${pythonPath} is executable`);
            } catch (accessErr) {
              logger.log('warn', `Python at ${pythonPath} exists but may not be executable: ${accessErr.message}`);
            }
          }
          return pythonPath;
        }
      } catch (error) {
        logger.log('warn', `Error checking Python path ${pythonPath}: ${error.message}`);
      }
    }

    // If we reach here, log a warning but return system python
    logger.log('warn', `Bundled Python not found at expected locations. Attempting to use system Python.`);
    return "python";

  } else {
    // Linux - build a list of all possible Python paths
    const possiblePaths = [];

    // Add all combinations of paths
    for (const basePath of basePaths) {
      possiblePaths.push(
        path.join(basePath, 'bin', 'python', 'python_embed', 'python.exe'),
        path.join(basePath, 'bin', 'python', 'python.exe'),
        path.join(basePath, 'bin', 'python', 'python')
      );
    }

    // Add system Python as last resort
    possiblePaths.push("python");

    logger.log('info', `Searching for Python in paths: ${JSON.stringify(possiblePaths)}`);

    // Try each path
    for (const pythonPath of possiblePaths) {
      try {
        // For system Python, we can't use fs.existsSync
        if (pythonPath === "python") {
          logger.log('info', `Attempting to use system Python: ${pythonPath}`);
          return pythonPath;
        }

        if (fs.existsSync(pythonPath)) {
          logger.log('info', `Found Python at ${pythonPath}`);
          // Verify it's executable for non-system paths
          if (!pythonPath.includes("python.exe")) {
            try {
              fs.accessSync(pythonPath, fs.constants.X_OK);
              logger.log('info', `Python at ${pythonPath} is executable`);
            } catch (accessErr) {
              logger.log('warn', `Python at ${pythonPath} exists but may not be executable: ${accessErr.message}`);
            }
          }
          return pythonPath;
        }
      } catch (error) {
        logger.log('warn', `Error checking Python path ${pythonPath}: ${error.message}`);
      }
    }

    // Fallback to system python
    logger.log('warn', `Bundled Python not found at expected locations. Falling back to system Python.`);
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

        // Convert paths for Wine usage
        const toWinePath = (unixPath) => {
          // First clean up the path - remove any quotes that might be in the path
          let cleanPath = unixPath.replace(/"/g, '');

          // If path has spaces and isn't already quoted, we'll handle that in the script itself
          // rather than trying to quote it here, as Wine path quoting is tricky

          if (cleanPath.startsWith('/')) {
            return 'Z:' + cleanPath.replace(/\//g, '\\');
          }
          return cleanPath.replace(/\//g, '\\');
        };

        // Get the Wine-compatible path to the run_engine_for_project.py script
        const ltMakerWinePath = toWinePath(ltMakerPath);

        // Get the path to the actual Python executable in the bundled environment
        // IMPORTANT: For packaged apps, this must use app.asar.unpacked
        let bundledPythonExe;
        const appPath = app.getAppPath();

        if (appPath.includes('app.asar')) {
          // In packaged app, use the unpacked path for binary executables
          const unpackedPath = appPath.replace('app.asar', 'app.asar.unpacked');
          bundledPythonExe = path.join(unpackedPath, 'bin', 'python', 'python_embed', 'python.exe');
          logger.log('info', `Using Python from unpacked path for Wine: ${bundledPythonExe}`);
        } else {
          // In dev mode
          bundledPythonExe = path.join(appPath, 'bin', 'python', 'python_embed', 'python.exe');
        }
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

        // Log additional debug info about paths
        logger.log('info', `Batch file configuration:
          Python Wine Exe: ${pythonWineExe}
          LT Maker Wine Path: ${ltMakerWinePath}
          Python Wine Script Path: ${pythonWineScriptPath}
          Is Packaged: ${app.isPackaged}
        `);

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
    echo Searching for Python in alternative locations...
    
    REM Check possible alternative locations
    if exist "${pythonWineExe.replace('app.asar\\', 'app.asar.unpacked\\')}" (
        echo Found Python at alternative location: ${pythonWineExe.replace('app.asar\\', 'app.asar.unpacked\\')}
        set PYTHON_EXE=${pythonWineExe.replace('app.asar\\', 'app.asar.unpacked\\')}
    ) else (
        echo Could not find Python executable
        exit /b 1
    )
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
echo print("Python version:", sys.version) >> run_game_simple.py
echo print("Python paths:", sys.path) >> run_game_simple.py
echo sys.path.insert(0, r'${ltMakerWinePath}') >> run_game_simple.py
echo os.environ['PYTHONPATH'] = r'${ltMakerWinePath}' + os.pathsep + os.environ.get('PYTHONPATH', '') >> run_game_simple.py
echo try: >> run_game_simple.py
echo     import run_engine_for_project >> run_game_simple.py
echo     print("Successfully imported run_engine_for_project") >> run_game_simple.py
echo     run_engine_for_project.main('${normalizedProjectPath}') >> run_game_simple.py
echo except ImportError as e: >> run_game_simple.py
echo     print("Failed to import run_engine_for_project:", e) >> run_game_simple.py
echo     sys.exit(1) >> run_game_simple.py
echo except Exception as e: >> run_game_simple.py
echo     print("Error running game:", e) >> run_game_simple.py
echo     sys.exit(1) >> run_game_simple.py

REM Run the game with proper Python configuration
echo Starting game engine...
REM If we found an alternative Python path, use that
if defined PYTHON_EXE (
    "%PYTHON_EXE%" run_game_simple.py
) else (
    "${pythonWineExe}" run_game_simple.py
)
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

          // For packaged apps, ensure the Python path is using app.asar.unpacked
          // This is crucial because binaries can't be executed from inside asar archive
          if (app.isPackaged && pythonWineExe.includes('app.asar\\')) {
            // Fix the path by replacing app.asar with app.asar.unpacked
            const fixedPythonPath = pythonWineExe.replace('app.asar\\', 'app.asar.unpacked\\');
            logger.log('info', `Fixed Python path for packaged app: 
              Original: ${pythonWineExe} 
              Fixed: ${fixedPythonPath}`);

            // Use the fixed path
            pythonWineExe = fixedPythonPath;
          }

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

          let stdoutBuffer = '';
          let installInProgress = false;

          wineProcess.stdout.on('data', (data) => {
            const output = data.toString().trim();
            stdoutBuffer += output + '\n';
            logger.log('info', `Game stdout: ${output}`);

            // Check if we're seeing the pygame not found error
            if (output.includes('ModuleNotFoundError') && output.includes('No module named \'pygame\'') && !installInProgress) {
              installInProgress = true;
              logger.log('warn', 'Detected missing pygame module, attempting to install it automatically...');

              // Create a script to install pygame
              const pythonDir = path.join(app.getAppPath(), 'bin', 'python');
              const pythonEmbedDir = path.join(pythonDir, 'python_embed');
              const installScriptPath = path.join(require('os').tmpdir(), 'install_pygame.py');
              const ltMakerPath = getLtMakerPath();
              const requirementsPath = path.join(ltMakerPath, 'requirements_editor.txt');

              // Write a script to install pygame
              const installScriptContent = `
import os
import sys
import subprocess
print("Installing pygame and other dependencies...")

# Install pip if needed
try:
    import pip
    print(f"pip is already installed: {pip.__version__}")
except ImportError:
    print("pip not found, installing it...")
    try:
        import urllib.request
        print("Downloading get-pip.py...")
        urllib.request.urlretrieve("https://bootstrap.pypa.io/get-pip.py", "get-pip.py")
        print("Installing pip...")
        subprocess.check_call([sys.executable, "get-pip.py"])
        print("pip installed successfully")
    except Exception as e:
        print(f"Error installing pip: {e}")
        sys.exit(1)

# First try installing pygame directly
try:
    print("Installing pygame-ce...")
    subprocess.check_call([
        sys.executable, "-m", "pip", "install", "pygame-ce==2.3.2", "--no-warn-script-location"
    ])
    print("pygame-ce installed successfully")
except Exception as e:
    print(f"Error installing pygame-ce: {e}")
    sys.exit(1)

# Verify pygame installation
try:
    import pygame
    print(f"pygame installed successfully: {pygame.__version__}")
except ImportError as e:
    print(f"Failed to import pygame after installation: {e}")
    sys.exit(1)

print("Installation completed successfully. Please restart the game.")
sys.exit(0)
`;

              fs.writeFileSync(installScriptPath, installScriptContent);

              // Run the installation script with Wine
              try {
                const { spawn, execSync } = require('child_process');
                logger.log('info', 'Running pygame installation script...');

                // Kill the current Wine process first
                if (wineProcess && !wineProcess.killed) {
                  wineProcess.kill();
                }

                // Get the Wine path
                const winePath = getWinePath();
                if (!winePath) {
                  logger.log('error', 'Wine not found, cannot install pygame');
                  return;
                }

                // Create a better shell script for running in Wine environment
                const shellPath = path.join(require('os').tmpdir(), 'install_pygame.sh');
                const shellContent = `#!/bin/bash
# Enhanced Python dependency installation script for Wine
set -e

# Set Wine configuration
export WINEDEBUG=-all
export WINEDLLOVERRIDES=mscoree,mshtml=

# Get script directory
PYTHON_DIR="${path.join(app.getAppPath(), 'bin', 'python')}"
PYTHON_EXE="${path.join(pythonEmbedDir, 'python.exe')}"
INSTALL_SCRIPT="${installScriptPath}"

echo "=== Python Setup with Wine ==="
echo "Python directory: $PYTHON_DIR"
echo "Python executable: $PYTHON_EXE"
echo "Install script: $INSTALL_SCRIPT"

# Check Wine is available
if ! command -v wine &> /dev/null; then
    echo "ERROR: Wine is not installed or not in PATH"
    echo "Please install Wine using: brew install --cask --no-quarantine wine-stable"
    exit 1
fi

echo "Wine version: $(wine --version)"

# Check Python executable exists
if [ ! -f "$PYTHON_EXE" ]; then
    echo "ERROR: Python executable not found"
    exit 1
fi

echo "Using Python executable: $PYTHON_EXE"

# Create python script directly inline
TEMP_SCRIPT="${path.join(require('os').tmpdir(), 'install_pygame_inline.py')}"
cat > "$TEMP_SCRIPT" << 'EOF'
import os
import sys
import subprocess
print("Installing pygame and other dependencies...")

# Install pip if needed
try:
    import pip
    print(f"pip is already installed: {pip.__version__}")
except ImportError:
    print("pip not found, installing it...")
    try:
        import urllib.request
        print("Downloading get-pip.py...")
        urllib.request.urlretrieve("https://bootstrap.pypa.io/get-pip.py", "get-pip.py")
        print("Installing pip...")
        subprocess.check_call([sys.executable, "get-pip.py"])
        print("pip installed successfully")
    except Exception as e:
        print(f"Error installing pip: {e}")
        sys.exit(1)

try:
    # First update pip itself
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "pip", "--no-warn-script-location"])
    print("pip upgraded successfully")
    
    # Install pygame directly
    print("Installing pygame-ce...")
    subprocess.check_call([
        sys.executable, "-m", "pip", "install", "pygame-ce==2.3.2", "--no-warn-script-location"
    ])
    print("pygame-ce installed successfully")
    
    # Install other critical packages
    print("Installing typing-extensions...")
    subprocess.check_call([
        sys.executable, "-m", "pip", "install", "typing-extensions==4.8.0", "--no-warn-script-location"
    ])
    print("typing-extensions installed successfully")
    
    print("Installing PyQt5...")
    subprocess.check_call([
        sys.executable, "-m", "pip", "install", "PyQt5==5.15.10", "--no-warn-script-location"
    ])
    print("PyQt5 installed successfully")
except Exception as e:
    print(f"Error installing packages: {e}")
    sys.exit(1)

# Verify installation
try:
    import pygame
    print(f"pygame installed successfully: {pygame.__version__}")
except ImportError as e:
    print(f"Failed to import pygame after installation: {e}")
    sys.exit(1)

print("Installation completed successfully. Please restart the game.")
sys.exit(0)
EOF

# Run the Python script with Wine
echo "Running Python script to install pygame and other dependencies..."
wine "$PYTHON_EXE" "$TEMP_SCRIPT"

if [ $? -eq 0 ]; then
    echo "SUCCESS: Python packages installed correctly!"
    exit 0
else
    echo "ERROR: Failed to install Python packages"
    exit 1
fi
`;

                fs.writeFileSync(shellPath, shellContent);
                fs.chmodSync(shellPath, 0o755);

                // Execute the shell script
                logger.log('info', 'Running install_pygame.sh shell script...');

                try {
                  // Show output to user so they can see progress
                  const output = execSync(`/bin/bash ${shellPath}`, {
                    stdio: 'inherit',  // Show output directly
                    timeout: 300000    // 5 minute timeout
                  });

                  logger.log('info', 'Python packages installed successfully. Please restart the game.');

                  // Display a dialog to the user
                  const { dialog } = require('electron');
                  dialog.showMessageBox({
                    type: 'info',
                    title: 'Installation Complete',
                    message: 'Python packages installed successfully.',
                    detail: 'Please restart the game to apply the changes.',
                    buttons: ['OK']
                  });

                } catch (execError) {
                  logger.log('error', `Failed to install Python packages: ${execError.message}`);

                  // Try direct spawn as fallback
                  const installProcess = spawn('/bin/bash', [shellPath], {
                    stdio: 'pipe'
                  });

                  installProcess.stdout.on('data', (data) => {
                    const output = data.toString().trim();
                    logger.log('info', `Install stdout: ${output}`);
                  });

                  installProcess.stderr.on('data', (data) => {
                    const output = data.toString().trim();
                    logger.log('error', `Install stderr: ${output}`);
                  });

                  installProcess.on('close', (code) => {
                    if (code === 0) {
                      logger.log('info', 'Python packages installed successfully. Please restart the game.');

                      // Display a dialog to the user
                      const { dialog } = require('electron');
                      dialog.showMessageBox({
                        type: 'info',
                        title: 'Installation Complete',
                        message: 'Python packages installed successfully.',
                        detail: 'Please restart the game to apply the changes.',
                        buttons: ['OK']
                      });
                    } else {
                      logger.log('error', `Python package installation failed with code ${code}`);

                      // Display error dialog to the user
                      const { dialog } = require('electron');
                      dialog.showMessageBox({
                        type: 'error',
                        title: 'Installation Failed',
                        message: 'Failed to install required Python packages.',
                        detail: 'Please check the logs for more information. The game may not run correctly.',
                        buttons: ['OK']
                      });
                    }
                  });
                }
              } catch (installError) {
                logger.log('error', `Error installing pygame: ${installError.message}`);
              }
            }
          });

          wineProcess.stderr.on('data', (data) => {
            const output = data.toString().trim();
            logger.log('error', `Game stderr: ${output}`);
          });

          wineProcess.on('close', (code) => {
            logger.log('info', `Game process closed with code ${code}`);
            if (code !== 0) {
              logger.log('error', `Wine process exited with non-zero code: ${code}`);
            }
            resolve();
          });

          wineProcess.on('error', (err) => {
            logger.log('error', 'Failed to start game process', {
              error: err.message,
              code: err.code,
              path: tempScriptPath
            });
            reject(err);
          });
        } catch (spawnError) {
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
        logger.log('info', `Using Python executable: ${pythonPath}`);

        // Create a Python script to run the game with better error handling
        let runScriptPath;
        if (app.isPackaged) {
          // In a packaged app, we'll write to a temp file
          runScriptPath = path.join(require('os').tmpdir(), 'run_fe_game.py');
        } else {
          // In dev mode, we can write to the project directory
          runScriptPath = path.join(app.getAppPath(), 'run_fe_game.py');
        }

        // Create a script with more robust error handling and diagnostics
        const scriptContent = `
import sys
import os
import traceback

# Display information about the Python environment
print("Python version:", sys.version)
print("Python executable:", sys.executable)
print("Running game script from:", os.path.abspath(__file__))

# Add all necessary directories to the Python path
lt_maker_path = r'${ltMakerPath}'
print("Using LT Maker path:", lt_maker_path)

# Make sure LT Maker is in path
if lt_maker_path not in sys.path:
    sys.path.insert(0, lt_maker_path)

# Set environment variables
os.environ['PYTHONPATH'] = lt_maker_path + os.pathsep + os.environ.get('PYTHONPATH', '')

# Try to import and run the game
try:
    print("Importing run_engine_for_project module")
    import run_engine_for_project
    print("Successfully imported run_engine_for_project")
    
    # Run the game
    print("Running game:", r'${projectNameEndingInDotLtProj}')
    run_engine_for_project.main('${projectNameEndingInDotLtProj}')
except ImportError as e:
    print("ERROR: Failed to import run_engine_for_project:", e)
    print("Python sys.path:", sys.path)
    print("Traceback:")
    traceback.print_exc()
    sys.exit(1)
except Exception as e:
    print("ERROR: Failed to run game:", e)
    print("Traceback:")
    traceback.print_exc()
    sys.exit(1)
`;

        // Write the script to the run script path
        fs.writeFileSync(runScriptPath, scriptContent);
        logger.log('info', `Created run script at: ${runScriptPath}`);

        // Use this script instead of the command line approach for better error handling
        const pythonProcess = spawn(
          pythonPath,
          [runScriptPath, projectNameEndingInDotLtProj],
          {
            cwd: ltMakerPath,
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: {
              ...process.env,
              PYTHONPATH: `${ltMakerPath}${path.delimiter}${process.env.PYTHONPATH || ''}`,
              PYTHONUNBUFFERED: '1'  // Important for immediate logging
            }
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

    // Skip on non-Windows platforms - we'll detect and handle missing packages at runtime
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

// Run the LT Maker Editor with an optional project
async function runEditor(projectNameEndingInDotLtProj) {
  return new Promise((resolve, reject) => {
    try {
      // Add logging for app paths and environment
      logger.log('info', `Running editor on platform: ${process.platform}`, {
        projectPath: projectNameEndingInDotLtProj || 'none',
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
      logger.log('info', 'Path resolution for editor launcher', {
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

      // Determine which Python script to run based on whether a project was specified
      const pythonScript = projectNameEndingInDotLtProj
        ? "run_editor_for_project.py"
        : "run_editor.py";

      logger.log('info', `Using Python script: ${pythonScript}`);

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
        let normalizedProjectPath = '';
        if (projectNameEndingInDotLtProj) {
          normalizedProjectPath = projectNameEndingInDotLtProj.replace(/\\/g, '/');

          // If the project name doesn't end with .ltproj, add it
          if (!normalizedProjectPath.endsWith(".ltproj")) {
            normalizedProjectPath += ".ltproj";
          }

          logger.log('info', `Running editor with normalized path: ${normalizedProjectPath}`);
        }

        // Get the environment for Python with Wine
        const pythonEnv = getWinePythonEnv();

        // Prepare the Wine command to run Python with the LT Maker script
        const pythonExe = getBundledPythonPath();

        // Convert paths for Wine usage
        const toWinePath = (unixPath) => {
          let cleanPath = unixPath.replace(/"/g, '');
          if (cleanPath.startsWith('/')) {
            return 'Z:' + cleanPath.replace(/\//g, '\\');
          }
          return cleanPath.replace(/\//g, '\\');
        };

        // Convert LT Maker path to Wine format
        const wineLtMakerPath = toWinePath(ltMakerPath);

        // Create arguments array for the Python command
        const pythonArgs = [pythonScript];
        if (normalizedProjectPath) {
          pythonArgs.push(normalizedProjectPath);
        }

        // Create an improved shell script for running Wine
        const shellScriptPath = path.join(app.getPath('temp'), 'run-editor-wine.sh');
        const shellScriptContent = `#!/bin/bash
# Run Wine with Python to launch editor
cd "${ltMakerPath}"
export WINEDEBUG=${pythonEnv.WINEDEBUG || '-all'}
export WINEPREFIX=${pythonEnv.WINEPREFIX || '~/.wine'}

# Set Python environment variables
export PYTHONIOENCODING=utf-8
export PYTHONUNBUFFERED=1
export PYTHONPATH="${ltMakerPath}"

echo "Running editor with Wine"
echo "Wine executable: ${winePath}"
echo "Python executable: ${pythonExe}"
echo "Using editor embedded Python wrapper script"
echo "Editor script: ${pythonScript}"
echo "Project path: ${normalizedProjectPath || 'none'}"
echo "Working directory: ${ltMakerPath}"

# Execute Python script through the editor embedded Python wrapper
"${winePath}" "${pythonExe}" "run_editor_with_embedded_python.py" "${pythonScript}" ${normalizedProjectPath ? `"${normalizedProjectPath}"` : ''} 2>&1
`;

        fs.writeFileSync(shellScriptPath, shellScriptContent);
        fs.chmodSync(shellScriptPath, 0o755);

        logger.log('info', `Created shell script for editor at ${shellScriptPath}`);

        // Launch with shell script
        const editorProcess = spawn(
          '/bin/bash',
          [shellScriptPath],
          {
            cwd: ltMakerPath,
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: pythonEnv
          }
        );

        // Unref the process to allow Node.js to exit
        editorProcess.unref();

        editorProcess.stdout.on('data', (data) => {
          const output = data.toString().trim();
          logger.log('info', `Editor stdout: ${output}`);
        });

        editorProcess.stderr.on('data', (data) => {
          const output = data.toString().trim();
          logger.log('error', `Editor stderr: ${output}`);
        });

        editorProcess.on('close', (code) => {
          logger.log('info', `Editor process closed with code ${code}`);

          // Clean up temp files
          try {
            fs.unlinkSync(shellScriptPath);
          } catch (err) {
            logger.log('warn', `Error cleaning up temp files: ${err.message}`);
          }

          if (code !== 0) {
            logger.log('error', `Editor process exited with non-zero code: ${code}`);
          }
          resolve();
        });

        editorProcess.on('error', (err) => {
          logger.log('error', 'Failed to start editor process', {
            error: err.message,
            code: err.code,
            path: shellScriptPath
          });
          reject(err);
        });

        // Resolve after a short delay to unblock UI
        setTimeout(() => {
          logger.log('info', 'Resolving editor process promise to unblock UI');
          resolve();
        }, 2000);
      } else {
        // On Windows, we run Python directly
        logger.log('info', 'Using Windows-native execution path for editor');

        // Get the Python path
        const pythonPath = getBundledPythonPath();
        logger.log('info', `Using bundled Python on Windows: ${pythonPath}`);

        // Verify Python exists
        if (!fs.existsSync(pythonPath)) {
          const errorMsg = `Critical error: Python executable not found at ${pythonPath}`;
          logger.log('error', errorMsg);
          reject(new Error(errorMsg));
          return;
        }

        // Create args array for the Python process with the embedded Python wrapper
        const pythonArgs = ['run_editor_with_embedded_python.py', pythonScript];

        // Add project path if specified
        if (projectNameEndingInDotLtProj) {
          // Ensure it ends with .ltproj
          let normalizedPath = projectNameEndingInDotLtProj;
          if (!normalizedPath.endsWith('.ltproj')) {
            normalizedPath += '.ltproj';
          }
          pythonArgs.push(normalizedPath);
        }

        logger.log('info', `Running editor with command: ${pythonPath} ${pythonArgs.join(' ')}`);

        // Launch the Python process
        const pythonProcess = spawn(
          pythonPath,
          pythonArgs,
          {
            cwd: ltMakerPath,
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: {
              ...process.env,
              PYTHONPATH: `${ltMakerPath}${path.delimiter}${process.env.PYTHONPATH || ''}`,
              PYTHONUNBUFFERED: '1'
            }
          }
        );

        // Unref to allow Node.js to exit
        pythonProcess.unref();

        pythonProcess.stdout.on('data', (data) => {
          const output = data.toString().trim();
          logger.log('info', `Editor stdout: ${output}`);
        });

        pythonProcess.stderr.on('data', (data) => {
          const output = data.toString().trim();
          logger.log('error', `Editor stderr: ${output}`);
        });

        pythonProcess.on('close', (code) => {
          logger.log('info', `Editor process closed with code ${code}`);
          resolve();
        });

        pythonProcess.on('error', (err) => {
          logger.log('error', 'Failed to start editor process', {
            error: err.message,
            stack: err.stack
          });
          reject(err);
        });

        // Resolve after a short delay to unblock UI
        setTimeout(() => {
          logger.log('info', 'Resolving editor process promise to unblock UI');
          resolve();
        }, 2000);
      }
    } catch (error) {
      logger.log('error', 'Unexpected error in runEditor', {
        error: error.message,
        stack: error.stack
      });
      reject(error);
    }
  });
}

// Alias for backward compatibility
const runGameWithWine = runGame;

// Run a Python script with appropriate environment setup
async function runPythonScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    try {
      logger.log('info', `Running Python script: ${scriptPath} with args:`, args);

      // Make sure we're using the correct path to lt-maker-fork
      const ltMakerPath = process.env.NODE_ENV === 'development'
        ? path.join(app.getAppPath(), '..', 'lt-maker-fork')
        : getLtMakerPath();

      // Get the directory of the script
      const scriptDir = path.dirname(scriptPath);
      const scriptName = path.basename(scriptPath);

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

        // Get the bundled Python executable path - we want to use our bundled Python not system Python
        const bundledPythonPath = getBundledPythonPath();
        logger.log('info', `Using bundled Python with Wine: ${bundledPythonPath}`);

        // Convert paths for Wine usage
        const toWinePath = (unixPath) => {
          // First clean up the path - remove any quotes that might be in the path
          let cleanPath = unixPath.replace(/"/g, '');

          // If path has spaces and isn't already quoted, we'll handle that in the script itself
          // rather than trying to quote it here, as Wine path quoting is tricky

          if (cleanPath.startsWith('/')) {
            return 'Z:' + cleanPath.replace(/\//g, '\\');
          }
          return cleanPath.replace(/\//g, '\\');
        };

        // Create a temporary Python wrapper script to handle the execution
        const tempScriptPath = path.join(require('os').tmpdir(), `run_${scriptName.replace('.py', '')}_wrapper.py`);

        // Convert script and ltMaker paths to Wine format
        const wineScriptPath = toWinePath(scriptPath);
        const wineLtMakerPath = toWinePath(ltMakerPath);

        // Convert arguments to proper format for Python script
        // Escape any special characters and wrap in quotes if needed
        const formattedArgs = args.map(arg => {
          // If arg contains spaces, wrap in quotes
          if (arg.includes(' ')) {
            return `"${arg.replace(/"/g, '\\"')}"`;
          }
          return arg;
        });

        // Create a Python wrapper script that will import and run the target script with arguments
        const pythonWrapperContent = `
import sys
import os
import subprocess

# Helper function to normalize paths
def normalize_path(path):
    # Remove any surrounding quotes
    path = path.strip('"')
    # Normalize path separators
    return os.path.normpath(path)

# Add LT Maker to Python path - normalize the path first
lt_maker_path = normalize_path(r'${wineLtMakerPath}')
sys.path.insert(0, lt_maker_path)
os.environ['PYTHONPATH'] = lt_maker_path + os.pathsep + os.environ.get('PYTHONPATH', '')

# Set working directory to script directory
script_dir = normalize_path(r'${toWinePath(scriptDir)}')
os.chdir(script_dir)

# Prepare the command line arguments - normalize each argument
original_args = ${JSON.stringify(formattedArgs)}
script_args = [normalize_path(arg) for arg in original_args]
script_path = normalize_path(r'${wineScriptPath}')
sys.argv = [script_path] + script_args

# Print environment for debugging
print(f"Current directory: {os.getcwd()}")
print(f"Python path: {sys.path}")
print(f"Running script: {script_path}")
print(f"Arguments: {' '.join(script_args)}")

# Try to import and run the module directly
try:
    # First try to import the target script as a module
    script_name = os.path.basename(script_path).replace('.py', '')
    print(f"Trying to import {script_name}")
    
    # Add the script directory to path
    if script_dir not in sys.path:
        sys.path.insert(0, script_dir)
    
    # Try importing the module
    module = __import__(script_name)
    print(f"Successfully imported {script_name}")
    
    # Check if it has a main function and call it with arguments if applicable
    if hasattr(module, 'main'):
        print(f"Calling {script_name}.main({', '.join(repr(arg) for arg in script_args)})")
        if script_args:
            module.main(*script_args)
        else:
            module.main()
    else:
        print(f"Module {script_name} has no main() function, executing script directly")
        with open(script_path, 'r') as f:
            script_content = f.read()
            exec(script_content)
        
except Exception as e:
    print(f"Error importing module: {e}")
    print("Falling back to running script directly")
    try:
        # If import fails, try executing the script directly
        with open(script_path, 'r') as f:
            script_content = f.read()
            exec(script_content)
    except Exception as e2:
        print(f"Error executing script directly: {e2}")
        sys.exit(1)
        
print("Script execution completed successfully")
`;

        // Write the wrapper script to a file
        fs.writeFileSync(tempScriptPath, pythonWrapperContent);
        const wineTempScriptPath = toWinePath(tempScriptPath);

        // Create a bash script to execute Wine with the wrapper script
        const shellScriptPath = path.join(require('os').tmpdir(), `run_${scriptName.replace('.py', '')}.sh`);
        const shellScriptContent = `#!/bin/bash
# Run Wine with Python wrapper script
cd "${ltMakerPath}"
export WINEDEBUG=${pythonEnv.WINEDEBUG || '-all'}
export WINEPREFIX=${pythonEnv.WINEPREFIX || '~/.wine'}

# Set Python environment variables
export PYTHONIOENCODING=utf-8
export PYTHONUNBUFFERED=1
export PYTHONPATH="${ltMakerPath}"

echo "Running Python script with Wine"
echo "Wine executable: ${winePath}"
echo "Python script: ${tempScriptPath}"
echo "Script directory: ${scriptDir}"
echo "Arguments: ${args.join(' ')}"

# Check if the bundled Python exists and is accessible
bundled_python="${bundledPythonPath}"
if [[ "${bundledPythonPath}" == *"python.exe" ]]; then
  echo "Using bundled Python executable: ${bundledPythonPath}"
  "${winePath}" "${bundledPythonPath}" "${wineTempScriptPath}" 2>&1
else
  echo "Using system Python with Wine"
  "${winePath}" python "${wineTempScriptPath}" 2>&1
fi
`;

        fs.writeFileSync(shellScriptPath, shellScriptContent);
        fs.chmodSync(shellScriptPath, 0o755);

        logger.log('info', `Created shell script at ${shellScriptPath}`);
        logger.log('info', `Shell script content: ${shellScriptContent.substring(0, 500)}...`);

        // Run the shell script
        const wineProcess = spawn(
          '/bin/bash',
          [shellScriptPath],
          {
            cwd: ltMakerPath,
            detached: false,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: pythonEnv
          }
        );

        let stdoutData = '';
        let stderrData = '';

        wineProcess.stdout.on('data', (data) => {
          const output = data.toString().trim();
          stdoutData += output + '\n';
          logger.log('info', `Python script stdout: ${output}`);
        });

        wineProcess.stderr.on('data', (data) => {
          const output = data.toString().trim();
          stderrData += output + '\n';
          logger.log('error', `Python script stderr: ${output}`);
        });

        wineProcess.on('close', (code) => {
          logger.log('info', `Python script process closed with code ${code}`);

          // Clean up temporary files
          try {
            fs.unlinkSync(tempScriptPath);
            fs.unlinkSync(shellScriptPath);
          } catch (err) {
            logger.log('warn', `Error cleaning up temp files: ${err.message}`);
          }

          if (code !== 0) {
            logger.log('error', `Wine process exited with non-zero code: ${code}`);
          }
          resolve(stdoutData);
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

        // Get the Python path using our improved function
        logger.log('info', 'Getting Python path for running script');
        const pythonPath = getBundledPythonPath();

        if (!pythonPath) {
          const errorMsg = `Python executable not found at any expected location`;
          logger.log('error', errorMsg);
          reject(new Error(errorMsg));
          return;
        }

        logger.log('info', `Using Python at: ${pythonPath}`);

        // Add LT Maker to PYTHONPATH environment variable
        const pythonPathEnv = process.env.PYTHONPATH || '';
        const updatedPythonPath = pythonPathEnv.includes(ltMakerPath)
          ? pythonPathEnv
          : `${ltMakerPath}${path.delimiter}${pythonPathEnv}`;

        // Run the Python script with arguments
        const pythonProcess = spawn(
          pythonPath,
          [scriptPath, ...args],
          {
            cwd: scriptDir,
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: {
              ...process.env,
              PYTHONPATH: updatedPythonPath,
              PYTHONUNBUFFERED: '1'
            }
          }
        );

        // Unref to allow Node.js to exit
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
          resolve(stdoutData);
        });

        pythonProcess.on('error', (err) => {
          logger.log('error', 'Failed to start Python script process', {
            error: err.message,
            stack: err.stack
          });
          reject(err);
        });

        // Resolve after a short delay to unblock UI
        setTimeout(() => {
          logger.log('info', 'Resolving Python process promise to unblock UI');
          resolve(stdoutData);
        }, 2000);
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
  runGameWithWine,
  preparePythonEnvironment,
  runPythonScript,
  runEditor
};