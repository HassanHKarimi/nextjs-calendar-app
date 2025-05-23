# Next.js Calendar App - Static Export

This project is configured to work with Next.js static export mode, which generates pure HTML/CSS/JS files without requiring a Node.js server for hosting.

## Static Export Configuration

- `next.config.js` is configured with `output: 'export'` to enable static export mode
- API routes are disabled in static export mode
- No server-side rendering is used
- All data is stored client-side in demo mode

## Running the Application

There are two ways to run the application:

### 1. Development Mode (with Custom Server)

```bash
npm run dev
```

This uses a custom server (`server.js`) that provides additional functionality but is not compatible with static export.

### 2. Static Export Mode

```bash
npm run start-static
```

This script:
1. Builds the application with `next build` (which performs the static export)
2. Kills any process running on port 3000 (if any)
3. Starts a simple static file server (`server-static.js`) that serves the exported files

## Static Server Features

The static server (`server-static.js`) provides:

- Serving static files from the `out` directory
- Proper MIME type handling
- SPA (Single Page Application) routing support for client-side navigation
- Error handling for missing files
- Support for proper paths with query parameters

## Known Limitations

- API routes are not available in static export mode
- Server-side rendering is not available
- Authentication needs to use the demo mode
- Data persistence is limited to client-side storage

## Troubleshooting

If you encounter the error "Error: listen EADDRINUSE: address already in use :::3000", it means port 3000 is already in use. The `start-static.sh` script will attempt to kill any process using this port, but if that fails, you can manually kill the process:

```bash
# Find the process using port 3000
lsof -i :3000

# Kill the process (replace <PID> with the process ID)
kill <PID>
``` 