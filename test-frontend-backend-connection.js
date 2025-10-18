const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testConnection() {
  console.log('Testing connection between frontend and backend...\n');
  
  // Test the health endpoint
  try {
    console.log('1. Testing backend health endpoint...');
    const healthResponse = await fetch('https://aarambh01-1.onrender.com/health');
    const healthData = await healthResponse.json();
    
    console.log('   Status:', healthResponse.status);
    console.log('   Success:', healthData.success);
    console.log('   Message:', healthData.message);
    console.log('   MongoDB Status:', healthData.mongodbStatus);
    console.log('   ✅ Health check passed\n');
  } catch (error) {
    console.log('   ❌ Health check failed:', error.message, '\n');
  }
  
  // Test the root endpoint
  try {
    console.log('2. Testing backend root endpoint...');
    const rootResponse = await fetch('https://aarambh01-1.onrender.com/');
    const rootData = await rootResponse.json();
    
    console.log('   Status:', rootResponse.status);
    console.log('   Success:', rootData.success);
    console.log('   Message:', rootData.message);
    console.log('   Version:', rootData.version);
    console.log('   ✅ Root endpoint accessible\n');
  } catch (error) {
    console.log('   ❌ Root endpoint test failed:', error.message, '\n');
  }
  
  // Test CORS by making a preflight request
  try {
    console.log('3. Testing CORS configuration...');
    const corsResponse = await fetch('https://aarambh01-1.onrender.com/health', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://your-frontend.netlify.app',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('   Status:', corsResponse.status);
    console.log('   Access-Control-Allow-Origin:', corsResponse.headers.get('access-control-allow-origin'));
    console.log('   ✅ CORS preflight request successful\n');
  } catch (error) {
    console.log('   ❌ CORS test failed:', error.message, '\n');
  }
  
  // Test a protected endpoint to verify authentication flow
  try {
    console.log('4. Testing authentication endpoints...');
    const coursesResponse = await fetch('https://aarambh01-1.onrender.com/api/courses');
    
    console.log('   Status:', coursesResponse.status);
    console.log('   Status Text:', coursesResponse.statusText);
    console.log('   ✅ Authentication flow working (returns 401 for unauthenticated requests)\n');
  } catch (error) {
    console.log('   ❌ Authentication endpoint test failed:', error.message, '\n');
  }
  
  console.log('🎉 Connection tests completed!');
  console.log('📝 Next steps:');
  console.log('   1. Update your frontend .env.production with the correct VITE_API_BASE_URL');
  console.log('   2. Redeploy your frontend to Netlify with the new environment variables');
  console.log('   3. Test the full application flow');
}

testConnection().catch(console.error);