
import { addNotification, mockNotifications } from './mockData';

// Initialize sample notifications if there are none
export const initializeNotifications = () => {
  console.log("Initializing notifications. Current count:", mockNotifications.length);
  
  // Clear existing notifications for testing purposes
  // In development, uncomment this line to reset notifications
  localStorage.removeItem('notifications');
  
  if (mockNotifications.length === 0) {
    console.log("Adding sample notifications");
    
    // Create sample notifications for student
    addNotification({
      userId: 'student1',
      title: 'Welcome to AssignGuard',
      message: 'Welcome to your student dashboard. You can view your courses and assignments here.',
      isRead: false
    });
    
    addNotification({
      userId: 'student1',
      title: 'Course enrollment open',
      message: 'New courses are available for enrollment. Check out the courses page.',
      isRead: false
    });
    
    // Create sample notifications for teacher
    addNotification({
      userId: 'teacher1',
      title: 'Welcome to AssignGuard',
      message: 'Welcome to your teacher dashboard. You can manage your courses and assignments here.',
      isRead: false
    });
    
    addNotification({
      userId: 'teacher1',
      title: 'Assignment due soon',
      message: 'One of your assignments is due in the next 48 hours.',
      isRead: false
    });
  } else {
    console.log("Notifications already exist, skipping initialization");
  }
};
