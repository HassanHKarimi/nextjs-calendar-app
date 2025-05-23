#!/bin/bash

# Enhanced static build script for Next.js Calendar App
# This script builds the app and prepares it for static hosting without requiring NODE_OPTIONS

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Next.js Calendar App Static Build ===${NC}"
echo "Starting build process..."

# Clean previous build files
echo -e "${YELLOW}Cleaning previous build files...${NC}"
rm -rf .next dist out
if [ $? -ne 0 ]; then
  echo -e "${RED}Error cleaning directories${NC}"
  exit 1
fi

# Ensure NODE_OPTIONS is unset to avoid --legacy-peer-deps error
echo -e "${YELLOW}Unsetting NODE_OPTIONS...${NC}"
unset NODE_OPTIONS

# Build Next.js app
echo -e "${YELLOW}Building Next.js app...${NC}"
env -i PATH=$PATH npx next build
if [ $? -ne 0 ]; then
  echo -e "${RED}Next.js build failed${NC}"
  exit 1
fi

# Create output directory if it doesn't exist
echo -e "${YELLOW}Creating output directory...${NC}"
mkdir -p out

# Run the export fix script
echo -e "${YELLOW}Running export fix script...${NC}"
node next-export-fix.js
if [ $? -ne 0 ]; then
  echo -e "${RED}Export fix failed${NC}"
  exit 1
fi

# Create required HTML files for SPA
echo -e "${YELLOW}Creating additional SPA files...${NC}"

# Create calendar directory if it doesn't exist
mkdir -p out/calendar
if [ ! -f out/calendar/index.html ] && [ -f out/index.html ]; then
  cp out/index.html out/calendar/index.html
  echo "Created calendar/index.html"
fi

# Create 404 page if not exists
if [ ! -f out/404.html ] && [ -f out/index.html ]; then
  cp out/index.html out/404.html
  echo "Created 404.html"
fi

# Create error page if not exists
if [ ! -f out/error.html ] && [ -f out/index.html ]; then
  cp out/index.html out/error.html
  echo "Created error.html"
fi

echo -e "${GREEN}Build completed successfully!${NC}"
echo -e "You can now run ${YELLOW}npm run serve:static${NC} to test the static build"
echo -e "Or deploy the ${YELLOW}out${NC} directory to any static hosting service"

exit 0 