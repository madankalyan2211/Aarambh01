import React, { useState, useEffect } from 'react';
import { UserRole } from '../App'; // Ensure UserRole is defined in App.tsx
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { motion } from 'motion/react';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Mail, Clock, AlertCircle } from 'lucide-react';
import { sendOTP, verifyOTP, resendOTP, getApiBaseUrl, apiRequest } from '../services/api.service';

interface LoginRegistrationProps {
  onLogin: (role: UserRole, name?: string, email?: string) => void; // Updated to accept email
}

export function LoginRegistration({ onLogin }: LoginRegistrationProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('student' as 'student' | 'teacher' | 'admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // New state for name
  const [rememberMe, setRememberMe] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  
  // OTP verification states
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Timer effect for OTP resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length > 6) strength += 25;
    if (pass.length > 10) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) strength += 25;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(password);

  // Generate and send OTP
  const sendOtpEmail = async () => {
    setIsSendingOtp(true);
    setErrorMessage('');
    
    try {
      const response = await sendOTP(email, name || 'User');
      
      if (response.success) {
        setOtpSent(true);
        setResendTimer(60); // 60 seconds cooldown
        console.log('✅ OTP sent successfully to', email);
      } else {
        setErrorMessage(response.message || 'Failed to send OTP. Please try again.');
        alert(response.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrorMessage('Network error. Please check your connection.');
      alert('Failed to send OTP. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Resend OTP
  const resendOtpEmail = async () => {
    if (resendTimer === 0) {
      setIsSendingOtp(true);
      setErrorMessage('');
      
      try {
        const response = await resendOTP(email, name || 'User');
        
        if (response.success) {
          setOtp(''); // Clear previous OTP input
          setResendTimer(60);
          console.log('✅ OTP resent successfully');
        } else {
          setErrorMessage(response.message || 'Failed to resend OTP.');
          alert(response.message || 'Failed to resend OTP.');
        }
      } catch (error) {
        console.error('Error resending OTP:', error);
        setErrorMessage('Network error. Please check your connection.');
        alert('Failed to resend OTP. Please try again.');
      } finally {
        setIsSendingOtp(false);
      }
    }
  };

  // Verify OTP
  const verifyOtpCode = async () => {
    setIsVerifying(true);
    setErrorMessage('');
    
    try {
      // If this is registration, verify OTP from MongoDB
      if (!isLogin) {
        // Use the apiRequest function from api.service.ts instead of direct fetch
        const verifyResponse = await apiRequest('/auth/verify-otp-db', {
          method: 'POST',
          body: JSON.stringify({ email, otp }),
        });
        
        if (verifyResponse.success) {
          // Store token and user data
          localStorage.setItem('authToken', verifyResponse.data.token);
          localStorage.setItem('userData', JSON.stringify({
            email: verifyResponse.data.user.email,
            name: verifyResponse.data.user.name,
            role: verifyResponse.data.user.role,
          }));
          
          setIsVerifying(false);
          setShowOtpVerification(false);
          setShowTour(true); // Show tour for new users
        } else {
          setIsVerifying(false);
          setErrorMessage(verifyResponse.message || 'Invalid OTP. Please try again.');
          setOtp('');
        }
      } else {
        // For login, verify using legacy OTP service
        const response = await verifyOTP(email, otp);
        
        if (response.success) {
          setIsVerifying(false);
          setShowOtpVerification(false);
          
          // Store user data in localStorage
          const userData = {
            email,
            name: name || email.split('@')[0],
            role
          };
          localStorage.setItem('userData', JSON.stringify(userData));
          
          // Retrieve stored name or use email prefix
          const storedData = localStorage.getItem('userData');
          const displayName = storedData ? JSON.parse(storedData).name : email.split('@')[0];
          onLogin(role, displayName, email);
        } else {
          setIsVerifying(false);
          setErrorMessage(response.message || 'Invalid OTP. Please try again.');
          setOtp('');
        }
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setIsVerifying(false);
      setErrorMessage('Network error. Please check your connection.');
      setOtp('');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    // Validation
    if (!isLogin && !name.trim()) {
      alert('Please enter your name.');
      return;
    }
    
    if (!email.trim() || !password.trim()) {
      alert('Please enter email and password.');
      return;
    }
    
    // For login, try to authenticate directly with MongoDB
    if (isLogin) {
      try {
        // Using apiRequest function from api.service.ts instead of direct fetch
        const response = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        
        if (response.success) {
          // User is verified, login directly with JWT token
          const token = response.data.token;
          const user = response.data.user;
          
          // Store token and user data
          localStorage.setItem('authToken', token);
          localStorage.setItem('userData', JSON.stringify({
            email: user.email,
            name: user.name,
            role: user.role,
          }));
          
          // Login to app
          onLogin(user.role, user.name, user.email);
          return;
        } else if (response.data && response.data.requiresVerification) {
          // User exists but not verified - show OTP screen
          alert('Your email is not verified. Please verify your email first.');
          setShowOtpVerification(true);
          sendOtpEmail();
          return;
        } else {
          alert(response.message || 'Invalid email or password');
          return;
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
        return;
      }
    }
    
    // For registration, create user in MongoDB first
    try {
      const registerResponse = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          password, 
          name: name || email.split('@')[0],
          role 
        }),
      });
      
      if (registerResponse.success) {
        // User created successfully, now send OTP email
        // The OTP was generated in MongoDB during registration
        setShowOtpVerification(true);
        // Note: The backend already generated OTP, we just show the verification screen
        // In a real app, you'd send the OTP via email here using the backend
        alert(`Registration successful! An OTP has been generated. Check the console for the OTP (in production, this would be sent via email).`);
      } else if (registerResponse.message?.includes('already exists')) {
        alert('Email already registered. Please login instead.');
        setIsLogin(true);
      } else {
        alert(registerResponse.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to create account. Please try again.');
    }
  };

  const tourSlides = [
    {
      title: 'Welcome to Aarambh! 🎉',
      description: 'Your AI-powered learning companion is ready to help you succeed.',
    },
    {
      title: 'Track Your Progress 📊',
      description: 'Monitor your learning journey with detailed analytics and insights.',
    },
    {
      title: 'Engage with Community 💬',
      description: 'Connect with peers, join discussions, and learn together.',
    },
    {
      title: 'Gamified Learning 🎮',
      description: 'Earn badges, maintain streaks, and climb the leaderboard!',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/20"
        animate={{
          background: [
            'linear-gradient(to bottom right, rgba(255, 105, 180, 0.2), rgba(255, 193, 204, 0.3), rgba(255, 20, 147, 0.2))',
            'linear-gradient(to bottom right, rgba(255, 20, 147, 0.2), rgba(255, 105, 180, 0.3), rgba(255, 193, 204, 0.2))',
            'linear-gradient(to bottom right, rgba(255, 105, 180, 0.2), rgba(255, 193, 204, 0.3), rgba(255, 20, 147, 0.2))',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* App Name - Top Left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-6 left-6 z-20"
      >
        <h2 className="text-4xl md:text-3xl app-logo">Aarambh</h2>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center pt-16 pb-12 px-4"
      >
        <h1 className="text-5xl md:text-6xl mb-4">Learn. Connect. Grow.</h1>
        <p className="text-xl text-muted-foreground">AI-Powered Learning Management System</p>
      </motion.div>

      {/* Login/Registration Form */}
      <div className="relative z-10 flex items-center justify-center px-4 pb-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 backdrop-blur-sm bg-card/95">
            {/* Show OTP Verification if needed */}
            {showOtpVerification ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-primary mb-2">Verify Your Email</h2>
                  <p className="text-muted-foreground text-sm">
                    We've sent a 6-digit code to
                    <br />
                    <span className="font-semibold text-foreground">{email}</span>
                  </p>
                </div>

                <div className="space-y-6">
                  {errorMessage && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center space-y-4">
                    <Label htmlFor="otp" className="text-center text-base font-semibold">Enter OTP</Label>
                    <div className="flex justify-center w-full">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                      >
                        <InputOTPGroup className="gap-2">
                          <InputOTPSlot index={0} className="w-12 h-12 text-xl" />
                          <InputOTPSlot index={1} className="w-12 h-12 text-xl" />
                          <InputOTPSlot index={2} className="w-12 h-12 text-xl" />
                          <InputOTPSlot index={3} className="w-12 h-12 text-xl" />
                          <InputOTPSlot index={4} className="w-12 h-12 text-xl" />
                          <InputOTPSlot index={5} className="w-12 h-12 text-xl" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="w-full bg-primary hover:bg-accent"
                    onClick={verifyOtpCode}
                    disabled={otp.length !== 6 || isVerifying}
                  >
                    {isVerifying ? 'Verifying...' : 'Verify OTP'}
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Didn't receive the code?
                    </p>
                    {resendTimer > 0 ? (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Resend in {resendTimer}s</span>
                      </div>
                    ) : (
                      <Button
                        variant="link"
                        className="text-primary p-0 h-auto"
                        onClick={resendOtpEmail}
                        disabled={isSendingOtp}
                      >
                        {isSendingOtp ? 'Sending...' : 'Resend OTP'}
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setShowOtpVerification(false);
                      setOtp('');
                      setOtpSent(false);
                    }}
                  >
                    Change Email
                  </Button>
                </div>
              </motion.div>
            ) : (
              <>
            <div className="text-center mb-6">
              <h2 className="text-primary mb-2">{isLogin ? 'Welcome Back!' : 'Join Aarambh'}</h2>
              <p className="text-muted-foreground">
                {isLogin ? 'Sign in to continue learning' : 'Create your account to get started'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>I am a...</Label>
                <Select value={role} onValueChange={(value) => setRole(value as typeof role)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">👩‍🎓 Student</SelectItem>
                    <SelectItem value="teacher">👨‍🏫 Teacher</SelectItem>
                    <SelectItem value="admin">⚙️ Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {!isLogin && password && (
                  <div className="space-y-1">
                    <Progress value={passwordStrength} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Password strength:{' '}
                      {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Medium' : 'Strong'}
                    </p>
                  </div>
                )}
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                    Forgot password?
                  </Button>
                </div>
              )}

              <Button type="submit" className="w-full bg-primary hover:bg-accent">
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <Button
                  variant="link"
                  className="text-primary p-0 h-auto"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </Button>
              </p>
            </div>
            </>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Micro Tour Dialog */}
      <Dialog open={showTour} onOpenChange={setShowTour}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tourSlides[tourStep].title}</DialogTitle>
            <DialogDescription>{tourSlides[tourStep].description}</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-1">
              {tourSlides.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === tourStep ? 'w-8 bg-primary' : 'w-2 bg-muted'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {tourStep < tourSlides.length - 1 ? (
                <>
                  <Button variant="ghost" onClick={() => setShowTour(false)}>
                    Skip
                  </Button>
                  <Button onClick={() => setTourStep(tourStep + 1)}>Next</Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    setShowTour(false);
                    const userData = {
                      email,
                      name: name || email.split('@')[0],
                      role
                    };
                    localStorage.setItem('userData', JSON.stringify(userData));
                    onLogin(role, name, email); // Pass both name and email
                  }}
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}