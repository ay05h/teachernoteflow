
export type UserType = 'teacher' | 'student' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
}

export interface Course {
  id: string;
  teacherId: string;
  title: string;
  description: string;
  code: string;
  createdAt: Date;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
  totalMarks: number;
  fileUrl?: string;
  createdAt: Date;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  fileUrl: string;
  fileContent?: string; // Added to store the text content for plagiarism detection
  rollNumber: string;
  submittedAt: Date;
  marks?: number;
  plagiarismScore?: number;
  feedback?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// New interface for discussion comments
export interface Comment {
  id: string;
  assignmentId: string;
  userId: string;
  userName: string;
  userType: UserType;
  content: string;
  createdAt: Date;
  replies?: Comment[];
}

// Badge variants
export type BadgeVariant = 
  | "default" 
  | "secondary" 
  | "destructive" 
  | "outline" 
  | "success"  // Added for submitted assignments
  | "warning"; // Added for due soon assignments
