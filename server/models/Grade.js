const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
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
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher is required'],
  },
  // Grade components
  assignments: [{
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
    },
    score: Number,
    maxScore: Number,
    weight: Number, // percentage weight in final grade
  }],
  midtermScore: {
    type: Number,
    default: null,
  },
  finalExamScore: {
    type: Number,
    default: null,
  },
  participationScore: {
    type: Number,
    default: null,
  },
  // Final grade
  totalScore: {
    type: Number,
    default: 0,
  },
  letterGrade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'I', 'W'],
    default: null,
  },
  gradePoints: {
    type: Number,
    default: 0,
  },
  // Status
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'failed', 'withdrawn'],
    default: 'in_progress',
  },
  completedAt: {
    type: Date,
  },
  // Comments
  teacherComments: {
    type: String,
    default: '',
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for querying
gradeSchema.index({ student: 1, course: 1 }, { unique: true });
gradeSchema.index({ course: 1, status: 1 });

// Method to calculate final grade
gradeSchema.methods.calculateFinalGrade = function() {
  let total = 0;
  let weights = 0;
  
  // Calculate assignment scores
  this.assignments.forEach(assignment => {
    if (assignment.score !== null && assignment.maxScore > 0) {
      const percentage = (assignment.score / assignment.maxScore) * 100;
      total += percentage * (assignment.weight / 100);
      weights += assignment.weight;
    }
  });
  
  // Add other components
  if (this.midtermScore !== null) {
    total += this.midtermScore * 0.25; // 25% weight
    weights += 25;
  }
  
  if (this.finalExamScore !== null) {
    total += this.finalExamScore * 0.35; // 35% weight
    weights += 35;
  }
  
  if (this.participationScore !== null) {
    total += this.participationScore * 0.1; // 10% weight
    weights += 10;
  }
  
  this.totalScore = weights > 0 ? total : 0;
  this.letterGrade = this.getLetterGrade(this.totalScore);
  this.gradePoints = this.getGradePoints(this.letterGrade);
  
  return this.totalScore;
};

// Method to get letter grade
gradeSchema.methods.getLetterGrade = function(score) {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 60) return 'D';
  return 'F';
};

// Method to get grade points (for GPA calculation)
gradeSchema.methods.getGradePoints = function(letterGrade) {
  const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D': 1.0, 'F': 0.0, 'I': 0.0, 'W': 0.0
  };
  return gradePoints[letterGrade] || 0.0;
};

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;
