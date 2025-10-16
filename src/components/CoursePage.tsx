import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useToast } from './ui/toast';
import { RefreshCw, BookOpen, GraduationCap, Award, Loader2, CheckCircle, User } from 'lucide-react';
import { getAllCoursesAPI, getAllTeachers, getEnrolledCourses, enrollInCourseWithTeacher, unenrollFromCourseNew, getPublicCoursesAPI } from '../services/api.service';
import { UserRole } from '../App';

interface Course {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  tags: string[];
  maxStudents: number;
  enrolledCount: number;
  image: string;
  isEnrolled?: boolean;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  teachingCourses: string[];
}

interface CoursePageProps {
  userRole: UserRole;
  onNavigate: (page: string) => void;
  onViewCourse?: (courseId: string) => void;
}

export function CoursePage({ userRole, onNavigate, onViewCourse }: CoursePageProps) {
  const { showToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showTeacherDialog, setShowTeacherDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [showUnenrollDialog, setShowUnenrollDialog] = useState(false);
  const [courseToUnenroll, setCourseToUnenroll] = useState(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch data
  const fetchData = async (isManualRefresh = false) => {
    if (!isManualRefresh) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    
    try {
      let coursesResponse;
      
      // Use public courses endpoint for unauthenticated users, authenticated endpoint for logged-in users
      if (!userRole) {
        coursesResponse = await getPublicCoursesAPI();
      } else {
        // Fetch courses and teachers for authenticated users
        const [coursesRes, teachersRes] = await Promise.all([
          getAllCoursesAPI(),
          getAllTeachers(),
        ]);
        
        coursesResponse = coursesRes;
        
        if (teachersRes.success) {
          setTeachers(teachersRes.data || []);
        }
      }

      console.log('🔄 Fetching data...', { isManualRefresh });
      console.log('📊 Courses response:', coursesResponse);

      if (coursesResponse.success) {
        const coursesData = coursesResponse.data || [];
        setCourses(coursesData);
        
        // For students, extract enrolled course IDs from the isEnrolled flag
        if (userRole === 'student') {
          const enrolledIds = new Set(
            coursesData
              .filter(course => {
                console.log(`📝 Course ${course.name}: isEnrolled = ${course.isEnrolled}`);
                return course.isEnrolled === true;
              })
              .map(course => course.id)
          );
          console.log('📚 Explicitly enrolled course IDs:', Array.from(enrolledIds));
          setEnrolledCourseIds(enrolledIds);
        }
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('❌ Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get teachers teaching a specific course
  const getTeachersForCourse = (courseId) => {
    return teachers.filter(teacher => {
      if (!teacher.teachingCourses || !Array.isArray(teacher.teachingCourses)) {
        return false;
      }
      
      return teacher.teachingCourses.some(tc => {
        // Handle both populated (object) and unpopulated (string) course references
        if (typeof tc === 'string') {
          return tc === courseId;
        }
        // If it's an object, check both id and _id fields
        return tc.id === courseId || tc._id === courseId;
      });
    });
  };

  // Handle enrollment button click
  const handleEnrollClick = (course) => {
    const courseTeachers = getTeachersForCourse(course.id);
    
    console.log('🎓 Enroll button clicked for course:', course.name);
    console.log('🎓 Course ID:', course.id);
    console.log('🎓 Teachers found:', courseTeachers.length);
    
    if (courseTeachers.length === 0) {
      // No teachers available
      showToast('warning', 'No Teachers Available', 'No teachers have been assigned to this course yet. Please check back later.');
      return;
    }
    
    if (courseTeachers.length === 1) {
      // Auto-enroll with the only teacher
      console.log('🎓 Auto-enrolling with single teacher:', courseTeachers[0].name);
      handleEnrollWithTeacher(course.id, courseTeachers[0].id);
      return;
    }
    
    // Multiple teachers - show dialog
    console.log('🎓 Showing teacher selection dialog');
    setSelectedCourse(course);
    setAvailableTeachers(courseTeachers);
    setSelectedTeacherId(null); // Reset selection
    setShowTeacherDialog(true);
  };

  // Handle enrollment with selected teacher
  const handleEnrollWithTeacher = async (courseId, teacherId) => {
    console.log('🎓 Starting enrollment...');
    console.log('🎓 Course ID:', courseId);
    console.log('🎓 Teacher ID:', teacherId);
    
    setEnrolling(true);
    try {
      const response = await enrollInCourseWithTeacher(courseId, teacherId);
      
      console.log('🎓 Enrollment response:', response);
      
      if (response.success) {
        // Refresh data to update enrollment status
        await fetchData(true);
        setShowTeacherDialog(false);
        setSelectedTeacherId(null);
        showToast('success', 'Enrollment Successful', 'You have been successfully enrolled in the course!');
      } else {
        showToast('error', 'Enrollment Failed', response.message || 'Unable to enroll in this course.');
      }
    } catch (error) {
      console.error('❌ Enrollment error:', error);
      showToast('error', 'Enrollment Error', 'An error occurred during enrollment. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  // Handle Done button click in teacher selection dialog
  const handleDoneSelection = () => {
    if (!selectedTeacherId) {
      showToast('warning', 'Select a Teacher', 'Please select a teacher to continue.');
      return;
    }
    handleEnrollWithTeacher(selectedCourse?.id, selectedTeacherId);
  };

  // Handle unenrollment
  const handleUnenrollClick = (courseId) => {
    setCourseToUnenroll(courseId);
    setShowUnenrollDialog(true);
  };

  const confirmUnenroll = async () => {
    if (!courseToUnenroll) return;
    
    setEnrolling(true);
    try {
      const response = await unenrollFromCourseNew(courseToUnenroll);
      
      if (response.success) {
        // Refresh data to update enrollment status
        await fetchData(true);
        showToast('success', 'Unenrolled Successfully', 'You have been unenrolled from the course.');
      } else {
        showToast('error', 'Unenrollment Failed', response.message || 'Unable to unenroll from this course.');
      }
    } catch (error) {
      console.error('Unenrollment error:', error);
      showToast('error', 'Unenrollment Error', 'An error occurred during unenrollment. Please try again.');
    } finally {
      setEnrolling(false);
      setShowUnenrollDialog(false);
      setCourseToUnenroll(null);
    }
  };

  const categories = ['All', ...new Set(courses.map(course => course.category))];
  const filteredCourses = selectedCategory === 'All' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return '#10b981'; // green
      case 'Intermediate':
        return '#FF69B4'; // pink
      case 'Advanced':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1>All Courses 📚</h1>
            <p className="text-muted-foreground">
              Browse and explore all available courses
            </p>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-[#FF69B4]/10 to-secondary/10 border-[#FF69B4]/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FF69B4]/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6" style={{ color: '#FF69B4' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#FF69B4' }}>{courses.length}</p>
                <p className="text-xs text-muted-foreground">Total Courses</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-accent/10 to-[#FF69B4]/10 border-accent/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">
                  {categories.length - 1}
                </p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-secondary/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center">
                <Award className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {courses.filter(c => c.difficulty === 'Beginner').length}
                </p>
                <p className="text-xs text-muted-foreground">Beginner Friendly</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-[#FF69B4] hover:bg-accent' : ''}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <Card className="p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: '#FF69B4' }} />
            <p className="text-muted-foreground">Loading courses...</p>
          </Card>
        ) : filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Card className="p-6 h-full flex flex-col hover:shadow-xl transition-all border-secondary hover:border-[#FF69B4]/50">
                  {/* Course Image */}
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                      alt={course.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge 
                      variant="outline" 
                      className="absolute top-2 right-2 bg-white/90 dark:bg-black/90"
                      style={{ 
                        borderColor: getDifficultyColor(course.difficulty),
                        color: getDifficultyColor(course.difficulty)
                      }}
                    >
                      {course.difficulty}
                    </Badge>
                  </div>

                  <h3 className="font-bold mb-2">{course.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                    {course.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                      {course.tags && course.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Enrollment Button - Only for students */}
                    {userRole === 'student' && (
                      <div className="flex items-center justify-center mb-3">
                        {enrolledCourseIds.has(course.id) ? (
                          <Button
                            className="w-full border-2 font-medium"
                            variant="outline"
                            style={{ borderColor: '#FF69B4', color: '#FF69B4' }}
                            onClick={() => handleUnenrollClick(course.id)}
                            disabled={enrolling}
                          >
                            {enrolling ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            Unenroll
                          </Button>
                        ) : (
                          <Button
                            className="w-full font-medium text-white"
                            style={{ backgroundColor: '#FF69B4' }}
                            onClick={() => handleEnrollClick(course)}
                            disabled={enrolling}
                          >
                            {enrolling ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <BookOpen className="h-4 w-4 mr-2" />
                            )}
                            Enroll Now
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Teachers teaching this course */}
                    <div className="border-t pt-3">
                      <p className="text-xs font-medium mb-2" style={{ color: '#FF69B4' }}>
                        Teachers ({getTeachersForCourse(course.id).length})
                      </p>
                      {getTeachersForCourse(course.id).length > 0 ? (
                        <div className="space-y-2 max-h-32 overflow-y-auto mb-3">
                          {getTeachersForCourse(course.id).map((teacher, idx) => (
                            <div 
                              key={idx} 
                              className="flex items-center gap-2 p-2 bg-[#FF69B4]/5 rounded-lg hover:bg-[#FF69B4]/10 transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-[#FF69B4]/20 flex items-center justify-center text-sm">
                                👨‍🏫
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{teacher.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{teacher.email}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-secondary/30 rounded-lg mb-3">
                          <User className="h-8 w-8 text-muted-foreground mx-auto mb-1" />
                          <p className="text-xs text-muted-foreground">No teachers yet</p>
                        </div>
                      )}

                      {/* View Course Button */}
                      <Button
                        className="w-full bg-[#FF69B4] hover:bg-[#FF69B4]/90 text-black dark:text-white font-medium shadow-md hover:shadow-lg transition-all"
                        onClick={() => {
                          console.log('🔍 View Course clicked for course:', course);
                          console.log('🔍 course.id:', course.id);
                          console.log('🔍 course._id:', course._id);
                          const courseId = course.id || course._id;
                          console.log('🔍 Using courseId:', courseId);
                          onViewCourse?.(courseId);
                        }}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Course
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="mb-2">No Courses Found</h3>
            <p className="text-muted-foreground">
              {selectedCategory !== 'All' 
                ? `No courses available in ${selectedCategory} category`
                : 'No courses available at the moment'}
            </p>
          </Card>
        )}
      </div>

      {/* Teacher Selection Dialog */}
      <Dialog open={showTeacherDialog} onOpenChange={setShowTeacherDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: '#FF69B4' }}>Select a Teacher</DialogTitle>
            <DialogDescription>
              {selectedCourse?.name} is taught by multiple teachers. Please select one to enroll with.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto py-4">
            {availableTeachers.map((teacher) => (
              <motion.div
                key={teacher.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`p-4 cursor-pointer transition-all border-2 ${
                    selectedTeacherId === teacher.id 
                      ? 'border-[#FF69B4] bg-[#FF69B4]/5' 
                      : 'hover:border-[#FF69B4]/50'
                  }`}
                  onClick={() => setSelectedTeacherId(teacher.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#FF69B4]/20 flex items-center justify-center text-xl">
                      👨‍🏫
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-base">{teacher.name}</p>
                      <p className="text-sm text-muted-foreground">{teacher.email}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {teacher.studentCount || 0} students
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {teacher.courseCount || 0} courses
                        </span>
                      </div>
                    </div>
                    <div 
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedTeacherId === teacher.id ? 'border-[#FF69B4]' : 'border-gray-400'
                      }`}
                      style={{ borderColor: selectedTeacherId === teacher.id ? '#FF69B4' : undefined }}
                    >
                      {selectedTeacherId === teacher.id && (
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: '#FF69B4' }}
                        />
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowTeacherDialog(false);
                setSelectedTeacherId(null);
              }}
              disabled={enrolling}
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: '#FF69B4', color: 'white' }}
              onClick={handleDoneSelection}
              disabled={enrolling || !selectedTeacherId}
            >
              {enrolling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enrolling...
                </>
              ) : (
                'Done'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unenroll Confirmation Dialog */}
      <Dialog open={showUnenrollDialog} onOpenChange={setShowUnenrollDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: '#FF69B4' }}>Confirm Unenrollment</DialogTitle>
            <DialogDescription>
              Are you sure you want to unenroll from this course? You will lose access to all course materials.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowUnenrollDialog(false);
                setCourseToUnenroll(null);
              }}
              disabled={enrolling}
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: '#FF69B4', color: 'white' }}
              onClick={confirmUnenroll}
              disabled={enrolling}
            >
              {enrolling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Unenrolling...
                </>
              ) : (
                'Yes, Unenroll'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
