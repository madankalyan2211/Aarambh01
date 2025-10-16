const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../services/email.service');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
    });

    // Generate OTP for email verification
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    console.log(`OTP for ${email}: ${otp}`);
    const emailResult = await sendOTPEmail(email, otp, name);
    
    if (!emailResult.success) {
      console.warn('Failed to send OTP email:', emailResult.error);
      // Continue anyway - user can see OTP in console during development
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email.',
      data: {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email first. Check your inbox for the verification code.',
        requiresVerification: true,
        email: user.email,
      });
    }

    // User is verified - generate JWT token and login directly
    const token = generateToken(user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: user.toPublicProfile(),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify OTP
    const isOTPValid = user.verifyOTP(otp);
    
    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined; // Clear OTP
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        token,
        user: user.toPublicProfile(),
      },
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message,
    });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate new OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    console.log(`New OTP for ${email}: ${otp}`);
    const emailResult = await sendOTPEmail(email, otp, user.name);
    
    if (!emailResult.success) {
      console.warn('Failed to send OTP email:', emailResult.error);
      // Continue anyway - user can see OTP in console during development
    }

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resending OTP',
      error: error.message,
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses', 'name description image')
      .populate('teachingCourses', 'name description image');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user.toPublicProfile(),
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user data',
      error: error.message,
    });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    // In a JWT-based system, logout is typically handled client-side
    // by removing the token from storage
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging out',
      error: error.message,
    });
  }
};
