/**
 * This script fixes Next.js export output to handle routes better for static serving.
 * 
 * Run this script after `next build` to prepare files for static serving:
 * node next-export-fix.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const OUT_DIR = path.join(__dirname, 'out');
const DIST_DIR = path.join(__dirname, 'dist');

// Ensure the out directory exists
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Function to recursively copy static files
function copyStaticFiles(source, destination) {
  // Create the destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Read all items in the source directory
  const items = fs.readdirSync(source);

  // Copy each item recursively
  for (const item of items) {
    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);

    // Get item stats
    const stats = fs.statSync(sourcePath);

    if (stats.isDirectory()) {
      // If it's a directory, copy it recursively
      copyStaticFiles(sourcePath, destPath);
    } else {
      // If it's a file, copy it
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting Next.js export fix...');

    // 1. Copy static assets from dist/static to out directory
    if (fs.existsSync(path.join(DIST_DIR, 'static'))) {
      console.log('📦 Copying static assets...');
      copyStaticFiles(path.join(DIST_DIR, 'static'), path.join(OUT_DIR, '_next/static'));
    }

    // 2. Copy public directory to out
    if (fs.existsSync(path.join(__dirname, 'public'))) {
      console.log('📦 Copying public assets...');
      copyStaticFiles(path.join(__dirname, 'public'), OUT_DIR);
    }

    // 3. Fix calendar path - ensure HTML files exist for the /calendar route
    const calendarDir = path.join(OUT_DIR, 'calendar');
    if (!fs.existsSync(calendarDir)) {
      fs.mkdirSync(calendarDir, { recursive: true });
    }

    // Copy index.html to calendar/index.html if it doesn't exist
    const calendarIndexPath = path.join(calendarDir, 'index.html');
    if (!fs.existsSync(calendarIndexPath) && fs.existsSync(path.join(OUT_DIR, 'index.html'))) {
      console.log('📝 Creating calendar/index.html...');
      fs.copyFileSync(path.join(OUT_DIR, 'index.html'), calendarIndexPath);
    }

    // 4. Add error pages
    // Copy 404.html to out directory if it doesn't exist
    if (!fs.existsSync(path.join(OUT_DIR, '404.html')) && fs.existsSync(path.join(OUT_DIR, 'index.html'))) {
      console.log('📝 Creating 404.html...');
      fs.copyFileSync(path.join(OUT_DIR, 'index.html'), path.join(OUT_DIR, '404.html'));
    }

    // Create an error.html page if it doesn't exist
    if (!fs.existsSync(path.join(OUT_DIR, 'error.html')) && fs.existsSync(path.join(OUT_DIR, 'index.html'))) {
      console.log('📝 Creating error.html...');
      fs.copyFileSync(path.join(OUT_DIR, 'index.html'), path.join(OUT_DIR, 'error.html'));
    }

    console.log('✅ Next.js export fix completed successfully!');
  } catch (error) {
    console.error('❌ Error fixing Next.js export:', error);
    process.exit(1);
  }
}

// Run the main function
main(); 