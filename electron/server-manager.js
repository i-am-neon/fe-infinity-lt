const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { app } = require('electron');
const logger = require('./logger');

let denoProcess = null;
let serverReady = false;

// Get user data directory for storing databases
const getDataDir = () => {
  const userDataPath = app.getPath('userData');
  const dataDir = path.join(userDataPath, 'data');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  return dataDir;
};

// Set up environment variables for the server
const getServerEnv = () => {
  const dataDir = getDataDir();
  const userDataPath = app.getPath('userData');

  return {
    ...process.env,
    // Path for SQLite database
    DB_PATH: path.join(dataDir, 'sqlite.db'),
    // Always set USER_DATA_PATH for consistent vector storage
    USER_DATA_PATH: userDataPath
  };
};

// Add this function at the top, after the existing imports
const ensureGameLogsDir = (logDir) => {
  try {
    const gameLogsDir = path.join(logDir, 'game_logs');

    if (!fs.existsSync(gameLogsDir)) {
      fs.mkdirSync(gameLogsDir, { recursive: true });
      logger.log('info', `Created game logs directory: ${gameLogsDir}`);
      console.log(`Created game logs directory: ${gameLogsDir}`);
    }

    // Set directory permissions to ensure Deno can write to it
    if (process.platform !== 'win32') {
      try {
        fs.chmodSync(gameLogsDir, 0o777);
        logger.log('info', `Set permissions on game logs directory: ${gameLogsDir}`);
        console.log(`Set permissions on game logs directory: ${gameLogsDir}`);
      } catch (permError) {
        logger.log('error', `Failed to set permissions on game logs directory: ${permError.message}`);
        console.error(`Failed to set permissions on game logs directory: ${permError.message}`);
      }
    }

    return gameLogsDir;
  } catch (error) {
    logger.log('error', `Failed to create game logs directory: ${error.message}`);
    console.error(`Failed to create game logs directory: ${error.message}`);
    return null;
  }
};

