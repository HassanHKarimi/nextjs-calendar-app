#!/bin/bash

# Unset NODE_OPTIONS to avoid the --legacy-peer-deps error
unset NODE_OPTIONS

# Build Next.js app
echo "Building Next.js app with clean environment..."
npx next build

# Check if build succeeded
if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  
  # Create the out directory if needed
  mkdir -p out
  
  # Copy static files
  if [ -d "dist/static" ]; then
    echo "Copying static files to out directory..."
    cp -r dist/static out/
  fi
  
  # Copy public files
  if [ -d "public" ]; then
    echo "Copying public files to out directory..."
    cp -r public/* out/
  fi
  
  echo "Static build complete. You can serve the 'out' directory with 'npx serve out'."
else
  echo "❌ Build failed."
  exit 1
fi 