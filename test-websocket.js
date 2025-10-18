const io = require('socket.io-client');

// Connect to the server
const socket = io('http://localhost:5173', {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
});

console.log('Connecting to WebSocket server...');

socket.on('connect', () => {
  console.log('Connected to server with socket ID:', socket.id);
  
  // Register a test user
  const testUserId = 'test-user-id-123';
  socket.emit('register-user', testUserId);
  console.log('Registered user:', testUserId);
  
  // Listen for notification events
  socket.on('unread-notifications-count', (data) => {
    console.log('Received unread notifications count:', data);
  });
  
  socket.on('new-notification', (data) => {
    console.log('Received new notification:', data);
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.log('Connection error:', error);
});

// Keep the process running
setTimeout(() => {
  console.log('Test completed');
  socket.disconnect();
  process.exit(0);
}, 10000);