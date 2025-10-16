# Aarambh LMS - Complete Database Setup Guide

## 🎯 Overview

Your MongoDB database structure is now ready with **9 comprehensive collections** designed specifically for your Learning Management System.

---

## 📊 Database Collections Created

### Core Collections

1. **Users** - Admin, Teachers, and Students
   - Role-based access control (admin/teacher/student)
   - Password hashing with bcrypt
   - OTP authentication support
   - Learning statistics and badges

2. **Courses** - Course content and modules
   - Hierarchical module/lesson structure
   - Enrollment management
   - Category and difficulty levels
   - Student capacity limits

3. **Assignments** - Course assignments
   - Due date tracking
   - AI detection settings
   - Plagiarism check options
   - Late submission policies

4. **Submissions** - Student submissions
   - Grading workflow
   - Teacher feedback
   - Revision tracking
   - AI/Plagiarism scores

5. **Discussions** - Course forums
   - Questions and announcements
   - Threaded replies
   - Like and view tracking
   - Pin and resolve options

6. **Notifications** - User notifications
   - Multiple notification types
   - Priority levels
   - Read/unread status
   - Related entity references

7. **Attendance** - Attendance tracking
   - Status tracking (present/absent/late/excused)
   - Session details
   - Attendance percentage calculation
   - Teacher remarks

8. **Grades** - Comprehensive grading
   - Weighted assignments
   - Midterm and final exams
   - Letter grades and GPA points
   - Teacher comments

9. **Announcements** - System announcements
   - Target audience filtering
   - Priority and category
   - Pin and expiry dates
   - Read tracking

---

## 🚀 Quick Start - 3 Steps

### Step 1: Whitelist Your IP Address

**IMPORTANT**: Before running any database scripts, you must whitelist your IP address in MongoDB Atlas.

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Navigate to your cluster
3. Click "Network Access" in the left sidebar
4. Click "Add IP Address"
5. Choose one of these options:
   - **Recommended for Development**: Click "Add Current IP Address"
   - **For Testing Only**: Use `0.0.0.0/0` (allows all IPs - NOT secure for production)
6. Click "Confirm"
7. Wait 2-3 minutes for the changes to propagate

### Step 2: Initialize the Database

Once your IP is whitelisted, run the initialization script:

```bash
cd server
node quick-init-database.js
```

This will create:
- ✅ 1 Admin account
- ✅ 3 Teacher accounts
- ✅ 8 Student accounts
- ✅ 3 Sample courses with content
- ✅ 2 Sample assignments
- ✅ 1 Welcome announcement
- ✅ All database indexes for performance

### Step 3: Verify Setup

Check that everything is working:

```bash
node view-users.js
```

You should see all 12 users listed (1 admin + 3 teachers + 8 students).

---

## 🔐 Test Login Credentials

### Admin Account
- **Email**: `admin@aarambh.edu`
- **Password**: `admin123`
- **Role**: System Administrator

### Teacher Accounts

**Teacher 1 - Computer Science**
- **Email**: `sarah.johnson@aarambh.edu`
- **Password**: `teacher123`
- **Course**: Introduction to Web Development

**Teacher 2 - Data Science**
- **Email**: `michael.chen@aarambh.edu`
- **Password**: `teacher123`
- **Course**: Data Science with Python

**Teacher 3 - Physics**
- **Email**: `emily.rodriguez@aarambh.edu`
- **Password**: `teacher123`
- **Course**: Physics 101

### Student Accounts

All students have the same password: `student123`

- `alice.williams@student.aarambh.edu`
- `bob.martinez@student.aarambh.edu`
- `charlie.brown@student.aarambh.edu`
- `diana.prince@student.aarambh.edu`
- `ethan.hunt@student.aarambh.edu`
- `fiona.green@student.aarambh.edu`
- `george.wilson@student.aarambh.edu`
- `hannah.lee@student.aarambh.edu`

---

## 📁 New Files Created

### Model Files (Database Schemas)
- `/server/models/Attendance.js` - Attendance tracking schema
- `/server/models/Grade.js` - Grade management schema
- `/server/models/Announcement.js` - Announcement schema
- `/server/models/index.js` - Updated to export all models

### Database Scripts
- `/server/quick-init-database.js` - Quick database initialization (no prompts)
- `/server/initialize-database.js` - Interactive database initialization
- `/server/clear-sample-mflix.js` - Clear sample_mflix database (for your previous request)
- `/server/check-sample-mflix.js` - Check sample_mflix database contents

### Documentation
- `/DATABASE_STRUCTURE.md` - Comprehensive database documentation
- `/DATABASE_SETUP_GUIDE.md` - This file

---

## 🛠️ Database Management Commands

### Initialize Database
```bash
cd server
node quick-init-database.js
```
Creates all collections with sample data.

### Clear Database
```bash
cd server
node clear-database.js
```
Removes all data from aarambh-lms database (requires confirmation).

### View Users
```bash
cd server
node view-users.js
```
Display all users by role.

### Test Connection
```bash
cd server
node test-connection.js
```
Verify MongoDB Atlas connectivity.

---

## 🔗 Database Relationships

