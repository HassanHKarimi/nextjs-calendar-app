// This script restores the original pages after the build is complete
const fs = require('fs');
const path = require('path');

// List of pages that were backed up
const problematicPages = [
  'src/app/calendar/page.tsx',
  'src/app/calendar/day/page.tsx',
  'src/app/calendar/week/page.tsx',
  'src/app/calendar/new-event/page.tsx',
  'src/app/calendar/event/[eventId]/page.tsx',
  'src/app/calendar/event/[eventId]/edit/page.tsx',
];

// Restore each page from its backup
problematicPages.forEach(pagePath => {
  try {
    const fullPath = path.resolve(process.cwd(), pagePath);
    const backupPath = `${fullPath}.bak`;
    
    // Only proceed if the backup exists
    if (fs.existsSync(backupPath)) {
      // Restore from backup
      fs.copyFileSync(backupPath, fullPath);
      console.log(`Restored ${pagePath} from backup`);
      
      // Delete backup
      fs.unlinkSync(backupPath);
      console.log(`Deleted backup file ${backupPath}`);
    }
  } catch (error) {
    console.error(`Error restoring ${pagePath}:`, error);
  }
});

console.log('Finished restoring files from backup');