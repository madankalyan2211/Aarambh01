const express = require('express');
const { generateOTP, storeOTP, verifyOTP: verifyOTPService, hasValidOTP, getOTPInfo } = require('../services/otp.service.js');
const { sendOTPEmail, sendWelcomeEmail } = require('../services/email.service.js');
const { register, login, verifyOTP: verifyOTPController, resendOTP: resendOTPController, getCurrentUser, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// MongoDB-based authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp-db', verifyOTPController); // Renamed to avoid conflict
router.post('/resend-otp-db', resendOTPController); // Renamed to avoid conflict
router.post('/logout', protect, logout);
router.get('/me', protect, getCurrentUser);

// Legacy OTP routes (for email-based OTP without database)

/**
 * POST /api/auth/send-otp
 * Send OTP to user's email
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }
    
    // Check if there's already a valid OTP
    if (hasValidOTP(email)) {
      const info = getOTPInfo(email);
      return res.status(429).json({
        success: false,
        message: `Please wait ${info.expiresIn} seconds before requesting a new OTP`,
        expiresIn: info.expiresIn,
      });
    }
    
    // Generate OTP
    const otpLength = parseInt(process.env.OTP_LENGTH || '6');
    const otp = generateOTP(otpLength);
    
    // Store OTP
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10');
    storeOTP(email, otp, expiryMinutes);
    
    // Send email
    const emailResult = await sendOTPEmail(email, otp, name);
    
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.',
        error: emailResult.error,
      });
    }
    
    // Success response
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      email,
      expiresIn: expiryMinutes * 60, // in seconds
    });
    
  } catch (error) {
    console.error('Error in send-otp:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verify OTP (Legacy - Email-based only)
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }
    
    // Verify OTP using the service function
    const result = verifyOTPService(email, otp);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    // Success response
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      email,
    });
    
  } catch (error) {
    console.error('Error in verify-otp:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/resend-otp
 * Resend OTP
 */
router.post('/resend-otp', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }
    
    // Generate new OTP
    const otpLength = parseInt(process.env.OTP_LENGTH || '6');
    const otp = generateOTP(otpLength);
    
    // Store OTP
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10');
    storeOTP(email, otp, expiryMinutes);
    
    // Send email
    const emailResult = await sendOTPEmail(email, otp, name);
    
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to resend OTP email',
        error: emailResult.error,
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      email,
      expiresIn: expiryMinutes * 60,
    });
    
  } catch (error) {
    console.error('Error in resend-otp:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/send-welcome
 * Send welcome email after successful registration
 */
router.post('/send-welcome', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email and name are required',
      });
    }
    
    const result = await sendWelcomeEmail(email, name);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Welcome email sent successfully',
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send welcome email',
      });
    }
    
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

module.exports = router;
