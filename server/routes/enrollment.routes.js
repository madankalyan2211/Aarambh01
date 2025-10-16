const express = require('express');
const {
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

// Debug middleware to log request body
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

// Protected routes - require authentication
router.use(protect);

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
