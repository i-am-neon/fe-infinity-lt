const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const { startServer, stopServer, isServerReady } = require('./server-manager');
const { runGameWithWine } = require('./game-runner');
const { startGameLauncherServer } = require('./game-launcher');
const logger = require('./logger');

// Set application name before anything else
app.setName("FE Infinity");

let mainWindow = null;
let splashWindow = null;
let serverStarted = false;

// Create splash screen
function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    icon: path.join(__dirname, '../client/public/fe-infinity-logo.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  splashWindow.loadFile(path.join(__dirname, 'splash.html'));
  splashWindow.center();
}

// Create main application window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    icon: path.join(__dirname, '../client/public/fe-infinity-logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Check if running in development mode
  const isDev = process.argv.includes('--dev');
  
  // Load from Next.js dev server in development
  if (isDev) {
    console.log('Running in development mode');
    process.env.NODE_ENV = 'development';
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
    
    // Start HTTP game launcher server in development mode
    startGameLauncherServer().then(server => {
      console.log('Game launcher HTTP server started successfully');
      app.on('before-quit', () => {
        server.close();
      });
    }).catch(err => {
      console.error('Failed to start game launcher server:', err);
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../client/out/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    splashWindow.close();
    mainWindow.show();
  });
}

// Initialize application
app.whenReady().then(async () => {
  // Initialize logger early
  const logDir = logger.initLogger();
  logger.log('info', 'Application starting', { version: app.getVersion(), environment: process.env.NODE_ENV });
  
  // Set app icon for macOS dock
  if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(__dirname, '../client/public/fe-infinity-logo.png'));
    logger.log('info', 'Set macOS dock icon');
  }
  
  createSplashWindow();
  logger.log('info', 'Splash window created');
  
  try {
    // Add env variable for server logs
    process.env.ELECTRON_LOG_DIR = logDir;
    logger.log('info', 'Set log directory for server', { logDir });
    
    // Start server components
    logger.log('info', 'Starting server components...');
    serverStarted = await startServer();
    
    if (!serverStarted) {
      logger.log('error', 'Server startup failed');
      dialog.showErrorBox(
        'Server Startup Failed',
        'Failed to start server components. The application may not function correctly.'
      );
    } else {
      logger.log('info', 'Server components started successfully');
    }
    
    // Create main window after server starts (or fails)
    createMainWindow();
    logger.log('info', 'Main window created');
  } catch (error) {
    logger.log('error', 'Initialization error', { error: error.message, stack: error.stack });
    dialog.showErrorBox(
      'Initialization Error',
      `Failed to initialize application: ${error.message}`
    );
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    if (serverStarted) {
      createMainWindow();
    } else {
      dialog.showErrorBox(
        'Server Not Running',
        'Cannot start application because server components failed to initialize.'
      );
    }
  }
});

// Handle IPC request to run a game
ipcMain.handle('runGame', async (_, projectPath) => {
  try {
    await runGameWithWine(projectPath);
    return { success: true };
  } catch (error) {
    console.error('Error running game:', error);
    dialog.showErrorBox(
      'Game Launch Failed',
      `Failed to launch the game: ${error.message}`
    );
    return { success: false, error: error.message };
  }
});

app.on('before-quit', () => {
  logger.log('info', 'Application shutting down');
  stopServer();
  logger.closeLogger();
});