const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const { startServer, stopServer, isServerReady } = require('./server-manager');
const { runGameWithWine, preparePythonEnvironment } = require('./game-runner');
const { startGameLauncherServer } = require('./game-launcher');
const logger = require('./logger');
const apiKeyManager = require('./api-key-manager');
const { protocol } = require('electron');


// Register the custom asset:// scheme before app readiness so that
// it is treated like a standard, secure protocol in the renderer.  This
// allows  and fetch() calls to succeed in the
// packaged application.
protocol.registerSchemesAsPrivileged([
  {
    scheme: "asset",
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true
    }
  }
]);
const { verifyAssets } = require('./verify-assets');

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
    icon: app.isPackaged 
      ? path.join(process.resourcesPath, 'app.ico')
      : path.join(__dirname, '../client/public/fe-infinity-logo.png'),
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
    icon: app.isPackaged 
      ? path.join(process.resourcesPath, 'app.ico') 
      : path.join(__dirname, '../client/public/fe-infinity-logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Check if running in development mode
  const isDev = process.argv.includes('--dev');

  // Always start the game launcher HTTP server in any mode
  startGameLauncherServer().then(server => {
    console.log('Game launcher HTTP server started successfully');
    app.on('before-quit', () => {
      server.close();
    });
  }).catch(err => {
    console.error('Failed to start game launcher server:', err);
  });

  // Load from Vite dev server in development
  if (isDev) {
    console.log('Running in development mode');
    process.env.NODE_ENV = 'development';
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, we need to handle path resolution differently
    try {
      // Get platform-specific information
      const isMac = process.platform === 'darwin';
      logger.log('info', `Platform: ${process.platform}, is macOS: ${isMac}`);
      logger.log('info', `__dirname: ${__dirname}`);
      logger.log('info', `app.getAppPath(): ${app.getAppPath()}`);
      logger.log('info', `process.resourcesPath: ${process.resourcesPath}`);

      // Define base paths based on platform
      let basePaths = [];

      if (isMac) {
        // macOS-specific paths (in order of priority)
        basePaths = [
          // Inside .app bundle
          path.join(process.resourcesPath, 'client/dist'),
          path.join(process.resourcesPath, 'app/client/dist'),
          path.join(process.resourcesPath, 'extraResources/client/dist'),
          path.join(app.getAppPath(), 'Resources/client/dist'),
          path.join(app.getAppPath(), 'Resources/app/client/dist'),
          path.join(app.getPath('exe'), '../../Resources/client/dist')
        ];
      } else {
        // Windows/Linux paths
        basePaths = [
          path.join(__dirname, '../client/dist'),
          path.join(__dirname, 'client/dist'),
          path.join(app.getAppPath(), 'client/dist'),
          path.join(process.resourcesPath, 'client/dist'),
          path.join(process.resourcesPath, 'app/client/dist')
        ];
      }

      // Add development paths
      if (app.isPackaged === false) {
        basePaths.unshift(path.join(__dirname, '../client/out'));
      }

      // Markers to identify a valid Vite build directory
      const buildMarkers = ['index.html', 'assets'];

      let validBuildPath = null;
      let appEntryPath = null;

      // Log all path attempts for debugging
      logger.log('info', 'Searching for Vite build output...');

      // First, find a valid build directory
      for (const basePath of basePaths) {
        let isValid = false;

        for (const marker of buildMarkers) {
          const markerPath = path.join(basePath, marker);
          const exists = fs.existsSync(markerPath);
          logger.log('info', `Checking marker: ${markerPath}, exists: ${exists}`);

          if (exists) {
            isValid = true;
            validBuildPath = basePath;
            logger.log('info', `Found valid Vite build at: ${validBuildPath}`);

            // If we found the index.html, set it as the entry path
            if (marker === 'index.html') {
              appEntryPath = markerPath;
              logger.log('info', `Found entry file at: ${appEntryPath}`);
            }
            break;
          }
        }

        if (isValid) break;
      }

      // If we found a valid build path but not an entry path yet, look for index.html
      if (validBuildPath && !appEntryPath) {
        const indexPath = path.join(validBuildPath, 'index.html');
        const exists = fs.existsSync(indexPath);
        logger.log('info', `Checking for index.html: ${indexPath}, exists: ${exists}`);

        if (exists) {
          appEntryPath = indexPath;
          logger.log('info', `Found Vite entry file at: ${appEntryPath}`);
        } else {
          // If we couldn't find an HTML entry file, try to load the app directory itself
          logger.log('info', `No index.html found, using build directory: ${validBuildPath}`);
          appEntryPath = validBuildPath;
        }
      }

      // Use validBuildPath as our indexPath
      let indexPath = appEntryPath || validBuildPath;

      if (indexPath) {
        logger.log('info', `Attempting to load React app from: ${indexPath}`);

        try {
          // Check if indexPath is a directory or file
          const stats = fs.statSync(indexPath);

          if (stats.isDirectory()) {
            // If it's a directory, we need to load index.html from it
            const indexHtmlPath = path.join(indexPath, 'index.html');
            if (fs.existsSync(indexHtmlPath)) {
              // Create file:// URL with proper formatting for loadURL
              const fileUrl = `file://${indexHtmlPath.replace(/\\/g, '/')}`;
              logger.log('info', `Loading from URL (directory): ${fileUrl}`);
              mainWindow.loadURL(fileUrl);
            } else {
              logger.log('error', `index.html not found in directory: ${indexPath}`);
              throw new Error(`index.html not found in directory: ${indexPath}`);
            }
          } else {
            // It's a direct file (likely index.html) - use proper URL format
            const fileUrl = `file://${indexPath.replace(/\\/g, '/')}`;
            logger.log('info', `Loading from URL (file): ${fileUrl}`);
            mainWindow.loadURL(fileUrl);
          }

          // Set up error handling
          mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
            logger.log('error', `Page failed to load: ${errorDescription} (${errorCode})`);

            // Show error in window
            mainWindow.loadURL(`data:text/html;charset=utf-8,
              <html>
                <head><title>FE Infinity - Error</title></head>
                <body style="font-family: Arial; padding: 2rem; color: #333;">
                  <h2>Failed to load application</h2>
                  <p>Error: ${errorDescription} (${errorCode})</p>
                  <p>Please check the application logs for more details.</p>
                </body>
              </html>
            `);
          });

          // Enable DevTools in packaged app for debugging
          mainWindow.webContents.on('did-finish-load', () => {
            logger.log('info', 'React app loaded successfully');
            // Uncomment to open DevTools in production for debugging
            // mainWindow.webContents.openDevTools();
          });

          // Set up protocol handling
          mainWindow.webContents.on('will-navigate', (event, url) => {
            const parsedUrl = new URL(url);

            // For external links, open in browser
            if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
              event.preventDefault();
              require('electron').shell.openExternal(url);
            }
          });
        } catch (err) {
          logger.log('error', `Failed to load React app: ${err.message}`, { error: err.stack });

          // Fallback to a basic HTML message
          mainWindow.loadURL(`data:text/html;charset=utf-8,
            <html>
              <head><title>FE Infinity - Error</title></head>
              <body style="font-family: Arial; padding: 2rem; color: #333;">
                <h2>Failed to load application</h2>
                <p>There was an error loading the application: ${err.message}</p>
                <p>Please check the application logs for more details.</p>
              </body>
            </html>
          `);
        }
      } else {
        // If we can't find the client build, show an error page
        logger.log('error', 'Could not find Vite build output in any expected location');
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

  // Add Windows icon initialization function
  if (process.platform === 'win32') {
    try {
      // Check if we're in a packaged app
      if (app.isPackaged) {
        const iconPath = path.join(process.resourcesPath, 'app.ico');
        if (fs.existsSync(iconPath)) {
          logger.log('info', `Windows icon found at: ${iconPath}`);
          app.getFileIcon = () => iconPath;
        } else {
          logger.log('warn', `Windows icon not found at: ${iconPath}`);
        }
      }
    } catch (error) {
      logger.log('error', 'Failed to initialize Windows icon', { error: error.message });
    }
  }

  // Copy logo file to all potential paths to ensure it's found
  try {
    const sourceLogoPath = path.join(__dirname, 'logo.png');
    if (fs.existsSync(sourceLogoPath)) {
      const destPaths = [
        path.join(process.resourcesPath, 'logo.png'),
        path.join(process.resourcesPath, 'app/logo.png')
      ];

      logger.log('info', `Copying logo from ${sourceLogoPath} to ensure availability`);
      for (const destPath of destPaths) {
        try {
          // Create directory if it doesn't exist
          const destDir = path.dirname(destPath);
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }

          fs.copyFileSync(sourceLogoPath, destPath);
          logger.log('info', `Copied logo to ${destPath}`);
        } catch (copyErr) {
          logger.log('warn', `Failed to copy logo to ${destPath}: ${copyErr.message}`);
        }
      }
    } else {
      logger.log('warn', `Source logo not found at ${sourceLogoPath}`);
    }
  } catch (logoError) {
    logger.log('error', `Error preparing logo: ${logoError.message}`);
  }

  // Register the custom protocol to handle assets
  protocol.registerFileProtocol('asset', (request, callback) => {
    const url = request.url.replace(/^asset:\/\//, '');
    // Remove any trailing slashes that might be present
    const decodedUrl = decodeURI(url).replace(/\/+$/, '');

    // Log the request for debugging in packaged app
    logger.log('info', `Asset request: ${decodedUrl}`);

    // Special case for logo.png which could be in multiple locations
    if (decodedUrl === 'logo.png') {
      const logoPaths = [
        path.join(__dirname, 'logo.png'),
        path.join(app.getAppPath(), 'logo.png'),
        path.join(process.resourcesPath, 'logo.png'),
        path.join(process.resourcesPath, 'app/logo.png'),
        // Add paths where we've found logo before
        path.join(process.resourcesPath, 'client/dist/logo.png'),
        path.join(process.resourcesPath, 'client/public/logo.png'),
        path.join(app.getAppPath().replace('.asar', ''), 'logo.png')
      ];

      // Log all potential logo paths for debugging
      logger.log('info', `Searching for logo in paths: ${JSON.stringify(logoPaths)}`);

      for (const logoPath of logoPaths) {
        try {
          if (fs.existsSync(logoPath)) {
            logger.log('info', `Logo found at: ${logoPath}`);
            return callback({ path: logoPath });
          }
        } catch (err) {
          logger.log('warn', `Error checking logo path: ${logoPath}`, { error: err.message });
        }
      }

      // If logo not found in known locations, continue with standard search paths
      logger.log('warn', 'Logo not found in known locations, trying standard paths');
    }

    // Simplified search paths based on what works
    const searchPaths = [
      // In public directory (current standard)
      path.join(process.resourcesPath, 'client/public', decodedUrl),
      path.join(app.getAppPath(), 'client/public', decodedUrl),
      // Files copied by Vite build
      path.join(process.resourcesPath, 'client/dist', decodedUrl),
      path.join(app.getAppPath(), 'client/dist', decodedUrl),
      // In development
      path.join(__dirname, '../client/public', decodedUrl),
      path.join(__dirname, '../client/dist', decodedUrl),
      // Additional paths specific to packaged app
      path.join(process.resourcesPath, decodedUrl),
      path.join(app.getAppPath().replace('.asar', ''), decodedUrl)
    ];

    // Log search paths for debugging
    if (decodedUrl.includes('logo')) {
      logger.log('info', `Standard search paths for logo: ${JSON.stringify(searchPaths)}`);
    }

    // Try each path in order
    for (const filePath of searchPaths) {
      try {
        if (fs.existsSync(filePath)) {
          logger.log('info', `Asset found at: ${filePath}`);
          return callback({ path: filePath });
        }
      } catch (err) {
        logger.log('warn', `Error checking path: ${filePath}`, { error: err.message });
      }
    }

    // If we got here, file wasn't found
    logger.log('error', `Asset not found: ${decodedUrl}`);
    // Return a fallback or just fail
    return callback({ error: -6 }); // FILE_NOT_FOUND
  });

  // Verify assets in packaged app
  if (app.isPackaged) {
    try {
      logger.log('info', 'Verifying packaged assets...');
      const verificationResults = verifyAssets();

      if (!verificationResults.success) {
        logger.log('warn', 'Asset verification failed', { errors: verificationResults.errors });
        // Don't show error dialog as this might confuse users, just log it
      } else {
        logger.log('info', 'Asset verification passed');
      }
    } catch (error) {
      logger.log('error', 'Error during asset verification', { error: error.message });
    }
  }

  // Check for Wine and Python on macOS/Linux
  if (process.platform !== 'win32') {
    try {
      const { execSync } = require('child_process');
      let wineInstalled = false;
      let pythonInstalled = false;

      // Check for Wine
      try {
        execSync('which wine', { encoding: 'utf8' });
        wineInstalled = true;
        logger.log('info', 'Wine is installed and available in PATH');
      } catch (e) {
        logger.log('warn', 'Wine not found in PATH. Checking common locations...');

        // Check common locations based on platform
        const commonPaths = process.platform === 'darwin'
          ? ['/usr/local/bin/wine', '/opt/homebrew/bin/wine', '/Applications/Wine Stable.app/Contents/Resources/wine/bin/wine']
          : ['/usr/bin/wine', '/usr/local/bin/wine'];

        for (const winePath of commonPaths) {
          if (require('fs').existsSync(winePath)) {
            wineInstalled = true;
            logger.log('info', `Wine found at: ${winePath}`);
            break;
          }
        }
      }

      // We only use bundled Python now
      pythonInstalled = true;

      // Show error message if Wine is missing
      const missingComponents = [];
      if (!wineInstalled) missingComponents.push('Wine');

      if (missingComponents.length > 0) {
        logger.log('error', `Missing required components: ${missingComponents.join(', ')}`);

        let errorMessage = 'The following required components were not found on your system:\n\n';

        if (!wineInstalled) {
          errorMessage += '• Wine: Install via Homebrew with:\n  brew install --cask --no-quarantine wine-stable\n\n';
        }

        errorMessage += 'Please install the missing components and restart the application.';

        dialog.showErrorBox('Required Components Missing', errorMessage);
        app.quit();
        return;
      }
    } catch (error) {
      logger.log('error', 'Error checking for required components', { error: error.message });
    }
  }

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

    // Initialize Python environment for game engine
    try {
      logger.log('info', 'Initializing Python environment for game engine...');
      await preparePythonEnvironment();
      logger.log('info', 'Python environment initialized');
    } catch (pythonError) {
      logger.log('error', 'Failed to initialize Python environment', {
        error: pythonError.message,
        stack: pythonError.stack
      });
      // Continue anyway - we'll retry during game launch
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
    logger.log('info', `IPC request to run game received`, { projectPath });

    if (!projectPath) {
      logger.log('error', 'Missing project path in IPC runGame request');
      return { success: false, error: 'Missing project path' };
    }

    // Verify the project exists before attempting to run
    const resourcesPath = process.resourcesPath || app.getAppPath();
    const ltMakerPath = path.join(resourcesPath, 'lt-maker-fork');
    const projectFullPath = path.join(ltMakerPath, projectPath);

    if (!fs.existsSync(projectFullPath)) {
      const errorMsg = `Project not found: ${projectPath} (full path: ${projectFullPath})`;
      logger.log('error', errorMsg);
      return { success: false, error: errorMsg };
    }

    // Check metadata.json exists
    const metadataPath = path.join(projectFullPath, 'metadata.json');
    if (!fs.existsSync(metadataPath)) {
      const errorMsg = `metadata.json not found in project: ${projectPath}`;
      logger.log('error', errorMsg);
      return { success: false, error: errorMsg };
    }

    logger.log('info', `Launching game through Wine: ${projectPath}`);

    await runGameWithWine(projectPath);
    logger.log('info', `Game launch initiated successfully`);

    return { success: true };
  } catch (error) {
    logger.log('error', 'Error running game via IPC', {
      error: error.message,
      stack: error.stack
    });

    dialog.showErrorBox(
      'Game Launch Failed',
      `Failed to launch the game: ${error.message}`
    );

    return { success: false, error: error.message };
  }
});

