import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockAssignments, mockCourses, addSubmission } from '@/services/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Calendar, Clock, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Assignment } from '@/types';
import FileUploader from '@/components/FileUploader';
import { useNotifications } from '@/contexts/NotificationContext';
import { generateSubmissionNotification } from '@/services/notificationService';

const AssignmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [fileContent, setFileContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Find assignment by id
    const foundAssignment = mockAssignments.find(a => a.id === id);
    if (foundAssignment) {
      setAssignment(foundAssignment);
      
      // Find associated course
      const foundCourse = mockCourses.find(c => c.id === foundAssignment.courseId);
      setCourse(foundCourse);
    }
  }, [id]);
  
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    
    // Read file content for plagiarism detection
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFileContent(e.target.result.toString());
      }
    };
    reader.readAsText(file);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assignment || !user) return;
    
    if (!selectedFile) {
      toast({
        title: 'Error',
        description: 'Please select a file to submit',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would upload the file to a server
      // For this demo, we'll just use a placeholder URL
      const fileUrl = URL.createObjectURL(selectedFile);
      
      // Add submission to mock data
      const submission = addSubmission({
        assignmentId: assignment.id,
        studentId: user.id,
        studentName: user.name,
        rollNumber: '001', // In a real app, this would come from the user profile
        fileUrl,
        fileContent,
      });
      
      // Create notification for the teacher
      if (course) {
        const teacherNotification = generateSubmissionNotification(
          submission, 
          assignment,
          user,
          true
        );
        addNotification(teacherNotification);
        
        // Notification for the student who submitted
        const studentNotification = generateSubmissionNotification(
          submission,
          assignment,
          user,
          false
        );
        addNotification(studentNotification);
      }
      
      toast({
        title: 'Success',
        description: 'Assignment submitted successfully',
      });
      
      // Redirect back to assignments page
      navigate('/student/assignments');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast({
        title: 'Error',
        description: 'There was an error submitting your assignment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!assignment || !course) {
    return <div>Loading...</div>;
  }
  
  // Format the due date properly
  const dueDate = assignment.dueDate instanceof Date 
    ? assignment.dueDate 
    : new Date(assignment.dueDate);
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => navigate('/student/assignments')}>
            <BookOpen className="w-4 h-4 mr-2" />
            Assignments
          </Button>
          <span>/</span>
          <h2 className="text-2xl font-bold">{assignment.title}</h2>
        </div>
        <p className="text-muted-foreground">
          Submit your assignment here.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{assignment.title}</CardTitle>
          <CardDescription>
            {course.title} ({course.code})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Description:</span>
            </div>
            <p>{assignment.description}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Due Date:</span>
            </div>
            <p>{format(dueDate, 'PPP')}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Total Marks:</span>
            </div>
            <p>{assignment.totalMarks}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="file">Upload File</Label>
              <FileUploader onFileSelect={handleFileSelect} />
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentDetail;
