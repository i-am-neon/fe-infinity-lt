const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');
const logger = require('./logger');

let denoProcess = null;
let pgProcess = null;
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

  return {
    ...process.env,
    // PostgreSQL connection details (for embedded PostgreSQL)
    PGHOST: 'localhost',
    PGPORT: '5432',
    PGUSER: 'postgres',
    PGPASSWORD: 'password',
    PGDATABASE: 'postgres',
    // Path for SQLite database
    DB_PATH: path.join(dataDir, 'local.db')
  };
};

// Start the embedded PostgreSQL server
const startPostgres = () => {
  return new Promise((resolve, reject) => {
    const dataDir = getDataDir();
    const pgDataDir = path.join(dataDir, 'pgdata');

    // Create PostgreSQL data directory if it doesn't exist
    if (!fs.existsSync(pgDataDir)) {
      fs.mkdirSync(pgDataDir, { recursive: true });

      // Initialize PostgreSQL database
      const pgInitProcess = spawn(
        path.join(__dirname, 'bin', process.platform === 'win32' ? 'initdb.exe' : 'initdb'),
        ['-D', pgDataDir, '-U', 'postgres', '--auth=trust'],
        { env: process.env }
      );

      pgInitProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Failed to initialize PostgreSQL database');
          reject(new Error('PostgreSQL initialization failed'));
          return;
        }

        startPostgresServer(pgDataDir, resolve, reject);
      });
    } else {
      startPostgresServer(pgDataDir, resolve, reject);
    }
  });
};

// Start the PostgreSQL server process
const startPostgresServer = (pgDataDir, resolve, reject) => {
  pgProcess = spawn(
    path.join(__dirname, 'bin', process.platform === 'win32' ? 'postgres.exe' : 'postgres'),
    ['-D', pgDataDir],
    { env: process.env }
  );

  pgProcess.stdout.on('data', (data) => {
    console.log(`PostgreSQL: ${data}`);
    if (data.toString().includes('database system is ready to accept connections')) {
      console.log('PostgreSQL server is ready');
      resolve();
    }
  });

  pgProcess.stderr.on('data', (data) => {
    console.error(`PostgreSQL error: ${data}`);
    // Still continue even with some errors as PostgreSQL might output warnings
  });

  pgProcess.on('error', (err) => {
    console.error('Failed to start PostgreSQL server:', err);
    reject(err);
  });

  // Set timeout in case PostgreSQL doesn't start properly
  setTimeout(() => {
    if (pgProcess) {
      resolve(); // Assume it's running after timeout
    }
  }, 5000);
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
    const denoCommand = path.join(__dirname, 'bin', process.platform === 'win32' ? 'deno.exe' : 'deno');
    
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
    } catch (logDirError) {
      logger.log('error', `Failed to create log directory: ${logDirError.message}`);
    }

    logger.log('info', `Using log directory for Deno server: ${logDir}`);

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
        shell: isMac // Use shell on macOS
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
    }
  } catch (e) {
    logger.log('error', `Failed to create log directory: ${e.message}`);
  }

  logger.log('info', `Using log directory for Deno server fallback: ${logDir}`);

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
    NODE_ENV: process.env.NODE_ENV || 'production'
  };

  // Always use bundled Deno
  const bundledDenoPath = path.join(__dirname, 'bin', process.platform === 'win32' ? 'deno.exe' : 'deno');

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
  const denoExecutable = path.join(__dirname, 'bin', process.platform === 'win32' ? 'deno.exe' : 'deno');
  const serverPath = path.join(__dirname, '..', 'server');

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
  const denoExecutable = path.join(__dirname, 'bin', process.platform === 'win32' ? 'deno.exe' : 'deno');
  const serverPath = path.join(__dirname, '..', 'server');

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

