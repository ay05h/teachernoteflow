
import { addNotification } from './mockData';
import { Notification } from '../types';

// Check if notifications have been initialized
const hasInitializedNotifications = () => {
  return localStorage.getItem('notificationsInitialized') === 'true';
};

// Set notifications as initialized
const setNotificationsInitialized = () => {
  localStorage.setItem('notificationsInitialized', 'true');
};

// Initialize sample notifications for demo purposes
export const initializeSampleNotifications = () => {
  if (hasInitializedNotifications()) {
    return;
  }

  // Sample teacher notifications
  const teacherNotifications: Omit<Notification, 'id' | 'createdAt'>[] = [
    {
      userId: 'teacher1',
      title: 'Assignment Submitted',
      message: 'John Doe has submitted the programming assignment.',
      isRead: false
    },
    {
      userId: 'teacher1',
      title: 'Assignment Submitted',
      message: 'Jane Smith has submitted the database assignment.',
      isRead: false
    },
    {
      userId: 'teacher1',
      title: 'Assignment Submitted',
      message: 'Mike Johnson has submitted the web development assignment.',
      isRead: true
    }
  ];

  // Sample student notifications
  const studentNotifications: Omit<Notification, 'id' | 'createdAt'>[] = [
    {
      userId: 'student1',
      title: 'New Assignment Added',
      message: 'A new programming assignment has been added to CS101.',
      isRead: false
    },
    {
      userId: 'student1',
      title: 'Assignment Graded',
      message: 'Your database assignment has been graded. You received 95/100.',
      isRead: false
    },
    {
      userId: 'student1',
      title: 'New Course Added',
      message: 'You have been enrolled in Web Development 202.',
      isRead: true
    }
  ];

  // Add all sample notifications
  [...teacherNotifications, ...studentNotifications].forEach(notification => {
    addNotification(notification);
  });

  // Mark notifications as initialized
  setNotificationsInitialized();
};
