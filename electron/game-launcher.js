const http = require('http');
const { runGameWithWine } = require('./game-runner');

// Create a simple HTTP server for all modes (both development and production)
const PORT = 8989;

function startGameLauncherServer() {
  return new Promise((resolve, reject) => {
    console.log(`Attempting to start game launcher HTTP server on port ${PORT}...`);
    
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
            console.log(`Received run-game request with body: ${body}`);
            const { projectPath } = JSON.parse(body);
            
            if (!projectPath) {
              res.statusCode = 400;
              res.end(JSON.stringify({
                success: false,
                error: 'Missing projectPath parameter'
              }));
              return;
            }
            
            console.log(`HTTP endpoint received request to run game: ${projectPath}`);
            await runGameWithWine(projectPath);
            
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true }));
          } catch (error) {
            console.error('Error running game:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({
              success: false,
              error: error.message || 'Failed to launch game'
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
      console.log(`Game launcher HTTP server running on port ${PORT}`);
      resolve(server);
    });
    
    server.on('error', (err) => {
      console.error(`Failed to start game launcher server:`, err);
      reject(err);
    });
  });
}

module.exports = {
  startGameLauncherServer
};