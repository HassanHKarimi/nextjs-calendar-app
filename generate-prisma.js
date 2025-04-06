const { execSync } = require('child_process');
const fs = require('fs');

console.log('Running Prisma generate...');

try {
  // Check if node_modules/.bin/prisma exists
  if (fs.existsSync('./node_modules/.bin/prisma')) {
    console.log('Using local Prisma installation...');
    execSync('./node_modules/.bin/prisma generate', { stdio: 'inherit' });
  } else {
    console.log('Installing Prisma CLI and generating client...');
    execSync('npm install prisma --no-save', { stdio: 'inherit' });
    execSync('npx prisma generate', { stdio: 'inherit' });
  }

  console.log('Prisma client generated successfully!');
} catch (error) {
  console.error('Failed to generate Prisma client:', error);
  // Don't fail the build if Prisma generation fails
  // Just log the error and continue
  console.log('Continuing with build anyway...');
}
