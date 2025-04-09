/**
 * Pre-build script to handle App Router vs Pages Router conflicts
 * 
 * This script decides which router implementation to use by temporarily
 * moving the conflicting files to a backup directory.
 * 
 * For this deployment, we'll prioritize the Pages Router implementation
 * since it's fully working with the demo auth system.
 */

const fs = require('fs');
const path = require('path');

console.log('Running pre-build script to resolve router conflicts...');

// Create a temporary directory for App Router files
const backupDir = path.join(__dirname, '.app-router-backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(`Created backup directory: ${backupDir}`);
}

// List of conflicting paths to temporarily move (App Router files)
const conflictingPaths = [
  'app/api/auth/[...nextauth]/route.ts',
  'app/api/register/route.ts',
  'app/calendar/day/page.tsx',
  'app/calendar/new-event/page.tsx',
  'app/calendar/page.tsx',
  'app/calendar/week/page.tsx',
  'app/page.tsx',
  'app/sign-in/page.tsx',
  'app/sign-up/page.tsx',
];

// Move each App Router file to backup
conflictingPaths.forEach(filePath => {
  const fullPath = path.join(__dirname, 'src', filePath);
  
  if (fs.existsSync(fullPath)) {
    // Create the target directory structure
    const fileName = path.basename(filePath);
    const dirPath = path.dirname(filePath);
    const targetDir = path.join(backupDir, dirPath);
    
    fs.mkdirSync(targetDir, { recursive: true });
    
    // Move the file
    const targetPath = path.join(backupDir, dirPath, fileName);
    fs.renameSync(fullPath, targetPath);
    
    console.log(`Moved: ${fullPath} -> ${targetPath}`);
  } else {
    console.log(`File not found, skipping: ${fullPath}`);
  }
});

// Create a restore script that can be run after build
const restoreScript = `
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Restoring App Router files from backup...');

const backupDir = path.join(__dirname, '.app-router-backup');
if (!fs.existsSync(backupDir)) {
  console.log('Backup directory not found, nothing to restore.');
  process.exit(0);
}

// Walk through the backup directory and restore all files
function restoreFiles(dir, baseDir = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(dir, entry.name);
    const relativePath = path.join(baseDir, entry.name);
    const targetPath = path.join(__dirname, 'src', relativePath);
    
    if (entry.isDirectory()) {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }
      restoreFiles(sourcePath, relativePath);
    } else {
      // Create the target directory if it doesn't exist
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Move the file back
      fs.renameSync(sourcePath, targetPath);
      console.log(\`Restored: \${sourcePath} -> \${targetPath}\`);
    }
  }
}

restoreFiles(backupDir);

// Remove the backup directory
fs.rmSync(backupDir, { recursive: true, force: true });
console.log('App Router files restored successfully.');
`;

fs.writeFileSync(path.join(__dirname, 'post-build.js'), restoreScript);
console.log('Created post-build restore script.');

console.log('Pre-build script completed successfully.');