#!/usr/bin/env node

/**
 * Render Deployment Test Script
 * This script tests the critical components needed for Render deployment
 */

const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

console.log('🔍 Testing Render Deployment Configuration...\n');

// Test 1: Environment Variables
console.log('📋 Environment Variables Check:');
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'GMAIL_USER',
  'GMAIL_APP_PASSWORD',
  'PORT'
];

let allEnvVarsPresent = true;
requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`  ✅ ${envVar}: Present`);
  } else {
    console.log(`  ❌ ${envVar}: Missing`);
    allEnvVarsPresent = false;
  }
});

console.log('');

// Test 2: Port Configuration
console.log('🔌 Port Configuration:');
const port = process.env.PORT || 3001;
console.log(`  📌 Using port: ${port}`);
console.log(`  📌 Process env PORT: ${process.env.PORT || 'Not set'}`);
console.log('');

// Test 3: MongoDB URI
console.log('🔗 MongoDB Connection String:');
if (process.env.MONGODB_URI) {
  // Mask the password for security
  const maskedUri = process.env.MONGODB_URI.replace(/\/\/(.*?):(.*?)@/, '//*****:*****@');
  console.log(`  🔐 ${maskedUri}`);
  
  // Check if it's a valid MongoDB URI
  if (process.env.MONGODB_URI.startsWith('mongodb://') || process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
    console.log('  ✅ Valid MongoDB URI format');
  } else {
    console.log('  ❌ Invalid MongoDB URI format');
  }
} else {
  console.log('  ❌ MONGODB_URI not set');
}
console.log('');

// Test 4: Node Environment
console.log('⚙️  Node Environment:');
console.log(`  🌍 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`  🚀 Expected for Render: production`);
console.log('');

// Summary
console.log('📊 Summary:');
if (allEnvVarsPresent) {
  console.log('  ✅ All required environment variables are present');
} else {
  console.log('  ❌ Some required environment variables are missing');
}

if (process.env.NODE_ENV === 'production') {
  console.log('  ✅ NODE_ENV is correctly set to production');
} else {
  console.log('  ⚠️  NODE_ENV is not set to production (recommended for Render)');
}

console.log('\n💡 Recommendations:');
console.log('  1. Make sure all environment variables are set in Render dashboard');
console.log('  2. Verify MongoDB Atlas IP whitelist includes Render IPs');
console.log('  3. Check that your Gmail App Password is correct');
console.log('  4. Ensure PORT is being used correctly in server.js');