// Function to get Wine path from local system
function getWinePath() {
  if (isWindows) {
    return null;
  }

  try {
    // Check if wine is installed and in PATH
    const { execSync } = require('child_process');
    
    try {
      const winePath = execSync('which wine', { encoding: 'utf8' }).trim();
      logger.log('info', `Found Wine in PATH: ${winePath}`);
      return winePath;
    } catch (error) {
      logger.log('error', 'Wine not found in PATH', { error: error.message });
      
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
      
      const errorMessage = 'Wine is not installed or not found in PATH. Please install Wine to run the server.';
      logger.log('error', errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    logger.log('error', 'Error checking for Wine', { error: error.message });
    throw new Error(`Wine is required but not found: ${error.message}`);
  }
}

// Setup Python with Wine (for macOS and Linux)
async function setupPythonWithWine() {
  if (isWindows) {
    return; // Not needed on Windows
  }

  console.log('Setting up Python with Wine...');
  const pythonDir = path.join(__dirname, 'bin', 'python');
  const pythonInstallerPath = path.join(pythonDir, 'python-3.11.7-amd64.exe');
  const winePath = getWinePath();

  if (!fs.existsSync(pythonInstallerPath)) {
    console.error('Python installer not downloaded');
    return;
  }

  if (!winePath) {
    console.error('Bundled Wine not found - cannot set up Python with Wine');
    throw new Error('Bundled Wine not found - cannot set up Python with Wine');
  }

  try {
    // Create a custom Wine prefix for Python
    const pythonWinePrefix = path.join(pythonDir, 'prefix');

    if (!fs.existsSync(pythonWinePrefix)) {
      fs.mkdirSync(pythonWinePrefix, { recursive: true });
    }

    // Set environment variables for Wine
    const wineEnv = {
      ...process.env,
      WINEDEBUG: '-all',
      WINEPREFIX: pythonWinePrefix
    };

    // Run Python installer silently
    console.log('Running Python installer with Wine...');
    await execCommand(winePath, [pythonInstallerPath, '/quiet', 'InstallAllUsers=0', 'PrependPath=1', 'Include_test=0'], {
      env: wineEnv,
      timeout: 120000 // 2 minutes timeout
    });

    // Create a script to install pip and requirements
    const pipScriptPath = path.join(pythonDir, 'install_requirements.py');
    const pipScriptContent = `
import subprocess
import sys

def install_package(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

# Install pip
print("Installing pip...")
try:
    import ensurepip
    ensurepip._bootstrap()
except ImportError:
    print("ensurepip not available, trying get-pip.py...")
    import urllib.request
    urllib.request.urlretrieve("https://bootstrap.pypa.io/get-pip.py", "get-pip.py")
    subprocess.check_call([sys.executable, "get-pip.py"])

# Install requirements
print("Installing requirements...")
subprocess.check_call([sys.executable, "-m", "pip", "install", "pygame-ce==2.3.2", "pyinstaller==6.2.0", "typing-extensions==4.8.0", "PyQt5==5.15.10"])

print("Installation complete!")
`;

    fs.writeFileSync(pipScriptPath, pipScriptContent);

    // Run the script with Wine Python
    console.log('Installing pip and requirements with Wine Python...');
    await execCommand(winePath, ['python', pipScriptPath], {
      env: wineEnv,
      timeout: 300000 // 5 minutes timeout
    });

    console.log('Python setup with Wine completed successfully');
  } catch (error) {
    console.error('Failed to setup Python with Wine:', error);
    // Continue anyway
  }
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

    // Skip PostgreSQL on macOS (both in dev and production)
    if (isMac) {
      logger.log('info', 'On macOS, skipping PostgreSQL startup (using SQLite fallback)');
      console.log('On macOS, skipping PostgreSQL startup (using SQLite fallback)');
    } else {
      // Start PostgreSQL on other platforms
      try {
        logger.log('info', 'Starting PostgreSQL...');
        await startPostgres();
        logger.log('info', 'PostgreSQL started successfully');
      } catch (err) {
        logger.log('warn', 'PostgreSQL startup failed, continuing anyway', { error: err.message });
        console.warn('PostgreSQL startup failed, continuing anyway:', err);
        // Continue even if PostgreSQL fails - our adapter can handle it
      }
    }

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

        try {
          systemInfo.denoVersion = execSync('deno --version', { encoding: 'utf8' }).trim();
        } catch (e) {
          systemInfo.denoVersion = 'Not found or not in PATH';
        }

        try {
          systemInfo.homebrewInstalled = execSync('which brew', { encoding: 'utf8' }).trim();
        } catch (e) {
          systemInfo.homebrewInstalled = 'Not found';
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

  if (pgProcess) {
    logger.log('info', 'Stopping PostgreSQL server...');
    console.log('Stopping PostgreSQL server...');
    pgProcess.kill();
    pgProcess = null;
  }

  serverReady = false;
  logger.log('info', 'All server components stopped');
};

module.exports = {
  startServer,
  stopServer,
  isServerReady: () => serverReady
};