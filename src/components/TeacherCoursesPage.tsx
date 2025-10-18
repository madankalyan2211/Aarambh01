import { useState, useEffect } from 'react';
import { Page } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { BookOpen, Users, Loader2, CheckCircle2, Plus, X } from 'lucide-react';
import { getAllCoursesAPI, getTeachingCourses, addTeachingCourse, removeTeachingCourse } from '../services/api.service';
import { useToast } from './ui/toast';

// Define the course type
interface Course {
  id: string;
  _id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  enrolledCount?: number;
  [key: string]: any; // Allow additional properties
}

interface TeacherCoursesPageProps {
  onNavigate: (page: Page) => void;
}

export function TeacherCoursesPage({ onNavigate }: TeacherCoursesPageProps) {
  const { showToast } = useToast();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [teachingCourses, setTeachingCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingCourses, setProcessingCourses] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const [allCoursesRes, teachingRes] = await Promise.all([
        getAllCoursesAPI(),
        getTeachingCourses(),
      ]);

      console.log('All Courses:', allCoursesRes);
      console.log('Teaching Courses:', teachingRes);

      if (allCoursesRes.success) {
        setAllCourses(allCoursesRes.data || []);
      }

      if (teachingRes.success) {
        setTeachingCourses(teachingRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get course ID consistently
  const getCourseId = (course: Course): string => {
    return course.id || course._id || '';
  };

  // Helper function to check if a teacher is teaching a course
  const isTeachingCourse = (courseId: string): boolean => {
    return teachingCourses.some(tc => {
      const teachingCourseId = getCourseId(tc);
      return teachingCourseId === courseId;
    });
  };

  const handleEnrollCourse = async (courseId: string) => {
    // Add course to processing state
    setProcessingCourses(prev => new Set(prev).add(courseId));
    
    try {
      const response = await addTeachingCourse(courseId);
      
      if (response.success) {
        showToast('success', 'Success', 'Course added to your teaching list');
        // Refresh courses to update the UI
        await fetchCourses();
      } else {
        showToast('error', 'Error', response.message || 'Failed to add course to teaching list');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      showToast('error', 'Error', 'Failed to add course to teaching list');
    } finally {
      // Remove course from processing state
      setProcessingCourses(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  const handleUnenrollCourse = async (courseId: string) => {
    // Add course to processing state
    setProcessingCourses(prev => new Set(prev).add(courseId));
    
    try {
      const response = await removeTeachingCourse(courseId);
      
      if (response.success) {
        showToast('success', 'Success', 'Course removed from your teaching list');
        // Refresh courses to update the UI
        await fetchCourses();
      } else {
        showToast('error', 'Error', response.message || 'Failed to remove course from teaching list');
      }
    } catch (error) {
      console.error('Error unenrolling from course:', error);
      showToast('error', 'Error', 'Failed to remove course from teaching list');
    } finally {
      // Remove course from processing state
      setProcessingCourses(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1>My Courses 📚</h1>
          <p className="text-muted-foreground">
            View the courses you teach
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-[#FF69B4]/10 to-secondary/10 border-[#FF69B4]/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FF69B4]/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6" style={{ color: '#FF69B4' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#FF69B4' }}>{teachingCourses.length}</p>
                <p className="text-xs text-muted-foreground">Teaching Courses</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-accent/10 to-[#FF69B4]/10 border-accent/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">
                  {teachingCourses.reduce((sum, course) => sum + (course.enrolledCount || 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
            </div>
          </Card>
        </div>

        {loading ? (
          <Card className="p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: '#FF69B4' }} />
            <p className="text-muted-foreground">Loading courses...</p>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* My Teaching Courses */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5" style={{ color: '#FF69B4' }} />
                <h2>My Teaching Courses ({teachingCourses.length})</h2>
              </div>

              {teachingCourses.length > 0 ? (
                <div className="space-y-3">
                  {teachingCourses.map((course, index) => {
                    const courseId = getCourseId(course);
                    return (
                      <motion.div
                        key={courseId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                      >
                        <Card className="p-4 bg-gradient-to-br from-[#FF69B4]/5 to-accent/5 border-[#FF69B4]/20">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg bg-[#FF69B4]/10 flex items-center justify-center shrink-0">
                              <BookOpen className="h-6 w-6" style={{ color: '#FF69B4' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold mb-1">{course.name}</h3>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {course.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge variant="outline" style={{ borderColor: '#FF69B4', color: '#FF69B4' }}>
                                  {course.difficulty}
                                </Badge>
                                <Badge variant="outline">{course.category}</Badge>
                                <Badge variant="outline">
                                  <Users className="h-3 w-3 mr-1" />
                                  {course.enrolledCount || 0} students
                                </Badge>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUnenrollCourse(courseId)}
                                disabled={processingCourses.has(courseId)}
                                className="border-[#FF69B4] text-[#FF69B4] hover:bg-[#FF69B4]/10"
                              >
                                {processingCourses.has(courseId) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <X className="h-4 w-4 mr-1" />
                                    Remove from Teaching
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-2">No courses yet</p>
                  <p className="text-sm text-muted-foreground">
                    You are not currently teaching any courses
                  </p>
                </Card>
              )}
            </div>

            {/* Available Courses - With enroll/unenroll functionality */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5" style={{ color: '#FF69B4' }} />
                <h2>All Available Courses ({allCourses.length})</h2>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {allCourses.map((course, index) => {
                  // Check if the teacher is already teaching this course
                  const courseId = getCourseId(course);
                  
                  // Only show courses that are not already being taught
                  if (isTeachingCourse(courseId)) {
                    return null;
                  }
                  
                  return (
                    <motion.div
                      key={courseId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <Card className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                            <BookOpen className="h-5 w-5 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium mb-1">{course.name}</h4>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {course.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              <Badge variant="outline" className="text-xs">{course.difficulty}</Badge>
                              <Badge variant="outline" className="text-xs">{course.category}</Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleEnrollCourse(courseId)}
                              disabled={processingCourses.has(courseId)}
                            >
                              {processingCourses.has(courseId) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add to Teaching
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
                {allCourses.length > 0 && allCourses.every(course => isTeachingCourse(getCourseId(course))) && (
                  <Card className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-2">No more courses available</p>
                    <p className="text-sm text-muted-foreground">
                      You are teaching all available courses
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}