import { Assignment, Course, Submission, PlagiarismCluster, Comment } from '../types';

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
    } else if (key === 'comments') {
      return parsedData;
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

// Initialize empty arrays for courses, assignments, submissions, and comments
export let mockCourses: Course[] = getInitialData<Course>('courses');
export let mockAssignments: Assignment[] = getInitialData<Assignment>('assignments');
export let mockSubmissions: Submission[] = getInitialData<Submission>('submissions');
export let mockComments: Comment[] = getInitialData<Comment>('comments') || [];

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

// New function to get submissions with plagiarism information for an assignment
export const getSubmissionsWithPlagiarismInfo = (assignmentId: string) => {
  // Get all submissions for this assignment
  const submissions = getSubmissionsForAssignment(assignmentId);
  
  // Group submissions by plagiarism content for clustering
  const contentMap = new Map<string, Submission[]>();
  
  submissions.forEach(submission => {
    if (submission.fileContent && submission.plagiarismScore && submission.plagiarismScore > 30) {
      // Use fileContent as a key for identical content
      const key = submission.fileContent;
      if (!contentMap.has(key)) {
        contentMap.set(key, []);
      }
      contentMap.get(key)?.push(submission);
    }
  });
  
  // Create plagiarism clusters
  const plagiarismClusters: PlagiarismCluster[] = [];
  
  contentMap.forEach((similarSubmissions, contentHash) => {
    // Only create clusters for submissions that have more than one student
    if (similarSubmissions.length > 1) {
      const studentNames = similarSubmissions.map(sub => sub.studentName);
      const plagiarismScore = similarSubmissions[0].plagiarismScore || 0;
      
      plagiarismClusters.push({
        plagiarismScore,
        studentNames,
        contentHash
      });
    }
  });
  
  return { submissions, plagiarismClusters };
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

// Function to add a comment to an assignment
export const addComment = (comment: Omit<Comment, "id" | "createdAt">): Comment => {
  const newComment: Comment = {
    ...comment,
    id: `c${Date.now()}`, // Generate unique ID using timestamp
    createdAt: new Date()
  };
  
  mockComments = [...mockComments, newComment];
  storeData('comments', mockComments);
  return newComment;
};

// Function to get comments for an assignment
export const getCommentsForAssignment = (assignmentId: string): Comment[] => {
  return mockComments.filter(comment => comment.assignmentId === assignmentId);
};

// Simple function to generate random plagiarism score - no longer used
export const generatePlagiarismScore = (): number => {
  return Math.floor(Math.random() * 100);
};
