#!/bin/bash

# Debug: Print current directory
echo "Current working directory: $(pwd)"

# Install missing packages
npm install --save @auth/prisma-adapter

# Create an pre-build bootstrapper file to ensure modules are loaded in the right order
cat > pre-build-bootstrap.js << 'EOF'
// Import order matters for webpack
import './lib/db';  
import './data/user';
import './schemas';
import './auth';
console.log('Bootstrap imports completed');
EOF

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

# Copy files to node_modules/@shared to ensure they're available
mkdir -p node_modules/@shared
cp -r lib node_modules/@shared/
cp -r data node_modules/@shared/
cp -r schemas node_modules/@shared/
cp -r auth.js node_modules/@shared/

# Fix imports in files first
bash ./fixed-vercel-build-imports.sh

# Run the regular build script
bash ./fixed-vercel-build.sh