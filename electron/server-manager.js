const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

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
    
    console.log(`Starting Deno server with command: ${denoCommand}`);
    
    // Add additional environment variables to help with path resolution
    const appRoot = path.resolve(__dirname, '..');
    const ltMakerPath = path.resolve(appRoot, 'lt-maker-fork');
    
    console.log('Electron app root path:', appRoot);
    console.log('LT Maker path:', ltMakerPath);
    console.log('Server path:', serverPath);
    
    // Check if lt-maker directory exists
    try {
      if (fs.existsSync(ltMakerPath)) {
        console.log('LT Maker directory exists');
      } else {
        console.error('LT Maker directory does not exist at:', ltMakerPath);
      }
    } catch (error) {
      console.error('Error checking LT Maker directory:', error);
    }
    
    const serverEnv = {
      ...getServerEnv(),
      ELECTRON_APP_ROOT: appRoot,
      LT_MAKER_PATH: ltMakerPath,
      SERVER_DIR: serverPath,
      DENO_ENV: process.env.NODE_ENV || 'development',
      // DEBUG: 'true'
    };

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
      console.log(`Deno server: ${data}`);
      serverReady = true;
      resolve();
    });
    
    denoProcess.stderr.on('data', (data) => {
      console.error(`Deno server error: ${data}`);
      // Don't reject on stderr, as Deno might output warnings here
    });
    
    denoProcess.on('error', (err) => {
      console.error('Failed to start Deno server:', err);
      
      if (isDev) {
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
        console.log('Timeout waiting for Deno server output, assuming it started');
        serverReady = true;
        resolve();
      }
    }, 5000);
  });
};

// Fallback method for starting Deno in development
const startDenoServerFallback = (serverPath, resolve, reject) => {
  // Add additional environment variables to help with path resolution
  const serverEnv = {
    ...getServerEnv(),
    ELECTRON_APP_ROOT: path.resolve(__dirname, '..'),
    SERVER_DIR: serverPath,
    DENO_ENV: process.env.NODE_ENV || 'development'
  };

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
    console.log(`Deno server (fallback): ${data}`);
    serverReady = true;
    resolve();
  });
  
  denoProcess.stderr.on('data', (data) => {
    console.error(`Deno server error (fallback): ${data}`);
  });
  
  denoProcess.on('error', (err) => {
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
    
    if (process.platform === 'darwin' && isDev) {
      console.log('On macOS in dev mode, skipping PostgreSQL startup (assuming it\'s running)');
      // Skip PostgreSQL startup on macOS in dev mode - assume it's running from Homebrew
    } else {
      // Start PostgreSQL first 
      try {
        await startPostgres();
      } catch (err) {
        console.warn('PostgreSQL startup failed, continuing anyway:', err);
        // Continue even if PostgreSQL fails - our adapter can handle it
      }
    }
    
    // Start Deno server first, which will initialize everything else
    await startDenoServer();
    
    console.log('All server components started successfully');
    return true;
  } catch (error) {
    console.error('Server startup failed:', error);
    return false;
  }
};

// Shut down all services
const stopServer = () => {
  if (denoProcess) {
    console.log('Stopping Deno server...');
    denoProcess.kill();
    denoProcess = null;
  }
  
  if (pgProcess) {
    console.log('Stopping PostgreSQL server...');
    pgProcess.kill();
    pgProcess = null;
  }
  
  serverReady = false;
};

module.exports = {
  startServer,
  stopServer,
  isServerReady: () => serverReady
};