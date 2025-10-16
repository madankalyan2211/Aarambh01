import { Page } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { Users, BookOpen, Activity, AlertTriangle, Server, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminPanelProps {
  onNavigate: (page: Page) => void;
}

const users = [
  { id: 1, name: 'Sarah Chen', role: 'Student', status: 'Active', enrolled: 3 },
  { id: 2, name: 'Dr. Jane Smith', role: 'Teacher', status: 'Active', courses: 2 },
  { id: 3, name: 'Alex Rivera', role: 'Student', status: 'Active', enrolled: 4 },
  { id: 4, name: 'Prof. Mike Johnson', role: 'Teacher', status: 'Active', courses: 1 },
  { id: 5, name: 'Emma Wilson', role: 'Student', status: 'Inactive', enrolled: 2 },
];

const courses = [
  { id: 1, name: 'AI & Machine Learning', students: 45, teacher: 'Dr. Jane Smith', status: 'Active' },
  { id: 2, name: 'Web Development', students: 38, teacher: 'Prof. Mike Johnson', status: 'Active' },
  { id: 3, name: 'Digital Marketing', students: 52, teacher: 'Dr. Jane Smith', status: 'Active' },
];

const activityData = [
  { date: 'Mon', users: 145 },
  { date: 'Tue', users: 162 },
  { date: 'Wed', users: 138 },
  { date: 'Thu', users: 178 },
  { date: 'Fri', users: 195 },
  { date: 'Sat', users: 89 },
  { date: 'Sun', users: 72 },
];

const enrollmentData = [
  { month: 'Jan', enrolled: 320 },
  { month: 'Feb', enrolled: 385 },
  { month: 'Mar', enrolled: 412 },
  { month: 'Apr', enrolled: 478 },
  { month: 'May', enrolled: 523 },
  { month: 'Jun', enrolled: 567 },
];

const flaggedSubmissions = [
  { id: 1, student: 'John Doe', assignment: 'AI Essay', reason: 'High AI similarity', risk: 'High' },
  { id: 2, student: 'Jane Smith', assignment: 'Web Project', reason: 'Unusual patterns', risk: 'Medium' },
  { id: 3, student: 'Bob Wilson', assignment: 'Marketing Quiz', reason: 'Plagiarism detected', risk: 'High' },
];

export function AdminPanel({ onNavigate }: AdminPanelProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1>Admin Panel</h1>
          <p className="text-muted-foreground">Manage users, courses, and monitor system health</p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-primary" />
                <Badge variant="outline" className="border-primary text-primary">+12%</Badge>
              </div>
              <p className="text-2xl mb-1">567</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 bg-secondary/30">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="h-5 w-5 text-accent" />
                <Badge variant="outline" className="border-accent text-accent">+3</Badge>
              </div>
              <p className="text-2xl mb-1">24</p>
              <p className="text-sm text-muted-foreground">Active Courses</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-5 w-5 text-primary" />
                <Badge variant="outline" className="border-primary text-primary">+8%</Badge>
              </div>
              <p className="text-2xl mb-1">92%</p>
              <p className="text-sm text-muted-foreground">Engagement Rate</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 bg-accent/10 border-accent/30">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="h-5 w-5 text-accent" />
                <Badge className="bg-accent text-white">3</Badge>
              </div>
              <p className="text-2xl mb-1">Alerts</p>
              <p className="text-sm text-muted-foreground">Flagged Items</p>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="courses">Course Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
          </TabsList>

          {/* User Management */}
          <TabsContent value="users">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2>Users</h2>
                <div className="flex gap-2">
                  <Input placeholder="Search users..." className="w-64" />
                  <Button className="bg-primary hover:bg-accent">Add User</Button>
                </div>
              </div>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrolled/Courses</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.status === 'Active'
                                ? 'bg-primary text-white'
                                : 'bg-muted text-muted-foreground'
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.role === 'Student'
                            ? `${user.enrolled} courses`
                            : `${user.courses} courses`}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Course Management */}
          <TabsContent value="courses">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2>Courses</h2>
                <Button className="bg-primary hover:bg-accent">Create Course</Button>
              </div>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>{course.name}</TableCell>
                        <TableCell>{course.students}</TableCell>
                        <TableCell>{course.teacher}</TableCell>
                        <TableCell>
                          <Badge className="bg-primary text-white">{course.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-5 w-5 text-primary" />
                    <h3>Daily Active Users</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="users" fill="#FF69B4" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3>Course Enrollment Trend</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={enrollmentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="enrolled"
                        stroke="#FF1493"
                        strokeWidth={2}
                        dot={{ fill: '#FF1493', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Security / Auto Cheat Detector */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-accent" />
                <h2>Auto Cheat Detector</h2>
              </div>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flaggedSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>{submission.student}</TableCell>
                        <TableCell>{submission.assignment}</TableCell>
                        <TableCell>{submission.reason}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              submission.risk === 'High'
                                ? 'bg-accent text-white'
                                : 'bg-secondary text-secondary-foreground'
                            }
                          >
                            {submission.risk}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          </TabsContent>

          {/* System Health */}
          <TabsContent value="system">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Server className="h-5 w-5 text-primary" />
                <h2>Server Health Dashboard</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="p-6">
                  <h3 className="mb-4">Server Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Uptime</span>
                      <Badge className="bg-primary text-white">99.9%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Response Time</span>
                      <span className="text-sm">45ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Sessions</span>
                      <span className="text-sm">234</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="mb-4">Database Health</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className="bg-primary text-white">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Query Time</span>
                      <span className="text-sm">12ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Storage Used</span>
                      <span className="text-sm">67%</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-accent/10 border-accent/30">
                  <h3 className="mb-4">Anomaly Detection</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">AI-Generated</span>
                      <Badge variant="outline" className="border-accent text-accent">3</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Suspicious Activity</span>
                      <Badge variant="outline" className="border-accent text-accent">1</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Scan</span>
                      <span className="text-sm">5 min ago</span>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
