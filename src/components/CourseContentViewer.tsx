import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ArrowLeft, 
  PlayCircle, 
  FileText, 
  CheckCircle, 
  Lock,
  Clock,
  ChevronRight,
  ChevronDown,
  Award,
  Download,
  ExternalLink
} from 'lucide-react';
import { getCourseContentAPI } from '../services/api.service';

interface CourseContentViewerProps {
  courseId: string;
  onBack: () => void;
}

export function CourseContentViewer({ courseId, onBack }: CourseContentViewerProps) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [expandedModules, setExpandedModules] = useState(new Set([0]));

  useEffect(() => {
    fetchCourseContent();
    // Load completed lessons from localStorage
    const saved = localStorage.getItem(`course_${courseId}_progress`);
    if (saved) {
      setCompletedLessons(new Set(JSON.parse(saved)));
    }
  }, [courseId]);

  const fetchCourseContent = async () => {
    console.log('📚 Fetching course content for courseId:', courseId);
    console.log('📚 courseId type:', typeof courseId);
    console.log('📚 courseId valid:', !!courseId);
    
    if (!courseId) {
      console.error('❌ No courseId provided to CourseContentViewer');
      setError('No course ID provided');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // Fetch from actual API
      const response = await getCourseContentAPI(courseId);
      console.log('📚 API Response:', response);
      
      if (response.success && response.data) {
        console.log('📚 Course data received:', response.data);
        console.log('📚 Modules:', response.data.modules);
        if (response.data.modules && response.data.modules.length > 0) {
          console.log('📚 First module:', response.data.modules[0]);
          if (response.data.modules[0].lessons && response.data.modules[0].lessons.length > 0) {
            console.log('📚 First lesson:', response.data.modules[0].lessons[0]);
            console.log('📚 First lesson content:', response.data.modules[0].lessons[0].content);
          }
        }
        setCourse(response.data);
        // Auto-select first lesson if modules exist
        if (response.data.modules && response.data.modules.length > 0) {
          const firstModule = response.data.modules[0];
          if (firstModule.lessons && firstModule.lessons.length > 0) {
            const firstLesson = firstModule.lessons[0];
            console.log('📚 Auto-selecting first lesson:', firstLesson);
            setSelectedLesson(firstLesson);
          }
        }
      } else {
        console.error('❌ Failed to fetch course content:', response.message);
        console.error('❌ Response:', response);
        setError(response.message || 'Failed to load course content');
      }
    } catch (error) {
      console.error('❌ Error fetching course content:', error);
      setError(error.message || 'An error occurred while loading the course');
    } finally {
      setLoading(false);
    }
  };

  const toggleModuleExpand = (moduleId: number) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      // Save to localStorage
      localStorage.setItem(`course_${courseId}_progress`, JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const getTotalLessons = () => {
    if (!course || !course.modules) return 0;
    return course.modules.reduce((total: number, module: any) => 
      total + (module.lessons?.length || 0), 0
    );
  };

  const getProgress = () => {
    const total = getTotalLessons();
    if (total === 0) return 0;
    return Math.round((completedLessons.size / total) * 100);
  };

  const renderLessonContent = () => {
    if (!selectedLesson) {
      return (
        <Card className="p-12 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Select a Lesson</h3>
          <p className="text-muted-foreground">
            Choose a lesson from the sidebar to start learning
          </p>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* Lesson Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {selectedLesson.type === 'video' && <PlayCircle className="h-5 w-5" style={{ color: '#FF69B4' }} />}
            {selectedLesson.type === 'text' && <FileText className="h-5 w-5" style={{ color: '#FF69B4' }} />}
            {selectedLesson.type === 'pdf' && <Download className="h-5 w-5" style={{ color: '#FF69B4' }} />}
            <h2 className="text-2xl font-bold">{selectedLesson.title || 'Lesson'}</h2>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{selectedLesson.duration || 0} min</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {selectedLesson.type ? selectedLesson.type.toUpperCase() : 'LESSON'}
            </Badge>
            {selectedLesson.isPreview && (
              <Badge variant="outline" className="text-xs" style={{ borderColor: '#FF69B4', color: '#FF69B4' }}>
                Free Preview
              </Badge>
            )}
          </div>
        </div>

        {/* Video Player */}
        {selectedLesson.type === 'video' && selectedLesson.videoUrl && (
          <Card className="p-0 overflow-hidden">
            <div className="aspect-video bg-secondary/20">
              <iframe
                src={selectedLesson.videoUrl}
                className="w-full h-full"
                allowFullScreen
                title={selectedLesson.title}
              />
            </div>
          </Card>
        )}

        {/* PDF Viewer */}
        {selectedLesson.type === 'pdf' && selectedLesson.pdfUrl && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">PDF Document</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(selectedLesson.pdfUrl, '_blank')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(selectedLesson.pdfUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          </Card>
        )}

        {/* Lesson Content - Enhanced Display */}
        {selectedLesson.content ? (
          <Card className="p-8">
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              style={{
                fontSize: '1.125rem',
                lineHeight: '1.75',
              }}
            >
              {/* Check if content is HTML or plain text */}
              {selectedLesson.content.includes('<') ? (
                <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
              ) : (
                // Convert plain text to formatted paragraphs
                selectedLesson.content.split('\n').map((paragraph, idx) => (
                  paragraph.trim() ? (
                    <p key={idx} className="mb-4 text-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ) : null
                ))
              )}
            </div>
          </Card>
        ) : (
          <Card className="p-12 text-center bg-secondary/20">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Content Available Yet</h3>
            <p className="text-muted-foreground">
              The detailed lesson content will be added soon by the instructor.
            </p>
          </Card>
        )}

        {/* Additional Resources (if available) */}
        {selectedLesson.resources && selectedLesson.resources.length > 0 && (
          <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Download className="h-5 w-5" style={{ color: '#FF69B4' }} />
              Additional Resources
            </h3>
            <div className="space-y-2">
              {selectedLesson.resources.map((resource: any, idx: number) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open(resource.url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {resource.title}
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Mark as Complete Button */}
        <Card className="p-4">
          <Button
            className="w-full"
            variant={completedLessons.has(selectedLesson.id) ? 'outline' : 'default'}
            style={!completedLessons.has(selectedLesson.id) ? { 
              backgroundColor: '#FF69B4',
              color: 'white'
            } : {}}
            onClick={() => toggleLessonComplete(selectedLesson.id)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {completedLessons.has(selectedLesson.id) ? 'Completed ✓' : 'Mark as Complete'}
          </Button>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="p-12 text-center">
          <BookOpen className="h-12 w-12 animate-pulse mx-auto mb-4" style={{ color: '#FF69B4' }} />
          <p className="text-muted-foreground">Loading course content...</p>
        </Card>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <p className="text-lg text-muted-foreground mb-2">
            {error || 'Course not found'}
          </p>
          {error && (
            <p className="text-sm text-muted-foreground mb-4">
              Please make sure you are logged in and try again.
            </p>
          )}
          <Button className="mt-4" onClick={onBack}>Go Back</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
              <p className="text-muted-foreground mb-4">{course.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{course.category}</Badge>
                <Badge variant="outline" style={{ borderColor: '#FF69B4', color: '#FF69B4' }}>
                  {course.difficulty}
                </Badge>
                {course.tags?.map((tag: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Progress Card */}
            <Card className="p-6 w-64">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-2 flex items-center justify-center">
                  <svg className="absolute transform -rotate-90" width="128" height="128" viewBox="0 0 128 128">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="11"
                      fill="none"
                      className="text-secondary"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#FF69B4"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - getProgress() / 100)}`}
                      className="transition-all duration-300"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="relative z-10 flex items-center justify-center">
                    <span className="text-3xl font-bold" style={{ color: '#FF69B4' }}>
                      {getProgress()}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {completedLessons.size} of {getTotalLessons()} lessons completed
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar - Course Modules */}
          <div className="space-y-2">
            <Card className="p-4">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5" style={{ color: '#FF69B4' }} />
                Course Content
              </h3>
              <div className="space-y-1">
                {(course.modules || []).map((module: any, moduleIdx: number) => (
                  <div key={module.id || `module-${moduleIdx}`}>
                    {/* Module Header */}
                    <button
                      className="w-full text-left p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                      onClick={() => toggleModuleExpand(module.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">Module {moduleIdx + 1}</p>
                          <p className="text-xs text-muted-foreground truncate">{module.title}</p>
                        </div>
                        {expandedModules.has(module.id) ? (
                          <ChevronDown className="h-4 w-4 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 flex-shrink-0" />
                        )}
                      </div>
                    </button>

                    {/* Lessons List */}
                    <AnimatePresence>
                      {expandedModules.has(module.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-2 space-y-1 overflow-hidden"
                        >
                          {module.lessons?.map((lesson: any) => (
                            <button
                              key={lesson.id || `lesson-${moduleIdx}-${Math.random()}`}
                              className={`w-full text-left p-2 rounded-lg transition-colors ${
                                selectedLesson?.id === lesson.id
                                  ? 'bg-[#FF69B4]/10 border-l-2 border-[#FF69B4]'
                                  : 'hover:bg-secondary/30'
                              }`}
                              onClick={() => setSelectedLesson(lesson)}
                            >
                              <div className="flex items-center gap-2">
                                {completedLessons.has(lesson.id) ? (
                                  <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: '#FF69B4' }} />
                                ) : lesson.type === 'video' ? (
                                  <PlayCircle className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                ) : lesson.type === 'pdf' ? (
                                  <Download className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                ) : (
                                  <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm truncate">{lesson.title}</p>
                                  <p className="text-xs text-muted-foreground">{lesson.duration} min</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                {(!course.modules || course.modules.length === 0) && (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No modules available</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div>
            {renderLessonContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
