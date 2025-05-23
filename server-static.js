// Simple static file server for serving Next.js static export
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.join(__dirname, 'out'); // 'out' is the default Next.js static export directory

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

// Function to log with timestamps
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Create HTTP server
const server = http.createServer((req, res) => {
  // Log request
  log(`${req.method} ${req.url}`);
  
  // Parse URL to get file path
  let filePath = path.join(ROOT_DIR, req.url);
  
  // Handle root or directory paths by serving index.html
  if (req.url === '/' || req.url.endsWith('/')) {
    filePath = path.join(filePath, 'index.html');
  }
  
  // Handle SPA routes - if file doesn't exist, try using index.html
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // Check if it's a known route pattern
    if (req.url.startsWith('/calendar')) {
      // For calendar routes, use the calendar/index.html
      const basePath = req.url.split('?')[0]; // Remove query parameters
      const parts = basePath.split('/').filter(Boolean);
      
      // Try to find the most specific matching HTML file
      let found = false;
      
      // First, try for exact path match
      if (fs.existsSync(path.join(ROOT_DIR, ...parts, 'index.html'))) {
        filePath = path.join(ROOT_DIR, ...parts, 'index.html');
        found = true;
      } 
      // Then, try for parent path match
      else if (parts.length > 1 && fs.existsSync(path.join(ROOT_DIR, parts[0], 'index.html'))) {
        filePath = path.join(ROOT_DIR, parts[0], 'index.html');
        found = true;
      }
      // Default to main calendar index
      else if (fs.existsSync(path.join(ROOT_DIR, 'calendar', 'index.html'))) {
        filePath = path.join(ROOT_DIR, 'calendar', 'index.html');
        found = true;
      }
      
      if (!found) {
        // Fall back to main index.html for SPA routing
        filePath = path.join(ROOT_DIR, 'index.html');
      }
    } else {
      // For any other routes, use the main index.html
      filePath = path.join(ROOT_DIR, 'index.html');
    }
  }
  
  // Get file extension for MIME type
  const ext = path.extname(filePath);
  
  // Serve the file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // If file not found, try serving index.html for SPA routes
      if (err.code === 'ENOENT' && !req.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|ttf|woff|woff2)$/)) {
        log(`File not found: ${filePath}, serving index.html instead`);
        fs.readFile(path.join(ROOT_DIR, 'index.html'), (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
            return;
          }
          
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        });
        return;
      }
      
      // Handle other errors
      log(`Error reading file: ${err}`);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }
    
    // Set MIME type
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // Send response
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

// Start server
server.listen(PORT, () => {
  log(`Static file server running at http://localhost:${PORT}/`);
  log(`Serving files from: ${ROOT_DIR}`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    log(`Error: Port ${PORT} is already in use. Please try a different port.`);
    process.exit(1);
  } else {
    log(`Server error: ${err}`);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  log('Server shutting down...');
  server.close(() => {
    log('Server shut down successfully');
    process.exit(0);
  });
}); 