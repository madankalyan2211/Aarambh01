# Aarambh LMS - Database Structure

## Overview

The Aarambh LMS uses MongoDB Atlas with a comprehensive database schema designed for educational platforms. The database name is `aarambh-lms` and contains 9 main collections.

## Collections

### 1. Users Collection

**Purpose**: Stores all user accounts (Admins, Teachers, Students)

**Schema Fields**:
- `name` (String, required): User's full name
- `email` (String, required, unique): User's email address
- `password` (String, required): Hashed password
- `role` (String, enum): 'student', 'teacher', or 'admin'
- `enrolledCourses` (Array): Course IDs for students
- `teachingCourses` (Array): Course IDs for teachers
- `avatar` (String): Profile picture URL
- `bio` (String): User biography
- `learningStreak` (Number): Consecutive days of activity
- `totalXP` (Number): Experience points earned
- `badges` (Array): Achievement badges
- `isVerified` (Boolean): Email verification status
- `isActive` (Boolean): Account status
- `lastLogin` (Date): Last login timestamp
- `otp` (Object): OTP code and expiry for authentication

**Indexes**:
- `email`: Unique index for fast lookups
- `role`: Index for filtering by user type

**Methods**:
- `comparePassword(candidatePassword)`: Verify password
- `generateOTP()`: Create 6-digit OTP
- `verifyOTP(candidateOTP)`: Validate OTP
- `toPublicProfile()`: Get sanitized user data

---

### 2. Courses Collection

**Purpose**: Stores course information and content

**Schema Fields**:
- `name` (String, required): Course name
- `description` (String, required): Course description
- `image` (String): Course thumbnail URL
- `teacher` (ObjectId, ref: User): Course instructor
- `modules` (Array): Course content modules
  - `title`, `description`, `order`
  - `lessons`: Array of lesson objects
- `maxStudents` (Number): Enrollment limit
- `enrolledStudents` (Array of ObjectIds): Student references
- `isPublished` (Boolean): Publication status
- `isActive` (Boolean): Active status
- `category` (String): Course category
- `tags` (Array): Searchable tags
- `difficulty` (String, enum): 'Beginner', 'Intermediate', 'Advanced'
- `totalEnrollments` (Number): Total enrollment count
- `averageRating` (Number): Average course rating
- `totalReviews` (Number): Number of reviews

**Indexes**:
- `teacher`: Index for teacher's courses
- `isPublished`: Index for published courses
- `name, description`: Text index for search

**Methods**:
- `enrollStudent(studentId)`: Enroll a student
- `unenrollStudent(studentId)`: Remove student enrollment

---

### 3. Assignments Collection

**Purpose**: Stores assignment details

**Schema Fields**:
- `title` (String, required): Assignment title
- `description` (String, required): Assignment description
- `course` (ObjectId, ref: Course): Associated course
- `teacher` (ObjectId, ref: User): Assignment creator
- `dueDate` (Date, required): Submission deadline
- `totalPoints` (Number): Maximum points
- `passingScore` (Number): Minimum passing score
- `instructions` (String): Detailed instructions
- `attachments` (Array): Reference materials
- `allowLateSubmission` (Boolean): Late submission policy
- `lateSubmissionPenalty` (Number): Penalty percentage
- `isPublished` (Boolean): Publication status
- `enableAIDetection` (Boolean): AI content detection
- `enablePlagiarismCheck` (Boolean): Plagiarism detection
- `totalSubmissions` (Number): Submission count
- `averageScore` (Number): Average student score

**Indexes**:
- `course, dueDate`: Index for course assignments

**Methods**:
- `isOverdue()`: Check if past due date

---

### 4. Submissions Collection

**Purpose**: Stores student assignment submissions

**Schema Fields**:
- `assignment` (ObjectId, ref: Assignment): Assignment reference
- `student` (ObjectId, ref: User): Student reference
- `course` (ObjectId, ref: Course): Course reference
- `content` (String, required): Submission content
- `attachments` (Array): Attached files
- `submittedAt` (Date): Submission timestamp
- `isLate` (Boolean): Late submission flag
- `score` (Number): Graded score
- `feedback` (String): Teacher feedback
- `gradedAt` (Date): Grading timestamp
- `gradedBy` (ObjectId, ref: User): Grader reference
- `status` (String, enum): 'submitted', 'graded', 'returned', 'resubmitted'
- `aiDetectionScore` (Number): AI content percentage
- `plagiarismScore` (Number): Plagiarism percentage
- `isFlagged` (Boolean): Flagged for review
- `flagReason` (String): Flag reason
- `attempt` (Number): Attempt number
- `previousVersions` (Array): Submission history

