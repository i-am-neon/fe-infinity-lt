const http = require('http');
const { runGameWithWine } = require('./game-runner');
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
      // Only handle POST requests to /run-game
      if (req.method === 'POST' && req.url === '/run-game') {
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
            logger.log('info', `Received run-game request`, { body });

            let projectPath;
            try {
              const parsedBody = JSON.parse(body);
              projectPath = parsedBody.projectPath;
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

            if (!projectPath) {
              logger.log('error', 'Missing projectPath parameter');
              res.statusCode = 400;
              res.end(JSON.stringify({
                success: false,
                error: 'Missing projectPath parameter'
              }));
              return;
            }

            // Verify the project exists before attempting to run
            const resourcesPath = process.resourcesPath || app.getAppPath();
            const ltMakerPath = path.join(resourcesPath, 'lt-maker-fork');
            const projectFullPath = path.join(ltMakerPath, projectPath);

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
              await runGameWithWine(projectPath);
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
          } catch (error) {
            logger.log('error', 'Unexpected error processing run-game request', {
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