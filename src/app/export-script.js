// This script is to be run before a build to create a dummy file
// that will avoid static generation errors for protected pages
const fs = require('fs');
const path = require('path');

// Create a blank page that can be used as a placeholder during export
const blankPageContent = `
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This is a dummy page that redirects to the login page
export default function BlankPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to home on client-side
    router.push('/');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  );
}
`;

// List of pages that cause prerendering errors
const problematicPages = [
  'src/app/calendar/page.tsx',
  'src/app/calendar/day/page.tsx',
  'src/app/calendar/week/page.tsx',
  'src/app/calendar/new-event/page.tsx',
  'src/app/calendar/event/[eventId]/page.tsx',
  'src/app/calendar/event/[eventId]/edit/page.tsx',
];

// Back up and replace each problematic page
problematicPages.forEach(pagePath => {
  try {
    const fullPath = path.resolve(process.cwd(), pagePath);
    
    // Only proceed if the file exists
    if (fs.existsSync(fullPath)) {
      // Create backup file
      const backupPath = `${fullPath}.bak`;
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(fullPath, backupPath);
        console.log(`Backed up ${pagePath} to ${pagePath}.bak`);
      }
      
      // Replace with blank page content
      fs.writeFileSync(fullPath, blankPageContent);
      console.log(`Replaced ${pagePath} with blank page`);
    }
  } catch (error) {
    console.error(`Error processing ${pagePath}:`, error);
  }
});

console.log('Finished preparing files for static export');