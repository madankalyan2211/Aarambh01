const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds instead of 5
      socketTimeoutMS: 45000,
      // Remove deprecated options
    };

    console.log('🔄 Attempting to connect to MongoDB...');
    console.log(`🔗 Connection string: ${process.env.MONGODB_URI.replace(/\/\/(.*?):(.*?)@/, '//*****:*****@')}`);

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔢 Connection readyState: ${mongoose.connection.readyState}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.error('🔧 Troubleshooting steps:');
    console.error('   1. Check your MongoDB Atlas IP whitelist');
    console.error('   2. Verify your connection string is correct');
    console.error('   3. Ensure your credentials are valid');
    console.error('   4. Check if MongoDB Atlas service is up and running');
    console.error('   5. For Render deployment, add 0.0.0.0/0 to IP whitelist (temporarily)');
    process.exit(1);
  }
};

module.exports = connectDB;