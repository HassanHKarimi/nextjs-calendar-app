#!/bin/bash

# Set Vercel environment variable explicitly
export VERCEL=1

# Print directory contents before build
echo "Current directory before build:"
ls -la

# Use the ultra-simple build script with no CSS frameworks
bash ./ultra-simple-build.sh

# Print directory structure after build
echo "Directory structure after build:"
find ./dist -type f | sort

# Make sure the routes-manifest.json is available
if [ -f "./dist/routes-manifest.json" ]; then
  echo "routes-manifest.json exists:"
  cat ./dist/routes-manifest.json
else
  echo "ERROR: routes-manifest.json does not exist!"
  echo "Contents of dist directory:"
  ls -la ./dist
fi
