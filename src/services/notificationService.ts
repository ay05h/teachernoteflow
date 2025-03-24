
import { Notification, Assignment, Course, Submission, User } from '@/types';

// Generate a notification for when an assignment is created
export const generateAssignmentCreatedNotification = (
  assignment: Assignment,
  course: Course,
  forTeacher: boolean
): Omit<Notification, 'id' | 'createdAt' | 'isRead'> => {
  if (forTeacher) {
    return {
      userId: course.teacherId,
      title: 'Assignment Created',
      message: `You created a new assignment "${assignment.title}" for course ${course.title}.`,
    };
  } else {
    return {
      userId: 'student', // This would normally be the student ID
      title: 'New Assignment',
      message: `A new assignment "${assignment.title}" has been added to course ${course.title}.`,
    };
  }
};

// Generate a notification for when an assignment is submitted
export const generateSubmissionNotification = (
  submission: Submission, 
  assignment: Assignment,
  student: User,
  forTeacher: boolean
): Omit<Notification, 'id' | 'createdAt' | 'isRead'> => {
  if (forTeacher) {
    return {
      userId: 'teacher', // This would normally be the teacher ID
      title: 'Assignment Submitted',
      message: `${student.name} has submitted assignment "${assignment.title}".`,
    };
  } else {
    return {
      userId: student.id,
      title: 'Assignment Submitted',
      message: `You have successfully submitted assignment "${assignment.title}".`,
    };
  }
};

// Generate a notification for when an assignment is graded
export const generateGradedNotification = (
  submission: Submission,
  assignment: Assignment
): Omit<Notification, 'id' | 'createdAt' | 'isRead'> => {
  return {
    userId: submission.studentId,
    title: 'Assignment Graded',
    message: `Your submission for "${assignment.title}" has been graded. You received ${submission.marks} out of ${assignment.totalMarks}.`,
  };
};

// Generate a notification for when a course is created
export const generateCourseCreatedNotification = (
  course: Course
): Omit<Notification, 'id' | 'createdAt' | 'isRead'> => {
  return {
    userId: course.teacherId,
    title: 'Course Created',
    message: `You have created a new course: ${course.title}.`,
  };
};

// Generate a notification for when a student is enrolled in a course
export const generateEnrollmentNotification = (
  course: Course,
  student: User
): Omit<Notification, 'id' | 'createdAt' | 'isRead'> => {
  return {
    userId: student.id,
    title: 'Course Enrollment',
    message: `You have been enrolled in ${course.title}.`,
  };
};

// Generate a notification for a high plagiarism score
export const generatePlagiarismNotification = (
  submission: Submission,
  assignment: Assignment
): Omit<Notification, 'id' | 'createdAt' | 'isRead'> => {
  return {
    userId: 'teacher', // This would normally be the teacher ID
    title: 'High Plagiarism Detected',
    message: `Submission by ${submission.studentName} for "${assignment.title}" has a high plagiarism score of ${submission.plagiarismScore}%.`,
  };
};
