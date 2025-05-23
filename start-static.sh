#!/bin/bash

# Build the app with static export
echo "Building the Next.js app with static export..."
NODE_OPTIONS= npx next build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "Build failed! See errors above."
  exit 1
fi

# Kill any process using port 3000
echo "Checking for processes using port 3000..."
PID=$(lsof -ti:3000)
if [ ! -z "$PID" ]; then
  echo "Killing process $PID using port 3000..."
  kill $PID
  sleep 1
fi

# Start the static server
echo "Starting static server on http://localhost:3000"
node server-static.js 