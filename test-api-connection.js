const http = require('http');

console.log('🔍 Testing API Connection...\n');

// Test backend connection
const backendUrl = 'http://localhost:3001';
console.log(`🔗 Testing connection to backend at: ${backendUrl}/api`);

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api',
  method: 'GET'
};

const req = http.request(options, res => {
  console.log(`  Status: ${res.statusCode}`);
  
  res.on('data', d => {
    try {
      const data = JSON.parse(d);
      console.log(`  Success: ${data.success}`);
      console.log(`  Message: ${data.message}`);
      console.log('\n✅ Backend connection successful!');
    } catch (e) {
      console.log('  Response:', d.toString());
      console.log('\n✅ Backend responded (but not in expected JSON format)');
    }
  });
});

req.on('error', error => {
  console.error('❌ Backend connection failed:');
  console.error(`  Error: ${error.message}`);
  
  console.log('\n🔧 Troubleshooting steps:');
  console.log('  1. Make sure the backend server is running (cd server && npm start)');
  console.log('  2. Check if the port 3001 is available');
  console.log('  3. Check for CORS issues');
  console.log('  4. Verify firewall settings');
});

req.end();

console.log('\n📝 To run the full application:');
console.log('  1. Start backend: cd server && npm start');
console.log('  2. Start frontend: npm run dev');
console.log('  3. Visit http://localhost:5173 in your browser');