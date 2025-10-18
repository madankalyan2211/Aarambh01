import { useState, useEffect } from 'react';
import { Page } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { BookOpen, Users, Loader2, CheckCircle2 } from 'lucide-react';
import { getAllCoursesAPI, getTeachingCourses } from '../services/api.service';

interface TeacherCoursesPageProps {
  onNavigate: (page: Page) => void;
}

export function TeacherCoursesPage({ onNavigate }: TeacherCoursesPageProps) {
  const [allCourses, setAllCourses] = useState([]);
  const [teachingCourses, setTeachingCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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
                  {teachingCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
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
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
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

            {/* Available Courses - Display only, no actions */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5" style={{ color: '#FF69B4' }} />
                <h2>All Available Courses ({allCourses.length})</h2>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {allCourses.map((course, index) => {
                  return (
                    <motion.div
                      key={course.id}
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
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="outline" className="text-xs">{course.difficulty}</Badge>
                              <Badge variant="outline" className="text-xs">{course.category}</Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}