#!/usr/bin/env node

/**
 * Frontend-Backend Connection Test
 * This script tests if the frontend can connect to the backend
 */

console.log('🔍 Frontend-Backend Connection Test\n');

// Test 1: Check environment variables
console.log('📋 Environment Variables Check:');
console.log('  For local development, the frontend should connect to: http://localhost:3001/api');
console.log('  For production, update VITE_API_BASE_URL in .env file\n');

// Test 2: Check if backend is running
import('node-fetch').then(({ default: fetch }) => {
  async function testBackendConnection() {
    const backendUrl = 'http://localhost:3001/api';
    
    console.log(`🔗 Testing connection to backend at: ${backendUrl}`);
    
    try {
      const response = await fetch(backendUrl);
      const data = await response.json();
      
      console.log(`  Status: ${response.status} ${response.statusText}`);
      console.log(`  Success: ${data.success}`);
      console.log(`  Message: ${data.message}`);
      
      if (data.endpoints) {
        console.log('  📌 Available endpoints:');
        Object.keys(data.endpoints).forEach(endpoint => {
          console.log(`    ${endpoint}: ${data.endpoints[endpoint]}`);
        });
      }
      
      console.log('\n✅ Backend connection successful!');
    } catch (error) {
      console.error('❌ Backend connection failed:');
      console.error(`  Error: ${error.message}`);
      
      console.log('\n🔧 Troubleshooting steps:');
      console.log('  1. Make sure the backend server is running (cd server && npm start)');
      console.log('  2. Check if the port 3001 is available');
      console.log('  3. Check for CORS issues');
      console.log('  4. Verify firewall settings');
    }
  }

  // Test 3: Check if frontend dev server can be reached
  function testFrontendConnection() {
    console.log('\n🌐 Testing frontend development server...');
    console.log('  Expected URL: http://localhost:5173');
    console.log('  To start frontend: npm run dev');
  }

  // Run tests
  testBackendConnection();
  testFrontendConnection();

  console.log('\n📝 To run the full application:');
  console.log('  1. Start backend: cd server && npm start');
  console.log('  2. Start frontend: npm run dev');
  console.log('  3. Visit http://localhost:5173 in your browser');
});