// Start the Deno server
const startDenoServer = () => {
  return new Promise((resolve, reject) => {
    const serverPath = path.join(__dirname, '..', 'server');

    // Check if server path exists in packaged app
    if (!fs.existsSync(serverPath)) {
      logger.log('error', 'Server directory does not exist', { path: serverPath });
      console.error('Server directory does not exist at:', serverPath);

      // Try alternative paths in packaged app
      const alternativePaths = [
        path.join(app.getAppPath(), 'server'),
        path.join(app.getAppPath(), '..', 'server'),
        path.join(process.resourcesPath, 'server'),
        path.join(process.resourcesPath, 'app', 'server')
      ];

      let foundPath = null;
      for (const altPath of alternativePaths) {
        logger.log('info', `Checking alternative server path: ${altPath}`);
        console.log(`Checking alternative server path: ${altPath}`);

        if (fs.existsSync(altPath)) {
          logger.log('info', `Found server at alternative path: ${altPath}`);
          console.log(`Found server at alternative path: ${altPath}`);
          foundPath = altPath;
          break;
        }
      }

      if (foundPath) {
        logger.log('info', `Using alternative server path: ${foundPath}`);
        console.log(`Using alternative server path: ${foundPath}`);
        serverPath = foundPath;
      } else {
        logger.log('error', 'Cannot find server directory in any expected location');
        return reject(new Error('Cannot find server directory in any expected location'));
      }
    }

    // Always use bundled Deno regardless of dev or prod mode
    const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development';
    const isMac = process.platform === 'darwin';

    // Use bundled Deno for all platforms
    // When packaged in asar, binaries should be in resources/app.asar.unpacked/bin
    const appPath = app.getAppPath();
    let denoCommand;

    if (appPath.includes('app.asar')) {
      // In production, use the unpacked path
      const unpackedPath = appPath.replace('app.asar', 'app.asar.unpacked');
      denoCommand = path.join(unpackedPath, 'bin', process.platform === 'win32' ? 'deno.exe' : 'deno');
    } else {
      // In development, use the normal path
      denoCommand = path.join(__dirname, 'bin', process.platform === 'win32' ? 'deno.exe' : 'deno');
    }

    // Verify bundled Deno exists
    if (!fs.existsSync(denoCommand)) {
      const errorMsg = `Bundled Deno not found at: ${denoCommand}. Please ensure binaries are downloaded correctly.`;
      logger.log('error', errorMsg);
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    logger.log('info', `Using bundled Deno: ${denoCommand}`);
    console.log(`Using bundled Deno: ${denoCommand}`);

    logger.log('info', `Starting Deno server with command: ${denoCommand}`);
    console.log(`Starting Deno server with command: ${denoCommand}`);

    // Add additional environment variables to help with path resolution
    const appRoot = app.getAppPath();
    const resourcesPath = process.resourcesPath || appRoot;

    // Try to find lt-maker-fork in various locations
    let ltMakerPath = path.resolve(appRoot, 'lt-maker-fork');

    if (!fs.existsSync(ltMakerPath)) {
      const possibleLtMakerPaths = [
        path.join(appRoot, '..', 'lt-maker-fork'),
        path.join(resourcesPath, 'lt-maker-fork'),
        path.join(resourcesPath, 'app', 'lt-maker-fork'),
        path.join(app.getPath('userData'), 'lt-maker-fork')
      ];

      for (const possiblePath of possibleLtMakerPaths) {
        if (fs.existsSync(possiblePath)) {
          ltMakerPath = possiblePath;
          break;
        }
      }
    }

    logger.log('info', 'Path information', {
      electronAppRoot: appRoot,
      resourcesPath: resourcesPath,
      ltMakerPath,
      serverPath
    });
    console.log('Electron app root path:', appRoot);
    console.log('Resources path:', resourcesPath);
    console.log('LT Maker path:', ltMakerPath);
    console.log('Server path:', serverPath);

    // Check if lt-maker directory exists
    try {
      if (fs.existsSync(ltMakerPath)) {
        logger.log('info', 'LT Maker directory exists');
        console.log('LT Maker directory exists');
      } else {
        logger.log('error', 'LT Maker directory does not exist', { path: ltMakerPath });
        console.error('LT Maker directory does not exist at:', ltMakerPath);
      }
    } catch (error) {
      logger.log('error', 'Error checking LT Maker directory', { error: error.message });
      console.error('Error checking LT Maker directory:', error);
    }

    // Get log directory from environment or use default
    const logDir = process.env.ELECTRON_LOG_DIR || path.join(serverPath, '_logs');

    // Ensure log directory exists
    try {
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
        logger.log('info', `Created log directory: ${logDir}`);
      }

      // Set permissions to ensure Deno can write to it
      if (process.platform !== 'win32') {
        try {
          fs.chmodSync(logDir, 0o777);
          logger.log('info', `Set permissions on log directory: ${logDir}`);
        } catch (permError) {
          logger.log('error', `Failed to set permissions on log directory: ${permError.message}`);
        }
      }

      // Also ensure game_logs subdirectory exists
      const gameLogsDir = ensureGameLogsDir(logDir);

      // Log directory structure
      logger.log('info', 'Log directory structure', {
        mainLogDir: logDir,
        gameLogsDir: gameLogsDir
      });

      logger.log('info', `Using log directory for Deno server: ${logDir}`);
      console.log(`Using log directory for Deno server: ${logDir}`);
    } catch (logDirError) {
      logger.log('error', `Failed to create log directory: ${logDirError.message}`);
    }

    const serverEnv = {
      ...getServerEnv(),
      ELECTRON_APP_ROOT: appRoot,
      RESOURCES_PATH: resourcesPath,
      LT_MAKER_PATH: ltMakerPath,
      SERVER_DIR: serverPath,
      DENO_ENV: process.env.NODE_ENV || (isDev ? 'development' : 'production'),
      ELECTRON_LOG_DIR: logDir,
      NODE_ENV: isDev ? 'development' : 'production'
    };

    // Log the command and env for debugging
    logger.log('info', 'Deno server command', {
      command: denoCommand,
      args: ['run', '--allow-all', 'server.ts'],
      cwd: serverPath,
      env: {
        ELECTRON_APP_ROOT: serverEnv.ELECTRON_APP_ROOT,
        RESOURCES_PATH: serverEnv.RESOURCES_PATH,
        LT_MAKER_PATH: serverEnv.LT_MAKER_PATH,
        SERVER_DIR: serverEnv.SERVER_DIR,
        DENO_ENV: serverEnv.DENO_ENV
      }
    });

    denoProcess = spawn(
      denoCommand,
      ['run', '--allow-all', 'server.ts'],
      {
        cwd: serverPath,
        env: serverEnv,
        shell: false // Don't use shell to avoid path escaping issues with spaces
      }
    );

    denoProcess.stdout.on('data', (data) => {
      const output = data.toString();
      logger.log('info', `Deno server output: ${output}`);
      console.log(`Deno server: ${output}`);
      serverReady = true;
      resolve();
    });

    denoProcess.stderr.on('data', (data) => {
      const error = data.toString();
      logger.log('error', `Deno server error: ${error}`);
      console.error(`Deno server error: ${error}`);
      // Don't reject on stderr, as Deno might output warnings here
    });

    denoProcess.on('error', (err) => {
      logger.log('error', 'Failed to start Deno server', {
        error: err.message,
        code: err.code,
        stack: err.stack
      });
      console.error('Failed to start Deno server:', err);

      // We don't want to use system binaries as fallback anymore
      logger.log('error', 'Failed to start Deno server - not attempting fallback');
      console.error('Failed to start Deno server - not attempting fallback');
      reject(err);
    });

    // Resolve after timeout to not block app startup
    setTimeout(() => {
      if (!serverReady) {
        logger.log('info', 'Timeout waiting for Deno server output, assuming it started');
        console.log('Timeout waiting for Deno server output, assuming it started');
        serverReady = true;
        resolve();
      }
    }, 5000);
  });
};

