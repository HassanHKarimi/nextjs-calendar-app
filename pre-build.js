/**
 * Minimal pre-build script to handle App Router vs Pages Router conflicts
 */

const fs = require('fs');
const path = require('path');

console.log('Running minimalist pre-build script...');

// Move problematic files from pages to a temporary location
console.log('Moving non-page files...');

// Get reference to auth-context.js
const authContextPath = path.join(__dirname, 'pages/auth/auth-context.js');
const authContextBackupPath = path.join(__dirname, '.build-tmp-auth-context.js');

// Get reference to event-modal.tsx
const eventModalPath = path.join(__dirname, 'pages/calendar/components/event-modal.tsx');
const eventModalBackupPath = path.join(__dirname, '.build-tmp-event-modal.tsx');

// Create a shared components directory
const sharedDir = path.join(__dirname, 'shared-components');
if (\!fs.existsSync(sharedDir)) {
  fs.mkdirSync(sharedDir);
  console.log('Created shared components directory');
}

// Move auth-context.js if it exists
if (fs.existsSync(authContextPath)) {
  console.log('Moving auth-context.js to temporary location');
  
  // Read the file content
  const content = fs.readFileSync(authContextPath, 'utf8');
  
  // Write it to the backup location
  fs.writeFileSync(authContextBackupPath, content);
  
  // Remove the original directory
  fs.unlinkSync(authContextPath);
  fs.rmdirSync(path.dirname(authContextPath));
  
  console.log('Auth context moved successfully');
}

// Move event-modal.tsx if it exists
if (fs.existsSync(eventModalPath)) {
  console.log('Moving event-modal.tsx to temporary location');
  
  // Read the file content
  const content = fs.readFileSync(eventModalPath, 'utf8');
  
  // Write it to the backup location and to shared components
  fs.writeFileSync(eventModalBackupPath, content);
  fs.writeFileSync(path.join(sharedDir, 'event-modal.tsx'), content);
  
  // Remove the original directory
  fs.unlinkSync(eventModalPath);
  fs.rmdirSync(path.dirname(eventModalPath));
  fs.rmdirSync(path.dirname(path.dirname(eventModalPath)));
  
  console.log('Event modal moved successfully');
  
  // Update import paths in calendar files
  const calendarFiles = [
    {
      path: path.join(__dirname, 'pages/calendar/index.tsx'),
      oldImport: './components/event-modal',
      newImport: '../shared-components/event-modal'
    },
    {
      path: path.join(__dirname, 'pages/calendar/day/index.tsx'),
      oldImport: '../components/event-modal',
      newImport: '../../shared-components/event-modal'
    },
    {
      path: path.join(__dirname, 'pages/calendar/week/index.tsx'),
      oldImport: '../components/event-modal',
      newImport: '../../shared-components/event-modal'
    }
  ];
  
  // Update each file's imports
  calendarFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      console.log('Updating import in: ' + file.path);
      
      let content = fs.readFileSync(file.path, 'utf8');
      content = content.replace(
        new RegExp('import { EventModal } from [\'"]' + file.oldImport + '[\'"]', 'g'),
        'import { EventModal } from "' + file.newImport + '"'
      );
      
      fs.writeFileSync(file.path, content);
    }
  });
}

