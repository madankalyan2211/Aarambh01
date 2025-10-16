const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: __dirname + '/.env' });

const Course = require('./models/Course');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const checkCourses = async () => {
  await connectDB();
  
  try {
    const courses = await Course.find({});
    console.log(`\n📊 Found ${courses.length} courses in database:\n`);
    
    courses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.name}`);
      console.log(`   ID: ${course._id}`);
      console.log(`   Category: ${course.category}`);
      console.log(`   Enrolled Students: ${course.enrolledStudents.length}`);
      console.log(`   Published: ${course.isPublished ? '✅' : '❌'}`);
      console.log(`   Active: ${course.isActive ? '✅' : '❌'}`);
      console.log('');
    });
    
    if (courses.length === 0) {
      console.log('⚠️  No courses found in database');
      console.log('💡 Run initialize-database.js to add sample data');
    }
  } catch (error) {
    console.error('❌ Error fetching courses:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
};

checkCourses();