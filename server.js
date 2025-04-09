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
const port = process.env.PORT || 3003; // Use 3003 since 3000-3002 appear to be in use

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
        try {
          // Check if we need to redirect to the Pages Router API
          if (fs.existsSync(path.join(process.cwd(), 'pages/api/auth'))) {
            console.log('Using Pages Router API route');
            // Use the Pages Router version
            await app.render(req, res, `/api/auth/${pathname.replace('/api/auth/', '')}`, query);
          } else {
            // Use the App Router version
            await handle(req, res, parsedUrl);
          }
        } catch (err) {
          console.error('Error handling auth request:', err);
          res.statusCode = 500;
          res.end('Authentication Error');
        }
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
      
      // Special handling for calendar path
      if (pathname.startsWith('/calendar')) {
        console.log('Handling calendar request:', pathname);
        try {
          // Try different variations to find the calendar page
          if (fs.existsSync(path.join(process.cwd(), 'pages/calendar'))) {
            console.log('Using Pages Router calendar at pages/calendar');
            await app.render(req, res, pathname, query);
          } else if (fs.existsSync(path.join(process.cwd(), 'src/app/calendar'))) {
            console.log('Using App Router calendar at src/app/calendar');
            await handle(req, res, parsedUrl);
          } else {
            console.log('No calendar page found, returning 404');
            res.statusCode = 404;
            res.end('Calendar Not Found');
          }
        } catch (err) {
          console.error('Error rendering calendar page:', err);
          res.statusCode = 500;
          res.end('Calendar Error');
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