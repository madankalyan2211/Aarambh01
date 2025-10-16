// Export all models from a single file for easy importing

const User = require('./User');
const Course = require('./Course');
const Assignment = require('./Assignment');
const Submission = require('./Submission');
const Discussion = require('./Discussion');
const Notification = require('./Notification');
const Attendance = require('./Attendance');
const Grade = require('./Grade');
const Announcement = require('./Announcement');

module.exports = {
  User,
  Course,
  Assignment,
  Submission,
  Discussion,
  Notification,
  Attendance,
  Grade,
  Announcement,
};