**Indexes**:
- `assignment, student`: Composite index
- `course, status`: Index for filtering

**Methods**:
- `calculateGrade(totalPoints)`: Get letter grade

---

### 5. Discussions Collection

**Purpose**: Course discussion forums

**Schema Fields**:
- `title` (String, required): Discussion title
- `content` (String, required): Discussion content
- `author` (ObjectId, ref: User): Post author
- `course` (ObjectId, ref: Course): Associated course
- `category` (String, enum): 'question', 'announcement', 'discussion', 'resource'
- `tags` (Array): Topic tags
- `replies` (Array): Nested replies
  - `author`, `content`, `createdAt`, `likes`
- `likes` (Array of ObjectIds): Users who liked
- `views` (Number): View count
- `isPinned` (Boolean): Pinned status
- `isResolved` (Boolean): Resolution status
- `isLocked` (Boolean): Lock status

**Indexes**:
- `course`: Index for course discussions

**Virtual Fields**:
- `replyCount`: Number of replies
- `likeCount`: Number of likes

---

### 6. Notifications Collection

**Purpose**: User notifications system

**Schema Fields**:
- `recipient` (ObjectId, ref: User, required): Notification recipient
- `sender` (ObjectId, ref: User): Notification sender
- `type` (String, enum): Notification type
  - Types: 'assignment_created', 'assignment_due', 'assignment_graded', 'course_enrolled', 'discussion_reply', 'announcement', 'grade_posted', 'system'
- `title` (String, required): Notification title
- `message` (String, required): Notification message
- `relatedCourse` (ObjectId, ref: Course): Related course
- `relatedAssignment` (ObjectId, ref: Assignment): Related assignment
- `relatedDiscussion` (ObjectId, ref: Discussion): Related discussion
- `isRead` (Boolean): Read status
- `readAt` (Date): Read timestamp
- `priority` (String, enum): 'low', 'medium', 'high', 'urgent'
- `actionUrl` (String): Action link
- `actionLabel` (String): Action button text

**Indexes**:
- `recipient, isRead, createdAt`: Composite index for filtering

**Methods**:
- `markAsRead()`: Mark notification as read

---

### 7. Attendance Collection

**Purpose**: Track student attendance

**Schema Fields**:
- `course` (ObjectId, ref: Course, required): Course reference
- `student` (ObjectId, ref: User, required): Student reference
- `teacher` (ObjectId, ref: User, required): Teacher reference
- `date` (Date, required): Attendance date
- `status` (String, enum, required): 'present', 'absent', 'late', 'excused'
- `remarks` (String): Additional notes
- `markedAt` (Date): Mark timestamp
- `sessionTitle` (String): Session/class title
- `sessionDuration` (Number): Duration in minutes

**Indexes**:
- `course, student, date`: Composite index
- `student, status`: Index for student attendance

**Static Methods**:
- `getAttendancePercentage(studentId, courseId)`: Calculate attendance percentage

---

### 8. Grades Collection

**Purpose**: Comprehensive grade management

**Schema Fields**:
- `student` (ObjectId, ref: User, required): Student reference
- `course` (ObjectId, ref: Course, required): Course reference
- `teacher` (ObjectId, ref: User, required): Teacher reference
- `assignments` (Array): Assignment scores
  - `assignment`, `score`, `maxScore`, `weight`
- `midtermScore` (Number): Midterm exam score
- `finalExamScore` (Number): Final exam score
- `participationScore` (Number): Participation score
- `totalScore` (Number): Calculated total score
- `letterGrade` (String, enum): Letter grade (A+, A, A-, B+, B, B-, C+, C, C-, D, F, I, W)
- `gradePoints` (Number): GPA points (0.0 - 4.0)
- `status` (String, enum): 'in_progress', 'completed', 'failed', 'withdrawn'
- `completedAt` (Date): Completion timestamp
- `teacherComments` (String): Teacher comments
- `isPublished` (Boolean): Grade publication status

**Indexes**:
- `student, course`: Unique composite index
- `course, status`: Index for filtering

**Methods**:
- `calculateFinalGrade()`: Calculate weighted final grade
- `getLetterGrade(score)`: Convert score to letter grade
- `getGradePoints(letterGrade)`: Get GPA points

---

### 9. Announcements Collection

**Purpose**: System and course announcements

