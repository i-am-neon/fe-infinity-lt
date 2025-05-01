const http = require('http');
const { runGameWithWine, runPythonScript, runEditor } = require('./game-runner');
const logger = require('./logger');
const { app } = require('electron');
const path = require('path');
const fs = require('fs');

/**
 * Creates an HTTP server to handle game launching requests from the Deno server
 * This provides a bridge between the Deno server and Electron's main process
 */
async function startGameLauncherServer() {
  // Create HTTP server
  const server = http.createServer(async (req, res) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        // Set CORS headers to allow requests from localhost
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Handle preflight requests
        if (req.method === 'OPTIONS') {
          res.writeHead(200);
          res.end();
          return;
        }

        // Log incoming request
        logger.log('info', `Received request to ${req.url}`, {
          body: body.length > 500 ? `${body.substring(0, 500)}...` : body
        });

        if (req.url === '/run-game' && req.method === 'POST') {
          // Parse JSON request body
          const data = JSON.parse(body);
          const projectPath = data.projectPath;

          if (!projectPath) {
            logger.log('error', 'Missing project path in run-game request');
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Missing project path' }));
            return;
          }

          try {
            // First check if the project exists in the user data directory
            const userDataDir = app.getPath('userData');
            const userLtMakerPath = path.join(userDataDir, 'lt-maker-fork');
            const userProjectPath = path.join(userLtMakerPath, projectPath);

            // Check if the project exists in user directory first
            if (fs.existsSync(userProjectPath)) {
              logger.log('info', `Found project in user data directory: ${userProjectPath}`);

              // Check metadata.json exists
              const metadataPath = path.join(userProjectPath, 'metadata.json');
              if (!fs.existsSync(metadataPath)) {
                const errorMsg = `metadata.json not found in user project: ${projectPath}`;
                logger.log('error', errorMsg);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: errorMsg }));
                return;
              }

              logger.log('info', `Launching game through Wine: ${projectPath}`);
              await runGameWithWine(projectPath);
              logger.log('info', `Game launch initiated successfully`);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true }));
              return;
            }

            // Fall back to resources directory if not found in user data
            const resourcesPath = process.resourcesPath || app.getAppPath();
            const ltMakerPath = path.join(resourcesPath, 'lt-maker-fork');
            const projectFullPath = path.join(ltMakerPath, projectPath);

            if (!fs.existsSync(projectFullPath)) {
              const errorMsg = `Project not found in any location: ${projectPath}`;
              logger.log('error', errorMsg, {
                checkedPaths: [userProjectPath, projectFullPath]
              });
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: errorMsg }));
              return;
            }

            // Run the game
            await runGameWithWine(projectPath);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          } catch (error) {
            logger.log('error', 'Error running game', {
              error: error.message,
              stack: error.stack
            });
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
          }
        } else if (req.url === '/run-editor' && req.method === 'POST') {
          // Handle editor launch requests
          try {
            // Parse JSON request body
            const data = JSON.parse(body);
            const projectPath = data.projectPath; // This can be undefined if just opening editor

            // First check if the project exists (if a project was specified)
            if (projectPath) {
              const userDataDir = app.getPath('userData');
              const userLtMakerPath = path.join(userDataDir, 'lt-maker-fork');
              const userProjectPath = path.join(userLtMakerPath, projectPath);

              // Check in user directory first
              if (fs.existsSync(userProjectPath)) {
                logger.log('info', `Found project for editor in user data directory: ${userProjectPath}`);
                await runEditor(projectPath);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
                return;
              }

              // Fall back to resources directory if not found in user data
              const resourcesPath = process.resourcesPath || app.getAppPath();
              const ltMakerPath = path.join(resourcesPath, 'lt-maker-fork');
              const projectFullPath = path.join(ltMakerPath, projectPath);

              if (!fs.existsSync(projectFullPath)) {
                const errorMsg = `Project not found for editor in any location: ${projectPath}`;
                logger.log('error', errorMsg, {
                  checkedPaths: [userProjectPath, projectFullPath]
                });
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: errorMsg }));
                return;
              }
            }

            // Run the editor with or without a project
            logger.log('info', `Launching editor${projectPath ? ` with project: ${projectPath}` : ''}`);
            await runEditor(projectPath);
            logger.log('info', 'Editor launch initiated successfully');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          } catch (error) {
            logger.log('error', 'Error running editor', {
              error: error.message,
              stack: error.stack
            });
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
          }
        } else if (req.url === '/run-python' && req.method === 'POST') {
          // Handle Python script execution
          const data = JSON.parse(body);
          const { scriptPath, args = [] } = data;

          if (!scriptPath) {
            logger.log('error', 'Missing script path in run-python request');
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Missing script path' }));
            return;
          }

          try {
            await runPythonScript(scriptPath, args);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          } catch (error) {
            logger.log('error', 'Error running Python script', {
              error: error.message,
              stack: error.stack
            });
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
          }
        } else {
          // Handle unknown endpoint
          logger.log('warn', `Unknown endpoint requested: ${req.url}`);
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Endpoint not found' }));
        }
      } catch (error) {
        logger.log('error', 'Error processing request', {
          error: error.message,
          stack: error.stack
        });
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Internal server error' }));
      }
    });
  });

  // Start server on port 8989
  await new Promise((resolve, reject) => {
    server.listen(8989, 'localhost', () => {
      logger.log('info', 'Game launcher HTTP server started on port 8989');
      resolve();
    });

    server.on('error', (error) => {
      logger.log('error', 'Failed to start game launcher HTTP server', {
        error: error.message,
        stack: error.stack
      });
      reject(error);
    });
  });

  return server;
}

module.exports = {
  startGameLauncherServer
};