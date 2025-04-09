const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env.local file if it exists
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('Loading environment variables from .env.local');
  require('dotenv').config({ path: envPath });
}

// Set development mode
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3001; // Use 3001 since 3000 appears to be in use

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Make sure required environment variables are set
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = `http://${hostname}:${port}`;
  console.log(`Setting NEXTAUTH_URL to ${process.env.NEXTAUTH_URL}`);
}

if (!process.env.NEXTAUTH_SECRET) {
  console.warn('Warning: NEXTAUTH_SECRET is not set. Using a default for development.');
  process.env.NEXTAUTH_SECRET = 'development-secret-key-change-in-production';
}

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Parse the URL
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;
      
      // Special handling for NextAuth API routes
      if (pathname.startsWith('/api/auth')) {
        console.log(`Auth request: ${pathname}`);
        await handle(req, res, parsedUrl);
        return;
      }
      
      // Special handling for root path
      if (pathname === '/') {
        console.log('Handling request for root path');
        try {
          // Try different variations to find the home page
          if (fs.existsSync(path.join(process.cwd(), 'src/app/page.tsx'))) {
            console.log('Found home page at src/app/page.tsx');
            await app.render(req, res, '/', query);
          } else if (fs.existsSync(path.join(process.cwd(), 'pages/index.tsx'))) {
            console.log('Found home page at pages/index.tsx');
            await app.render(req, res, '/', query);
          } else {
            console.log('No home page found, rendering sign-in page');
            await app.render(req, res, '/sign-in', query);
          }
        } catch (err) {
          console.error('Error rendering home page:', err);
          // Fallback to sign-in page
          await app.render(req, res, '/sign-in', query);
        }
        return;
      }
      
      // Let Next.js handle the request
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});