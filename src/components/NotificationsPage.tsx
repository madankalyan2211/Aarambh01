import { Page } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { motion } from 'motion/react';
import { Bell, CheckCircle, Award, MessageSquare, BookOpen, AlertCircle, Mic } from 'lucide-react';

interface NotificationsPageProps {
  onNavigate: (page: Page) => void;
}

const notifications = [
  {
    id: 1,
    type: 'grade',
    title: 'New Grade Posted',
    message: 'Your AI Quiz #3 has been graded',
    time: '10 minutes ago',
    urgent: false,
    read: false,
    icon: Award,
  },
  {
    id: 2,
    type: 'assignment',
    title: 'Assignment Due Soon',
    message: 'Neural Network Project due in 24 hours',
    time: '2 hours ago',
    urgent: true,
    read: false,
    icon: AlertCircle,
  },
  {
    id: 3,
    type: 'discussion',
    title: 'New Reply to Your Post',
    message: 'Sarah Chen replied to "Understanding Backpropagation"',
    time: '3 hours ago',
    urgent: false,
    read: false,
    icon: MessageSquare,
  },
  {
    id: 4,
    type: 'course',
    title: 'New Module Available',
    message: 'Deep Learning Module 5 is now available',
    time: '1 day ago',
    urgent: false,
    read: true,
    icon: BookOpen,
  },
  {
    id: 5,
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: 'You earned the "7-Day Streak" badge 🔥',
    time: '1 day ago',
    urgent: false,
    read: true,
    icon: Award,
  },
  {
    id: 6,
    type: 'grade',
    title: 'Grade Updated',
    message: 'Your essay grade has been updated to A-',
    time: '2 days ago',
    urgent: false,
    read: true,
    icon: Award,
  },
];

const weeklyDigest = [
  { label: 'Assignments Completed', value: '5' },
  { label: 'Discussions Participated', value: '12' },
  { label: 'New Grades', value: '3' },
  { label: 'Learning Streak', value: '14 days 🔥' },
];

export function NotificationsPage({ onNavigate }: NotificationsPageProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1>Notifications</h1>
              <p className="text-muted-foreground">Stay updated with your learning journey</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Mark all as read</Button>
              <Button variant="outline" size="icon">
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Notifications */}
          <div className="lg:col-span-2">
            <div className="space-y-3">
              {notifications.map((notification, index) => {
                const Icon = notification.icon;
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                        !notification.read ? 'border-l-4 border-l-primary bg-secondary/20' : ''
                      } ${notification.urgent ? 'animate-pulse-slow' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            notification.urgent
                              ? 'bg-accent/20'
                              : notification.read
                              ? 'bg-muted'
                              : 'bg-primary/20'
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${
                              notification.urgent
                                ? 'text-accent'
                                : notification.read
                                ? 'text-muted-foreground'
                                : 'text-primary'
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="text-sm">{notification.title}</h3>
                            {notification.urgent && (
                              <Badge className="bg-accent text-white text-xs">Urgent</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Load More */}
            <div className="mt-6 text-center">
              <Button variant="outline">Load More Notifications</Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weekly Digest */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-primary" />
                <h2>Weekly Digest</h2>
              </div>
              <Card className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
                <div className="space-y-3">
                  {weeklyDigest.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-lg">{item.value}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <p className="text-xs text-muted-foreground text-center">
                  Oct 7 - Oct 14, 2025
                </p>
              </Card>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="mb-4">Notification Settings</h2>
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notif" className="cursor-pointer">
                        Email Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch id="email-notif" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="voice-notif" className="cursor-pointer">
                        Voice Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Enable audio alerts
                      </p>
                    </div>
                    <Switch id="voice-notif" />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="grade-notif" className="cursor-pointer">
                        Grade Updates
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Get notified of new grades
                      </p>
                    </div>
                    <Switch id="grade-notif" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="assignment-notif" className="cursor-pointer">
                        Assignment Reminders
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Deadline notifications
                      </p>
                    </div>
                    <Switch id="assignment-notif" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="discussion-notif" className="cursor-pointer">
                        Discussion Updates
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Replies and mentions
                      </p>
                    </div>
                    <Switch id="discussion-notif" defaultChecked />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Smart Priority Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-4 bg-accent/10 border-accent/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm mb-1">Smart Priority System</h3>
                    <p className="text-xs text-muted-foreground">
                      Urgent notifications are highlighted and will glow until viewed. This
                      helps you never miss important deadlines and updates.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
