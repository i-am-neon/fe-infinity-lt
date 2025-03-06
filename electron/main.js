const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { startServer, stopServer, isServerReady } = require('./server-manager');

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
  createSplashWindow();
  
  try {
    // Start server components
    serverStarted = await startServer();
    if (!serverStarted) {
      dialog.showErrorBox(
        'Server Startup Failed',
        'Failed to start server components. The application may not function correctly.'
      );
    }
    
    // Create main window after server starts (or fails)
    createMainWindow();
  } catch (error) {
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

app.on('before-quit', () => {
  stopServer();
});