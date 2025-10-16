import { Page, UserRole } from '../App';
import { Button } from './ui/button';
import { Bell, Home, BookOpen, ClipboardList, Award, MessageSquare, Settings, LogOut, Users, Moon, Sun } from 'lucide-react';
import { Badge } from './ui/badge';
import { VoiceAssistant } from './VoiceAssistant';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface NavigationProps {
  userRole: UserRole;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  currentPage: Page;
  isDark: boolean;
  onToggleDark: () => void;
}

export function Navigation({ userRole, onNavigate, onLogout, currentPage, isDark, onToggleDark }: NavigationProps) {
  const navItems = {
    student: [
      { page: 'student-dashboard' as Page, label: 'Dashboard', icon: Home },
      { page: 'my-teachers' as Page, label: 'My Teachers', icon: Users },
      { page: 'course' as Page, label: 'Courses', icon: BookOpen },
      { page: 'assignment' as Page, label: 'Assignments', icon: ClipboardList },
      { page: 'grades' as Page, label: 'Grades', icon: Award },
      { page: 'discussion' as Page, label: 'Discussion', icon: MessageSquare },
    ],
    teacher: [
      { page: 'teacher-dashboard' as Page, label: 'Dashboard', icon: Home },
      { page: 'my-students' as Page, label: 'My Students', icon: Users },
      { page: 'teacher-courses' as Page, label: 'My Courses', icon: BookOpen },
      { page: 'course' as Page, label: 'All Courses', icon: BookOpen },
      { page: 'assignment' as Page, label: 'Assignments', icon: ClipboardList },
      { page: 'grades' as Page, label: 'Grades', icon: Award },
      { page: 'discussion' as Page, label: 'Discussion', icon: MessageSquare },
    ],
    admin: [
      { page: 'admin' as Page, label: 'Admin Panel', icon: Settings },
      { page: 'course' as Page, label: 'Courses', icon: BookOpen },
      { page: 'discussion' as Page, label: 'Discussion', icon: MessageSquare },
    ],
  };

  const items = navItems[userRole as 'student' | 'teacher' | 'admin'] || [];

  return (
    <nav className="bg-card border-b-4 border-primary sticky top-0 z-50 shadow-lg text-foreground">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl app-logo">Aarambh</h1>
            <div className="flex items-center gap-2">
              {items.map(({ page, label, icon: Icon }) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate(page)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <VoiceAssistant userRole={userRole || undefined} />
            
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => onNavigate('notifications')}
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent">
                3
              </Badge>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" size="icon" type="button">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 z-[100]"
                sideOffset={8}
              >
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onToggleDark} className="cursor-pointer">
                  {isDark ? (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      Dark Mode
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </div>
    </nav>
  );
}
