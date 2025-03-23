import { Assignment, Course, Notification, PlagiarismCluster, Submission } from '../types';

// Initialize data from localStorage or use empty arrays
const getInitialData = <T>(key: string): T[] => {
  const storedData = localStorage.getItem(key);
  if (!storedData) return [];
  
  try {
    // Parse the stored data
    const parsedData = JSON.parse(storedData);
    
    // Process date fields if this is a known type
    if (key === 'assignments') {
      return parsedData.map((item: any) => ({
        ...item,
        dueDate: new Date(item.dueDate),
        createdAt: new Date(item.createdAt)
      }));
    } else if (key === 'submissions') {
      return parsedData.map((item: any) => ({
        ...item,
        submittedAt: new Date(item.submittedAt)
      }));
    } else if (key === 'courses') {
      return parsedData.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt)
      }));
    } else if (key === 'notifications') {
      return parsedData.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt)
      }));
    }
    
    return parsedData;
  } catch (error) {
    console.error(`Error parsing data from localStorage for ${key}:`, error);
    return [];
  }
};

// Store data to localStorage
const storeData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize empty arrays for courses, assignments, and submissions
export let mockCourses: Course[] = getInitialData<Course>('courses');
export let mockAssignments: Assignment[] = getInitialData<Assignment>('assignments');
export let mockSubmissions: Submission[] = getInitialData<Submission>('submissions');
export let mockNotifications: Notification[] = getInitialData<Notification>('notifications');

// Function to add a notification
export const addNotification = (notification: Omit<Notification, "id" | "createdAt">): Notification => {
  const newNotification: Notification = {
    ...notification,
    id: `n${Date.now()}`, // Generate unique ID using timestamp
    createdAt: new Date(),
  };
  
  mockNotifications = [...mockNotifications, newNotification];
  storeData('notifications', mockNotifications);
  return newNotification;
};

