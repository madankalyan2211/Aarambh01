import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { env } from './config/env';

// Log environment configuration at startup
console.log('🚀 Aarambh LMS Frontend Starting...');
console.log('🔧 Environment Configuration:', env);

// Check if API base URL is properly configured
if (!env.apiBaseUrl || env.apiBaseUrl === 'http://localhost:31001/api') {
  console.warn('⚠️  API Base URL might not be properly configured for production!');
  console.warn('🔧 Current API Base URL:', env.apiBaseUrl);
  
  // In production, this should be a warning
  if (env.appEnv === 'production') {
    console.error('❌ CRITICAL: API Base URL is not configured for production environment!');
    console.error('🔧 Please check your environment variables configuration.');
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);