const { execSync } = require('child_process');
const fs = require('fs');

// List of packages that need to be installed
const packagesToInstall = [
  '@radix-ui/react-checkbox',
  'bcryptjs',
  'bcrypt'
];

// Install each package
packagesToInstall.forEach(pkg => {
  try {
    execSync(`npm install ${pkg} --no-save --force`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to install ${pkg}:`, error);
  }
});
