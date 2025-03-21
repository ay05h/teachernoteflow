
import { Assignment, Course, Submission } from '../types';

// Initialize data from localStorage or use empty arrays
const getInitialData = <T>(key: string): T[] => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : [];
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
  const newSubmission: Submission = {
    ...submission,
    id: `s${Date.now()}`, // Generate unique ID using timestamp
    submittedAt: new Date(),
    plagiarismScore: generatePlagiarismScore()
  };
  
  mockSubmissions = [...mockSubmissions, newSubmission];
  storeData('submissions', mockSubmissions);
  return newSubmission;
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
  const index = mockSubmissions.findIndex(submission => submission.id === submissionId);
  if (index !== -1) {
    mockSubmissions[index] = { ...mockSubmissions[index], ...updates };
    storeData('submissions', mockSubmissions);
    return mockSubmissions[index];
  }
  return undefined;
};

// Simple function to generate random plagiarism score
export const generatePlagiarismScore = (): number => {
  return Math.floor(Math.random() * 100);
};
