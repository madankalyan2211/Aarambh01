const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
require('dotenv').config({ path: './.env' });

// Initialize Gemini AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log('Gemini API Key exists:', !!GEMINI_API_KEY);

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in the environment variables');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function testGemini() {
  try {
    console.log('🚀 Testing Gemini API connection...');
    
    // Try to initialize a model that should work
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });
    
    // Create a simple test prompt
    const prompt = "What is the capital of France?";
    
    console.log('📤 Sending request to Gemini API...');
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API test successful!');
    console.log('Response:', text);
  } catch (error) {
    console.error('❌ Error testing Gemini API:', error.message);
    console.error('Error details:', error);
  }
}

testGemini();