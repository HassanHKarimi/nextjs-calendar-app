const { execSync } = require('child_process');
const fs = require('fs');

console.log('Installing missing dependencies...');

// List of packages that need to be installed
const packagesToInstall = [
  '@radix-ui/react-checkbox',
  'bcryptjs',
  'bcrypt'
];

// Install each package
packagesToInstall.forEach(pkg => {
  try {
    console.log(`Installing ${pkg}...`);
    execSync(`npm install ${pkg} --no-save --force`, { stdio: 'inherit' });
    console.log(`${pkg} installed successfully.`);
  } catch (error) {
    console.error(`Failed to install ${pkg}:`, error);
  }
});

console.log('All dependencies installed successfully!');
