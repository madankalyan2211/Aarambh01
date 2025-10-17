const express = require('express');
const {
  getPublicTeachers,
  getAllTeachers,
  getMyTeachers,
  enrollWithTeacher,
  unenrollFromTeacher,
  getMyStudents,
  enrollInCourseWithTeacher,
  unenrollFromCourse,
} = require('../controllers/enrollmentController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Test public route - no authentication required
router.get('/teachers/public/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Public test route working',
  });
});

// Public routes - no authentication required
router.get('/teachers/public', getPublicTeachers); // Get all available teachers (public)

// Apply authentication middleware to all subsequent routes
router.use(protect);

// Apply debug middleware only to protected routes
router.use((req, res, next) => {
  console.log('\n🔍 ENROLLMENT ROUTE DEBUG:');
  console.log('  Method:', req.method);
  console.log('  URL:', req.url);
  console.log('  Content-Type:', req.headers['content-type']);
  console.log('  Raw Body:', req.body);
  console.log('  Body Keys:', Object.keys(req.body));
  console.log('  Body JSON:', JSON.stringify(req.body));
  next();
});

// Teacher routes
router.get('/teachers', getAllTeachers); // Get all available teachers
router.get('/my-teachers', getMyTeachers); // Get student's enrolled teachers
router.post('/enroll-teacher', enrollWithTeacher); // Enroll with a teacher
router.post('/unenroll-teacher', unenrollFromTeacher); // Unenroll from a teacher

// Course enrollment routes (student)
router.post('/enroll-course', restrictTo('student'), enrollInCourseWithTeacher); // Enroll in course with teacher
router.post('/unenroll-course', restrictTo('student'), unenrollFromCourse); // Unenroll from course

// Student routes (for teachers)
router.get('/my-students', getMyStudents); // Get teacher's students

module.exports = router;