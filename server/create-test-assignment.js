const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

async function createTestAssignment() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const { Assignment, User, Course } = require('./models');
    
    // Find a teacher and course
    const teacher = await User.findOne({ role: 'teacher' });
    console.log('Teacher:', teacher ? teacher.name : 'Not found');
    
    const course = await Course.findOne();
    console.log('Course:', course ? course.name : 'Not found');
    
    if (!teacher || !course) {
      console.log('❌ No teacher or course found');
      await mongoose.connection.close();
      return;
    }
    
    // Create a test assignment
    const assignment = new Assignment({
      title: 'Test Assignment',
      description: 'This is a test assignment for students',
      course: course._id,
      teacher: teacher._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      totalPoints: 100,
      passingScore: 60,
      isPublished: true,
    });
    
    await assignment.save();
    console.log('✅ Created test assignment:', assignment._id);
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTestAssignment();