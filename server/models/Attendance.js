const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required'],
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required'],
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher is required'],
  },
  // Attendance details
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    required: true,
  },
  // Additional information
  remarks: {
    type: String,
    default: '',
  },
  markedAt: {
    type: Date,
    default: Date.now,
  },
  // Session details
  sessionTitle: {
    type: String,
    default: '',
  },
  sessionDuration: {
    type: Number, // in minutes
    default: 60,
  },
}, {
  timestamps: true,
});

// Index for querying
attendanceSchema.index({ course: 1, student: 1, date: -1 });
attendanceSchema.index({ student: 1, status: 1 });

// Static method to get attendance percentage
attendanceSchema.statics.getAttendancePercentage = async function(studentId, courseId) {
  const total = await this.countDocuments({ student: studentId, course: courseId });
  const present = await this.countDocuments({ 
    student: studentId, 
    course: courseId, 
    status: { $in: ['present', 'late'] }
  });
  
  return total > 0 ? (present / total) * 100 : 0;
};

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
