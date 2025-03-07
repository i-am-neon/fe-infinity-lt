const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
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
    // In production, we need to handle path resolution differently
    try {
      // First, try to find the Next.js output in different potential locations
      const possiblePaths = [
        path.join(__dirname, '../client/out/index.html'),             // Dev structure
        path.join(__dirname, 'client/out/index.html'),                // Packaged relative
        path.join(app.getAppPath(), 'client/out/index.html'),         // From app root
        path.join(process.resourcesPath, 'client/out/index.html'),    // From resources
        path.join(process.resourcesPath, 'app/client/out/index.html'), // Nested in resources/app
        path.join(process.resourcesPath, '../Resources/client/out/index.html') // macOS specific path
      ];

      let indexPath = null;

      // Log all path attempts for debugging
      logger.log('info', 'Searching for Next.js build output...');
      for (const possiblePath of possiblePaths) {
        const exists = fs.existsSync(possiblePath);
        logger.log('info', `Checking path: ${possiblePath}, exists: ${exists}`);

        if (exists) {
          indexPath = possiblePath;
          logger.log('info', `Using Next.js build at: ${indexPath}`);
          break;
        }
      }

      if (indexPath) {
        // For Next.js apps in Electron, we need to load the index.html first
        // and let the Next.js router handle the rest
        mainWindow.loadFile(indexPath);

        // Set up protocol handling for Next.js routes
        mainWindow.webContents.on('will-navigate', (event, url) => {
          const parsedUrl = new URL(url);

          // Only handle same-origin navigation
          if (parsedUrl.origin === 'file://') {
            // Let it navigate normally
            return;
          }

          // For external links, open in browser
          if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
            event.preventDefault();
            require('electron').shell.openExternal(url);
          }
        });
      } else {
        // If we can't find the client build, show an error page
        logger.log('error', 'Could not find Next.js build output in any expected location');
        mainWindow.loadFile(path.join(__dirname, 'splash.html')); // Fallback to splash screen

        // Show error dialog after window opens
        mainWindow.webContents.on('did-finish-load', () => {
          dialog.showErrorBox(
            'Application Error',
            'Could not find the application interface files. The application may not have been packaged correctly.'
          );
        });
      }
    } catch (error) {
      logger.log('error', 'Error loading main window content', { error: error.message, stack: error.stack });
      dialog.showErrorBox(
        'Application Error',
        `Failed to load application interface: ${error.message}`
      );
    }
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
  logger.log('info', 'Application starting', {
    version: app.getVersion(),
    environment: process.env.NODE_ENV,
    platform: process.platform,
    arch: process.arch,
    appPath: app.getAppPath(),
    resourcesPath: process.resourcesPath || 'not available',
    userDataPath: app.getPath('userData')
  });

  // Set app icon for macOS dock
  if (process.platform === 'darwin') {
    try {
      // Try local logo first (for packaged app)
      const localIconPath = path.join(__dirname, 'logo.png');
      const localIconExists = require('fs').existsSync(localIconPath);

      if (localIconExists) {
        app.dock.setIcon(localIconPath);
        logger.log('info', 'Set macOS dock icon from local path');
      } else {
        // Fall back to client public path (for development)
        const iconPath = path.join(__dirname, '../client/public/fe-infinity-logo.png');
        const iconPathExists = require('fs').existsSync(iconPath);

        if (iconPathExists) {
          app.dock.setIcon(iconPath);
          logger.log('info', 'Set macOS dock icon');

          // Copy icon for future use
          try {
            fs.copyFileSync(iconPath, localIconPath);
            logger.log('info', 'Copied icon to local directory for future use');
          } catch (copyErr) {
            logger.log('warn', `Failed to copy icon: ${copyErr.message}`);
          }
        } else {
          // Try alternative icon paths in packaged app
          const alternativePaths = [
            path.join(app.getAppPath(), 'client/public/fe-infinity-logo.png'),
            path.join(process.resourcesPath, 'client/public/fe-infinity-logo.png'),
            path.join(process.resourcesPath, 'app/client/public/fe-infinity-logo.png')
          ];

          let foundIcon = false;
          for (const altPath of alternativePaths) {
            if (require('fs').existsSync(altPath)) {
              app.dock.setIcon(altPath);
              logger.log('info', `Set macOS dock icon from alternative path: ${altPath}`);
              foundIcon = true;
              break;
            }
          }

          if (!foundIcon) {
            logger.log('warn', 'Could not find app icon');
          }
        }
      }
    } catch (iconError) {
      logger.log('error', 'Error setting dock icon', { error: iconError.message });
    }
  }
  createSplashWindow();
  logger.log('info', 'Splash window created');

  try {
    // Add env variable for server logs
    process.env.ELECTRON_LOG_DIR = logDir;
    process.env.APP_PATH = app.getAppPath();
    process.env.RESOURCES_PATH = process.resourcesPath;
    process.env.USER_DATA_PATH = app.getPath('userData');
    logger.log('info', 'Set environment variables', {
      ELECTRON_LOG_DIR: logDir,
      APP_PATH: app.getAppPath(),
      RESOURCES_PATH: process.resourcesPath,
      USER_DATA_PATH: app.getPath('userData')
    });

    // Log system information to help diagnose issues
    try {
      if (process.platform === 'darwin') {
        const { execSync } = require('child_process');

        try {
          const osVersion = execSync('sw_vers -productVersion', { encoding: 'utf8' }).trim();
          logger.log('info', `macOS version: ${osVersion}`);
        } catch (e) {
          logger.log('error', 'Failed to get macOS version');
        }

        try {
          const homebrewInstalled = execSync('which brew || echo "Not found"', { encoding: 'utf8' }).trim();
          logger.log('info', `Homebrew path: ${homebrewInstalled}`);

          if (homebrewInstalled !== 'Not found') {
            try {
              const denoInstalled = execSync('brew list | grep deno || echo "Not installed"', { encoding: 'utf8' }).trim();
              logger.log('info', `Deno via Homebrew: ${denoInstalled}`);
            } catch (e) {
              logger.log('error', 'Failed to check Deno via Homebrew');
            }
          }
        } catch (e) {
          logger.log('error', 'Failed to check Homebrew installation');
        }

        try {
          const denoInPath = execSync('which deno || echo "Not found"', { encoding: 'utf8' }).trim();
          logger.log('info', `Deno in PATH: ${denoInPath}`);
        } catch (e) {
          logger.log('error', 'Failed to check Deno in PATH');
        }
      }
    } catch (diagError) {
      logger.log('error', 'Failed to gather system diagnostics', { error: diagError.message });
    }

    // Check for important directories
    const fs = require('fs');

    // Check server directory
    const serverDir = path.join(app.getAppPath(), '..', 'server');
    const serverDirExists = fs.existsSync(serverDir);
    logger.log('info', `Server directory exists: ${serverDirExists}`, { path: serverDir });

    if (!serverDirExists) {
      // Check alternative locations
      const altServerPaths = [
        path.join(app.getAppPath(), 'server'),
        path.join(process.resourcesPath, 'server'),
        path.join(process.resourcesPath, 'app', 'server')
      ];

      for (const altPath of altServerPaths) {
        const exists = fs.existsSync(altPath);
        logger.log('info', `Alternative server path exists: ${exists}`, { path: altPath });
      }
    }

    // Check LT Maker directory
    const ltMakerDir = path.join(app.getAppPath(), '..', 'lt-maker-fork');
    const ltMakerDirExists = fs.existsSync(ltMakerDir);
    logger.log('info', `LT Maker directory exists: ${ltMakerDirExists}`, { path: ltMakerDir });

    if (!ltMakerDirExists) {
      // Check alternative locations
      const altLtMakerPaths = [
        path.join(app.getAppPath(), 'lt-maker-fork'),
        path.join(process.resourcesPath, 'lt-maker-fork'),
        path.join(process.resourcesPath, 'app', 'lt-maker-fork')
      ];

      for (const altPath of altLtMakerPaths) {
        const exists = fs.existsSync(altPath);
        logger.log('info', `Alternative LT Maker path exists: ${exists}`, { path: altPath });
      }
    }

    // Start server components with retries
    logger.log('info', 'Starting server components...');

    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        serverStarted = await startServer();

        if (serverStarted) {
          logger.log('info', 'Server components started successfully');
          break;
        } else {
          retryCount++;
          logger.log('warn', `Server startup attempt ${retryCount} failed, ${maxRetries - retryCount} retries left`);

          if (retryCount < maxRetries) {
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      } catch (serverError) {
        retryCount++;
        logger.log('error', `Server startup attempt ${retryCount} threw error`, {
          error: serverError.message,
          stack: serverError.stack,
          retriesLeft: maxRetries - retryCount
        });

        if (retryCount < maxRetries) {
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    if (!serverStarted) {
      logger.log('error', 'Server startup failed after all retry attempts');

      if (process.platform === 'darwin') {
        dialog.showErrorBox(
          'Server Startup Failed',
          'Failed to start server components. This might be due to missing dependencies.\n\n' +
          'Please make sure you have installed:\n' +
          '1. Homebrew (https://brew.sh)\n' +
          '2. Deno: brew install deno\n' +
          '3. Wine: brew install --cask --no-quarantine wine-stable\n\n' +
          'The application may not function correctly.'
        );
      } else {
        dialog.showErrorBox(
          'Server Startup Failed',
          'Failed to start server components. The application may not function correctly.'
        );
      }
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