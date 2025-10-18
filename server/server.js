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
const discussionRoutes = require('./routes/discussion.routes.js');
const userRoutes = require('./routes/users.routes.js');
const messageRoutes = require('./routes/message.routes.js');
const announcementRoutes = require('./routes/announcement.routes.js');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config({ path: __dirname + '/.env' });

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
// Use PORT from environment variable (for AWS) or default to 31001
const PORT = process.env.PORT || 31001;

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list or if it's a local request or a vercel app
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:5175',
        'https://aarambh-frontend.vercel.app',
        'https://aarambh-git-main-madantambisetty.vercel.app',
        'https://aarambh.vercel.app'
      ];
      
      if (allowedOrigins.indexOf(origin) !== -1 || 
          origin?.startsWith('http://localhost:') || 
          origin?.startsWith('http://127.0.0.1:') ||
          origin?.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }
});

// Store connected users
const connectedUsers = new Map();

// Handle socket connections
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // When a user connects, store their user ID
  socket.on('register-user', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });
  
  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove user from connected users map
    for (let [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

// Make io available to other modules
app.set('io', io);
app.set('connectedUsers', connectedUsers);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'https://aarambh-frontend.vercel.app',
  'https://aarambh-git-main-madantambisetty.vercel.app',
  'https://aarambh.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or if it's a local request or a vercel app
    if (allowedOrigins.indexOf(origin) !== -1 || 
        origin?.startsWith('http://localhost:') || 
        origin?.startsWith('http://127.0.0.1:') ||
        origin?.endsWith('.vercel.app')) {
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
  max: 500, // Increased limit to 500 requests per windowMs for development
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
app.use('/api/discussions', discussionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Health check endpoint for AWS Elastic Beanstalk
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  const mongodbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    mongodbStatus: mongodbStatus,
    uptime: process.uptime(),
  });
});

// AWS Elastic Beanstalk health check endpoint
app.get('/health-check', (req, res) => {
  res.status(200).send('OK');
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
server.listen(PORT, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log(`🚀 Aarambh LMS Backend Server Started`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 Server running on port: ${PORT}`);
  console.log(`🚀 WebSocket server available at: ws://localhost:${PORT}`);
  console.log(`🚀 Health check: /health`);
  console.log('🚀 ========================================');
  console.log('');
  console.log('📧 Email Service: Gmail');
  console.log(`📧 From: ${process.env.GMAIL_USER}`);
  console.log('');
  console.log('📌 Available Endpoints:');
  console.log('   Authentication:');
  console.log(`   POST /api/auth/register - Register new user`);
  console.log(`   POST /api/auth/login - Login user`);
  console.log(`   POST /api/auth/verify-otp-db - Verify OTP (MongoDB)`);
  console.log(`   POST /api/auth/logout - Logout user`);
  console.log(`   GET  /api/auth/me - Get current user`);
  console.log('');
  console.log('   Legacy OTP (Email-based):');
  console.log(`   POST /api/auth/send-otp`);
  console.log(`   POST /api/auth/verify-otp`);
  console.log(`   POST /api/auth/resend-otp`);
  console.log(`   POST /api/auth/send-welcome`);
  console.log('');
  console.log('✨ Ready to send OTP emails!');
  console.log('');
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please use a different port.`);
    process.exit(1);
  }
});

module.exports = app;