// Function to mark a notification as read
export const markNotificationAsRead = (notificationId: string): boolean => {
  try {
    const index = mockNotifications.findIndex(n => n.id === notificationId);
    
    if (index !== -1) {
      mockNotifications[index] = {
        ...mockNotifications[index],
        isRead: true
      };
      
      storeData('notifications', mockNotifications);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};

// Function to mark all notifications as read for a user
export const markAllNotificationsAsRead = (userId: string): boolean => {
  try {
    mockNotifications = mockNotifications.map(notification => {
      if (notification.userId === userId && !notification.isRead) {
        return { ...notification, isRead: true };
      }
      return notification;
    });
    
    storeData('notifications', mockNotifications);
    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
};

// Function to get notifications for a user
export const getNotificationsForUser = (userId: string): Notification[] => {
  return mockNotifications
    .filter(notification => notification.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

// Function to get unread notification count for a user
export const getUnreadNotificationCount = (userId: string): number => {
  return mockNotifications.filter(notification => 
    notification.userId === userId && !notification.isRead
  ).length;
};

// Function to cluster submissions by plagiarism score
export const getPlagiarismClusters = (assignmentId: string): PlagiarismCluster[] => {
  const submissions = mockSubmissions.filter(s => s.assignmentId === assignmentId);
  
  // Group submissions by plagiarism score
  const clusters: { [key: number]: PlagiarismCluster } = {};
  
  submissions.forEach(submission => {
    const score = submission.plagiarismScore || 0;
    
    if (!clusters[score]) {
      clusters[score] = {
        score,
        students: []
      };
    }
    
    clusters[score].students.push({
      name: submission.studentName,
      id: submission.studentId,
      rollNumber: submission.rollNumber
    });
  });
  
  // Convert to array and sort by score descending
  return Object.values(clusters)
    .filter(cluster => cluster.students.length > 1) // Only include clusters with multiple students
    .sort((a, b) => b.score - a.score);
};

// Function to add a new course
export const addCourse = (course: Omit<Course, "id" | "teacherId" | "createdAt">): Course => {
  const newCourse: Course = {
    ...course,
    id: `c${Date.now()}`, // Generate unique ID using timestamp
    teacherId: 'teacher1', // Assuming the logged-in teacher has this ID
    createdAt: new Date()
  };
  
  mockCourses = [...mockCourses, newCourse];
  storeData('courses', mockCourses);
  
  // Add notification for students
  const studentIds = ['student1', 'student2', 'student3']; // Mock student IDs
  studentIds.forEach(studentId => {
    addNotification({
      userId: studentId,
      title: "New Course Available",
      message: `A new course "${course.title}" has been added.`,
      isRead: false
    });
  });
  
  return newCourse;
};

// Function to add a new assignment
export const addAssignment = (assignment: Omit<Assignment, "id" | "createdAt">): Assignment => {
  const newAssignment: Assignment = {
    ...assignment,
    id: `a${Date.now()}`, // Generate unique ID using timestamp
    createdAt: new Date()
  };
  
  mockAssignments = [...mockAssignments, newAssignment];
  storeData('assignments', mockAssignments);
  
  // Add notification for students
  const studentIds = ['student1', 'student2', 'student3']; // Mock student IDs
  const course = mockCourses.find(c => c.id === assignment.courseId);
  
  studentIds.forEach(studentId => {
    addNotification({
      userId: studentId,
      title: "New Assignment",
      message: `A new assignment "${assignment.title}" has been added to ${course?.title || 'a course'}.`,
      isRead: false
    });
  });
  
  return newAssignment;
};

// Function to calculate text similarity (Jaccard similarity coefficient)
const calculateTextSimilarity = (text1: string, text2: string): number => {
  // Convert texts to lowercase and split into words
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  // Create sets of unique words
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  // Calculate intersection and union
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  // Calculate Jaccard similarity coefficient
  return union.size === 0 ? 0 : (intersection.size / union.size) * 100;
};

// Function to detect plagiarism in a submission
const detectPlagiarism = (text: string, assignmentId: string, studentId: string): number => {
  // If this is the first submission for this assignment, return 0%
  const previousSubmissions = mockSubmissions.filter(
    s => s.assignmentId === assignmentId && s.studentId !== studentId
  );
  
  if (previousSubmissions.length === 0) {
    return 0;
  }
  
  // Compare with all previous submissions
  let maxSimilarity = 0;
  
  for (const submission of previousSubmissions) {
    // Extract text from the file URL (in a real app, this would be a server-side operation)
    try {
      // In our mock system, assume the text is directly accessible
      // In a real app, you would retrieve the text content from the server
      const previousText = submission.fileContent || "";
      
      if (previousText) {
        const similarity = calculateTextSimilarity(text, previousText);
        maxSimilarity = Math.max(maxSimilarity, similarity);
      }
    } catch (error) {
      console.error("Error comparing submissions:", error);
    }
  }
  
  return Math.round(maxSimilarity);
};

// Function to add a new submission
export const addSubmission = (submission: Omit<Submission, "id" | "submittedAt" | "plagiarismScore" | "fileContent"> & { fileContent: string }): Submission => {
  try {
    // Calculate plagiarism score based on text similarity
    const plagiarismScore = detectPlagiarism(
      submission.fileContent,
      submission.assignmentId,
      submission.studentId
    );
    
    const newSubmission: Submission = {
      ...submission,
      id: `s${Date.now()}`, // Generate unique ID using timestamp
      submittedAt: new Date(),
      plagiarismScore: plagiarismScore,
    };
    
    mockSubmissions = [...mockSubmissions, newSubmission];
    storeData('submissions', mockSubmissions);
    
    // Add notification for teacher
    const assignment = mockAssignments.find(a => a.id === submission.assignmentId);
    
    addNotification({
      userId: 'teacher1', // Assuming the teacher has this ID
      title: "New Submission",
      message: `${submission.studentName} has submitted an assignment for "${assignment?.title || 'an assignment'}".`,
      isRead: false
    });
    
    // If high plagiarism score, add special notification
    if (plagiarismScore > 50) {
      addNotification({
        userId: 'teacher1',
        title: "High Plagiarism Detected",
        message: `${submission.studentName}'s submission has a plagiarism score of ${plagiarismScore}%.`,
        isRead: false
      });
    }
    
    return newSubmission;
  } catch (error) {
    console.error("Error adding submission:", error);
    throw error;
  }
};

// Function to get submissions for an assignment
export const getSubmissionsForAssignment = (assignmentId: string): Submission[] => {
  return mockSubmissions.filter(submission => submission.assignmentId === assignmentId);
};

// Function to get a submission by ID
export const getSubmissionById = (submissionId: string): Submission | undefined => {
  return mockSubmissions.find(submission => submission.id === submissionId);
};

// Function to update a submission (for grading)
export const updateSubmission = (submissionId: string, updates: Partial<Submission>): Submission | undefined => {
  try {
    const index = mockSubmissions.findIndex(submission => submission.id === submissionId);
    
    if (index !== -1) {
      // Create a new array with the updated submission
      const updatedSubmissions = [...mockSubmissions];
      updatedSubmissions[index] = { 
        ...updatedSubmissions[index], 
        ...updates 
      };
      
      // Update the global variable
      mockSubmissions = updatedSubmissions;
      
      // Store in localStorage
      storeData('submissions', mockSubmissions);
      
      // If marks were updated, notify the student
      if (updates.marks !== undefined) {
        const submission = mockSubmissions[index];
        const assignment = mockAssignments.find(a => a.id === submission.assignmentId);
        
        addNotification({
          userId: submission.studentId,
          title: "Assignment Graded",
          message: `Your submission for "${assignment?.title || 'an assignment'}" has been graded. You received ${updates.marks} marks.`,
          isRead: false
        });
      }
      
      return mockSubmissions[index];
    }
    return undefined;
  } catch (error) {
    console.error("Error updating submission:", error);
    return undefined;
  }
};

// Function to delete a course
export const deleteCourse = (courseId: string): boolean => {
  try {
    // Get course before deletion for notification
    const course = mockCourses.find(c => c.id === courseId);
    
    // Remove the course
    mockCourses = mockCourses.filter(course => course.id !== courseId);
    storeData('courses', mockCourses);
    
    // Find all assignments for this course
    const courseAssignmentIds = mockAssignments
      .filter(assignment => assignment.courseId === courseId)
      .map(assignment => assignment.id);
    
    // Remove all assignments for this course
    mockAssignments = mockAssignments.filter(assignment => assignment.courseId !== courseId);
    storeData('assignments', mockAssignments);
    
    // Remove all submissions for the deleted assignments
    mockSubmissions = mockSubmissions.filter(
      submission => !courseAssignmentIds.includes(submission.assignmentId)
    );
    storeData('submissions', mockSubmissions);
    
    // Notify students about course deletion
    if (course) {
      const studentIds = ['student1', 'student2', 'student3']; // Mock student IDs
      
      studentIds.forEach(studentId => {
        addNotification({
          userId: studentId,
          title: "Course Deleted",
          message: `The course "${course.title}" has been deleted.`,
          isRead: false
        });
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting course:", error);
    return false;
  }
};

// Simple function to generate random plagiarism score - no longer used
export const generatePlagiarismScore = (): number => {
  return Math.floor(Math.random() * 100);
};
