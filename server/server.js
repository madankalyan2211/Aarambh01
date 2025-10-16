const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth.routes.js');
const courseRoutes = require('./routes/course.routes.js');
const enrollmentRoutes = require('./routes/enrollment.routes.js');
const assignmentRoutes = require('./routes/assignment.routes.js');
const gradeRoutes = require('./routes/grade.routes.js');
const path = require('path');

// Load environment variables
dotenv.config({ path: __dirname + '/.env' });

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Specific rate limit for OTP endpoints
const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit to 5 OTP requests per minute
  message: 'Too many OTP requests, please try again later.',
});

app.use('/api/auth/send-otp', otpLimiter);
app.use('/api/auth/resend-otp', otpLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/grades', gradeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Aarambh LMS API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      verifyOTPDB: 'POST /api/auth/verify-otp-db',
      logout: 'POST /api/auth/logout',
      me: 'GET /api/auth/me',
      sendOTP: 'POST /api/auth/send-otp',
      verifyOTP: 'POST /api/auth/verify-otp',
      resendOTP: 'POST /api/auth/resend-otp',
      sendWelcome: 'POST /api/auth/send-welcome',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle multer file upload errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum file size is 10MB.',
      });
    }
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log(`🚀 Aarambh LMS Backend Server Started`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`🚀 Health check: http://localhost:${PORT}/health`);
  console.log('🚀 ========================================');
  console.log('');
  console.log('📧 Email Service: Gmail');
  console.log(`📧 From: ${process.env.GMAIL_USER}`);
  console.log('');
  console.log('📌 Available Endpoints:');
  console.log('   Authentication:');
  console.log(`   POST http://localhost:${PORT}/api/auth/register - Register new user`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login - Login user`);
  console.log(`   POST http://localhost:${PORT}/api/auth/verify-otp-db - Verify OTP (MongoDB)`);
  console.log(`   POST http://localhost:${PORT}/api/auth/logout - Logout user`);
  console.log(`   GET  http://localhost:${PORT}/api/auth/me - Get current user`);
  console.log('');
  console.log('   Legacy OTP (Email-based):');
  console.log(`   POST http://localhost:${PORT}/api/auth/send-otp`);
  console.log(`   POST http://localhost:${PORT}/api/auth/verify-otp`);
  console.log(`   POST http://localhost:${PORT}/api/auth/resend-otp`);
  console.log(`   POST http://localhost:${PORT}/api/auth/send-welcome`);
  console.log('');
  console.log('✨ Ready to send OTP emails!');
  console.log('');
});

module.exports = app;