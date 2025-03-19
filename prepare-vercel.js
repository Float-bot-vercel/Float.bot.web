/**
 * This script prepares the project for Vercel deployment
 * by copying the necessary static files to the deployment folder
 */

const fs = require('fs');
const path = require('path');

// Function to recursively copy a directory
function copyDirectory(source, destination) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Get all files in the source directory
  const files = fs.readdirSync(source);

  // Copy each file or subdirectory
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);

    // Get file stats
    const stats = fs.statSync(sourcePath);

    if (stats.isFile()) {
      // Copy the file
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${sourcePath} -> ${destPath}`);
    } else if (stats.isDirectory()) {
      // Recursively copy the directory
      copyDirectory(sourcePath, destPath);
    }
  }
}

// Main function to prepare files for Vercel
function prepareForVercel() {
  console.log('Preparing files for Vercel deployment...');

  // Define source and destination directories
  const publicDir = path.join(__dirname, 'public');
  const vercelDir = path.join(__dirname, '.vercel_build_output', 'static');

  // Create Vercel output directory if it doesn't exist
  if (!fs.existsSync(vercelDir)) {
    fs.mkdirSync(vercelDir, { recursive: true });
  }

  // Copy public directory to Vercel output
  copyDirectory(publicDir, vercelDir);

  console.log('Preparation complete! Files are ready for Vercel deployment.');
}

// Run the preparation function
prepareForVercel();