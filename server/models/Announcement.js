const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Announcement content is required'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required'],
  },
  // Target audience
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'teachers', 'course_specific'],
    default: 'all',
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  // Announcement metadata
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  category: {
    type: String,
    enum: ['general', 'academic', 'event', 'deadline', 'system'],
    default: 'general',
  },
  // Visibility
  isPinned: {
    type: Boolean,
    default: false,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
  },
  // Attachments
  attachments: [{
    name: String,
    url: String,
    type: String,
  }],
  // Engagement
  views: {
    type: Number,
    default: 0,
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

// Index for querying
announcementSchema.index({ targetAudience: 1, isPinned: -1, publishDate: -1 });
announcementSchema.index({ course: 1, isPublished: 1 });

// Method to check if announcement is active
announcementSchema.methods.isActive = function() {
  if (!this.isPublished) return false;
  if (this.expiryDate && new Date() > this.expiryDate) return false;
  return true;
};

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
