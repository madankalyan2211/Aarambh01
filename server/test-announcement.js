const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

// Test announcement creation
const testAnnouncement = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB');
    
    // Import models after connection
    const { Announcement, User } = require('./models');
    
    // Create a test teacher user if one doesn't exist
    let teacher = await User.findOne({ email: 'testteacher@example.com' });
    if (!teacher) {
      teacher = new User({
        name: 'Test Teacher',
        email: 'testteacher@example.com',
        password: 'password123',
        role: 'teacher',
        isVerified: true,
      });
      await teacher.save();
      console.log('Created test teacher:', teacher._id);
    } else {
      console.log('Found test teacher:', teacher._id);
    }
    
    // Create a test announcement
    const announcement = new Announcement({
      title: 'Test Announcement',
      content: 'This is a test announcement for all students.',
      author: teacher._id,
      targetAudience: 'all',
      priority: 'medium',
      isPublished: true,
    });
    
    await announcement.save();
    console.log('✅ Created test announcement:', announcement._id);
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Test completed successfully');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
};

testAnnouncement();