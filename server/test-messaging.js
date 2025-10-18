const mongoose = require('mongoose');
const { User, Conversation, Message } = require('./models');

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

const testMessaging = async () => {
  try {
    console.log('Testing messaging system...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB');
    
    // Create test users if they don't exist
    let user1 = await User.findOne({ email: 'test1@example.com' });
    if (!user1) {
      user1 = new User({
        name: 'Test User 1',
        email: 'test1@example.com',
        password: 'password123',
        role: 'student'
      });
      await user1.save();
      console.log('Created test user 1:', user1._id);
    } else {
      console.log('Found test user 1:', user1._id);
    }
    
    let user2 = await User.findOne({ email: 'test2@example.com' });
    if (!user2) {
      user2 = new User({
        name: 'Test User 2',
        email: 'test2@example.com',
        password: 'password123',
        role: 'teacher'
      });
      await user2.save();
      console.log('Created test user 2:', user2._id);
    } else {
      console.log('Found test user 2:', user2._id);
    }
    
    // Test creating a conversation
    console.log('Creating conversation...');
    const conversation = new Conversation({
      participants: [user1._id, user2._id],
      isGroup: false,
    });
    await conversation.save();
    console.log('✅ Created conversation:', conversation._id);
    
    // Test sending a message
    console.log('Sending message...');
    const message = new Message({
      sender: user1._id,
      receiver: user2._id,
      content: 'Hello, this is a test message!',
      conversationId: conversation._id,
    });
    await message.save();
    console.log('✅ Sent message:', message._id);
    
    // Verify the message was saved correctly
    const savedMessage = await Message.findById(message._id).populate('sender', 'name');
    console.log('Retrieved message:', {
      id: savedMessage._id,
      sender: savedMessage.sender.name,
      content: savedMessage.content,
      conversationId: savedMessage.conversationId,
    });
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Messaging test completed successfully');
  } catch (error) {
    console.error('❌ Messaging test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

testMessaging();