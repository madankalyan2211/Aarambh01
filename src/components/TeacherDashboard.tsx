import { Page } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { motion } from 'motion/react';
import { BookOpen, Users, ClipboardList, TrendingUp, BarChart3, LineChart, Bot } from 'lucide-react';
import { BarChart, Bar, LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateTeacherQuote, getCachedQuote, cacheQuote } from '../services/ai.service';
import { useState, useEffect } from 'react';

interface TeacherDashboardProps {
  onNavigate: (page: Page) => void;
  userName?: string; // Add userName prop
  userEmail?: string; // Add userEmail prop
}

const courses = [
  { id: 1, name: 'AI & Machine Learning', students: 45, pending: 12 },
  { id: 2, name: 'Web Development', students: 38, pending: 8 },
  { id: 3, name: 'Digital Marketing', students: 52, pending: 15 },
];

const engagementData = [
  { name: 'Mon', engagement: 75 },
  { name: 'Tue', engagement: 82 },
  { name: 'Wed', engagement: 68 },
  { name: 'Thu', engagement: 88 },
  { name: 'Fri', engagement: 91 },
  { name: 'Sat', engagement: 45 },
  { name: 'Sun', engagement: 38 },
];

const performanceData = [
  { name: 'Week 1', score: 72 },
  { name: 'Week 2', score: 78 },
  { name: 'Week 3', score: 75 },
  { name: 'Week 4', score: 85 },
  { name: 'Week 5', score: 88 },
  { name: 'Week 6', score: 92 },
];

const motivationalQuotes = [
  "Great teachers inspire! 🌟 Your impact is immeasurable.",
  "Teaching is the profession that creates all others. 📚",
  "You're shaping futures, one lesson at a time! 💡",
  "Your dedication makes a difference every day! 🎓",
];

export function TeacherDashboard({ onNavigate, userName = 'Professor', userEmail = '' }: TeacherDashboardProps) {
  const [motivationalQuote, setMotivationalQuote] = useState(
    "Great teachers inspire! 🌟 Your impact is immeasurable."
  );
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  // Generate AI-powered motivational quote on mount
  useEffect(() => {
    const loadQuote = async () => {
      // Check if we have a cached quote for this session
      const cached = getCachedQuote('teacher');
      if (cached) {
        setMotivationalQuote(cached);
        return;
      }

      // Generate new quote
      setIsLoadingQuote(true);
      try {
        const quote = await generateTeacherQuote(userName);
        setMotivationalQuote(quote);
        cacheQuote('teacher', quote);
      } catch (error) {
        console.error('Error loading quote:', error);
        // Keep default quote on error
      } finally {
        setIsLoadingQuote(false);
      }
    };

    loadQuote();
  }, [userName]); // Re-generate when userName changes

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1>Welcome, {userName}! 👨‍🏫</h1>
          <p className="text-muted-foreground">Manage your courses and track student progress</p>
        </div>

        {/* Motivational Quote - AI Generated */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
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

        {/* Performance Predictor */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30 h-full">
              <div className="flex items-start justify-between h-full flex-col">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3>Performance Predictor</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    AI-powered insights on student success rates
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Predicted Pass Rate</span>
                      <Badge className="bg-primary text-white">87% ↑</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">At-Risk Students</span>
                      <Badge variant="outline" className="border-accent text-accent">5</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-secondary/30 h-full">
              <div className="flex items-start justify-between h-full flex-col">
                <div className="flex-1">
                  <h3 className="mb-2">Quick Stats</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Overview of your teaching activities
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Students</span>
                      <Badge className="bg-primary/10 text-primary">142</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Courses</span>
                      <Badge className="bg-primary/10 text-primary">4</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Courses & Announcements */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Courses */}
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
              <div className="grid gap-4">
                {courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card
                      className="p-4 cursor-pointer hover:shadow-lg transition-all border-secondary"
                      onClick={() => onNavigate('course')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-sm">{course.name}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {course.students} students
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <ClipboardList className="h-3 w-3" />
                                {course.pending} pending
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Manage</Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Insights Board */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="mb-4">Insights Board</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Engagement Chart */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <h3 className="text-sm">Weekly Engagement</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="engagement" fill="#FF69B4" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Performance Chart */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <LineChart className="h-5 w-5 text-primary" />
                    <h3 className="text-sm">Performance Trend</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsLine data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#FF1493"
                        strokeWidth={2}
                        dot={{ fill: '#FF1493', r: 4 }}
                      />
                    </RechartsLine>
                  </ResponsiveContainer>
                </Card>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Announcements Editor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="mb-4">Create Announcement</h2>
            <Card className="p-4">
              <div className="space-y-4">
                <Textarea
                  placeholder="Share updates with your students..."
                  className="min-h-[200px] resize-none"
                />
                <div className="flex gap-2">
                  <Button className="flex-1 bg-primary hover:bg-accent">
                    Post Announcement
                  </Button>
                  <Button variant="outline">Save Draft</Button>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-4 mt-6">
              <h3 className="mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Students</span>
                  <span className="text-xl">135</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Courses</span>
                  <span className="text-xl">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending Reviews</span>
                  <Badge className="bg-accent text-white">35</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Score</span>
                  <span className="text-xl text-primary">85%</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
