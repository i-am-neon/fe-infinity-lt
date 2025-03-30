const http = require('http');
const { runGame, runPythonScript } = require('./game-runner');
const logger = require('./logger');
const { app } = require('electron');
const path = require('path');
const fs = require('fs');

// Create a simple HTTP server for all modes (both development and production)
const PORT = 8989;

function startGameLauncherServer() {
  return new Promise((resolve, reject) => {
    logger.log('info', `Starting game launcher HTTP server on port ${PORT}...`);

    const server = http.createServer((req, res) => {
      // Handle POST requests to /run-game or /run-python
      if (req.method === 'POST' && (req.url === '/run-game' || req.url === '/run-python')) {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        let body = '';

        // Collect request body data
        req.on('data', (chunk) => {
          body += chunk.toString();
        });

        // Process the request
        req.on('end', async () => {
          try {
            logger.log('info', `Received request to ${req.url}`, { body });

            let parsedBody;
            try {
              parsedBody = JSON.parse(body);
            } catch (parseError) {
              logger.log('error', 'Failed to parse JSON body', {
                error: parseError.message,
                body
              });
              res.statusCode = 400;
              res.end(JSON.stringify({
                success: false,
                error: 'Invalid JSON body'
              }));
              return;
            }

            // Handle different endpoints
            if (req.url === '/run-game') {
              // Run Game endpoint
              const projectPath = parsedBody.projectPath;
              
              if (!projectPath) {
                logger.log('error', 'Missing projectPath parameter');
                res.statusCode = 400;
                res.end(JSON.stringify({
                  success: false,
                  error: 'Missing projectPath parameter'
                }));
                return;
              }

              // Use improved path resolution logic to find lt-maker-fork directory
              let ltMakerPath;
              // Try multiple potential locations
              const potentialLocations = [
                // Development location
                path.join(app.getAppPath(), '..', 'lt-maker-fork'),
                // Direct from app path
                path.join(app.getAppPath(), 'lt-maker-fork'),
                // From resources
                path.join(process.resourcesPath || app.getAppPath(), 'lt-maker-fork'),
                // From resources/app
                path.join(process.resourcesPath || app.getAppPath(), 'app', 'lt-maker-fork')
              ];

              // Find the first location that exists
              let foundPath = false;
              for (const location of potentialLocations) {
                if (fs.existsSync(location)) {
                  ltMakerPath = location;
                  foundPath = true;
                  logger.log('info', `Found lt-maker-fork at: ${ltMakerPath}`);
                  break;
                }
              }

              if (!foundPath) {
                const errorMsg = `lt-maker-fork directory not found in any expected location`;
                logger.log('error', errorMsg, { searchedLocations: potentialLocations });
                res.statusCode = 404;
                res.end(JSON.stringify({
                  success: false,
                  error: errorMsg
                }));
                return;
              }

              const projectFullPath = path.join(ltMakerPath, projectPath);
              logger.log('info', `Looking for project at: ${projectFullPath}`);

              if (!fs.existsSync(projectFullPath)) {
                const errorMsg = `Project not found: ${projectPath} (full path: ${projectFullPath})`;
                logger.log('error', errorMsg);
                res.statusCode = 404;
                res.end(JSON.stringify({
                  success: false,
                  error: errorMsg
                }));
                return;
              }

              // Check metadata.json exists
              const metadataPath = path.join(projectFullPath, 'metadata.json');
              if (!fs.existsSync(metadataPath)) {
                const errorMsg = `metadata.json not found in project: ${projectPath}`;
                logger.log('error', errorMsg);
                res.statusCode = 404;
                res.end(JSON.stringify({
                  success: false,
                  error: errorMsg
                }));
                return;
              }

              logger.log('info', `HTTP endpoint received request to run game: ${projectPath}`);

              try {
                await runGame(projectPath);
                logger.log('info', `Game launch requested successfully`);

                res.statusCode = 200;
                res.end(JSON.stringify({ success: true }));
              } catch (gameError) {
                logger.log('error', 'Error running game', {
                  error: gameError.message,
                  stack: gameError.stack
                });

                res.statusCode = 500;
                res.end(JSON.stringify({
                  success: false,
                  error: gameError.message || 'Failed to launch game'
                }));
              }
            } else if (req.url === '/run-python') {
              // Run Python script endpoint
              const scriptPath = parsedBody.scriptPath;
              
              if (!scriptPath) {
                logger.log('error', 'Missing scriptPath parameter');
                res.statusCode = 400;
                res.end(JSON.stringify({
                  success: false,
                  error: 'Missing scriptPath parameter'
                }));
                return;
              }
              
              logger.log('info', `Received request to run Python script: ${scriptPath}`);
              
              // In Electron, use bundled Python
              // Try finding bundled Python
              const possiblePythonPaths = [
                path.join(app.getAppPath(), 'bin', 'python', 'python_embed', 'python.exe'),
                path.join(app.getAppPath(), 'bin', 'python', 'python.exe'),
              ];
              
              let pythonPath = null;
              for (const potentialPath of possiblePythonPaths) {
                logger.log('info', `Checking for Python at: ${potentialPath}`);
                if (fs.existsSync(potentialPath)) {
                  pythonPath = potentialPath;
                  logger.log('info', `Found bundled Python at: ${pythonPath}`);
                  break;
                }
              }
              
              if (!pythonPath) {
                logger.log('warning', `Could not find bundled Python, falling back to system Python`);
                pythonPath = 'python';
              }
              
              try {
                // Use child_process.spawn directly with bundled Python
                const { spawn } = require('child_process');
                const cwd = path.dirname(scriptPath);
                
                logger.log('info', `Attempting to run Python script with: ${pythonPath}`);
                logger.log('info', `Working directory: ${cwd}`);
                logger.log('info', `Script: ${scriptPath}`);
                
                const child = spawn(pythonPath, [scriptPath], {
                  cwd: cwd,
                  detached: true,
                  stdio: 'ignore',
                  windowsHide: false
                });
                
                // Unref child to let it run independently
                child.unref();
                
                logger.log('info', `Python script launched successfully`);
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true }));
                return;
              } catch (directError) {
                logger.log('error', 'Error running Python script directly:', {
                  error: directError.message,
                  stack: directError.stack
                });
                
                // Fall back to the normal method
                try {
                  await runPythonScript(scriptPath);
                  logger.log('info', `Python script launched successfully via runPythonScript`);
                  
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true }));
                  return;
                } catch (fallbackError) {
                  logger.log('error', 'Error in fallback Python execution', {
                    error: fallbackError.message,
                    stack: fallbackError.stack
                  });
                  
                  res.statusCode = 500;
                  res.end(JSON.stringify({
                    success: false,
                    error: fallbackError.message || 'Failed to run Python script'
                  }));
                  return;
                }
              }
            }
          } catch (error) {
            logger.log('error', 'Unexpected error processing request', {
              error: error.message,
              stack: error.stack
            });

            res.statusCode = 500;
            res.end(JSON.stringify({
              success: false,
              error: error.message || 'Internal server error'
            }));
          }
        });
      }
      // Handle OPTIONS request for CORS preflight
      else if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.statusCode = 204;
        res.end();
      }
      // Return 404 for all other requests
      else {
        res.statusCode = 404;
        res.end(JSON.stringify({ success: false, error: 'Not found' }));
      }
    });

    server.listen(PORT, () => {
      logger.log('info', `Game launcher HTTP server running on port ${PORT}`);
      resolve(server);
    });

    server.on('error', (err) => {
      logger.log('error', `Failed to start game launcher server`, {
        error: err.message,
        code: err.code
      });
      reject(err);
    });
  });
}

module.exports = {
  startGameLauncherServer
};