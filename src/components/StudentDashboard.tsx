import { Page } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { motion } from 'motion/react';
import { BookOpen, Clock, Award, TrendingUp, Flame, Bot, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getStudentAssignments, getCourseById, getTeacherById } from '../data/mockData';
import { generateStudentQuote, getCachedQuote, cacheQuote } from '../services/ai.service';
import { getEnrolledCourses } from '../services/api.service';
import { useState, useEffect } from 'react';

interface StudentDashboardProps {
  onNavigate: (page: Page) => void;
  userName?: string; // Add userName prop
  userEmail?: string; // Add userEmail prop for filtering assignments
}

const enrolledCourses = [
  {
    id: 1,
    title: 'AI & Machine Learning',
    progress: 65,
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400',
    nextLesson: 'Neural Networks Basics',
  },
  {
    id: 2,
    title: 'Web Development',
    progress: 82,
    image: 'https://images.unsplash.com/photo-1565229284535-2cbbe3049123?w=400',
    nextLesson: 'React Hooks Advanced',
  },
  {
    id: 3,
    title: 'Digital Marketing',
    progress: 45,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
    nextLesson: 'SEO Strategies',
  },
];

const grades = [
  { assignment: 'AI Quiz #3', score: '95%', grade: 'A' },
  { assignment: 'React Project', score: '88%', grade: 'B+' },
  { assignment: 'Marketing Essay', score: '92%', grade: 'A-' },
];

const deadlines = [
  { id: 1, title: 'AI Assignment #4', course: 'AI & Machine Learning', dueDate: 'Tomorrow', daysLeft: 1, urgent: true, teacher: 'Dr. Sarah Chen' },
  { id: 2, title: 'Web Dev Project', course: 'Web Development', dueDate: 'In 3 days', daysLeft: 3, urgent: false, teacher: 'Prof. Michael Ross' },
  { id: 3, title: 'Marketing Quiz', course: 'Digital Marketing', dueDate: 'Next week', daysLeft: 7, urgent: false, teacher: 'Dr. Emma Wilson' },
];

const announcements = [
  { title: 'New AI Module Released', time: '2 hours ago' },
  { title: 'Discussion Forum Update', time: '1 day ago' },
  { title: 'Grades Posted for Quiz #3', time: '2 days ago' },
];

const motivationalQuotes = [
  "You're on fire! 🔥 Keep up the great work!",
  "Every expert was once a beginner. Keep learning! 📚",
  "Your dedication is inspiring! 💪",
  "Learning today, leading tomorrow! 🌟",
];

