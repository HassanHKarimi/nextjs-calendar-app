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

// Now let's handle non-page files in the pages directory
// These are files that don't export a default React component
console.log('Handling non-page files in the pages directory...');

// Create temp directory for non-page files
const tmpDir = path.join(__dirname, '.build-tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
  console.log(`Created temporary directory: ${tmpDir}`);
}

// Helper function to handle all types of files in problematic directories
function handleNonPageDirectory(dirPath, backupDirPrefix) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory not found, skipping: ${dirPath}`);
    return;
  }
  
  console.log(`Handling files in directory: ${dirPath}`);
  
  try {
    const dirBackupPath = path.join(tmpDir, backupDirPrefix);
    if (!fs.existsSync(dirBackupPath)) {
      fs.mkdirSync(dirBackupPath, { recursive: true });
    }
    
    // Get all files in the directory
    const files = fs.readdirSync(dirPath);
    
    // Process each file
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const fileStats = fs.statSync(filePath);
      
      // If it's a directory, recursively handle it
      if (fileStats.isDirectory()) {
        handleNonPageDirectory(
          filePath, 
          path.join(backupDirPrefix, file)
        );
        return;
      }
      
      // It's a file, move it to backup
      const destPath = path.join(dirBackupPath, file);
      console.log(`Moving file: ${filePath} -> ${destPath}`);
      fs.renameSync(filePath, destPath);
    });
    
    // Remove the now-empty directory
    fs.rmdirSync(dirPath);
    console.log(`Removed directory: ${dirPath}`);
  } catch (error) {
    console.error(`Error handling directory ${dirPath}: ${error.message}`);
  }
}

// Handle non-page directories completely
const problemDirectories = [
  {
    path: path.join(__dirname, 'pages/auth'),
    backupPrefix: 'auth'
  },
  {
    path: path.join(__dirname, 'pages/calendar/components'),
    backupPrefix: 'calendar-components'
  }
];

problemDirectories.forEach(dir => {
  handleNonPageDirectory(dir.path, dir.backupPrefix);
});

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

console.log('Restoring files after build...');

// 1. Restore App Router files
const backupDir = path.join(__dirname, '.app-router-backup');
if (fs.existsSync(backupDir)) {
  console.log('Restoring App Router files from backup...');
  
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
} else {
  console.log('App Router backup directory not found, skipping restoration.');
}

// 2. Restore non-page files
const tmpDir = path.join(__dirname, '.build-tmp');
if (fs.existsSync(tmpDir)) {
  console.log('Restoring non-page files...');
  
  // Helper function to restore directory structure
  function restoreDirectoryFromBackup(backupDirPath, originalPathPrefix) {
    if (!fs.existsSync(backupDirPath)) {
      console.log(\`Backup directory not found, skipping: \${backupDirPath}\`);
      return;
    }
    
    console.log(\`Restoring directory: \${backupDirPath} -> \${originalPathPrefix}\`);
    
    try {
      // Create the original directory if it doesn't exist
      if (!fs.existsSync(originalPathPrefix)) {
        fs.mkdirSync(originalPathPrefix, { recursive: true });
        console.log(\`Created original directory: \${originalPathPrefix}\`);
      }
      
      // Get all files and directories in the backup
      const entries = fs.readdirSync(backupDirPath, { withFileTypes: true });
      
      // Process each entry
      entries.forEach(entry => {
        const sourcePath = path.join(backupDirPath, entry.name);
        const destPath = path.join(originalPathPrefix, entry.name);
        
        if (entry.isDirectory()) {
          // Recursively restore subdirectory
          restoreDirectoryFromBackup(sourcePath, destPath);
        } else {
          // Restore file
          console.log(\`Restoring file: \${sourcePath} -> \${destPath}\`);
          fs.renameSync(sourcePath, destPath);
        }
      });
    } catch (error) {
      console.error(\`Error restoring directory \${backupDirPath}: \${error.message}\`);
    }
  }
  
  // Directories to restore
  const directoriesToRestore = [
    {
      backupPath: path.join(tmpDir, 'auth'),
      originalPath: path.join(__dirname, 'pages/auth')
    },
    {
      backupPath: path.join(tmpDir, 'calendar-components'),
      originalPath: path.join(__dirname, 'pages/calendar/components')
    }
  ];
  
  // Restore each directory
  directoriesToRestore.forEach(({ backupPath, originalPath }) => {
    restoreDirectoryFromBackup(backupPath, originalPath);
  });
  
  // Remove the temporary directory
  fs.rmSync(tmpDir, { recursive: true, force: true });
  console.log('Non-page files restored successfully.');
} else {
  console.log('Temporary directory not found, skipping non-page file restoration.');
}

console.log('All files have been restored successfully.');
`;

fs.writeFileSync(path.join(__dirname, 'post-build.js'), restoreScript);
console.log('Created post-build restore script.');

console.log('Pre-build script completed successfully.');