#!/usr/bin/env node

/**
 * This script prepares the project for Vercel deployment
 * by copying the necessary static files to the deployment folder
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 Preparing for Vercel deployment...');

// Create the public directory if it doesn't exist
if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

// Copy the vercel.html file to index.html in the public directory
fs.copyFileSync('vercel.html', 'public/index.html');

// Update vercel.json to use the public directory
const vercelConfig = {
  "version": 2,
  "cleanUrls": true,
  "trailingSlash": false
};

fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));

console.log('✅ Vercel deployment preparation complete!');
console.log('Please run `vercel --prod` to deploy your project to Vercel.');