**Schema Fields**:
- `title` (String, required): Announcement title
- `content` (String, required): Announcement content
- `author` (ObjectId, ref: User, required): Author reference
- `targetAudience` (String, enum): 'all', 'students', 'teachers', 'course_specific'
- `course` (ObjectId, ref: Course): Course reference (if course-specific)
- `priority` (String, enum): 'low', 'medium', 'high', 'urgent'
- `category` (String, enum): 'general', 'academic', 'event', 'deadline', 'system'
- `isPinned` (Boolean): Pin status
- `isPublished` (Boolean): Publication status
- `publishDate` (Date): Publish timestamp
- `expiryDate` (Date): Expiration date
- `attachments` (Array): Attached files
- `views` (Number): View count
- `readBy` (Array of ObjectIds): Users who read

**Indexes**:
- `targetAudience, isPinned, publishDate`: Composite index
- `course, isPublished`: Index for course announcements

**Methods**:
- `isActive()`: Check if announcement is currently active

---

## Database Initialization

### Quick Start

Run the initialization script to set up the database with sample data:

```bash
cd server
node initialize-database.js
```

This will create:
- 1 Admin user
- 3 Teacher users
- 8 Student users
- 3 Sample courses with content
- 2 Sample assignments
- 1 Welcome announcement
- All necessary indexes

### Test Credentials

**Admin Account**:
- Email: `admin@aarambh.edu`
- Password: `admin123`

**Teacher Account**:
- Email: `sarah.johnson@aarambh.edu`
- Password: `teacher123`

**Student Account**:
- Email: `alice.williams@student.aarambh.edu`
- Password: `student123`

---

## Database Management Scripts

### Initialize Database
```bash
node initialize-database.js
```
Creates all collections with sample data and indexes.

### Clear Database
```bash
node clear-database.js
```
Removes all data from the aarambh-lms database.

### View Users
```bash
node view-users.js
```
Display all users in the database.

### Test Connection
```bash
node test-connection.js
```
Verify MongoDB Atlas connection.

---

## Relationships

```
User (Admin)
  └── manages → System

User (Teacher)
  ├── teaches → Courses
  ├── creates → Assignments
  ├── grades → Submissions
  └── posts → Announcements

User (Student)
  ├── enrolls in → Courses
  ├── submits → Submissions
  ├── participates in → Discussions
  └── receives → Notifications

Course
  ├── has → Assignments
  ├── has → Discussions
  ├── has → Announcements
  ├── has → Grades
  └── tracks → Attendance

Assignment
  └── has → Submissions

Submission
  ├── belongs to → Assignment
  ├── belongs to → Student
  └── graded in → Grade
```

---

## Performance Considerations

1. **Indexes**: All critical queries are indexed for optimal performance
2. **Population**: Use `.populate()` selectively to avoid over-fetching
3. **Pagination**: Implement pagination for large datasets
4. **Caching**: Consider Redis for frequently accessed data
5. **Aggregation**: Use MongoDB aggregation pipeline for complex queries

---

## Security

1. **Password Hashing**: bcrypt with salt rounds = 10
2. **OTP**: 6-digit codes with 10-minute expiry
3. **JWT**: 7-day expiration for authentication tokens
4. **Validation**: Mongoose schema validation on all inputs
5. **Sanitization**: Email normalization and trimming

---

## Backup and Recovery

### MongoDB Atlas Automated Backups
- Continuous backups enabled
- Point-in-time recovery available
- Snapshot retention: 7 days (configurable)

### Manual Backup
```bash
mongodump --uri="mongodb+srv://..." --db=aarambh-lms --out=./backup
```

### Restore
```bash
mongorestore --uri="mongodb+srv://..." --db=aarambh-lms ./backup/aarambh-lms
```

---

## Environment Variables

Required environment variables in `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aarambh-lms
PORT=3001
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

---

## Migration Notes

When updating the schema:
1. Create migration scripts in `server/migrations/`
2. Test on development database first
3. Backup production data before migration
4. Update model files and documentation
5. Run migration during low-traffic periods

---

## Monitoring

Monitor database performance through:
- MongoDB Atlas Dashboard: https://cloud.mongodb.com
- Query Performance Insights
- Real-time Metrics
- Slow Query Analysis
- Index Usage Statistics

---

## Support

For database issues:
1. Check MongoDB Atlas connection status
2. Verify IP whitelisting configuration
3. Review server logs for error messages
4. Consult MongoDB Atlas documentation
5. Contact database administrator

---

## Future Enhancements

Planned database features:
- [ ] Quiz and Test collections
- [ ] Live Session tracking
- [ ] File Storage references (S3/GridFS)
- [ ] Analytics and Reporting collections
- [ ] Calendar Events collection
- [ ] Video Progress tracking
- [ ] Certificate Generation records
- [ ] Payment and Subscription records (if needed)
