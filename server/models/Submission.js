const mongoose = require('mongoose');

// Define attachment schema
const attachmentSchema = new mongoose.Schema({
  name: String,
  url: String,
  type: String,
  size: Number,
});

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: [true, 'Assignment is required'],
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required'],
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required'],
  },
  // Submission content
  content: {
    type: String,
    required: [true, 'Submission content is required'],
  },
  attachments: [attachmentSchema],
  // Submission metadata
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  isLate: {
    type: Boolean,
    default: false,
  },
  // Grading
  score: {
    type: Number,
    default: null,
  },
  feedback: {
    type: String,
    default: '',
  },
  gradedAt: {
    type: Date,
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // Status
  status: {
    type: String,
    enum: ['submitted', 'graded', 'returned', 'resubmitted'],
    default: 'submitted',
  },
  // AI Detection
  aiDetectionScore: {
    type: Number,
    default: null,
  },
  plagiarismScore: {
    type: Number,
    default: null,
  },
  isFlagged: {
    type: Boolean,
    default: false,
  },
  flagReason: {
    type: String,
    default: '',
  },
  // Revision
  attempt: {
    type: Number,
    default: 1,
  },
  previousVersions: [{
    content: String,
    submittedAt: Date,
    score: Number,
  }],
}, {
  timestamps: true,
});

// Index for querying
submissionSchema.index({ assignment: 1, student: 1 });
submissionSchema.index({ course: 1, status: 1 });

// Method to calculate grade
submissionSchema.methods.calculateGrade = function(totalPoints) {
  if (!this.score) return null;
  
  const percentage = (this.score / totalPoints) * 100;
  
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B+';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;