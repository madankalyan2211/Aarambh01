const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const {
  User,
  Course,
  Assignment,
  Submission,
  Discussion,
  Notification,
  Attendance,
  Grade,
  Announcement,
} = require('./models');

async function quickInitializeDatabase() {
  try {
    console.log('🚀 Aarambh LMS - Quick Database Setup');
    console.log('═'.repeat(80));
    
    console.log('\n🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database: aarambh-lms\n');
    
    // Check if data already exists
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log(`⚠️  Database already contains ${existingUsers} users.`);
      console.log('❌ Please run clear-database.js first if you want to reinitialize.\n');
      await mongoose.connection.close();
      process.exit(1);
    }
    
    console.log('📝 Creating database structure and sample data...\n');
    
    // 1. Create Admin User
    console.log('1️⃣  Creating Admin user...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@aarambh.edu',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
      bio: 'System Administrator for Aarambh LMS',
    });
    console.log(`   ✅ Admin created: ${admin.email}`);
    
    // 2. Create Teachers
    console.log('\n2️⃣  Creating Teacher users...');
    const teacher1 = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@aarambh.edu',
      password: 'teacher123',
      role: 'teacher',
      isVerified: true,
      bio: 'Computer Science Professor specializing in Web Development and AI',
    });
    
    const teacher2 = await User.create({
      name: 'Prof. Michael Chen',
      email: 'michael.chen@aarambh.edu',
      password: 'teacher123',
      role: 'teacher',
      isVerified: true,
      bio: 'Mathematics Professor with expertise in Data Science',
    });
    
    const teacher3 = await User.create({
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@aarambh.edu',
      password: 'teacher123',
      role: 'teacher',
      isVerified: true,
      bio: 'Physics Professor passionate about interactive learning',
    });
    
    console.log(`   ✅ Teacher 1: ${teacher1.email}`);
    console.log(`   ✅ Teacher 2: ${teacher2.email}`);
    console.log(`   ✅ Teacher 3: ${teacher3.email}`);
    
    // 3. Create Students
    console.log('\n3️⃣  Creating Student users...');
    const students = [];
    const studentData = [
      { name: 'Alice Williams', email: 'alice.williams@student.aarambh.edu' },
      { name: 'Bob Martinez', email: 'bob.martinez@student.aarambh.edu' },
      { name: 'Charlie Brown', email: 'charlie.brown@student.aarambh.edu' },
      { name: 'Diana Prince', email: 'diana.prince@student.aarambh.edu' },
      { name: 'Ethan Hunt', email: 'ethan.hunt@student.aarambh.edu' },
      { name: 'Fiona Green', email: 'fiona.green@student.aarambh.edu' },
      { name: 'George Wilson', email: 'george.wilson@student.aarambh.edu' },
      { name: 'Hannah Lee', email: 'hannah.lee@student.aarambh.edu' },
    ];
    
    for (const data of studentData) {
      const student = await User.create({
        name: data.name,
        email: data.email,
        password: 'student123',
        role: 'student',
        isVerified: true,
        bio: `Enthusiastic learner at Aarambh LMS`,
        learningStreak: Math.floor(Math.random() * 30),
        totalXP: Math.floor(Math.random() * 1000),
      });
      students.push(student);
      console.log(`   ✅ Student: ${student.email}`);
    }
    
    // 4. Create Courses
    console.log('\n4️⃣  Creating sample courses...');
    const course1 = await Course.create({
      name: 'Introduction to Web Development',
      description: 'Learn the fundamentals of HTML, CSS, JavaScript, and modern web frameworks.',
      teacher: teacher1._id,
      category: 'Computer Science',
      difficulty: 'Beginner',
      isPublished: true,
      maxStudents: 50,
      enrolledStudents: students.slice(0, 5).map(s => s._id),
      totalEnrollments: 5,
      modules: [
        {
          title: 'HTML Basics',
          description: 'Introduction to HTML structure and elements',
          order: 1,
          lessons: [
            { title: 'HTML Elements', content: 'Learn about basic HTML elements', duration: 45, order: 1 },
            { title: 'HTML Attributes', content: 'Understanding HTML attributes', duration: 30, order: 2 },
          ],
        },
        {
          title: 'CSS Fundamentals',
          description: 'Styling web pages with CSS',
          order: 2,
          lessons: [
            { title: 'CSS Selectors', content: 'Learn CSS selectors', duration: 40, order: 1 },
            { title: 'CSS Layout', content: 'Flexbox and Grid', duration: 60, order: 2 },
          ],
        },
      ],
    });
    
    const course2 = await Course.create({
      name: 'Data Science with Python',
      description: 'Master data analysis, visualization, and machine learning with Python.',
      teacher: teacher2._id,
      category: 'Data Science',
      difficulty: 'Intermediate',
      isPublished: true,
      maxStudents: 40,
      enrolledStudents: students.slice(2, 7).map(s => s._id),
      totalEnrollments: 5,
      modules: [
        {
          title: 'Python Basics for Data Science',
          description: 'Essential Python programming for data science',
          order: 1,
          lessons: [
            { title: 'NumPy Arrays', content: 'Working with NumPy', duration: 50, order: 1 },
            { title: 'Pandas DataFrames', content: 'Data manipulation with Pandas', duration: 60, order: 2 },
          ],
        },
      ],
    });
    
    const course3 = await Course.create({
      name: 'Physics 101',
      description: 'Fundamental concepts in classical mechanics and thermodynamics.',
      teacher: teacher3._id,
      category: 'Physics',
      difficulty: 'Beginner',
      isPublished: true,
      maxStudents: 60,
      enrolledStudents: students.slice(0, 6).map(s => s._id),
      totalEnrollments: 6,
      modules: [
        {
          title: 'Newton\'s Laws',
          description: 'Understanding classical mechanics',
          order: 1,
          lessons: [
            { title: 'First Law of Motion', content: 'Law of Inertia', duration: 40, order: 1 },
            { title: 'Second Law of Motion', content: 'F = ma', duration: 45, order: 2 },
          ],
        },
      ],
    });
    
    console.log(`   ✅ Course: ${course1.name} (${course1.enrolledStudents.length} students)`);
    console.log(`   ✅ Course: ${course2.name} (${course2.enrolledStudents.length} students)`);
    console.log(`   ✅ Course: ${course3.name} (${course3.enrolledStudents.length} students)`);
    
    // Update teacher and student course references
    await User.findByIdAndUpdate(teacher1._id, { teachingCourses: [course1._id] });
    await User.findByIdAndUpdate(teacher2._id, { teachingCourses: [course2._id] });
    await User.findByIdAndUpdate(teacher3._id, { teachingCourses: [course3._id] });
    
    for (let i = 0; i < 5; i++) {
      await User.findByIdAndUpdate(students[i]._id, { 
        enrolledCourses: [course1._id, course3._id] 
      });
    }
    
    for (let i = 2; i < 7; i++) {
      await User.findByIdAndUpdate(students[i]._id, { 
        $addToSet: { enrolledCourses: course2._id }
      });
    }
    
    // 5. Create Sample Assignments
    console.log('\n5️⃣  Creating sample assignments...');
    const assignment1 = await Assignment.create({
      title: 'Build a Personal Portfolio Website',
      description: 'Create a responsive personal portfolio using HTML and CSS',
      course: course1._id,
      teacher: teacher1._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      totalPoints: 100,
      passingScore: 70,
      isPublished: true,
      instructions: 'Create a portfolio with at least 3 sections: About, Projects, and Contact.',
    });
    
    const assignment2 = await Assignment.create({
      title: 'Data Analysis Project',
      description: 'Analyze a real-world dataset using Python and Pandas',
      course: course2._id,
      teacher: teacher2._id,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      totalPoints: 100,
      passingScore: 70,
      isPublished: true,
      instructions: 'Choose a dataset, perform EDA, and create visualizations.',
    });
    
    console.log(`   ✅ Assignment: ${assignment1.title}`);
    console.log(`   ✅ Assignment: ${assignment2.title}`);
    
    // 6. Create Sample Announcements
    console.log('\n6️⃣  Creating sample announcements...');
    const announcement1 = await Announcement.create({
      title: 'Welcome to Aarambh LMS!',
      content: 'We are excited to have you join our learning platform. Explore courses, connect with teachers, and start your learning journey today!',
      author: admin._id,
      targetAudience: 'all',
      priority: 'high',
      category: 'general',
      isPinned: true,
    });
    
    console.log(`   ✅ Announcement: ${announcement1.title}`);
    
    // 7. Create Indexes
    console.log('\n7️⃣  Creating database indexes...');
    await User.collection.createIndex({ email: 1 });
    await User.collection.createIndex({ role: 1 });
    await Course.collection.createIndex({ teacher: 1 });
    await Course.collection.createIndex({ isPublished: 1 });
    await Assignment.collection.createIndex({ course: 1, dueDate: 1 });
    await Submission.collection.createIndex({ assignment: 1, student: 1 });
    await Discussion.collection.createIndex({ course: 1 });
    await Notification.collection.createIndex({ recipient: 1, isRead: 1 });
    await Attendance.collection.createIndex({ course: 1, student: 1, date: -1 });
    await Grade.collection.createIndex({ student: 1, course: 1 });
    console.log('   ✅ Indexes created successfully');
    
    console.log('\n' + '═'.repeat(80));
    console.log('\n🎉 Database initialized successfully!\n');
    
    // Summary
    console.log('📊 Database Summary:');
    console.log(`   • Total Users: ${await User.countDocuments()}`);
    console.log(`     - Admins: ${await User.countDocuments({ role: 'admin' })}`);
    console.log(`     - Teachers: ${await User.countDocuments({ role: 'teacher' })}`);
    console.log(`     - Students: ${await User.countDocuments({ role: 'student' })}`);
    console.log(`   • Courses: ${await Course.countDocuments()}`);
    console.log(`   • Assignments: ${await Assignment.countDocuments()}`);
    console.log(`   • Announcements: ${await Announcement.countDocuments()}`);
    
    console.log('\n📝 Test Credentials:');
    console.log('\n   👨‍💼 Admin:');
    console.log('      Email: admin@aarambh.edu');
    console.log('      Password: admin123');
    console.log('\n   👩‍🏫 Teacher:');
    console.log('      Email: sarah.johnson@aarambh.edu');
    console.log('      Password: teacher123');
    console.log('\n   👨‍🎓 Student:');
    console.log('      Email: alice.williams@student.aarambh.edu');
    console.log('      Password: student123');
    
    console.log('\n📚 Database Collections Created:');
    console.log('   1. users - Admin, Teachers, Students');
    console.log('   2. courses - Course content and modules');
    console.log('   3. assignments - Course assignments');
    console.log('   4. submissions - Student submissions');
    console.log('   5. discussions - Discussion forums');
    console.log('   6. notifications - User notifications');
    console.log('   7. attendance - Attendance tracking');
    console.log('   8. grades - Grade management');
    console.log('   9. announcements - System announcements');
    
    console.log('\n✅ All collections are ready to use!');
    console.log('📖 See DATABASE_STRUCTURE.md for detailed documentation.\n');
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed.\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

quickInitializeDatabase();
