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
        console.log(`Restored: ${sourcePath} -> ${targetPath}`);
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
      console.log(`Backup directory not found, skipping: ${backupDirPath}`);
      return;
    }
    
    console.log(`Restoring directory: ${backupDirPath} -> ${originalPathPrefix}`);
    
    try {
      // Create the original directory if it doesn't exist
      if (!fs.existsSync(originalPathPrefix)) {
        fs.mkdirSync(originalPathPrefix, { recursive: true });
        console.log(`Created original directory: ${originalPathPrefix}`);
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
          console.log(`Restoring file: ${sourcePath} -> ${destPath}`);
          fs.renameSync(sourcePath, destPath);
        }
      });
    } catch (error) {
      console.error(`Error restoring directory ${backupDirPath}: ${error.message}`);
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