// Move App Router files
const appRouterDir = path.join(__dirname, 'src/app');
if (fs.existsSync(appRouterDir)) {
  console.log('Moving App Router files...');
  
  // Create a backup directory
  const backupDir = path.join(__dirname, '.app-router-backup');
  if (\!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }
  
  // Simple list of app routes to move
  const appRoutes = [
    'api/auth/[...nextauth]/route.ts',
    'api/register/route.ts',
    'calendar/day/page.tsx',
    'calendar/new-event/page.tsx',
    'calendar/page.tsx',
    'calendar/week/page.tsx',
    'page.tsx',
    'sign-in/page.tsx',
    'sign-up/page.tsx'
  ];
  
  appRoutes.forEach(route => {
    const sourcePath = path.join(__dirname, 'src/app', route);
    if (fs.existsSync(sourcePath)) {
      const targetDir = path.join(backupDir, path.dirname(route));
      
      if (\!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      const targetPath = path.join(backupDir, route);
      
      // Read source file and write to target
      const content = fs.readFileSync(sourcePath, 'utf8');
      fs.writeFileSync(targetPath, content);
      fs.unlinkSync(sourcePath);
      
      console.log('Moved: ' + route);
    }
  });
}

// Create a post-build script
const postBuildScript = `
const fs = require('fs');
const path = require('path');

console.log('Running post-build script...');

// Restore App Router files
const appBackupDir = path.join(__dirname, '.app-router-backup');
if (fs.existsSync(appBackupDir)) {
  console.log('Restoring App Router files...');
  
  const restoreFile = (filePath) => {
    const relativePath = path.relative(appBackupDir, filePath);
    const targetPath = path.join(__dirname, 'src/app', relativePath);
    
    // Create target directory if it doesn't exist
    const targetDir = path.dirname(targetPath);
    if (\!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Restore the file
    fs.writeFileSync(targetPath, fs.readFileSync(filePath, 'utf8'));
    console.log('Restored: ' + relativePath);
  };
  
  const readDir = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        readDir(fullPath);
      } else {
        restoreFile(fullPath);
      }
    });
  };
  
  readDir(appBackupDir);
  
  // Remove backup directory
  fs.rmSync(appBackupDir, { recursive: true });
}

// Restore auth-context.js
const authContextBackupPath = path.join(__dirname, '.build-tmp-auth-context.js');
if (fs.existsSync(authContextBackupPath)) {
  console.log('Restoring auth-context.js...');
  
  const targetPath = path.join(__dirname, 'pages/auth/auth-context.js');
  const targetDir = path.dirname(targetPath);
  
  if (\!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  fs.writeFileSync(targetPath, fs.readFileSync(authContextBackupPath, 'utf8'));
  fs.unlinkSync(authContextBackupPath);
}

// Restore event-modal.tsx
const eventModalBackupPath = path.join(__dirname, '.build-tmp-event-modal.tsx');
if (fs.existsSync(eventModalBackupPath)) {
  console.log('Restoring event-modal.tsx...');
  
  const targetPath = path.join(__dirname, 'pages/calendar/components/event-modal.tsx');
  const targetDir = path.dirname(targetPath);
  
  if (\!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  fs.writeFileSync(targetPath, fs.readFileSync(eventModalBackupPath, 'utf8'));
  fs.unlinkSync(eventModalBackupPath);
  
  // Update import paths in calendar files
  const calendarFiles = [
    {
      path: path.join(__dirname, 'pages/calendar/index.tsx'),
      oldImport: '../shared-components/event-modal',
      newImport: './components/event-modal'
    },
    {
      path: path.join(__dirname, 'pages/calendar/day/index.tsx'),
      oldImport: '../../shared-components/event-modal',
      newImport: '../components/event-modal'
    },
    {
      path: path.join(__dirname, 'pages/calendar/week/index.tsx'),
      oldImport: '../../shared-components/event-modal',
      newImport: '../components/event-modal'
    }
  ];
  
  // Update each file's imports
  calendarFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      console.log('Updating import in: ' + file.path);
      
      let content = fs.readFileSync(file.path, 'utf8');
      content = content.replace(
        new RegExp('import { EventModal } from [\'"]' + file.oldImport + '[\'"]', 'g'),
        'import { EventModal } from "' + file.newImport + '"'
      );
      
      fs.writeFileSync(file.path, content);
    }
  });
  
  // Remove shared components directory
  const sharedDir = path.join(__dirname, 'shared-components');
  if (fs.existsSync(sharedDir)) {
    fs.rmSync(sharedDir, { recursive: true });
  }
}

console.log('Post-build script completed successfully.');
`;

fs.writeFileSync(path.join(__dirname, 'post-build.js'), postBuildScript);
console.log('Created post-build script');

console.log('Pre-build script completed successfully.');
