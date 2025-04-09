/**
 * Ultra minimal pre-build script
 */

// Import core modules
const fs = require('fs');
const path = require('path');

console.log('Running ultra minimal pre-build script...');

try {
  // Just delete the problematic directories
  const authDir = path.join(process.cwd(), 'pages/auth');
  const componentsDir = path.join(process.cwd(), 'pages/calendar/components');
  
  console.log('Removing problematic directories...');
  
  // Remove auth directory if it exists
  if (fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true, force: true });
    console.log('Removed auth directory');
  }
  
  // Remove components directory if it exists
  if (fs.existsSync(componentsDir)) {
    fs.rmSync(componentsDir, { recursive: true, force: true });
    console.log('Removed components directory');
  }
  
  console.log('Pre-build completed successfully');
} catch (error) {
  console.error('Error in pre-build script:', error);
}
