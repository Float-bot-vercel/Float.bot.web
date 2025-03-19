// This is a simplified build script for Vercel
// It creates a handler that serves static files from the public directory

const path = require('path');
const fs = require('fs').promises;

// This function will be called by Vercel when deploying the site
module.exports = async (req, res) => {
  // Define the path to our public directory
  const publicDir = path.join(__dirname, 'public');
  
  try {
    // Get the requested path from the URL
    let filePath = req.url;
    
    // Default to index.html if the root path is requested
    if (filePath === '/' || filePath === '') {
      filePath = '/index.html';
    }
    
    // Combine the public directory with the requested file path
    const fullPath = path.join(publicDir, filePath);
    
    // Try to read the file
    const fileContent = await fs.readFile(fullPath);
    
    // Set appropriate content type based on file extension
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = getContentType(ext);
    
    // Send the file with the correct content type
    res.setHeader('Content-Type', contentType);
    res.status(200).send(fileContent);
  } catch (error) {
    // If the file doesn't exist, return 404
    if (error.code === 'ENOENT') {
      try {
        // Try to serve index.html as a fallback
        const indexContent = await fs.readFile(path.join(publicDir, 'index.html'));
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(indexContent);
      } catch (indexError) {
        // If even index.html doesn't exist, return a simple 404
        res.status(404).send('Not Found');
      }
    } else {
      // For other errors, return 500
      console.error('Error serving file:', error);
      res.status(500).send('Internal Server Error');
    }
  }
};

// Helper function to determine content type
function getContentType(ext) {
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  };
  
  return contentTypes[ext] || 'text/plain';
}