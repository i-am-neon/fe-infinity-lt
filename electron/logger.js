const fs = require('fs');
const path = require('path');
const { app } = require('electron');

let logStream = null;
let logPath = '';

function getLogDirectory() {
  // Get platform-specific log directory
  let logDir;
  
  if (process.platform === 'darwin') {
    // macOS: ~/Library/Logs/[AppName]/
    logDir = path.join(app.getPath('home'), 'Library', 'Logs', app.getName());
  } else if (process.platform === 'win32') {
    // Windows: %USERPROFILE%\AppData\Roaming\[AppName]\logs\
    logDir = path.join(app.getPath('userData'), 'logs');
  } else {
    // Linux: ~/.config/[AppName]/logs/
    logDir = path.join(app.getPath('userData'), 'logs');
  }
  
  // Ensure the log directory exists
  ensureDirSync(logDir);
  
  return logDir;
}

// Simple implementation of ensureDirSync using native fs
function ensureDirSync(dirPath) {
  try {
    if (fs.existsSync(dirPath)) {
      return;
    }
    
    // Recursively create parent directories
    ensureDirSync(path.dirname(dirPath));
    
    // Create directory
    fs.mkdirSync(dirPath);
  } catch (error) {
    // Handle edge cases like permission errors
    console.error(`Failed to create directory ${dirPath}:`, error);
  }
}

function initLogger() {
  try {
    const logDir = getLogDirectory();
    const logFilename = `electron-${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
    logPath = path.join(logDir, logFilename);
    
    // Create a write stream for the log file
    logStream = fs.createWriteStream(logPath, { flags: 'a' });
    
    // Redirect console output to the log file in production mode
    if (process.env.NODE_ENV === 'production') {
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      
      console.log = function(...args) {
        const message = args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
        ).join(' ');
        
        if (logStream) {
          logStream.write(`[${new Date().toISOString()}] [INFO] ${message}\n`);
        }
        originalConsoleLog.apply(console, args);
      };
      
      console.error = function(...args) {
        const message = args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
        ).join(' ');
        
        if (logStream) {
          logStream.write(`[${new Date().toISOString()}] [ERROR] ${message}\n`);
        }
        originalConsoleError.apply(console, args);
      };
    }
    
    log('info', `Electron app logs initialized at: ${logPath}`);
    
    return logDir;
  } catch (error) {
    console.error('Failed to initialize logger:', error);
    // Return a fallback location if logger initialization fails
    return path.join(app.getPath('userData'), 'logs');
  }
}

function log(level, message, data = null) {
  if (!logStream) {
    console.log(`[${level.toUpperCase()}] ${message}`);
    if (data) console.log(data);
    return;
  }
  
  try {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (data) {
      logMessage += `\n${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}`;
    }
    
    logStream.write(logMessage + '\n');
    
    // Also output to console
    if (level.toLowerCase() === 'error') {
      console.error(message, data || '');
    } else {
      console.log(message, data || '');
    }
  } catch (error) {
    console.error('Error writing to log stream:', error);
  }
}

function closeLogger() {
  if (logStream) {
    try {
      logStream.end();
    } catch (error) {
      console.error('Error closing log stream:', error);
    }
    logStream = null;
  }
}

module.exports = {
  initLogger,
  getLogDirectory,
  log,
  closeLogger,
  getLogPath: () => logPath
};