// Fallback method for starting Deno (only for bundled binaries)
const startDenoServerFallback = (serverPath, resolve, reject) => {
  logger.log('error', 'Deno server failed to start with primary method - attempting bundled binary only fallback');
  console.error('Deno server failed to start with primary method - attempting bundled binary only fallback');

  // Get log directory from environment or use default
  const logDir = process.env.ELECTRON_LOG_DIR || path.join(serverPath, '_logs');

  // Ensure log directory exists
  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
      logger.log('info', `Created log directory: ${logDir} (fallback method)`);
    }

    // Set permissions to ensure Deno can write to it
    if (process.platform !== 'win32') {
      try {
        fs.chmodSync(logDir, 0o777);
        logger.log('info', `Set permissions on log directory: ${logDir} (fallback method)`);
      } catch (permError) {
        logger.log('error', `Failed to set permissions on log directory (fallback): ${permError.message}`);
      }
    }

    // Also ensure game_logs subdirectory exists
    const gameLogsDir = ensureGameLogsDir(logDir);

    // Log directory structure
    logger.log('info', 'Log directory structure (fallback method)', {
      mainLogDir: logDir,
      gameLogsDir: gameLogsDir
    });

    logger.log('info', `Using log directory for Deno server (fallback): ${logDir}`);
    console.log(`Using log directory for Deno server (fallback): ${logDir}`);
  } catch (logDirError) {
    logger.log('error', `Failed to create log directory (fallback): ${logDirError.message}`);
  }

  // Try to find LT Maker path
  const appRoot = app.getAppPath();
  const resourcesPath = process.resourcesPath || appRoot;

  let ltMakerPath = path.resolve(appRoot, 'lt-maker-fork');
  if (!fs.existsSync(ltMakerPath)) {
    const possibleLtMakerPaths = [
      path.join(appRoot, '..', 'lt-maker-fork'),
      path.join(resourcesPath, 'lt-maker-fork'),
      path.join(resourcesPath, 'app', 'lt-maker-fork'),
      path.join(app.getPath('userData'), 'lt-maker-fork')
    ];

    for (const possiblePath of possibleLtMakerPaths) {
      if (fs.existsSync(possiblePath)) {
        ltMakerPath = possiblePath;
        logger.log('info', `Found LT Maker at alternative path: ${ltMakerPath}`);
        break;
      }
    }
  }

  // Add additional environment variables to help with path resolution
  const serverEnv = {
    ...getServerEnv(),
    ELECTRON_APP_ROOT: appRoot,
    RESOURCES_PATH: resourcesPath,
    LT_MAKER_PATH: ltMakerPath,
    SERVER_DIR: serverPath,
    DENO_ENV: process.env.NODE_ENV || 'production',
    ELECTRON_LOG_DIR: logDir,
    NODE_ENV: process.env.NODE_ENV || 'production',
    // Python is always bundled now, no system Python flag needed
  };

  // Always use bundled Deno
  const appPath = app.getAppPath();
  let bundledDenoPath;

  if (appPath.includes('app.asar')) {
    // In production, use the unpacked path
    const unpackedPath = appPath.replace('app.asar', 'app.asar.unpacked');
    bundledDenoPath = path.join(unpackedPath, 'bin', process.platform === 'win32' ? 'deno.exe' : 'deno');
  } else {
    // In development, use the normal path
    bundledDenoPath = path.join(__dirname, 'bin', process.platform === 'win32' ? 'deno.exe' : 'deno');
  }

  if (!fs.existsSync(bundledDenoPath)) {
    const errorMessage = `Bundled Deno not found at ${bundledDenoPath}. Cannot start server without bundled binaries.`;
    logger.log('error', errorMessage);
    console.error(errorMessage);
    reject(new Error(errorMessage));
    return;
  }

  logger.log('info', `Using bundled Deno at: ${bundledDenoPath}`);
  console.log(`Using bundled Deno at: ${bundledDenoPath}`);

  // Log current working directory and file existence
  try {
    const serverTsPath = path.join(serverPath, 'server.ts');
    const serverTsExists = fs.existsSync(serverTsPath);
    logger.log('info', `server.ts exists: ${serverTsExists}`, { path: serverTsPath });

    if (!serverTsExists) {
      // Check other potential locations
      const otherPotentialPaths = [
        path.join(appRoot, 'server', 'server.ts'),
        path.join(resourcesPath, 'server', 'server.ts'),
        path.join(resourcesPath, 'app', 'server', 'server.ts')
      ];

      for (const potentialPath of otherPotentialPaths) {
        const exists = fs.existsSync(potentialPath);
        logger.log('info', `Alternative server.ts path exists: ${exists}`, { path: potentialPath });

        if (exists) {
          serverPath = path.dirname(potentialPath);
          logger.log('info', `Using alternative server path: ${serverPath}`);
          break;
        }
      }
    }
  } catch (e) {
    logger.log('error', `Error checking server.ts existence: ${e.message}`);
  }

  denoProcess = spawn(
    bundledDenoPath,
    ['run', '--allow-all', 'server.ts'],
    {
      cwd: serverPath,
      env: serverEnv
    }
  );

  denoProcess.stdout.on('data', (data) => {
    const output = data.toString();
    logger.log('info', `Deno server (bundled fallback) output: ${output}`);
    console.log(`Deno server (bundled fallback): ${output}`);
    serverReady = true;
    resolve();
  });

  denoProcess.stderr.on('data', (data) => {
    const error = data.toString();
    logger.log('error', `Deno server error (bundled fallback): ${error}`);
    console.error(`Deno server error (bundled fallback): ${error}`);
  });

  denoProcess.on('error', (err) => {
    logger.log('error', 'Failed to start Deno server with bundled fallback', {
      error: err.message,
      code: err.code,
      stack: err.stack
    });
    console.error('Failed to start Deno server with bundled fallback:', err);
    reject(err);
  });
};

