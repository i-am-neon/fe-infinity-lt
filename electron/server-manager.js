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
    
    // For development, use system Deno instead of bundled one
    const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development';
    const isMac = process.platform === 'darwin';
    
    // On macOS, prefer system Deno for both dev and production
    let denoCommand;
    if (isMac) {
      // Try to find Deno in PATH first
      try {
        const { execSync } = require('child_process');
        denoCommand = execSync('which deno', { encoding: 'utf8' }).trim();
        logger.log('info', `Using system Deno from PATH: ${denoCommand}`);
        console.log(`Using system Deno from PATH: ${denoCommand}`);
      } catch (e) {
        // Look in common locations
        const commonLocations = [
          '/usr/local/bin/deno',
          '/opt/homebrew/bin/deno',
          '/usr/bin/deno',
          path.join(app.getPath('home'), '.deno/bin/deno')
        ];
        
        for (const loc of commonLocations) {
          if (fs.existsSync(loc)) {
            denoCommand = loc;
            logger.log('info', `Found Deno at common location: ${denoCommand}`);
            console.log(`Found Deno at common location: ${denoCommand}`);
            break;
          }
        }
        
        // If still not found, fall back to bundled version or 'deno' command
        if (!denoCommand) {
          const bundledDeno = path.join(__dirname, 'bin', 'deno');
          if (fs.existsSync(bundledDeno)) {
            denoCommand = bundledDeno;
            logger.log('info', `Using bundled Deno: ${denoCommand}`);
          } else {
            denoCommand = 'deno'; // Last resort, hope it's in PATH
            logger.log('info', 'Falling back to "deno" command, hoping it exists in PATH');
          }
        }
      }
    } else {
      // For Windows/Linux, use bundled or system Deno based on dev mode
      denoCommand = isDev ? 'deno' : path.join(__dirname, 'bin', process.platform === 'win32' ? 'deno.exe' : 'deno');
      
      // Verify bundled Deno exists in production mode
      if (!isDev && !fs.existsSync(denoCommand)) {
        logger.log('error', `Bundled Deno not found at: ${denoCommand}, falling back to system Deno`);
        denoCommand = 'deno'; // Fallback to system Deno
      }
    }
    
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
      
      // Try fallback for both dev and production on macOS
      if (isMac) {
        logger.log('info', 'Attempting to use global Deno installation...');
        console.log('Attempting to use global Deno installation...');
        // Try using deno from PATH as fallback
        startDenoServerFallback(serverPath, resolve, reject);
      } else {
        reject(err);
      }
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

// Fallback method for starting Deno (works in both dev and production)
const startDenoServerFallback = (serverPath, resolve, reject) => {
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

  // Try different approaches to start Deno
  const isMac = process.platform === 'darwin';
  let denoCommand, args;
  
  if (isMac) {
    // For macOS, try to find Deno in the system
    try {
      const { execSync } = require('child_process');
      
      // Check if Deno is installed with Homebrew
      try {
        execSync('which brew', { stdio: 'ignore' });
        logger.log('info', 'Homebrew is installed, checking for Deno');
        
        try {
          const denoPath = execSync('brew --prefix deno 2>/dev/null || echo ""', { encoding: 'utf8' }).trim();
          if (denoPath && fs.existsSync(path.join(denoPath, 'bin/deno'))) {
            denoCommand = path.join(denoPath, 'bin/deno');
            logger.log('info', `Found Deno installed via Homebrew at: ${denoCommand}`);
          }
        } catch (e) {
          logger.log('info', 'Deno not found via Homebrew');
        }
      } catch (e) {
        logger.log('info', 'Homebrew not installed or not in PATH');
      }
      
      // If not found through Homebrew, try which
      if (!denoCommand) {
        try {
          denoCommand = execSync('which deno', { encoding: 'utf8' }).trim();
          logger.log('info', `Found Deno in PATH at: ${denoCommand}`);
        } catch (e) {
          logger.log('info', 'Deno not found in PATH');
        }
      }
      
      // If still not found, check common locations
      if (!denoCommand) {
        const commonLocations = [
          '/usr/local/bin/deno',
          '/opt/homebrew/bin/deno',
          '/usr/bin/deno',
          path.join(app.getPath('home'), '.deno/bin/deno')
        ];
        
        for (const loc of commonLocations) {
          if (fs.existsSync(loc)) {
            denoCommand = loc;
            logger.log('info', `Found Deno at common location: ${denoCommand}`);
            break;
          }
        }
      }
      
      // If still not found, last resort is to try /usr/bin/env
      if (!denoCommand) {
        denoCommand = '/usr/bin/env';
        args = ['deno', 'run', '--allow-all', 'server.ts'];
        logger.log('info', 'Using /usr/bin/env as last resort to find Deno');
      } else {
        args = ['run', '--allow-all', 'server.ts'];
      }
    } catch (e) {
      logger.log('error', `Error finding Deno: ${e.message}`);
      denoCommand = '/usr/bin/env';
      args = ['deno', 'run', '--allow-all', 'server.ts'];
    }
  } else {
    // For Windows/Linux, try system deno as fallback
    denoCommand = 'deno';
    args = ['run', '--allow-all', 'server.ts'];
  }

  logger.log('info', 'Starting Deno with fallback method', {
    command: denoCommand,
    args: args,
    cwd: serverPath
  });
  
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
    denoCommand,
    args,
    { 
      cwd: serverPath,
      env: serverEnv,
      shell: true
    }
  );
  
  denoProcess.stdout.on('data', (data) => {
    const output = data.toString();
    logger.log('info', `Deno server (fallback) output: ${output}`);
    console.log(`Deno server (fallback): ${output}`);
    serverReady = true;
    resolve();
  });
  
  denoProcess.stderr.on('data', (data) => {
    const error = data.toString();
    logger.log('error', `Deno server error (fallback): ${error}`);
    console.error(`Deno server error (fallback): ${error}`);
  });
  
  denoProcess.on('error', (err) => {
    logger.log('error', 'Failed to start Deno server with fallback', {
      error: err.message,
      code: err.code,
      stack: err.stack
    });
    console.error('Failed to start Deno server with fallback:', err);
    
    // As a last resort, set serverReady = true after a delay
    // This will allow the app to start, but functionality that depends on the server won't work
    logger.log('warn', 'Setting serverReady = true despite failure to allow app to start');
    console.warn('Setting serverReady = true despite failure to allow app to start');
    
    setTimeout(() => {
      serverReady = true;
      resolve();
    }, 1000);
  });
  
  // Set a timeout to resolve anyway, as last resort
  setTimeout(() => {
    if (!serverReady) {
      logger.log('warn', 'Fallback timeout reached, forcing serverReady = true');
      console.warn('Fallback timeout reached, forcing serverReady = true');
      serverReady = true;
      resolve();
    }
  }, 10000);
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

