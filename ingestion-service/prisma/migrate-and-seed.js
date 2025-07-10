const { execSync } = require('child_process');
const fs = require('fs');

console.log('Running Prisma migrations and seeding...');

try {
  // Install prisma CLI
  console.log('Installing Prisma CLI...');
  execSync('npm install prisma --no-save', { stdio: 'inherit' });
  
  // Deploy migrations to the database
  console.log('Deploying migrations to the database...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('Database migrations and client generation completed successfully!');
} catch (error) {
  console.error('Error during database setup:', error);
  // Don't fail the build if migrations fail
  console.log('Continuing with build despite migration errors...');
}
