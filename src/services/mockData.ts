
import { Assignment, Course, Submission } from '../types';

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
  return newAssignment;
};

// Function to add a new submission
export const addSubmission = (submission: Omit<Submission, "id" | "submittedAt">): Submission => {
  try {
    const newSubmission: Submission = {
      ...submission,
      id: `s${Date.now()}`, // Generate unique ID using timestamp
      submittedAt: new Date(),
      plagiarismScore: generatePlagiarismScore()
    };
    
    mockSubmissions = [...mockSubmissions, newSubmission];
    storeData('submissions', mockSubmissions);
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
    
    return true;
  } catch (error) {
    console.error("Error deleting course:", error);
    return false;
  }
};

// Simple function to generate random plagiarism score
export const generatePlagiarismScore = (): number => {
  return Math.floor(Math.random() * 100);
};