// Initialize the vector database
const initVectorDb = async () => {
  // Use Deno to run the initialization script
  const appPath = app.getAppPath();
  let denoExecutable;
  let serverPath;

  if (appPath.includes('app.asar')) {
    // In production, use the unpacked path for binaries
    const unpackedPath = appPath.replace('app.asar', 'app.asar.unpacked');
    denoExecutable = path.join(unpackedPath, 'bin', process.platform === 'win32' ? 'deno.exe' : 'deno');

    // Server path should be in resources, not in asar
    serverPath = path.join(process.resourcesPath, 'server');
  } else {
    // In development, use the normal paths
    denoExecutable = path.join(__dirname, 'bin', process.platform === 'win32' ? 'deno.exe' : 'deno');
    serverPath = path.join(__dirname, '..', 'server');
  }

  logger.log('info', `Using Deno at: ${denoExecutable} with server path: ${serverPath}`);
  console.log(`Using Deno at: ${denoExecutable} with server path: ${serverPath}`);

  // Verify paths exist
  if (!fs.existsSync(denoExecutable)) {
    throw new Error(`Deno executable not found at: ${denoExecutable}`);
  }

  if (!fs.existsSync(serverPath)) {
    throw new Error(`Server directory not found at: ${serverPath}`);
  }

  const vectorDbInitProcess = spawn(
    denoExecutable,
    ['run', '--allow-all', 'vector-db/init.ts'],
    {
      cwd: serverPath,
      env: getServerEnv()
    }
  );

  return new Promise((resolve) => {
    vectorDbInitProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Vector DB initialization exited with code', code);
      } else {
        console.log('Vector DB initialized successfully');
      }
      resolve();
    });
  });
};

