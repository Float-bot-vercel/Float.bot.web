import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// This script is designed for Vercel's static build process
// It creates a minimal static site for the client portion only

console.log('🔨 Starting Vercel static build process...');

try {
  // Ensure the dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }
  
  if (!fs.existsSync('dist/public')) {
    fs.mkdirSync('dist/public');
  }

  // Run client-only build (avoiding server build)
  console.log('📦 Building client assets...');
  execSync('cd client && npx vite build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      VITE_API_BASE_URL: '/api', // Set API base URL for production
    }
  });

  console.log('✅ Vercel static build completed successfully!');
} catch (error) {
  console.error('❌ Vercel static build failed:', error);
  process.exit(1);
}