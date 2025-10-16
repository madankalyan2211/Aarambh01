const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB Atlas connection...\n');
    console.log('Connection String:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@'));
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('\n✅ SUCCESS! MongoDB Atlas Connected');
    console.log('📊 Database Host:', conn.connection.host);
    console.log('📊 Database Name:', conn.connection.name);
    console.log('📊 Connection State:', conn.connection.readyState === 1 ? 'Connected' : 'Not Connected');
    
    // List collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('\n📁 Existing Collections:', collections.length);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    console.log('\n🎉 MongoDB Atlas is ready to use!');
    console.log('💡 You can now start your server with: npm run dev\n');
    
    await mongoose.connection.close();
    console.log('Connection closed.');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Connection Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check your internet connection');
    console.error('   2. Verify MongoDB Atlas credentials');
    console.error('   3. Ensure IP address is whitelisted in Atlas');
    console.error('   4. Check if password contains special characters');
    process.exit(1);
  }
}

testConnection();