// Seed the vector database
const seedVectorDb = async () => {
  const appPath = app.getAppPath();
  let denoExecutable;
  let serverPath;

  if (appPath.includes('app.asar')) {
    // In production, use the unpacked path for binaries
    const unpackedPath = appPath.replace('app.asar', 'app.asar.unpacked');
    denoExecutable = path.join(unpackedPath, 'bin', process.platform === 'win32' ? 'deno.exe' : 'deno');

    // Server path should be in resources, not in asar
    serverPath = path.join(process.resourcesPath, 'server');
  } else {
    // In development, use the normal paths
    denoExecutable = path.join(__dirname, 'bin', process.platform === 'win32' ? 'deno.exe' : 'deno');
    serverPath = path.join(__dirname, '..', 'server');
  }

  logger.log('info', `Seeding vectors using Deno at: ${denoExecutable} with server path: ${serverPath}`);
  console.log(`Seeding vectors using Deno at: ${denoExecutable} with server path: ${serverPath}`);

  // Verify paths exist
  if (!fs.existsSync(denoExecutable)) {
    throw new Error(`Deno executable not found at: ${denoExecutable}`);
  }

  if (!fs.existsSync(serverPath)) {
    throw new Error(`Server directory not found at: ${serverPath}`);
  }

  const vectorDbSeedProcess = spawn(
    denoExecutable,
    ['run', '--allow-all', 'vector-db/seed-vectors.ts'],
    {
      cwd: serverPath,
      env: getServerEnv()
    }
  );

  return new Promise((resolve) => {
    vectorDbSeedProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Vector DB seeding exited with code', code);
      } else {
        console.log('Vector DB seeded successfully');
      }
      resolve();
    });
  });
};

// Function to get Wine binary path from local system
async function getWineBinary() {
  if (process.platform === 'win32') {
    return null; // Not needed on Windows
  }

  try {
    // Check if wine is installed and in PATH
    const { execSync } = require('child_process');

    try {
      const winePath = execSync('which wine', { encoding: 'utf8' }).trim();
      logger.log('info', `Found Wine in PATH: ${winePath}`);
      return winePath;
    } catch (error) {
      logger.log('warn', 'Wine not found in PATH', { error: error.message });

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
            logger.log('info', `Found Wine at: ${macPath}`);
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
            logger.log('info', `Found Wine at: ${linuxPath}`);
            return linuxPath;
          }
        }
      }

      logger.log('error', 'Wine is not installed or not found in PATH');
      return null;
    }
  } catch (error) {
    logger.log('error', 'Error checking for Wine', { error: error.message });
    return null;
  }
}

// Not using Wine prefix for Python anymore

// Helper to execute commands with output capture option
async function execCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const captureOutput = options.capture === true;
    const childProcess = spawn(command, args, {
      ...options,
      stdio: captureOutput ? ['ignore', 'pipe', 'pipe'] : undefined
    });

    let stdout = '';
    let stderr = '';

    if (captureOutput) {
      childProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      childProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });
    }

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve(captureOutput ? { stdout, stderr } : undefined);
      } else {
        reject(new Error(`Command exited with code ${code}`));
      }
    });

    childProcess.on('error', reject);
  });
}

