# Aarambh LMS - Learning Management System

<div align="center">

![Aarambh LMS](https://img.shields.io/badge/Aarambh-LMS-ff69b4?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)

A comprehensive Learning Management System with role-based access for Admins, Teachers, and Students.

</div>

---

## 🌟 Features

### For Students 👨‍🎓
- Browse and enroll in courses
- Submit assignments with AI detection
- Track grades and attendance
- Participate in discussion forums
- Receive real-time notifications
- View learning progress and badges

### For Teachers 👩‍🏫
- Create and manage courses
- Create assignments with plagiarism detection
- Grade student submissions
- Mark attendance
- Post announcements
- Manage discussions
- View student analytics

### For Admins 👨‍💼
- Manage users (students, teachers)
- Oversee all courses
- System-wide announcements
- View analytics and reports
- Database management

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Aarambh
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   ```

3. **Configure environment variables**
   
   The `.env` file already exists in `/server/.env` with MongoDB Atlas credentials.
   
4. **Whitelist your IP in MongoDB Atlas** ⚠️ IMPORTANT
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Navigate to Network Access
   - Add your current IP address
   - Wait 2-3 minutes

5. **Initialize the database**
   ```bash
   cd server
   node quick-init-database.js
   ```

6. **Start the development servers**
   
   **Backend (Terminal 1):**
   ```bash
   cd server
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

---

## 🔐 Test Credentials

### Admin Account
- **Email**: `admin@aarambh.edu`
- **Password**: `admin123`

### Teacher Account
- **Email**: `sarah.johnson@aarambh.edu`
- **Password**: `teacher123`

### Student Account
- **Email**: `alice.williams@student.aarambh.edu`
- **Password**: `student123`

---

## 📊 Database Structure

The application uses MongoDB with **9 comprehensive collections**:

1. **Users** - Admin, Teachers, Students (role-based)
2. **Courses** - Course content with modules and lessons
3. **Assignments** - Tasks with AI detection and plagiarism check
4. **Submissions** - Student work with grading workflow
5. **Discussions** - Course forums with threaded replies
6. **Notifications** - Real-time user alerts
7. **Attendance** - Attendance tracking with statistics
8. **Grades** - Comprehensive grade management with GPA
9. **Announcements** - System and course-specific messages

📖 See [DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md) for detailed schema documentation.

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB Atlas** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service

---

## 📁 Project Structure

```
Aarambh/
├── src/                      # Frontend source code
│   ├── components/          # React components
│   ├── services/            # API services
│   ├── config/              # Configuration
│   └── styles/              # CSS styles
├── server/                   # Backend source code
│   ├── config/              # Database & email config
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Auth middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   └── server.js            # Entry point
├── DATABASE_STRUCTURE.md     # Database documentation
├── DATABASE_SETUP_GUIDE.md   # Setup instructions
├── DATABASE_DIAGRAM.md       # Visual relationships
└── README.md                 # This file
```

---

## 🗄️ Database Management

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
Removes all data (requires confirmation).

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
Verify MongoDB connectivity.

---

## 📚 Documentation

- **[DATABASE_SETUP_GUIDE.md](DATABASE_SETUP_GUIDE.md)** - Complete setup instructions
- **[DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md)** - Detailed schema documentation
- **[DATABASE_DIAGRAM.md](DATABASE_DIAGRAM.md)** - Visual database relationships
- **[MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)** - MongoDB Atlas configuration
- **[USER_REGISTRATION_GUIDE.md](USER_REGISTRATION_GUIDE.md)** - User registration process
- **[VOICE_ASSISTANT_GUIDE.md](VOICE_ASSISTANT_GUIDE.md)** - Voice assistant features

---

## 🔧 Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend
```bash
cd server
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
```

---

## 🎨 Design

The UI design is based on the Figma project:
https://www.figma.com/design/zkzPr2Es2INclQCyS2RrFL/Learning-Management-System-UI-Design

### Design Principles
- **Pink Accent** (#FF69B4) for key UI elements
- **Persistent Navigation** - Always visible
- **Theme Support** - Light and dark modes
- **Responsive Design** - Mobile-friendly

---

## 🐛 Troubleshooting

### Database Connection Issues
**Problem**: "Could not connect to MongoDB"
**Solution**: 
1. Whitelist your IP in MongoDB Atlas
2. Check `.env` file has correct URI
3. Verify internet connection

### Port Already in Use
**Problem**: "Port 3001 already in use"
**Solution**:
```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9
```

### Dependencies Issues
**Problem**: Module not found
**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Original Figma design by the LMS UI Design team
- MongoDB Atlas for database hosting
- Shadcn/ui for beautiful components
- The open-source community

---

## 🚀 Deployment

This project can be deployed to Render (backend) and Vercel (frontend). Follow the detailed [Deployment Guide](DEPLOYMENT_GUIDE.md) for step-by-step instructions.

### Quick Deployment Steps

1. **Backend (Render)**:
   - Create a new Web Service on Render
   - Connect your Git repository
   - Set the build command to `npm install` and start command to `npm start`
   - Configure environment variables as specified in [server/.env.production](server/.env.production)

2. **Frontend (Vercel)**:
   - Create a new Project on Vercel
   - Import your Git repository
   - Set the build command to `npm run build` and output directory to `dist`
   - Configure environment variables as specified in [.env.production](.env.production)

For detailed instructions, refer to the [Deployment Guide](DEPLOYMENT_GUIDE.md).

## 📞 Support

For issues and questions:
1. Check the documentation files
2. Review troubleshooting section
3. Open an issue on GitHub
4. Contact the development team

---

<div align="center">

**Built with ❤️ for education**

[Documentation](DATABASE_STRUCTURE.md) • [Setup Guide](DATABASE_SETUP_GUIDE.md) • [Database Diagram](DATABASE_DIAGRAM.md)

</div>