// Handle API key management IPC calls
ipcMain.handle('getApiKey', async (event) => {
  logger.log('info', 'Retrieving OpenAI API key');
  return apiKeyManager.getApiKey();
});

ipcMain.handle('setApiKey', async (event, { key }) => {
  logger.log('info', 'Setting OpenAI API key');
  return apiKeyManager.setApiKey(key);
});

ipcMain.handle('deleteApiKey', async (event) => {
  logger.log('info', 'Deleting OpenAI API key');
  return apiKeyManager.deleteApiKey();
});

ipcMain.handle('hasApiKey', async (event) => {
  return apiKeyManager.hasApiKey();
});

// Modify the api-call handler to include API keys from storage
ipcMain.handle('api-call', async (event, { endpoint, method, body }) => {
  try {
    logger.log('info', `API call to ${endpoint}`);

    // Get API key from storage to pass to the server
    const openaiKey = apiKeyManager.getApiKey();

    // Use URL API so we never create malformed URLs when the endpoint already
    // contains query parameters (e.g. "generation-progress?gameNid=abc").
    const isGetOrHead = method === 'GET' || method === 'HEAD';
    const urlObj = new URL(`http://localhost:8000/${endpoint}`);

    // Inject the stored API key for GET/HEAD without clobbering existing search
    if (isGetOrHead && openaiKey) {
      urlObj.searchParams.set('openaiApiKey', openaiKey);
    }

    const finalUrl = urlObj.toString();

    // Configure request options based on HTTP method
    const options = {
      method,
      headers: {},
    };

    // Only add content-type and body for non-GET/HEAD requests
    if (!isGetOrHead && body) {
      options.headers['Content-Type'] = 'application/json';

      // Add API key to the body for POST/PUT/etc requests
      const requestBody = { ...body };
      if (openaiKey) requestBody.openaiApiKey = openaiKey;

      options.body = JSON.stringify(requestBody);
    }

    const response = await fetch(finalUrl, options);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `API call failed with status ${response.status}`
      };
    }

    return { success: true, data };
  } catch (error) {
    logger.log('error', `API call to ${endpoint} failed`, { error: error.message });
    return { success: false, error: error.message };
  }
});

// Handle export logs request: zip log files and save to Downloads folder
ipcMain.handle('exportLogs', async () => {
  try {
    logger.log('info', 'Export logs requested');
    const logDir = logger.getLogDirectory();
    const downloadsDir = app.getPath('downloads');
    const zipName = `FE-Infinity-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.zip`;
    const zipPath = path.join(downloadsDir, zipName);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    return new Promise(resolve => {
      output.on('close', () => {
        logger.log('info', `Logs exported to ${zipPath}`);
        resolve({ success: true, path: zipPath });
      });
      archive.on('error', err => {
        logger.log('error', 'Error exporting logs', { error: err.message });
        resolve({ success: false, error: err.message });
      });
      archive.pipe(output);
      archive.directory(logDir, false);
      archive.finalize();
    });
  } catch (error) {
    logger.log('error', 'Exception in exportLogs handler', { error: error.stack });
    return { success: false, error: error.message };
  }
});

app.on('before-quit', () => {
  logger.log('info', 'Application shutting down');
  stopServer();
  logger.closeLogger();
});