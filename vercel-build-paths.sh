#!/bin/bash

# Debug: Print current directory
echo "Current working directory: $(pwd)"

# Create symbolic links to correctly map @/ imports
# The paths in tsconfig.json don't seem to be respected during build
mkdir -p .next
cd .next
ln -sf ../src src
ln -sf ../components components
ln -sf ../lib lib
ln -sf ../data data
ln -sf ../schemas schemas
ln -sf ../auth.js auth.js
cd ..

# Run the regular build script
bash ./fixed-vercel-build.sh

# Fix imports in files
bash ./fixed-vercel-build-imports.sh