```
Admin
  └── Manages entire system
  └── Creates announcements for all users

Teacher
  ├── Creates and manages Courses
  ├── Creates Assignments
  ├── Grades Submissions
  ├── Marks Attendance
  ├── Posts Announcements
  └── Manages Discussions

Student
  ├── Enrolls in Courses
  ├── Submits Assignments
  ├── Participates in Discussions
  ├── Receives Notifications
  ├── Has Attendance records
  └── Has Grade records

Course
  ├── Has enrolled Students
  ├── Has Assignments
  ├── Has Discussions
  ├── Has Grades
  ├── Has Attendance records
  └── Has Announcements
```

---

## 🎨 Sample Data Included

### Courses Created

1. **Introduction to Web Development** (Beginner)
   - Teacher: Dr. Sarah Johnson
   - Category: Computer Science
   - Enrolled: 5 students
   - Modules: HTML Basics, CSS Fundamentals

2. **Data Science with Python** (Intermediate)
   - Teacher: Prof. Michael Chen
   - Category: Data Science
   - Enrolled: 5 students
   - Modules: Python Basics for Data Science

3. **Physics 101** (Beginner)
   - Teacher: Dr. Emily Rodriguez
   - Category: Physics
   - Enrolled: 6 students
   - Modules: Newton's Laws

### Assignments Created

1. **Build a Personal Portfolio Website**
   - Course: Web Development
   - Due: 7 days from initialization
   - Points: 100

2. **Data Analysis Project**
   - Course: Data Science
   - Due: 14 days from initialization
   - Points: 100

---

## 📊 Database Performance Features

### Indexes Created
- User email (unique)
- User role
- Course teacher
- Course published status
- Assignment course and due date
- Submission assignment and student
- Discussion course
- Notification recipient, read status, and date
- Attendance course, student, and date
- Grade student and course (unique)

### Query Optimization
All collections have appropriate indexes for:
- Fast user lookups by email and role
- Efficient course filtering
- Quick assignment queries by due date
- Optimized notification retrieval
- Attendance percentage calculations
- Grade report generation

---

## 🔒 Security Features

### Password Security
- Bcrypt hashing with salt rounds = 10
- Passwords never returned in queries (select: false)
- Password comparison method included

### OTP Authentication
- 6-digit random OTP generation
- 10-minute expiry
- Verification method included

### Data Validation
- Required field validation
- Email format validation
- Enum value validation
- Reference validation (foreign keys)

---

## 📖 Additional Resources

### MongoDB Atlas Dashboard
- URL: https://cloud.mongodb.com
- View real-time metrics
- Monitor query performance
- Manage backups
- Configure security settings

### Documentation Files
- `DATABASE_STRUCTURE.md` - Detailed schema documentation
- `MONGODB_ATLAS_SETUP.md` - Initial MongoDB setup guide
- `MONGODB_INTEGRATION_SUMMARY.md` - Integration overview

---

## 🐛 Troubleshooting

### Connection Issues

**Problem**: "Could not connect to any servers"
**Solution**: Whitelist your IP address in MongoDB Atlas (see Step 1 above)

**Problem**: "Authentication failed"
**Solution**: Check your `.env` file has the correct MongoDB URI

**Problem**: "Database already contains users"
**Solution**: Run `node clear-database.js` first to clear existing data

### Initialization Issues

**Problem**: "Cannot find module 'mongoose'"
**Solution**: Run `npm install` in the server directory

**Problem**: Script hangs or times out
**Solution**: Check your internet connection and MongoDB Atlas status

---

## 🔄 Re-initializing the Database

If you need to start fresh:

```bash
cd server

# Step 1: Clear existing data
node clear-database.js
# Type "YES" then "DELETE" when prompted

# Step 2: Re-initialize
node quick-init-database.js

# Step 3: Verify
node view-users.js
```

---

## 📈 Next Steps

Now that your database is set up, you can:

1. **Test the Login System**
   - Use the test credentials to login
   - Verify role-based access works

2. **Explore the Data**
   - Login as a student to see enrolled courses
   - Login as a teacher to see teaching courses
   - Login as admin to see all data

3. **Add More Data**
   - Create new courses
   - Add more students
   - Create assignments
   - Post announcements

4. **Integrate with Frontend**
   - The API endpoints are ready
   - All models are properly exported
   - Authentication is configured

---

## 💡 Tips

1. **Development**: Keep your IP whitelisted in MongoDB Atlas
2. **Production**: Use specific IP addresses, not 0.0.0.0/0
3. **Backups**: MongoDB Atlas provides automatic backups
4. **Monitoring**: Check the Atlas dashboard regularly
5. **Security**: Change default passwords in production

---

## 📞 Need Help?

If you encounter issues:
1. Check MongoDB Atlas connection status
2. Verify IP whitelisting
3. Review server logs for errors
4. Consult `DATABASE_STRUCTURE.md` for schema details
5. Check environment variables in `.env`

---

## ✅ Checklist

Before using the database, ensure:
- [ ] IP address is whitelisted in MongoDB Atlas
- [ ] Environment variables are configured in `.env`
- [ ] Dependencies are installed (`npm install`)
- [ ] Database initialization completed successfully
- [ ] Test login credentials work
- [ ] All 9 collections are created

---

**Your database is ready! Start building amazing educational experiences with Aarambh LMS! 🚀**
