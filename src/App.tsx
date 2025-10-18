import { useState, useEffect } from 'react';
import { LoginRegistration } from './components/LoginRegistration';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { CoursePage } from './components/CoursePage';
import { AssignmentPage } from './components/AssignmentPage';
import { GradesPage } from './components/GradesPage';
import { GlobalDiscussionForum } from './components/GlobalDiscussionForum';
import { NotificationsPage } from './components/NotificationsPage';
import { AdminPanel } from './components/AdminPanel';
import { Navigation } from './components/Navigation';
import { MyTeachersPage } from './components/MyTeachersPage';
import { MyStudentsPage } from './components/MyStudentsPage';
import { TeacherCoursesPage } from './components/TeacherCoursesPage';
import { CourseContentViewer } from './components/CourseContentViewer';
import { Landing } from './components/Landing';
import { ToastProvider } from './components/ui/toast';
import { TeacherGradesPage } from './components/TeacherGradesPage';
import { MessagesPage } from './components/MessagesPage';
import { getCurrentUser } from './services/api.service';

export type UserRole = 'student' | 'teacher' | 'admin' | null;
export type Page = 'landing' | 'login' | 'student-dashboard' | 'teacher-dashboard' | 'course' | 'assignment' | 'grades' | 'discussion' | 'notifications' | 'admin' | 'my-teachers' | 'my-students' | 'teacher-courses' | 'course-content' | 'messages';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState(''); // Store user's name
  const [userEmail, setUserEmail] = useState(''); // Store user's email for data filtering
  const [userId, setUserId] = useState(''); // Store user's ID
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedDiscussionId, setSelectedDiscussionId] = useState('');
  const [selectedDiscussionCourseId, setSelectedDiscussionCourseId] = useState(''); // Add this for discussion context
  const [isDark, setIsDark] = useState(false); // Add dark mode state

  // Add effect to listen for course discussion events
  useEffect(() => {
    const handleViewCourseDiscussions = (event: CustomEvent) => {
      const courseId = event.detail;
      if (courseId) {
        setSelectedDiscussionCourseId(courseId);
        setCurrentPage('discussion');
      }
    };

    window.addEventListener('viewCourseDiscussions', handleViewCourseDiscussions as EventListener);
    return () => {
      window.removeEventListener('viewCourseDiscussions', handleViewCourseDiscussions as EventListener);
    };
  }, []);

  // Load user data from localStorage on app mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setUserEmail(userData.email || ''); // Load email
        setUserName(userData.name || 'User'); // Load name
        setUserId(userData._id || ''); // Load user ID
        // Optionally auto-login if user data exists
        // For now, just keep the data ready
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle hash changes for popup routing
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#messages') {
        setCurrentPage('messages');
      }
    };

    // Check initial hash
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleLogin = (role: UserRole, name?: string, email?: string) => {
    setUserRole(role);
    
    // If name or email is not provided, try to get it from localStorage
    let displayName = name;
    let userEmailAddress = email;
    let userIdValue = '';
    
    if (!displayName || !userEmailAddress) {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          displayName = displayName || userData.name;
          userEmailAddress = userEmailAddress || userData.email;
          userIdValue = userData._id || '';
        } catch (error) {
          console.error('Error parsing stored user data:', error);
        }
      }
    }
    
    setUserName(displayName || 'User'); // Store the name, default to 'User' if not provided
    setUserEmail(userEmailAddress || ''); // Store the email
    setUserId(userIdValue || ''); // Store the user ID
    
    if (role === 'student') {
      setCurrentPage('student-dashboard');
    } else if (role === 'teacher') {
      setCurrentPage('teacher-dashboard');
    } else if (role === 'admin') {
      setCurrentPage('admin');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserName(''); // Clear the name on logout
    setUserEmail(''); // Clear the email on logout
    setUserId(''); // Clear the user ID on logout
    // Optionally clear localStorage if you want to remove user data
    // localStorage.removeItem('userData');
    setCurrentPage('login');
  };

  const handleViewCourse = (courseId: string) => {
    console.log('🎓 View Course clicked - courseId:', courseId);
    console.log('🎓 courseId type:', typeof courseId);
    console.log('🎓 courseId is valid:', !!courseId);
    
    if (!courseId) {
      console.error('❌ Invalid courseId provided to handleViewCourse');
      return;
    }
    
    setSelectedCourseId(courseId);
    setCurrentPage('course-content');
  };

  // Add a function to navigate to discussions with course context
  const handleViewCourseDiscussions = (courseId: string) => {
    console.log('💬 View Course Discussions clicked - courseId:', courseId);
    
    if (!courseId) {
      console.error('❌ Invalid courseId provided to handleViewCourseDiscussions');
      return;
    }
    
    setSelectedDiscussionCourseId(courseId);
    setCurrentPage('discussion');
  };

  const handleBackToCourses = () => {
    setSelectedCourseId('');
    setCurrentPage('course');
  };

  const handleViewDiscussion = (discussionId: string) => {
    setSelectedDiscussionId(discussionId);
    setCurrentPage('discussion'); // We'll handle the thread view within the DiscussionForum
  };

  // Wrapper function to match the expected signature
  const handleNavigate = (page: string) => {
    // If navigating to messages, update the hash
    if (page === 'messages') {
      window.location.hash = 'messages';
    } else {
      // Clear hash for other pages
      if (window.location.hash) {
        history.pushState('', document.title, window.location.pathname + window.location.search);
      }
    }
    setCurrentPage(page as Page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onNavigate={handleNavigate} />;
      case 'login':
        return <LoginRegistration onLogin={handleLogin} />;
      case 'student-dashboard':
        return <StudentDashboard onNavigate={handleNavigate} userName={userName} userEmail={userEmail} />;
      case 'teacher-dashboard':
        return <TeacherDashboard onNavigate={handleNavigate} userName={userName} userEmail={userEmail} />;
      case 'my-teachers':
        return <MyTeachersPage onNavigate={handleNavigate} userEmail={userEmail} />;
      case 'my-students':
        return <MyStudentsPage onNavigate={handleNavigate} userEmail={userEmail} />;
      case 'teacher-courses':
        return <TeacherCoursesPage onNavigate={handleNavigate} />;
      case 'course':
        return <CoursePage onNavigate={handleNavigate} userRole={userRole} onViewCourse={handleViewCourse} />;
      case 'course-content':
        return <CourseContentViewer courseId={selectedCourseId} onBack={handleBackToCourses} />;
      case 'assignment':
        return <AssignmentPage onNavigate={handleNavigate} userRole={userRole} />;
      case 'grades':
        // Use different grade pages based on user role
        if (userRole === 'student') {
          return <GradesPage onNavigate={handleNavigate} />;
        } else if (userRole === 'teacher') {
          return <TeacherGradesPage onNavigate={handleNavigate} />;
        } else {
          return <GradesPage onNavigate={handleNavigate} />;
        }
      case 'discussion':
        return <GlobalDiscussionForum 
          onNavigate={handleNavigate} 
          userRole={userRole} 
          userName={userName}
        />;
      case 'notifications':
        return <NotificationsPage onNavigate={handleNavigate} />;
      case 'messages':
        return <MessagesPage 
          onNavigate={handleNavigate} 
          userRole={userRole} 
          userName={userName}
        />;
      default:
        // Default to dashboard based on role
        if (userRole === 'student') {
          return <StudentDashboard onNavigate={handleNavigate} userName={userName} userEmail={userEmail} />;
        } else if (userRole === 'teacher') {
          return <TeacherDashboard onNavigate={handleNavigate} userName={userName} userEmail={userEmail} />;
        } else {
          return <AdminPanel onNavigate={handleNavigate} />;
        }
    }
  };

  // Check if this is a popup window for messages
  const isMessagesPopup = window.name === 'Messages';

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        {!isMessagesPopup && userRole && (
          <Navigation
            userRole={userRole}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            currentPage={currentPage}
            isDark={isDark}
            onToggleDark={() => setIsDark(!isDark)}
            userId={userId}
          />
        )}

        {isMessagesPopup ? (
          <div className="min-h-screen bg-background">
            <MessagesPage 
              onNavigate={handleNavigate} 
              userRole={userRole} 
              userName={userName}
            />
          </div>
        ) : (
          renderPage()
        )}
      </div>
    </ToastProvider>
  );
}