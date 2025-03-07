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
    
    // For development, use system Deno instead of bundled one
    const isDev = process.argv.includes('--dev');
    let denoCommand = isDev ? 'deno' : path.join(__dirname, 'bin', process.platform === 'win32' ? 'deno.exe' : 'deno');
    
    logger.log('info', `Starting Deno server with command: ${denoCommand}`);
    console.log(`Starting Deno server with command: ${denoCommand}`);
    
    // Add additional environment variables to help with path resolution
    const appRoot = path.resolve(__dirname, '..');
    const ltMakerPath = path.resolve(appRoot, 'lt-maker-fork');
    
    logger.log('info', 'Path information', {
      electronAppRoot: appRoot,
      ltMakerPath,
      serverPath
    });
    console.log('Electron app root path:', appRoot);
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
    logger.log('info', `Using log directory for Deno server: ${logDir}`);
    
    const serverEnv = {
      ...getServerEnv(),
      ELECTRON_APP_ROOT: appRoot,
      LT_MAKER_PATH: ltMakerPath,
      SERVER_DIR: serverPath,
      DENO_ENV: process.env.NODE_ENV || 'development',
      ELECTRON_LOG_DIR: logDir
      // DEBUG: 'true'
    };

    // Log the command and env for debugging
    logger.log('info', 'Deno server command', {
      command: denoCommand,
      args: ['run', '--allow-all', 'server.ts'],
      cwd: serverPath
    });

    denoProcess = spawn(
      denoCommand,
      ['run', '--allow-all', 'server.ts'],
      { 
        cwd: serverPath,
        env: serverEnv,
        shell: process.platform === 'darwin' // Use shell on macOS
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
      
      if (isDev) {
        logger.log('info', 'Attempting to use global Deno installation...');
        console.log('Attempting to use global Deno installation...');
        // Try using deno from PATH as fallback in dev mode
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

// Fallback method for starting Deno in development
const startDenoServerFallback = (serverPath, resolve, reject) => {
  // Get log directory from environment or use default
  const logDir = process.env.ELECTRON_LOG_DIR || path.join(serverPath, '_logs');
  logger.log('info', `Using log directory for Deno server fallback: ${logDir}`);
  
  // Add additional environment variables to help with path resolution
  const serverEnv = {
    ...getServerEnv(),
    ELECTRON_APP_ROOT: path.resolve(__dirname, '..'),
    SERVER_DIR: serverPath,
    DENO_ENV: process.env.NODE_ENV || 'development',
    ELECTRON_LOG_DIR: logDir
  };

  logger.log('info', 'Starting Deno with fallback method', {
    command: '/usr/bin/env',
    args: ['deno', 'run', '--allow-all', 'server.ts'],
    cwd: serverPath
  });

  denoProcess = spawn(
    '/usr/bin/env',
    ['deno', 'run', '--allow-all', 'server.ts'],
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

// Start all required services
const startServer = async () => {
  try {
    const isDev = process.argv.includes('--dev');
    logger.log('info', 'Starting server components', { isDev: isDev });
    
    if (process.platform === 'darwin' && isDev) {
      logger.log('info', 'On macOS in dev mode, skipping PostgreSQL startup (assuming it\'s running)');
      console.log('On macOS in dev mode, skipping PostgreSQL startup (assuming it\'s running)');
      // Skip PostgreSQL startup on macOS in dev mode - assume it's running from Homebrew
    } else {
      // Start PostgreSQL first 
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
    await startDenoServer();
    
    logger.log('info', 'All server components started successfully');
    console.log('All server components started successfully');
    return true;
  } catch (error) {
    logger.log('error', 'Server startup failed', {
      error: error.message,
      stack: error.stack
    });
    console.error('Server startup failed:', error);
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