
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Load notifications from localStorage on mount
  useEffect(() => {
    if (user) {
      const storedNotifications = localStorage.getItem(`notifications-${user.id}`);
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    }
  }, [user]);
  
  // Save notifications to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`notifications-${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    if (user) {
      const newNotification: Notification = {
        ...notification,
        id: Math.random().toString(36).substring(2, 9),
        userId: user.id,
        isRead: false,
        createdAt: new Date(),
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      // Show toast notification
      toast({
        title: notification.title,
        description: notification.message,
      });
    }
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };
  
  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        addNotification, 
        markAsRead, 
        markAllAsRead 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
