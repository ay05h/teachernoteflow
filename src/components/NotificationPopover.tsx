
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getNotificationsForUser, 
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '@/services/mockData';
import { Notification } from '@/types';
import { toast } from '@/hooks/use-toast';

const NotificationPopover = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  const refreshNotifications = () => {
    if (user?.id) {
      console.log('Refreshing notifications for user:', user.id);
      
      // Convert user ID to expected format
      const userId = user.type === 'student' ? 'student1' : 'teacher1';
      console.log('Mapped to standard user ID:', userId);
      
      const userNotifications = getNotificationsForUser(userId);
      console.log('User notifications:', userNotifications);
      setNotifications(userNotifications);
    }
  };

  // Load notifications on component mount and periodically
  useEffect(() => {
    refreshNotifications();
    
    // Refresh notifications every 5 seconds
    const intervalId = setInterval(refreshNotifications, 5000);
    
    return () => clearInterval(intervalId);
  }, [user?.id]);
  
  // Refresh notifications when popover opens
  useEffect(() => {
    if (isOpen) {
      refreshNotifications();
    }
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    refreshNotifications();
  };

  const handleMarkAllAsRead = () => {
    if (user?.id) {
      // Convert user ID to expected format
      const userId = user.type === 'student' ? 'student1' : 'teacher1';
      
      markAllNotificationsAsRead(userId);
      refreshNotifications();
      toast({
        title: "Notifications cleared",
        description: "All notifications have been marked as read"
      });
    }
  };

  // Format date to be more readable
  const formatDate = (date: Date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    
    // If it's today, show the time
    if (notificationDate.toDateString() === now.toDateString()) {
      return notificationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If it's within the last week, show the day of week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    if (notificationDate > oneWeekAgo) {
      return notificationDate.toLocaleDateString([], { weekday: 'short' }) + ' ' + 
        notificationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise, show the date
    return notificationDate.toLocaleDateString();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center bg-primary text-primary-foreground text-xs"
              variant="default"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 max-h-[450px] flex flex-col">
        <div className="p-4 flex items-center justify-between border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                    !notification.isRead ? 'bg-muted/20' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h5 className={`text-sm font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                      {notification.title}
                    </h5>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
