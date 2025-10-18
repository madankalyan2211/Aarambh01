const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

const connectDB = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log(`Connection string: ${process.env.MONGODB_URI.replace(/\/\/(.*?):(.*?)@/, '//*****:*****@')}`);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
    
    // Test query
    const { Conversation } = require('./models');
    const count = await Conversation.countDocuments();
    console.log(`📊 Found ${count} conversations in the database`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Connection test completed successfully');
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error.message);
    process.exit(1);
  }
};

connectDB();