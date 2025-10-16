require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const user = await User.findOne({ email: 'testuser@example.com' });
  if (user) {
    console.log('\n=== User Info ===');
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    console.log('Verified:', user.isVerified);
    console.log('Has OTP:', !!user.otp);
    if (user.otp) {
      console.log('\n=== OTP Details ===');
      console.log('OTP Code:', user.otp.code);
      console.log('Expires At:', user.otp.expiresAt);
      console.log('Still Valid:', new Date() < user.otp.expiresAt);
    }
    console.log('\n');
  } else {
    console.log('User not found');
  }
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
