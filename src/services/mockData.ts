
import { Assignment, Course, Submission } from '../types';

// Mock data for courses
export let mockCourses: Course[] = [
  {
    id: 'c1',
    teacherId: 'teacher1',
    title: 'Introduction to Computer Science',
    description: 'A foundational course covering basic computer science concepts.',
    code: 'CS101',
    createdAt: new Date('2023-01-15'),
  },
  {
    id: 'c2',
    teacherId: 'teacher1',
    title: 'Data Structures and Algorithms',
    description: 'Learn essential data structures and algorithm design techniques.',
    code: 'CS201',
    createdAt: new Date('2023-02-20'),
  },
  {
    id: 'c3',
    teacherId: 'teacher1',
    title: 'Database Systems',
    description: 'Introduction to database design, SQL, and data management.',
    code: 'CS301',
    createdAt: new Date('2023-03-10'),
  },
];

// Mock data for assignments
export let mockAssignments: Assignment[] = [
  {
    id: 'a1',
    courseId: 'c1',
    title: 'Programming Basics Assignment',
    description: 'Implement basic programming concepts in Python.',
    dueDate: new Date('2023-09-30'),
    totalMarks: 100,
    createdAt: new Date('2023-09-01'),
  },
  {
    id: 'a2',
    courseId: 'c1',
    title: 'Algorithmic Thinking',
    description: 'Solve a set of algorithmic problems using pseudocode.',
    dueDate: new Date('2023-10-15'),
    totalMarks: 50,
    createdAt: new Date('2023-09-15'),
  },
  {
    id: 'a3',
    courseId: 'c2',
    title: 'Linked List Implementation',
    description: 'Implement a doubly linked list with various operations.',
    dueDate: new Date('2023-10-20'),
    totalMarks: 75,
    createdAt: new Date('2023-09-20'),
  },
];

// Mock data for submissions
export let mockSubmissions: Submission[] = [
  {
    id: 's1',
    assignmentId: 'a1',
    studentId: 'student1',
    studentName: 'Alice Johnson',
    fileUrl: '/path/to/assignment1.pdf',
    rollNumber: 'CS2301',
    submittedAt: new Date('2023-09-25'),
    marks: 85,
    plagiarismScore: 5,
  },
  {
    id: 's2',
    assignmentId: 'a1',
    studentId: 'student2',
    studentName: 'Bob Smith',
    fileUrl: '/path/to/assignment2.pdf',
    rollNumber: 'CS2302',
    submittedAt: new Date('2023-09-26'),
    marks: 72,
    plagiarismScore: 15,
  },
  {
    id: 's3',
    assignmentId: 'a1',
    studentId: 'student3',
    studentName: 'Charlie Brown',
    fileUrl: '/path/to/assignment3.pdf',
    rollNumber: 'CS2303',
    submittedAt: new Date('2023-09-28'),
    plagiarismScore: 65,
  },
  {
    id: 's4',
    assignmentId: 'a2',
    studentId: 'student1',
    studentName: 'Alice Johnson',
    fileUrl: '/path/to/assignment4.pdf',
    rollNumber: 'CS2301',
    submittedAt: new Date('2023-10-10'),
    plagiarismScore: 12,
  },
];

// Function to add a new course
export const addCourse = (course: Omit<Course, "id" | "teacherId" | "createdAt">): Course => {
  const newCourse: Course = {
    ...course,
    id: `c${mockCourses.length + 1}`,
    teacherId: 'teacher1', // Assuming the logged-in teacher has this ID
    createdAt: new Date()
  };
  
  mockCourses = [...mockCourses, newCourse];
  return newCourse;
};

// Function to add a new assignment
export const addAssignment = (assignment: Omit<Assignment, "id" | "createdAt">): Assignment => {
  const newAssignment: Assignment = {
    ...assignment,
    id: `a${mockAssignments.length + 1}`,
    createdAt: new Date()
  };
  
  mockAssignments = [...mockAssignments, newAssignment];
  return newAssignment;
};

// Function to add a new submission
export const addSubmission = (submission: Omit<Submission, "id" | "submittedAt">): Submission => {
  const newSubmission: Submission = {
    ...submission,
    id: `s${mockSubmissions.length + 1}`,
    submittedAt: new Date()
  };
  
  mockSubmissions = [...mockSubmissions, newSubmission];
  return newSubmission;
};

// Simple function to generate random plagiarism score
export const generatePlagiarismScore = (): number => {
  return Math.floor(Math.random() * 100);
};
