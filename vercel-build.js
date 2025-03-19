#!/usr/bin/env node

// This script is used by Vercel to build only the client-side code
// It essentially runs the equivalent of "vite build" without server compilation

import { execSync } from 'child_process';

console.log('Building client-side only for Vercel deployment...');

try {
  // Run the Vite build command to generate the client-side assets
  execSync('npx vite build', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Client-side build successful');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}