// Start all required services
const startServer = async () => {
  try {
    const isDev = process.argv.includes('--dev');
    const isMac = process.platform === 'darwin';
    logger.log('info', 'Starting server components', { isDev: isDev, platform: process.platform });
    
    // Skip PostgreSQL on macOS (both in dev and production)
    if (isMac) {
      logger.log('info', 'On macOS, skipping PostgreSQL startup (assuming it\'s running or using SQLite fallback)');
      console.log('On macOS, skipping PostgreSQL startup (assuming it\'s running or using SQLite fallback)');
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
      
      // Always try fallback on macOS, not just in dev mode
      if (isMac) {
        try {
          // Find system-installed Deno on macOS
          const { execSync } = require('child_process');
          let denoPath;
          
          try {
            denoPath = execSync('which deno', { encoding: 'utf8' }).trim();
            logger.log('info', `Found system Deno at: ${denoPath}`);
            console.log(`Found system Deno at: ${denoPath}`);
          } catch (whichErr) {
            // If 'which' fails, try common locations
            const commonPaths = [
              '/usr/local/bin/deno',
              '/opt/homebrew/bin/deno',
              '/usr/bin/deno'
            ];
            
            for (const path of commonPaths) {
              try {
                if (require('fs').existsSync(path)) {
                  denoPath = path;
                  logger.log('info', `Found system Deno at common path: ${denoPath}`);
                  console.log(`Found system Deno at common path: ${denoPath}`);
                  break;
                }
              } catch (e) {
                // Ignore and keep trying
              }
            }
          }
          
          if (denoPath) {
            // Use system Deno as fallback
            const serverPath = path.join(__dirname, '..', 'server');
            
            logger.log('info', 'Starting Deno with system installation');
            console.log('Starting Deno with system installation');
            
            const logDir = process.env.ELECTRON_LOG_DIR || path.join(serverPath, '_logs');
            
            const serverEnv = {
              ...getServerEnv(),
              ELECTRON_APP_ROOT: path.resolve(__dirname, '..'),
              LT_MAKER_PATH: path.join(path.resolve(__dirname, '..'), 'lt-maker-fork'),
              SERVER_DIR: serverPath,
              DENO_ENV: process.env.NODE_ENV || 'production',
              ELECTRON_LOG_DIR: logDir
            };
            
            denoProcess = spawn(
              denoPath,
              ['run', '--allow-all', 'server.ts'],
              {
                cwd: serverPath,
                env: serverEnv,
                shell: true
              }
            );
            
            denoProcess.stdout.on('data', (data) => {
              const output = data.toString();
              logger.log('info', `Deno server (system fallback) output: ${output}`);
              console.log(`Deno server (system fallback): ${output}`);
              serverReady = true;
            });
            
            denoProcess.stderr.on('data', (data) => {
              const error = data.toString();
              logger.log('error', `Deno server error (system fallback): ${error}`);
              console.error(`Deno server error (system fallback): ${error}`);
            });
            
            // Resolve after timeout to not block app startup
            await new Promise(resolve => setTimeout(resolve, 3000));
            serverReady = true;
          } else {
            throw new Error('Could not find system Deno installation');
          }
        } catch (fallbackErr) {
          logger.log('error', 'Fallback Deno server startup also failed', {
            error: fallbackErr.message,
            stack: fallbackErr.stack
          });
          console.error('Fallback Deno server startup also failed:', fallbackErr);
          throw fallbackErr; // Re-throw to the outer catch
        }
      } else {
        throw denoError; // Re-throw for non-macOS platforms
      }
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