// Start all required services
const startServer = async () => {
  try {
    const isDev = process.argv.includes('--dev');
    const isMac = process.platform === 'darwin';
    const isWindows = process.platform === 'win32';
    logger.log('info', 'Starting server components', { isDev: isDev, platform: process.platform });

    // Check for bundled binaries first
    const bundledDenoPath = path.join(__dirname, 'bin', process.platform === 'win32' ? 'deno.exe' : 'deno');
    if (!fs.existsSync(bundledDenoPath)) {
      const errorMsg = `Bundled Deno not found at: ${bundledDenoPath}. Please run the download-binaries script first.`;
      logger.log('error', errorMsg);
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    // Check for bundled Python
    if (!isWindows) {
      // Check multiple possible locations for Python
      const possiblePythonPaths = [
        path.join(__dirname, 'bin', 'python', 'python_embed', 'python.exe'),  // Direct path to executable
        path.join(__dirname, 'bin', 'python', 'python')                       // Wrapper script
      ];

      let foundPythonPath = null;
      for (const pythonPath of possiblePythonPaths) {
        if (fs.existsSync(pythonPath)) {
          foundPythonPath = pythonPath;
          break;
        }
      }

      const hasBundledPython = !!foundPythonPath;
      logger.log('info', `Bundled Python: ${hasBundledPython ? 'found' : 'not found'}`, {
        path: foundPythonPath || 'not found',
        checkedPaths: possiblePythonPaths
      });

      if (!hasBundledPython) {
        // Check if Wine is available for running Python
        const winePath = await getWineBinary();
        const hasWine = !!winePath;

        logger.log('info', `Wine for running Python: ${hasWine ? 'found' : 'not found'}`, { path: winePath || 'not available' });

        logger.log('error', 'Bundled Python not found');
        console.error('Bundled Python not found');
        throw new Error('Python not found. Please run the download-binaries.js script first.');
      } else {
        if (isMac) {
          // Check if Wine is available for running Python on macOS
          const winePath = await getWineBinary();
          const hasWine = !!winePath;

          if (!hasWine) {
            logger.log('error', 'Wine is required to run bundled Python on macOS but was not found');
            console.error('Wine is required to run bundled Python on macOS but was not found');
            throw new Error('Wine not found. Please install Wine using: brew install --cask --no-quarantine wine-stable');
          } else {
            logger.log('info', `Using bundled Python with Wine: ${winePath} and Python at ${foundPythonPath}`);
          }
        }
      }
    }

    // Initialize vector database with fresh data
    logger.log('info', 'Initializing vector database...');
    await initVectorDb();

    // Always seed the vector database with fresh data to ensure latest vectors
    logger.log('info', 'Seeding vector database with fresh data...');
    await seedVectorDb();

    // Start Deno server, which will initialize everything else
    logger.log('info', 'Starting Deno server...');

    try {
      await startDenoServer();
    } catch (denoError) {
      logger.log('error', 'Primary Deno server startup failed, trying fallback method', {
        error: denoError.message,
        stack: denoError.stack
      });
      console.error('Primary Deno server startup failed, trying fallback method:', denoError);
      throw denoError; // Re-throw the error
    }

    logger.log('info', 'All server components started successfully');
    console.log('All server components started successfully');
    return true;
  } catch (error) {
    logger.log('error', 'Server startup failed', {
      error: error.message,
      stack: error.stack
    });
    console.error('Server startup failed:', error);

    // Log system information to help diagnose the issue
    try {
      const { execSync } = require('child_process');
      let systemInfo = {};

      if (process.platform === 'darwin') {
        systemInfo.osVersion = execSync('sw_vers -productVersion', { encoding: 'utf8' }).trim();
        systemInfo.architecture = execSync('uname -m', { encoding: 'utf8' }).trim();

        // Use bundled Deno to check version
        try {
          const bundledDenoPath = path.join(__dirname, 'bin', 'deno');
          if (fs.existsSync(bundledDenoPath)) {
            systemInfo.bundledDenoVersion = `Available at ${bundledDenoPath}`;
          } else {
            systemInfo.bundledDenoVersion = 'Not found';
          }
        } catch (e) {
          systemInfo.bundledDenoVersion = `Error checking: ${e.message}`;
        }
      }

      logger.log('info', 'System diagnostic information', systemInfo);
      console.log('System diagnostic information:', systemInfo);
    } catch (diagError) {
      logger.log('error', 'Failed to gather system diagnostics', { error: diagError.message });
    }

    return false;
  }
};

// Shut down all services
const stopServer = () => {
  if (denoProcess) {
    logger.log('info', 'Stopping Deno server...');
    console.log('Stopping Deno server...');
    denoProcess.kill();
    denoProcess = null;
  }

  serverReady = false;
  logger.log('info', 'All server components stopped');
};

module.exports = {
  startServer,
  stopServer,
  isServerReady: () => serverReady
};