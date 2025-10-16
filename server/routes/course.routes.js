const express = require('express');
const {
  getPublicCourses,
  getAllCourses,
  getTeacherCourses,
  addTeachingCourse,
  removeTeachingCourse,
  getCourseContent,
  getEnrolledCourses,
  enrollInCourse,
  unenrollFromCourse,
} = require('../controllers/courseController');
const { protect, restrictTo, isVerified } = require('../middleware/auth');

const router = express.Router();

// Public route - no authentication required
router.get('/public', getPublicCourses);

// Protected routes - require authentication
router.use(protect);
router.use(isVerified);

// Get all courses (with enrollment status for authenticated users)
router.get('/', getAllCourses);

// Get course content (students and teachers)
router.get('/:courseId/content', getCourseContent);

// Student-specific routes
router.get('/enrolled', restrictTo('student'), getEnrolledCourses); // Get student's enrolled courses
router.post('/enroll', restrictTo('student'), enrollInCourse); // Student enrolls in course
router.post('/unenroll', restrictTo('student'), unenrollFromCourse); // Student unenrolls

// Teacher-specific routes
router.get('/teaching', restrictTo('teacher', 'admin'), getTeacherCourses);
router.post('/add-teaching', restrictTo('teacher'), addTeachingCourse); // Teacher adds course to teach
router.post('/remove-teaching', restrictTo('teacher'), removeTeachingCourse); // Teacher removes course

module.exports = router;