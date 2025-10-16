#!/usr/bin/env node

/**
 * MongoDB Connection Test Script
 * This script tests the MongoDB connection with detailed error reporting
 */

const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

const mongoose = require('mongoose');

async function testConnection() {
  console.log('🔍 Testing MongoDB Connection...\n');
  
  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set');
    process.exit(1);
  }
  
  // Mask the URI for security
  const maskedUri = process.env.MONGODB_URI.replace(/\/\/(.*?):(.*?)@/, '//*****:*****@');
  console.log(`🔗 Connection String: ${maskedUri}\n`);
  
  // Test connection with detailed options
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // 5 second timeout
  };
  
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Port: ${conn.connection.port}`);
    
    // Test a simple query
    console.log('\n🔍 Testing database operations...');
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`✅ Found ${collections.length} collections in database`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔒 Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:');
    console.error(`   Error: ${error.message}`);
    
    // Provide specific troubleshooting advice
    if (error.name === 'MongoServerSelectionError') {
      console.error('\n🔧 Troubleshooting Tips:');
      console.error('   1. Check your MongoDB Atlas IP whitelist');
      console.error('   2. Add your current IP address to the whitelist');
      console.error('   3. For deployment, temporarily add 0.0.0.0/0 to whitelist');
      console.error('   4. Verify your username and password are correct');
      console.error('   5. Check if your MongoDB cluster is paused or stopped');
      console.error('   6. Ensure your network allows outbound connections to MongoDB');
    }
    
    process.exit(1);
  }
}

// Run the test
testConnection();