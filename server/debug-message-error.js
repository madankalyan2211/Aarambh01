const mongoose = require('mongoose');
const { User, Conversation, Message } = require('./models');

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

const debugMessageError = async () => {
  try {
    console.log('Debugging message validation error...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB');
    
    // Create test users if they don't exist
    let user1 = await User.findOne({ email: 'debug1@example.com' });
    if (!user1) {
      user1 = new User({
        name: 'Debug User 1',
        email: 'debug1@example.com',
        password: 'password123',
        role: 'student'
      });
      await user1.save();
      console.log('Created debug user 1:', user1._id);
    } else {
      console.log('Found debug user 1:', user1._id);
    }
    
    let user2 = await User.findOne({ email: 'debug2@example.com' });
    if (!user2) {
      user2 = new User({
        name: 'Debug User 2',
        email: 'debug2@example.com',
        password: 'password123',
        role: 'teacher'
      });
      await user2.save();
      console.log('Created debug user 2:', user2._id);
    } else {
      console.log('Found debug user 2:', user2._id);
    }
    
    // Create a conversation
    console.log('Creating conversation...');
    const conversation = new Conversation({
      participants: [user1._id, user2._id],
      isGroup: false,
    });
    await conversation.save();
    console.log('✅ Created conversation:', conversation._id);
    
    // Test 1: Valid message
    console.log('\n--- Test 1: Valid message ---');
    try {
      const validMessage = new Message({
        sender: user1._id,
        receiver: user2._id,
        content: 'This is a valid test message',
        conversationId: conversation._id,
      });
      await validMessage.save();
      console.log('✅ Valid message saved successfully:', validMessage._id);
    } catch (error) {
      console.error('❌ Valid message failed:', error.message);
    }
    
    // Test 2: Missing sender
    console.log('\n--- Test 2: Missing sender ---');
    try {
      const messageWithoutSender = new Message({
        receiver: user2._id,
        content: 'Message without sender',
        conversationId: conversation._id,
      });
      await messageWithoutSender.save();
      console.log('✅ Message without sender saved (unexpected):', messageWithoutSender._id);
    } catch (error) {
      console.error('❌ Message without sender failed (expected):', error.message);
      console.log('Error name:', error.name);
    }
    
    // Test 3: Missing receiver
    console.log('\n--- Test 3: Missing receiver ---');
    try {
      const messageWithoutReceiver = new Message({
        sender: user1._id,
        content: 'Message without receiver',
        conversationId: conversation._id,
      });
      await messageWithoutReceiver.save();
      console.log('✅ Message without receiver saved (unexpected):', messageWithoutReceiver._id);
    } catch (error) {
      console.error('❌ Message without receiver failed (expected):', error.message);
      console.log('Error name:', error.name);
    }
    
    // Test 4: Missing content
    console.log('\n--- Test 4: Missing content ---');
    try {
      const messageWithoutContent = new Message({
        sender: user1._id,
        receiver: user2._id,
        conversationId: conversation._id,
      });
      await messageWithoutContent.save();
      console.log('✅ Message without content saved (unexpected):', messageWithoutContent._id);
    } catch (error) {
      console.error('❌ Message without content failed (expected):', error.message);
      console.log('Error name:', error.name);
    }
    
    // Test 5: Missing conversationId
    console.log('\n--- Test 5: Missing conversationId ---');
    try {
      const messageWithoutConversation = new Message({
        sender: user1._id,
        receiver: user2._id,
        content: 'Message without conversation',
      });
      await messageWithoutConversation.save();
      console.log('✅ Message without conversation saved (unexpected):', messageWithoutConversation._id);
    } catch (error) {
      console.error('❌ Message without conversation failed (expected):', error.message);
      console.log('Error name:', error.name);
    }
    
    // Test 6: Empty content
    console.log('\n--- Test 6: Empty content ---');
    try {
      const messageWithEmptyContent = new Message({
        sender: user1._id,
        receiver: user2._id,
        content: '',
        conversationId: conversation._id,
      });
      await messageWithEmptyContent.save();
      console.log('✅ Message with empty content saved (unexpected):', messageWithEmptyContent._id);
    } catch (error) {
      console.error('❌ Message with empty content failed (expected):', error.message);
      console.log('Error name:', error.name);
    }
    
    // Test 7: Invalid ObjectId formats
    console.log('\n--- Test 7: Invalid ObjectId formats ---');
    try {
      const messageWithInvalidIds = new Message({
        sender: 'invalid-sender-id',
        receiver: 'invalid-receiver-id',
        content: 'Message with invalid IDs',
        conversationId: 'invalid-conversation-id',
      });
      await messageWithInvalidIds.save();
      console.log('✅ Message with invalid IDs saved (unexpected):', messageWithInvalidIds._id);
    } catch (error) {
      console.error('❌ Message with invalid IDs failed (expected):', error.message);
      console.log('Error name:', error.name);
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Debug test completed');
  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

debugMessageError();