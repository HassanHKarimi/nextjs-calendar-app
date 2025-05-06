const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

// Check if running on Vercel
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

// If running on Vercel, we don't need to run this custom server
if (isVercel) {
  process.exit(0);
}

// Load environment variables from .env.local file if it exists
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

// Set development mode
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Make sure required environment variables are set
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = `http://${hostname}:${port}`;
}

// Force NEXTAUTH_URL to use port 3000
process.env.NEXTAUTH_URL = `http://${hostname}:${port}`;

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = 'development-secret-key-change-in-production';
}

// Set demo mode for testing
if (!process.env.NEXT_PUBLIC_DEMO_MODE) {
  process.env.NEXT_PUBLIC_DEMO_MODE = "true";
}

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Parse the URL
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;
      
      // Special handling for NextAuth API routes
      if (pathname.startsWith('/api/auth')) {
        try {
          // Check if we need to redirect to the Pages Router API
          if (fs.existsSync(path.join(process.cwd(), 'pages/api/auth'))) {
            await app.render(req, res, `/api/auth/${pathname.replace('/api/auth/', '')}`, query);
          } else {
            // Use the App Router version
            await handle(req, res, parsedUrl);
          }
        } catch (err) {
          res.statusCode = 500;
          res.end('Authentication Error');
        }
        return;
      }
      
      // Special handling for root path
      if (pathname === '/') {
        try {
          // Try different variations to find the home page
          if (fs.existsSync(path.join(process.cwd(), 'src/app/page.tsx'))) {
            await app.render(req, res, '/', query);
          } else if (fs.existsSync(path.join(process.cwd(), 'pages/index.tsx'))) {
            await app.render(req, res, '/', query);
          } else {
            await app.render(req, res, '/sign-in', query);
          }
        } catch (err) {
          // Fallback to sign-in page
          await app.render(req, res, '/sign-in', query);
        }
        return;
      }
      
      // Special handling for calendar path
      if (pathname.startsWith('/calendar')) {
        try {
          // Always prefer the App Router implementation
          if (fs.existsSync(path.join(process.cwd(), 'src/app/calendar'))) {
            await handle(req, res, parsedUrl);
          } else if (fs.existsSync(path.join(process.cwd(), 'pages/calendar'))) {
            await app.render(req, res, pathname, query);
          } else {
            res.statusCode = 404;
            res.end('Calendar Not Found');
          }
        } catch (err) {
          res.statusCode = 500;
          res.end('Calendar Error');
        }
        return;
      }
      
      // Let Next.js handle the request
      await handle(req, res, parsedUrl);
    } catch (err) {
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
  });
});