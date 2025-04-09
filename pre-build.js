/**
 * Ultra minimal pre-build script
 */

// Import core modules
const fs = require('fs');
const path = require('path');

console.log('Running complete pre-build script...');

try {
  // Step 1: Delete problematic directories
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
  
  // Step 2: Temporarily remove App Router files
  console.log('Removing App Router conflicts...');
  
  const conflictingPaths = [
    'src/app/api/auth/[...nextauth]/route.ts',
    'src/app/api/register/route.ts',
    'src/app/calendar/day/page.tsx',
    'src/app/calendar/new-event/page.tsx',
    'src/app/calendar/page.tsx',
    'src/app/calendar/week/page.tsx',
    'src/app/page.tsx',
    'src/app/sign-in/page.tsx',
    'src/app/sign-up/page.tsx'
  ];
  
  // Create a backup directory for App Router files
  const backupDir = path.join(process.cwd(), '.app-router-backup');
  if (\!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Process each conflicting path
  conflictingPaths.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (fs.existsSync(fullPath)) {
      // Create backup path
      const relativePath = filePath.replace('src/', '');
      const backupPath = path.join(backupDir, relativePath);
      
      // Create backup directory structure
      const backupFileDir = path.dirname(backupPath);
      if (\!fs.existsSync(backupFileDir)) {
        fs.mkdirSync(backupFileDir, { recursive: true });
      }
      
      // Copy file content
      fs.copyFileSync(fullPath, backupPath);
      
      // Delete original file
      fs.unlinkSync(fullPath);
      console.log(`Moved: ${filePath}`);
    }
  });
  
  console.log('Pre-build completed successfully');
} catch (error) {
  console.error('Error in pre-build script:', error);
}
