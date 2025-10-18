const { default: fetch } = require('node-fetch');

const testMessageRequest = async () => {
  try {
    console.log('Testing message request...');
    
    // First, let's get a valid conversation ID by creating one
    console.log('Creating conversation...');
    
    // For this test, we'll need to simulate an authenticated request
    // Let's first login to get a token
    const loginResponse = await fetch('http://localhost:31001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'debug1@example.com',
        password: 'password123',
      }),
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', JSON.stringify(loginData, null, 2));
    
    if (!loginData.success) {
      console.error('Failed to login:', loginData.message);
      return;
    }
    
    const token = loginData.data.token;
    console.log('Got auth token:', token ? 'YES' : 'NO');
    
    // Now let's try to send a message
    console.log('\n--- Sending message ---');
    const messageResponse = await fetch('http://localhost:31001/api/messages/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        receiverId: '68f28d71311effd3aece2063', // User 2 ID from our debug script
        content: 'Test message from script',
        conversationId: '68f28d71311effd3aece2065', // Conversation ID from our debug script
      }),
    });
    
    const messageData = await messageResponse.json();
    console.log('Message response:', JSON.stringify(messageData, null, 2));
    
    // Let's also test with missing data to see the validation errors
    console.log('\n--- Sending message with missing content ---');
    const missingContentResponse = await fetch('http://localhost:31001/api/messages/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        receiverId: '68f28d71311effd3aece2063',
        // Missing content
        conversationId: '68f28d71311effd3aece2065',
      }),
    });
    
    const missingContentData = await missingContentResponse.json();
    console.log('Missing content response:', JSON.stringify(missingContentData, null, 2));
    
  } catch (error) {
    console.error('Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
};

testMessageRequest();