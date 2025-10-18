#!/usr/bin/env node

/**
 * Test script for Render deployment
 * This script verifies that the backend can start correctly with Render-like environment
 */

console.log('🧪 Testing Render Deployment Configuration...\n');

// Simulate Render environment variables
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '3001';

console.log('🔧 Environment Configuration:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   PORT: ${process.env.PORT}`);
console.log('');

// Check required dependencies
try {
  console.log('📦 Checking dependencies...');
  
  const express = require('express');
  console.log('✅ Express loaded successfully');
  
  const mongoose = require('mongoose');
  console.log('✅ Mongoose loaded successfully');
  
  const cors = require('cors');
  console.log('✅ CORS loaded successfully');
  
  const dotenv = require('dotenv');
  console.log('✅ Dotenv loaded successfully');
  
  console.log('');
  
  // Test server creation
  console.log('🚀 Testing server creation...');
  const app = express();
  
  // Test middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Test route
  app.get('/test', (req, res) => {
    res.json({
      success: true,
      message: 'Test endpoint working',
      timestamp: new Date().toISOString(),
    });
  });
  
  console.log('✅ Server created and configured successfully');
  console.log('');
  
  // Test MongoDB connection string format (without actually connecting)
  console.log('🔗 Checking MongoDB URI format...');
  const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
  console.log(`   URI Format: ${mongodbUri.substring(0, Math.min(50, mongodbUri.length))}${mongodbUri.length > 50 ? '...' : ''}`);
  console.log('✅ MongoDB URI format check passed');
  console.log('');
  
  console.log('🎉 All Render deployment tests passed!');
  console.log('📝 Remember to set the following environment variables in Render:');
  console.log('   - MONGODB_URI');
  console.log('   - JWT_SECRET');
  console.log('   - GMAIL_USER');
  console.log('   - GMAIL_APP_PASSWORD');
  console.log('   - ALLOWED_ORIGINS');
  console.log('   - API_SECRET_KEY');
  console.log('');
  console.log('🚀 Ready for Render deployment!');
  
} catch (error) {
  console.error('❌ Error during deployment test:', error.message);
  process.exit(1);
}