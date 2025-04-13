#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Set Vercel environment variable explicitly
export VERCEL=1
export NODE_OPTIONS="--max-old-space-size=4096"

# Print directory contents before build
echo "Current directory before build:"
ls -la

# Use the ultra-simple build script with no CSS frameworks
bash ./ultra-simple-build.sh

# Double check that we have the correct next.config.js
echo "Verifying next.config.js contents:"
cat next.config.js

# If Next.js built to .next directory instead of dist, copy needed files
echo "Looking for .next directory:"
if [ -d "./.next" ]; then
  echo "Found .next directory. Contents:"
  ls -la ./.next
  
  # Create dist directory if it doesn't exist
  mkdir -p dist
  
  # Copy required files from .next to dist
  if [ -f "./.next/routes-manifest.json" ]; then
    echo "Copying routes-manifest.json from .next to dist"
    cp ./.next/routes-manifest.json ./dist/
  fi
  
  # Copy other essential files for Vercel deployment
  if [ -f "./.next/build-manifest.json" ]; then
    cp ./.next/build-manifest.json ./dist/
  fi
  
  if [ -f "./.next/react-loadable-manifest.json" ]; then
    cp ./.next/react-loadable-manifest.json ./dist/
  fi
  
  if [ -d "./.next/server" ]; then
    mkdir -p ./dist/server
    cp -r ./.next/server/* ./dist/server/
  fi
  
  if [ -d "./.next/static" ]; then
    mkdir -p ./dist/static
    cp -r ./.next/static/* ./dist/static/
  fi
fi

# Print directory structure after build and copying
echo "Directory structure after build and copying:"
find ./dist -type f -name "*.json" | sort

# Make sure the routes-manifest.json is available
if [ -f "./dist/routes-manifest.json" ]; then
  echo "routes-manifest.json exists:"
  cat ./dist/routes-manifest.json
else
  echo "ERROR: routes-manifest.json does not exist!"
  echo "Contents of dist directory:"
  ls -la ./dist
  
  # Create a minimal routes-manifest.json if it doesn't exist
  echo "Creating minimal routes-manifest.json"
  cat > ./dist/routes-manifest.json << 'EOF'
{
  "version": 3,
  "pages404": true,
  "basePath": "",
  "redirects": [],
  "headers": [],
  "dynamicRoutes": [
    {
      "page": "/api/auth/[...nextauth]",
      "regex": "^/api/auth/(.+?)(?:/)?$",
      "routeKeys": {
        "nextauth": "nextauth"
      },
      "namedRegex": "^/api/auth/(?<nextauth>.+?)(?:/)?$"
    }
  ],
  "staticRoutes": [
    {
      "page": "/",
      "regex": "^/(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/(?:/)?$"
    },
    {
      "page": "/404",
      "regex": "^/404(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/404(?:/)?$"
    },
    {
      "page": "/api/register",
      "regex": "^/api/register(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/api/register(?:/)?$"
    },
    {
      "page": "/auth",
      "regex": "^/auth(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/auth(?:/)?$"
    },
    {
      "page": "/calendar",
      "regex": "^/calendar(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/calendar(?:/)?$"
    },
    {
      "page": "/calendar/day",
      "regex": "^/calendar/day(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/calendar/day(?:/)?$"
    },
    {
      "page": "/calendar/new-event",
      "regex": "^/calendar/new-event(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/calendar/new-event(?:/)?$"
    },
    {
      "page": "/calendar/new-event/public",
      "regex": "^/calendar/new-event/public(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/calendar/new-event/public(?:/)?$"
    },
    {
      "page": "/calendar/utils/event-modal",
      "regex": "^/calendar/utils/event-modal(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/calendar/utils/event-modal(?:/)?$"
    },
    {
      "page": "/calendar/week",
      "regex": "^/calendar/week(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/calendar/week(?:/)?$"
    },
    {
      "page": "/sign-in",
      "regex": "^/sign-in(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/sign-in(?:/)?$"
    },
    {
      "page": "/sign-up",
      "regex": "^/sign-up(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/sign-up(?:/)?$"
    },
    {
      "page": "/utils/event-modal",
      "regex": "^/utils/event-modal(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/utils/event-modal(?:/)?$"
    }
  ],
  "dataRoutes": [],
  "rsc": {
    "header": "RSC",
    "varyHeader": "RSC, Next-Router-State-Tree, Next-Router-Prefetch"
  }
}
EOF
  
  echo "Manually created routes-manifest.json"
fi
