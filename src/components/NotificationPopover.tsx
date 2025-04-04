
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { Notification } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mock function to get notifications - in a real app, this would come from an API
const getMockNotifications = (userId: string): Notification[] => {
  const storedNotifications = localStorage.getItem('notifications');
  if (!storedNotifications) return [];
  
  try {
    const allNotifications = JSON.parse(storedNotifications) as Notification[];
    return allNotifications.filter(n => n.userId === userId).sort((a, b) => {
      // Sort by read status (unread first) and then by date (newest first)
      if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } catch (error) {
    console.error('Error parsing notifications:', error);
    return [];
  }
};

// Mock function to mark a notification as read
const markNotificationAsRead = (notificationId: string): void => {
  const storedNotifications = localStorage.getItem('notifications');
  if (!storedNotifications) return;
  
  try {
    const allNotifications = JSON.parse(storedNotifications) as Notification[];
    const updatedNotifications = allNotifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true } 
        : notification
    );
    
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error('Error updating notification:', error);
  }
};

// Mock function to mark all notifications as read
const markAllNotificationsAsRead = (userId: string): void => {
  const storedNotifications = localStorage.getItem('notifications');
  if (!storedNotifications) return;
  
  try {
    const allNotifications = JSON.parse(storedNotifications) as Notification[];
    const updatedNotifications = allNotifications.map(notification => 
      notification.userId === userId 
        ? { ...notification, isRead: true } 
        : notification
    );
    
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error('Error updating notifications:', error);
  }
};

const NotificationPopover = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Count of unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Fetch notifications when the component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      setNotifications(getMockNotifications(user.id));
    }
  }, [user?.id]);

  // Format date to readable format
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Handle clicking on a notification
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
    }
  };

  // Handle marking all as read
  const handleMarkAllAsRead = () => {
    if (user?.id) {
      markAllNotificationsAsRead(user.id);
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      
      toast({
        title: "Notifications",
        description: "All notifications marked as read"
      });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs hover:bg-secondary"
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="max-h-80 overflow-auto">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={cn(
                  "flex cursor-pointer flex-col border-b p-3 hover:bg-secondary/50",
                  !notification.isRead && "bg-secondary/20"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-medium">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
