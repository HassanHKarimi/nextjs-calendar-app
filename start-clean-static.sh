#!/bin/bash

echo "🧹 Starting clean static export process for Next.js app"
echo "=========================================================="

# Ensure script is executable
chmod +x ./env-clean-build.sh

# Kill any process using port 3000
echo "🔍 Checking for processes using port 3000..."
PID=$(lsof -ti:3000)
if [ ! -z "$PID" ]; then
  echo "🚫 Killing process $PID using port 3000..."
  kill $PID
  sleep 1
fi

# Build with clean environment
echo "🏗️  Building with clean environment..."
env -i \
  HOME="$HOME" \
  PATH="$PATH" \
  NODE_ENV=production \
  npm run build

# Check if build succeeded
if [ $? -ne 0 ]; then
  echo "❌ Build failed! See errors above."
  exit 1
fi

echo "✅ Build completed successfully!"
echo "📂 Static export created in 'out' directory"

# Verify output directory exists
if [ ! -d "out" ]; then
  echo "⚠️  Warning: 'out' directory not found. This may indicate an issue with the build."
  echo "    Check next.config.js to ensure 'output: 'export'' is set."
  exit 1
fi

# Start static server
echo "🚀 Starting static server on http://localhost:3000"
echo "=========================================================="
echo "👉 Press Ctrl+C to stop the server"
echo "=========================================================="

# Use server-static.js for serving
node server-static.js 