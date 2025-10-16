#!/usr/bin/env node

/**
 * Vercel Deployment Test Script
 * This script verifies the frontend can be built for Vercel deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Vercel Deployment Test\n');

// Test 1: Check if required files exist
console.log('📋 Checking required files...');

const requiredFiles = [
  'package.json',
  'vite.config.ts',
  'vercel.json',
  'src/main.tsx',
  'src/App.tsx'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} (MISSING)`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Missing required files for deployment');
  process.exit(1);
}

// Test 2: Check build command
console.log('\n🔨 Testing build command...');
try {
  console.log('  Executing: npm run build');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('  ✅ Build completed successfully');
} catch (error) {
  console.log('  ❌ Build failed');
  console.log(`  Error: ${error.message}`);
  process.exit(1);
}

// Test 3: Check build output
console.log('\n📂 Checking build output...');
const buildDir = path.join(__dirname, 'build');
if (fs.existsSync(buildDir)) {
  const files = fs.readdirSync(buildDir);
  console.log(`  ✅ Build directory exists with ${files.length} items`);
  
  if (files.includes('index.html')) {
    console.log('  ✅ index.html found');
  } else {
    console.log('  ❌ index.html missing');
  }
} else {
  console.log('  ❌ Build directory not found');
  process.exit(1);
}

// Test 4: Check Vercel configuration
console.log('\n⚙️  Checking Vercel configuration...');
const vercelConfigPath = path.join(__dirname, 'vercel.json');
if (fs.existsSync(vercelConfigPath)) {
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
    console.log('  ✅ vercel.json found and valid JSON');
    
    if (vercelConfig.buildCommand) {
      console.log(`  ✅ Build command: ${vercelConfig.buildCommand}`);
    }
    
    if (vercelConfig.outputDirectory) {
      console.log(`  ✅ Output directory: ${vercelConfig.outputDirectory}`);
    }
  } catch (error) {
    console.log('  ❌ vercel.json is not valid JSON');
    process.exit(1);
  }
} else {
  console.log('  ❌ vercel.json not found');
  process.exit(1);
}

console.log('\n✅ Vercel deployment verification passed!');
console.log('\n📝 Next steps for deployment:');
console.log('  1. Push your code to a Git repository');
console.log('  2. Go to https://vercel.com/dashboard');
console.log('  3. Create a new project and import your repository');
console.log('  4. Configure the project settings:');
console.log('     - Build Command: npm run build');
console.log('     - Output Directory: build');
console.log('  5. Add environment variables in Vercel dashboard');
console.log('  6. Deploy!');

console.log('\n📚 Refer to VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions');