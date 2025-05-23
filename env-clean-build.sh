#!/bin/bash

# This script builds the Next.js app with a completely clean environment
# to avoid any NODE_OPTIONS or other environment variable conflicts

echo "🚀 Starting clean environment build process"
echo "----------------------------------------"

# Use env -i to start with a completely clean environment, then set only what we need
echo "Running Next.js build with clean environment..."
env -i \
  HOME="$HOME" \
  PATH="$PATH" \
  NODE_ENV=production \
  npm run build

# Check if build succeeded
if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  
  # Verify the output directory exists
  if [ -d "out" ]; then
    echo "📁 Static export created in 'out' directory"
  else
    echo "⚠️  Warning: 'out' directory was not created. Check next.config.js for correct static export settings."
  fi
  
  echo "----------------------------------------"
  echo "To serve the static site, run: npm run start-static"
  echo "----------------------------------------"
else
  echo "❌ Build failed."
  exit 1
fi 