export function StudentDashboard({ onNavigate, userName = 'Student', userEmail = '' }: StudentDashboardProps) {
  const [motivationalQuote, setMotivationalQuote] = useState(
    "Every expert was once a beginner. Keep learning! 📚"
  );
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Fetch enrolled courses from backend
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoadingCourses(true);
      try {
        const response = await getEnrolledCourses();
        console.log('📚 Enrolled courses response:', response);
        
        if (response.success && response.data) {
          setEnrolledCourses(response.data);
        } else {
          console.error('❌ Failed to fetch enrolled courses:', response.message);
        }
      } catch (error) {
        console.error('❌ Error fetching enrolled courses:', error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  // Generate AI-powered motivational quote on mount
  useEffect(() => {
    const loadQuote = async () => {
      console.log('🤖 AI Quote: Starting generation...');
      console.log('🤖 AI Quote: User name:', userName);
      
      // Check if we have a cached quote for this session
      const cached = getCachedQuote('student');
      if (cached) {
        console.log('✅ AI Quote: Using cached quote:', cached);
        setMotivationalQuote(cached);
        return;
      }

      console.log('🔄 AI Quote: No cache, generating new quote...');
      // Generate new quote
      setIsLoadingQuote(true);
      try {
        const quote = await generateStudentQuote(userName);
        console.log('✅ AI Quote: Generated:', quote);
        setMotivationalQuote(quote);
        cacheQuote('student', quote);
      } catch (error) {
        console.error('❌ AI Quote: Error loading quote:', error);
        // Keep default quote on error
      } finally {
        setIsLoadingQuote(false);
      }
    };

    loadQuote();
  }, [userName]); // Re-generate when userName changes
  
  // Get assignments specific to this student based on their enrolled courses
  const studentAssignments = getStudentAssignments(userEmail);
  
  // Get the most urgent upcoming assignment from student's courses
  const nextAssignment = studentAssignments.length > 0 ? {
    ...studentAssignments[0],
    course: getCourseById(studentAssignments[0].courseId)?.name || 'Unknown Course',
    teacher: getTeacherById(studentAssignments[0].teacherId)?.name || 'Unknown Teacher',
  } : null;

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1>Welcome back, {userName}! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your learning journey</p>
        </div>

        {/* Top Row - Smart Next Step & Voice Command */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2"
          >
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <h3>Smart Next Step</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Based on your progress, we recommend completing this assignment
                  </p>
                  {nextAssignment ? (
                    <div className="space-y-3">
                      <div className="bg-card p-4 rounded-lg border-2 border-primary/40">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-semibold text-base mb-1">{nextAssignment.title}</p>
                            <p className="text-sm text-muted-foreground mb-2">
                              📚 {nextAssignment.course}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-xs">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-accent" />
                                <span className={nextAssignment.urgent ? 'text-accent font-semibold' : 'text-muted-foreground'}>
                                  Due: {nextAssignment.dueDate}
                                </span>
                              </span>
                              <span className="text-muted-foreground">
                                👨‍🏫 {nextAssignment.teacher}
                              </span>
                            </div>
                          </div>
                          {nextAssignment.urgent && (
                            <Badge className="bg-accent text-white shrink-0">Urgent</Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        className="w-full bg-primary hover:bg-accent"
                        onClick={() => onNavigate('assignment')}
                      >
                        Start Now →
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-card p-4 rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground">🎉 No pending assignments! Great job!</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 h-full flex flex-col justify-between bg-secondary/30">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-5 w-5 text-accent" />
                  <h3>Learning Streak</h3>
                </div>
                <div className="text-4xl mb-2">14 🔥</div>
                <p className="text-sm text-muted-foreground">Keep it going!</p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Motivational Quote - AI Generated */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30 relative overflow-hidden">
            {isLoadingQuote && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}
            <div className="flex items-center gap-2 justify-center">
              <Bot className="h-4 w-4 text-primary" />
              <p className="text-center text-lg">{motivationalQuote}</p>
            </div>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Courses & Deadlines */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enrolled Courses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2>My Courses</h2>
                <Button variant="ghost" size="sm" onClick={() => onNavigate('course')}>
                  View All
                </Button>
              </div>
              
              {loadingCourses ? (
                <Card className="p-12 text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: '#FF69B4' }} />
                  <p className="text-muted-foreground">Loading your courses...</p>
                </Card>
              ) : enrolledCourses.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {enrolledCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card
                        className="overflow-hidden cursor-pointer hover:shadow-lg transition-all border-secondary hover:border-[#FF69B4]/50"
                        onClick={() => onNavigate('course')}
                      >
                        <div className="relative h-32">
                          <ImageWithFallback
                            src={course.image}
                            alt={course.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <p className="absolute bottom-2 left-2 text-white text-sm font-medium">{course.name}</p>
                          {course.difficulty && (
                            <Badge 
                              className="absolute top-2 right-2 text-xs"
                              style={{ backgroundColor: '#FF69B4', color: 'white' }}
                            >
                              {course.difficulty}
                            </Badge>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold" style={{ color: '#FF69B4' }}>{course.progress}%</span>
                          </div>
                          <Progress 
                            value={course.progress} 
                            className="h-2 mb-3"
                          />
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-muted-foreground truncate">
                              📖 Next: {course.nextLesson}
                            </span>
                            {course.totalLessons > 0 && (
                              <span className="text-muted-foreground ml-2 shrink-0">
                                {course.totalLessons} lessons
                              </span>
                            )}
                          </div>
                          {course.instructor && (
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                              <div className="w-6 h-6 rounded-full bg-[#FF69B4]/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs">👨‍🏫</span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {course.instructor.name}
                              </p>
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Courses Available Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Enroll with a teacher to see their courses here!
                  </p>
                  <Button 
                    className="bg-[#FF69B4] hover:bg-[#FF69B4]/90 text-white"
                    onClick={() => onNavigate('my-teachers')}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Find Teachers
                  </Button>
                </Card>
              )}
            </motion.div>

            {/* Grades Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2>Recent Grades</h2>
                <Button variant="ghost" size="sm" onClick={() => onNavigate('grades')}>
                  View All
                </Button>
              </div>
              <Card>
                <div className="divide-y divide-border">
                  {grades.map((grade, index) => (
                    <div key={index} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                      <div>
                        <p>{grade.assignment}</p>
                        <p className="text-sm text-muted-foreground">Score: {grade.score}</p>
                      </div>
                      <Badge className="bg-primary text-white">{grade.grade}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Deadlines & Announcements */}
          <div className="space-y-6">
            {/* Deadlines */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <h2>Upcoming Deadlines</h2>
              </div>
              <Card>
                <div className="divide-y divide-border">
                  {studentAssignments.map((assignment) => {
                    const course = getCourseById(assignment.courseId);
                    const teacher = getTeacherById(assignment.teacherId);
                    
                    return (
                      <div key={assignment.id} className="p-4 hover:bg-secondary/10 transition-colors cursor-pointer" onClick={() => onNavigate('assignment')}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">{assignment.title}</p>
                            <p className="text-xs text-muted-foreground mb-1">
                              📚 {course?.name || 'Unknown Course'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              👨‍🏫 {teacher?.name || 'Unknown Teacher'}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {assignment.urgent && (
                              <Badge className="bg-accent text-white text-xs">Urgent</Badge>
                            )}
                            <span className={`text-xs ${assignment.urgent ? 'text-accent font-semibold' : 'text-muted-foreground'}`}>
                              {assignment.dueDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {studentAssignments.length === 0 && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      🎉 No pending assignments!
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Announcements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2>Announcements</h2>
              </div>
              <Card>
                <div className="divide-y divide-border">
                  {announcements.map((announcement, index) => (
                    <div key={index} className="p-4 hover:bg-secondary/20 transition-colors cursor-pointer">
                      <p className="text-sm">{announcement.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{announcement.time}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Radial Progress Graph */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-6">
                <h3 className="mb-4">Overall Progress</h3>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.64)}`}
                        className="text-primary transition-all duration-1000"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl">64%</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  You're doing great! Keep pushing forward.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
