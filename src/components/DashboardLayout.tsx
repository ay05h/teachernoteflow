
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  UserCheck, 
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import NotificationPopover from './NotificationPopover';
import { Button } from './ui/button';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const teacherNav = [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'Courses', path: '/teacher/courses', icon: BookOpen },
    { name: 'Assignments', path: '/teacher/assignments', icon: FileText },
  ];
  
  const studentNav = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Courses', path: '/student/courses', icon: BookOpen },
    { name: 'Assignments', path: '/student/assignments', icon: FileText },
  ];
  
  const navItems = user?.type === 'teacher' ? teacherNav : studentNav;

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar for large screens */}
      <aside className={`fixed inset-y-0 left-0 z-50 hidden w-64 flex-shrink-0 transform flex-col bg-card transition-all duration-300 md:static md:flex ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="text-xl font-display font-bold text-gradient">
            AssignGuard
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={closeSidebar}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="px-4 my-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">{user?.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{user?.type}</div>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
              }`}
              onClick={closeSidebar}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="border-t subtle-border px-4 py-4">
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>
      
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Mobile sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 transform flex-col bg-card transition-all duration-300 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between px-4">
          <Link to="/" className="text-xl font-display font-bold text-gradient">
            AssignGuard
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={closeSidebar}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="px-4 my-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">{user?.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{user?.type}</div>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
              }`}
              onClick={closeSidebar}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="border-t subtle-border px-4 py-4">
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="flex h-16 items-center justify-between border-b subtle-border bg-card px-4 md:px-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="mr-2 md:hidden" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">
              {user?.type === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <NotificationPopover />
            <ThemeToggle />
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
